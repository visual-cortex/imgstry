function imgstry(canvasId, path, callback) {

    // determine if the script is executed in the ui thread or in the worker thread
    var insideWorker = false;

    try{
        if(window.document !== undefined);
    }
    catch(e){
        insideWorker = true;
    }

    // if in the ui thread, load normally
    if(!insideWorker){
            // get the canvas element
            this.canvas = document.getElementById(canvasId);
            // get the canvas context
            this.context = this.canvas.getContext('2d');
            // initialize width and this.height with 0
            this.width = 0;
            this.height = 0;

            this.imgstryWorker = new Worker('scripts/libraries/imgstry-core/imgstry-worker.js');

            var that = this;

            var working = false;

            this.imgstryWorker.onmessage = function (raw) {
                that.setData(raw.data.imageData);
                asyncCallback();
            }

            // save original image data
            this.originalImage = "";

            this.isLoaded = false;

        // if the constructor is given an image path, call the loadImage method
        if (typeof path === "string")
            if (path.match(/\.(png|jpg|jpeg)$/) || path.match(/[A-Za-z0-9+/=]/))
                this.loadImage(path, callback);
            else{
                console.log(path);
                throw ("The specified path does not reference and image file!");
                }
        else{
            console.log(typeof path);
            console.log(path);
            throw ("Image cannot be loaded...");
		}
    }
}

imgstry.prototype.reinitializeWorker = function(callback){
    this.imgstryWorker.terminate();
    this.imgstryWorker = undefined;
    this.imgstryWorker = new Worker('scripts/libraries/imgstry-core/imgstry-worker.js');
    var that = this;
    this.imgstryWorker.onmessage = function (raw) {
        that.setData(raw.data.imageData);
        callback();
    }
}

imgstry.prototype.loadImage = function (path, callback) {

    // initialize the image
    var imgData = new Image();

    var that = this;

    // after the image is loaded draw to the canvas and update dimensions
    imgData.onload = function () {
        that.canvas.height = imgData.height;
        that.canvas.width = imgData.width;
        that.context.drawImage(this, 0, 0);
        that.width = that.canvas.width;
        that.height = that.canvas.height;
        that.isLoaded = true;
        that.originalImage = that.getData();
        callback(that);
    };

    // set image path
    imgData.src = path;
}

// get canvas data
imgstry.prototype.getData = function () {
    return this.context.getImageData(0, 0, this.width, this.height);
};

// set canvas data
imgstry.prototype.setData = function (canvasData) {
    this.context.putImageData(canvasData, 0, 0);
};

// process image method
imgstry.prototype.processImage = function (delegate, step) {
    if (!step)
        step = 4;

    if (typeof delegate === "function") {
        var imgData = this.getData(),
            pixelData = imgData.data;

        for (var i = 0; i < pixelData.length; i += step) {
            // pass the current pixel to the delegate method
            var processedPixels = delegate({
                r: pixelData[i],
                g: pixelData[i + 1],
                b: pixelData[i + 2]
            });

            if (processedPixels) {
                processedPixels = pixelHelper.clamp(processedPixels);
                // after processing update the pixel
                pixelData[i] = processedPixels.r;
                pixelData[i + 1] = processedPixels.g;
                pixelData[i + 2] = processedPixels.b;

            }
        }
        this.setData(imgData);
    } else throw ("Invalid delegate function for image processing !");


    return this;
};

// resets the image to it's original state
imgstry.prototype.reset = function () {
    this.setData(this.originalImage);
}

// gets the data url
imgstry.prototype.getUrlData = function () {
    return this.canvas.toDataURL();
}

// evaluates and returns the histogram raw data
imgstry.prototype.getHistogramData = function () {

    var values = {
        r: [],
        g: [],
        b: [],
        all: []
    };

    this.processImage(function (pixels) {
        var mean = Math.floor((pixels.r + pixels.b + pixels.g) / 3);

        if (isNaN(values.all[mean]))
            values.all[mean] = 0;

        values.all[mean]++;

        if (isNaN(values.r[pixels.r]))
            values.r[pixels.r] = 0;

        values.r[pixels.r]++;

        if (isNaN(values.g[pixels.g]))
            values.g[pixels.g] = 0;

        values.g[pixels.g]++;

        if (isNaN(values.b[pixels.b]))
            values.b[pixels.b] = 0;

        values.b[pixels.b]++;
    });

    return values;
}

// !!! requires imgstry-modules.js !!!
imgstry.prototype.drawHistogram = function (canvId) {
    new histogramHelper(canvId).drawHistogram(this.getHistogramData());
    return this;
}

// inversion method
imgstry.prototype.invert = function () {
    return this.processImage(function (pixel) {
        pixel.r = 255 ^ pixel.r;
        pixel.g = 255 ^ pixel.g;
        pixel.b = 255 ^ pixel.b;
        return pixel;
    });
}

// black and white method
imgstry.prototype.blackAndWhite = function (ratio) {
    // if the method is called without a given ratio
    // set the default black and white ratio
    if (!ratio)
        ratio = [0.3, 0.59, 0.11];

    // verify if the ratio is an array and that the total sum is 1
    if (Array.isArray(ratio) && ratio.reduce(function (a, b) {
        return a + b;
    }, 0) <= 1)
        return this.processImage(function (pixel) {
            // calculate the black and white ratio and return the modified pixel to the process image method
            var bwValue = ratio[0] * pixel.r + ratio[1] * pixel.g + ratio[2] * pixel.b;

            pixel.r = bwValue;
            pixel.g = bwValue;
            pixel.b = bwValue;

            return pixel;
        });
    else throw ("Invalid black and white ratio !");
}

// implementation of 3x3 convolution algorithm
imgstry.prototype.convolve = function (convMatrix, adj) {
    if(!adj)
        adj = 1;

    var divisor = convMatrix.reduce(function (a, b) {
            return a + b;
        }) || 1,
        imgData = this.getData(),
        newImgData = this.context.createImageData(imgData),
        pixelData = imgData.data,
        newPixelData = newImgData.data;

    for (var i = 0; i < newPixelData.length; i++) {
        // if we are on the alpha channel keep the original values
        if ((i + 1) % 4 === 0) {
            newPixelData[i] = pixelData[i];
            continue;
        }

        var convolutionResult = 0,
            rowOffset = this.width * 4,
            subMatrix = [
                             pixelData[i - rowOffset - 4], pixelData[i - rowOffset], pixelData[i - rowOffset + 4],
                             pixelData[i - 4], pixelData[i], pixelData[i + 4],
                             pixelData[i + rowOffset - 4], pixelData[i + rowOffset], pixelData[i + rowOffset + 4]
                            ];
        for (var j = 0; j < 9; j++)
            convolutionResult += (subMatrix[j] || subMatrix[5]) * convMatrix[j] * adj;

        convolutionResult /= divisor;

        newPixelData[i] = convolutionResult;
    }

    this.setData(newImgData);

    return this;
}

// contrast method
imgstry.prototype.contrast = function (value) {
    if(value < 0)
        value /= 10;
    value = Math.pow((value + 100) / 100, 2);

    var contrastLookup = [];
    // create contrast value lookup for faster proccesing
    for(var i = 0; i < 256; i++){
        contrastLookup[i] = i;
        contrastLookup[i] /= 255;
        contrastLookup[i] -= 0.5;
        contrastLookup[i] *= value;
        contrastLookup[i] += 0.5;
        contrastLookup[i] *= 255;
    }

    return this.processImage(function (pixel) {
        pixel.r = contrastLookup[pixel.r];
        pixel.g = contrastLookup[pixel.g];
        pixel.b = contrastLookup[pixel.b];
        return pixel;
    });
}

// brightness method
imgstry.prototype.brightness = function(value){
    value = Math.floor(255 * (value / 100));
    return this.processImage(function(pixel) {
      pixel.r += value;
      pixel.g += value;
      pixel.b += value;
      return pixel;
    });
}

// saturation method
imgstry.prototype.saturation = function(value){
    value *= -0.01;

    // generate saturation lookup for faster processing
    var saturationLookup = [];

    for(var i = 0; i < 256; i++){
            saturationLookup[i] = i * value;
    }

    return this.processImage(function(pixel){
        var max = Math.max(pixel.r, pixel.g, pixel.b);

            pixel.r += saturationLookup[max - pixel.r];
            pixel.g += saturationLookup[max - pixel.g];
            pixel.b += saturationLookup[max - pixel.b];

        return pixel;
    });
}

// hue method
imgstry.prototype.hue = function (value) {
    value *= 0.5;
    this.processImage(function (pixel) {
      var hsv = pixelHelper.rgbToHSV(pixel);
      hsv.h *= 100;
      hsv.h += Math.abs(value);
      hsv.h %= 100;
      hsv.h /= 100;
      pixel = pixelHelper.hsvToRGB(hsv);
      return pixel;
    });
}

// sepia method
imgstry.prototype.sepia = function(value){
    if(!value)
        value = 100;
    value /= 100;

    return this.processImage(function(pixel){
      pixel.r = (pixel.r * (1 - (0.607 * value))) + (pixel.g * (0.769 * value)) + (pixel.b * (0.189 * value));
      pixel.g = (pixel.r * (0.349 * value)) + (pixel.g * (1 - (0.314 * value))) + (pixel.b * (0.168 * value));
      pixel.b = (pixel.r * (0.272 * value)) + (pixel.g * (0.534 * value)) + (pixel.b * (1 - (0.869 * value)));
      return pixel;
    });
}

// gamma method
imgstry.prototype.gamma = function(value){
    if(value >= 0)
        value = 1 - (value / 100);
    else value /= -10;

    var gammaLookup = [];
    for(var i = 0; i < 256; i++)
        gammaLookup[i] = Math.pow(i / 255, value) * 255;

    return this.processImage(function(pixel){
        pixel.r = gammaLookup[pixel.r];
        pixel.g = gammaLookup[pixel.g];
        pixel.b = gammaLookup[pixel.b];
        return pixel;
    });
}

// noise method
imgstry.prototype.noise = function(value){
    return this.processImage(function(pixel){
        var randomValue = Math.random() * value * 2.55;
        randomValue = (Math.random() > 0.5 ? -randomValue : randomValue);
        pixel.r += randomValue;
        pixel.b += randomValue;
        pixel.g += randomValue;
        return pixel;
    });
}

// vibrance method
imgstry.prototype.vibrance = function(value){
    value *= -1;

    return this.processImage(function(pixel) {
      var amt, avg, max;
      max = Math.max(pixel.r, pixel.g, pixel.b);
      avg = (pixel.r + pixel.g + pixel.b) / 3;
      amt = ((Math.abs(max - avg) * 2 / 255) * value) / 100;
        pixel.r += (max - pixel.r) * amt;
        pixel.g += (max - pixel.g) * amt;
        pixel.b += (max - pixel.b) * amt;
      return pixel;
    });
}

// integral blur method
imgstry.prototype.integralBlur = function (radius) {
    var imageData = this.getData(),
        pixelData = imageData.data;

    var r = [],
        g = [],
        b = [];

    var i = 0,
        j = 0,
        rChannelSum,
        gChannelSum,
        bChannelSum;

    for (y = 0; y < this.height; y++) {

        rChannelSum = pixelData[i++];
        gChannelSum = pixelData[i++];
        bChannelSum = pixelData[i++];
        i++;

        for (var x = 0; x < this.width; x++) {
            r[j] = rChannelSum;
            g[j] = gChannelSum;
            b[j++] = bChannelSum;

            rChannelSum += pixelData[i++];
            gChannelSum += pixelData[i++];
            bChannelSum += pixelData[i++];
            i++;
        }

        r[j] = rChannelSum;
        g[j] = gChannelSum;
        b[j++] = bChannelSum;
        i -= 4;
    }

    var j1 = this.width + 1,
        w1 = j1,
        k = j1 * (this.height + 1),
        j2 = j1 - w1;

    while (j1 < k) {
        r[j1] += r[j2];
        g[j1] += g[j2];
        b[j1] += b[j2];
        j1++, j2++;
    }

    var dx1, dx2, dy1, dy2, dy,
        idx1, idx2, idx3, idx4, area;

    var i1 = 0,
        i2 = 0,
        iw = this.width + 1;

    for (var y = 0; y < this.height; y++) {
        dy1 = (y < radius ? -y : -radius);
        dy2 = (y >= this.height - radius ? this.height - y - 1 : radius);
        dy = dy2 - dy1;
        dy1 *= iw;
        dy2 *= iw;

        for (var x = 0; x < this.width; x++) {
            dx1 = (x < radius ? -x : -radius);
            dx2 = (x >= this.width - radius ? this.width - x - 1 : radius);

            area = 1 / ((dx2 - dx1) * dy);

            dx1 += i1;
            dx2 += i1;

            idx1 = dx1 + dy1;
            idx2 = dx2 + dy2;
            idx3 = dx1 + dy2;
            idx4 = dx2 + dy1;

            pixelData[i2++] = ((r[idx1] + r[idx2] - r[idx3] - r[idx4]) * area) | 0;
            pixelData[i2++] = ((g[idx1] + g[idx2] - g[idx3] - g[idx4]) * area) | 0;
            pixelData[i2++] = ((b[idx1] + b[idx2] - b[idx3] - b[idx4]) * area) | 0;
            i2++
            i1++;
        }
        i1++;
    }

    this.setData(imageData);
}

imgstry.prototype.batch = function(filterOptions){
    this.reset();

    filterOptions.sort(function(a, b){
        return a.priority - b.priority;
    });

    for(var i = 0; i < filterOptions.length; i++){
        this[filterOptions[i].filter](parseInt(filterOptions[i].value));
    }
}
