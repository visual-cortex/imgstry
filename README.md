# imgstry
An image editing module writtent in JavaScript.

--- NOTE ---

Imgstry comes with async worker extensions!

### Getting started

Basic markup 
```html
<canvas id="working-canvas"></canvas>
```

Initializing the 'imgstry' module using a server:
```javascript
// option one (server-side loading)
var imagePath = '/folder/subfolder/img.jpg';

new imgstry('working-canvas', imagePath, function(processor){ 
        // modify image here using the processor
});
```

Initializing the 'imgstry' module client-side only:
```javascript
// option two (client-side loading)
var fileReader = new FileReader();

fileReader.readAsDataURL(e.target.files[0]);

fileReader.onloadend  = function () {
	new imgstry('working-canvas', fileReader.result, function(processor){ 
            // modify image here using the processor
    });
};
```

### Processor methods
--- NOTE ---

To use the async workers, the methods below should be followed by the work 'Worker'

eg: processor.hue(5) -> processor.hueWorker(5)

The worker file path can be found in the 'imgstry.js' file in the constructor

```javascript
new imgstry('working-canvas', fileReader.result, function(processor){ 
            // invert
            processor.invert();

            // black and white filter
            processor.blackAndWhite();
            
            // black and white with filter ratio override --- sum must be 1
            processor.blackAndWhite([0.3, 0.7, 0]); 
            
            // sepia filter
            processor.sepia();
            
            // contrast
            processor.contrast(35);
            
            // brightness
            processor.brightness(15);
            
            // saturation
            processor.saturation(15);
            
            // hue
            processor.hue(5);
            
            // gamma
            processor.gamma(-15);
            
            // noise
            processor.noise(25);
            
            // vibrance
            processor.vibrance(50);
            
            // integral blur
            /* 
                Thanks to:
                Author:     Mario Klingemann
                Contact:    mario@quasimondo.com
                Website:	http://www.quasimondo.com/IntegralImageForCanvas
                Twitter:	@quasimondo
            */
            processor.integralBlur(5);
            
            // convolution matrices - emboss example
            processor.convolve([-2, -1, 0, 
                                -1, 1, 1, 
                                0, 1, 2]);
                                
           // reset applied filters         
            processor.reset();
            
            // batch filters
            // filters get ordered by the priority field before being applied to the image
            processor.batch([
                {"filter":"contrast","value":"38","priority":5},
                {"filter":"hue","value":"-60","priority":0},
                {"filter":"vibrance","value":"38","priority":1}
            ]);
    });
```
