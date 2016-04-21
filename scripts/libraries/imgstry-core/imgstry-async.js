// !!! ASYNC WORKER THREADS --- REQUIRE 'imgstry-worker.js' !!!
// invert method
imgstry.prototype.invertWorker = function () {
    this.imgstryWorker.postMessage({
        'imageData': this.originalImage,
        'filter': 'invert',
        'value': ''
    });
}

// black and white method
imgstry.prototype.blackAndWhiteWorker = function (ratio) {
    this.imgstryWorker.postMessage({
        'imageData': this.originalImage,
        'filter': 'blackAndWhite',
        'value': ''
    });
}

// contrast method
imgstry.prototype.contrastWorker = function (value) {
    this.imgstryWorker.postMessage({
        'imageData': this.originalImage,
        'filter': 'contrast',
        'value': value
    });
}

// brightness method
imgstry.prototype.brightnessWorker = function (value) {
    this.imgstryWorker.postMessage({
        'imageData': this.originalImage,
        'filter': 'brightness',
        'value': value
    });
}

// saturation method
imgstry.prototype.saturationWorker = function (value) {
    value *= -0.01;

    this.imgstryWorker.postMessage({
        'imageData': this.originalImage,
        'filter': 'saturation',
        'value': value
    });
}

// hue method
imgstry.prototype.hueWorker = function (value) {
    value *= 0.5555555556;

    this.imgstryWorker.postMessage({
        'imageData': this.originalImage,
        'filter': 'hue',
        'value': value
    });
}

// sepia method
imgstry.prototype.sepiaWorker = function (value) {
    if (!value)
        value = 100;
    value /= 100;

    this.imgstryWorker.postMessage({
        'imageData': this.originalImage,
        'filter': 'sepia',
        'value': value
    });
}

// gamma method
imgstry.prototype.gammaWorker = function (value) {
    if (value >= 0)
        value = 1 - (value / 100);
    else value /= -10;

    this.imgstryWorker.postMessage({
        'imageData': this.originalImage,
        'filter': 'gamma',
        'value': value
    });
}

// noise method
imgstry.prototype.noiseWorker = function (value) {
    this.imgstryWorker.postMessage({
        'imageData': this.originalImage,
        'filter': 'noise',
        'value': value
    });
}

// vibrance method
imgstry.prototype.vibranceWorker = function (value) {
    value *= -1;

    this.imgstryWorker.postMessage({
        'imageData': this.originalImage,
        'filter': 'vibrance',
        'value': value
    });
}

// integral blur method
imgstry.prototype.integralBlurWorker = function (radius) {
     this.imgstryWorker.postMessage({
        'imageData': this.originalImage,
        'filter': 'integralBlur',
        'value': value
    });
}

// batch processing method
imgstry.prototype.batchWorker = function(filterOptions, callback){
    console.log(JSON.stringify(filterOptions));
     this.reinitializeWorker(callback);

     this.imgstryWorker.postMessage({
        'imageData': this.originalImage,
        'filterOptions': filterOptions,
        'width': this.width,
        'height': this.height
    });
}
