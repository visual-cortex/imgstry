// convolution matrices collection
var convolutionMatrices = {
    sharpen: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
    edgeEnhance: [0, 0, 0, -1, 1, 0, 0, 0, 0],
    edgeDetect: [0, 1, 0, 1, -4, 1, 0, 1, 0],
    emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
    bicubicInterpolation: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    negativeBicubicInterpolation: [0, -1, 0, -1, 4, -1, 0, -1, 0]
};

function histogramHelper(histId) {
    this.canvas = document.getElementById(histId);
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillStyle = "rgba(69, 69, 69, 1)";
    this.context.fillRect(0, 0, this.width, this.height);
}

histogramHelper.prototype.drawHistogram = function(values) {
	this.drawChannelHistogram(values.all, "rgba(236, 240, 241, 1)");
	
    this.drawChannelHistogram(values.r, "rgba(231, 76, 60, 1)");

    this.drawChannelHistogram(values.g, "rgba(39, 174, 96, 1)");

    this.drawChannelHistogram(values.b, "rgba(41, 128, 185, 1)");
}

histogramHelper.prototype.drawChannelHistogram = function(values, color){
    this.context.beginPath();
    this.context.moveTo(0, this.height);

    for(var i = 0; i < 256; i++){
        if(isNaN(values[i]))
            values[i] = 1;
        var point = parseInt((this.height - (values[i] / this.height)));

        this.context.lineTo(((i / 255) * this.width), (point < 0 || point > this.height ? 0 : point));
    }
	
    this.context.fillStyle = color;
    this.context.lineTo(this.width, this.height);
    this.context.closePath();
    this.context.fill();
}

var pixelHelper = {
    rgbToHSV : function(pixel){
      var d, h, max, min, s, v;
      pixel.r /= 255;
      pixel.g /= 255;
      pixel.b /= 255;
      max = Math.max(pixel.r, pixel.g, pixel.b);
      min = Math.min(pixel.r, pixel.g, pixel.b);
      v = max;
      d = max - min;
      s = max === 0 ? 0 : d / max;
      if (max === min) {
        h = 0;
      } else {
        h = (function() {
          switch (max) {
            case pixel.r:
              return (pixel.g - pixel.b) / d + (pixel.g < pixel.b ? 6 : 0);
            case pixel.g:
              return (pixel.b - pixel.r) / d + 2;
            case pixel.b:
              return (pixel.r - pixel.g) / d + 4;
          }
        })();
        h /= 6;
      }
      return {
        h: h,
        s: s,
        v: v
      };
    },
    hsvToRGB : function(hsv){
      var b, f, g, i, p, q, r, t;
      i = Math.floor(hsv.h * 6);
      f = hsv.h * 6 - i;
      p = hsv.v * (1 - hsv.s);
      q = hsv.v * (1 - f * hsv.s);
      t = hsv.v * (1 - (1 - f) * hsv.s);
      switch (i % 6) {
        case 0:
          r = hsv.v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = hsv.v;
          b = p;
          break;
        case 2:
          r = p;
          g = hsv.v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = hsv.v;
          break;
        case 4:
          r = t;
          g = p;
          b = hsv.v;
          break;
        case 5:
          r = hsv.v;
          g = p;
          b = q;
      }
      return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
      };
    },
    clamp : function(pixel){
        return {
            r: pixel.r < 0 ? 0 : pixel.r > 255 ? 255 : pixel.r,
            g: pixel.g < 0 ? 0 : pixel.g > 255 ? 255 : pixel.g,
            b: pixel.b < 0 ? 0 : pixel.b > 255 ? 255 : pixel.b
        }
    }
};
