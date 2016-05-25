"use strict";
var chai_1 = require('chai');
var Hsv = require('../source/pixel/color/hsv');
describe('Hsv color', function () {
    it('Should have all channels 0', function () {
        var color = new Hsv();
        chai_1.expect(color.h).eql(0);
        chai_1.expect(color.s).eql(0);
        chai_1.expect(color.v).eql(0);
    });
    it('Should convert correctly to RGB', function () {
        var emeraldHsv = new Hsv({
            h: 145,
            s: 77.5 / 100,
            v: 80 / 100,
        });
        var emerald = emeraldHsv.toRgb();
        console.log('rgb', emerald);
        chai_1.expect(emerald.r).approximately(46, 1);
        chai_1.expect(emerald.g).approximately(204, 1);
        chai_1.expect(emerald.b).approximately(113, 1);
    });
});
