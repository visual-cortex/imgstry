importScripts('imgstry-helpers.js');
importScripts('imgstry.js');

// override load image method for the worker
imgstry.prototype.loadImage = function(data, callback){
        this.imgData = data.imageData;
        this.width = data.width;
        this.height = data.height;
        callback(this);
}

// override getData method for the worker
imgstry.prototype.getData = function () {
    return this.imgData;
};

// override setData method for the worker
imgstry.prototype.setData = function(){};

// listens to the ui thread for messages
self.onmessage = function (raw) {
    var sf = self;
    new imgstry().loadImage(raw.data, function (processor) {
        if(raw.data.filterOptions !== undefined)
            processor.batch(raw.data.filterOptions)
        else
        if (raw.data.value !== '')
            processor[raw.data.filter](parseFloat(raw.data.value));
        else
            processor[raw.data.filter]();
        sf.postMessage({
             'imageData': processor.getData(),
             'filter': raw.data.filter,
             'value': ''
         });
    });
};
