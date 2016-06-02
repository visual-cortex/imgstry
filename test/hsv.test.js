"use strict";
var chai_1 = require('chai');
var Hsv = require('../source/pixel/color/hsv');
var Hex = require('../source/pixel/color/hex');
var colorMap = require('./colors');
describe('HSV color', function () {
    it('Should have all channels 0 initially', function () {
        var color = new Hsv();
        chai_1.expect(color.h).eql(0);
        chai_1.expect(color.s).eql(0);
        chai_1.expect(color.v).eql(0);
    });
    var colors = colorMap;
    var _loop_1 = function(key) {
        if (colors[key]) {
            it("Should convert " + key + " correctly to RGB", function () {
                var rgb = colors[key].rgb;
                var hsv = colors[key].hsv;
                var color = new Hsv(hsv);
                var result = color.toRgb();
                chai_1.expect(result.r).approximately(rgb.r, 1);
                chai_1.expect(result.g).approximately(rgb.g, 1);
                chai_1.expect(result.b).approximately(rgb.b, 1);
            });
            it("Should convert " + key + " correctly to HEX", function () {
                var hsv = colors[key].hsv;
                var hex = new Hex(colors[key].hex);
                var color = new Hsv(hsv);
                var result = color.toHex();
                chai_1.expect(parseInt(result.value.substring(1), 16)).approximately(parseInt(hex.value.substring(1), 16), 80000);
            });
            it("Should convert " + key + " correctly to CMYK", function () {
                var hsv = colors[key].hsv;
                var cmyk = colors[key].cmyk;
                var color = new Hsv(hsv);
                var result = color.toCmyk();
                chai_1.expect(result.c).equals(cmyk.c);
                chai_1.expect(result.m).equals(cmyk.m);
                chai_1.expect(result.y).equals(cmyk.y);
                chai_1.expect(result.k).equals(cmyk.k);
            });
            it("Should convert " + key + " correctly to HSV", function () {
                var hsv = new Hsv(colors[key].hsv);
                var color = hsv.toHsv();
                chai_1.expect(color.h).eql(hsv.h);
                chai_1.expect(color.s).eql(hsv.s);
                chai_1.expect(color.v).eql(hsv.v);
            });
        }
    };
    for (var key in colors) {
        _loop_1(key);
    }
    it('Should clamp correctly', function () {
        var color = new Hsv({
            h: 0,
            s: 0,
            v: 0,
        }).clamp();
        chai_1.expect(color.h).eql(0);
        chai_1.expect(color.s).eql(0);
        chai_1.expect(color.v).eql(0);
        color = new Hsv({
            h: 360,
            s: 1,
            v: 1,
        }).clamp();
        chai_1.expect(color.h).eql(360);
        chai_1.expect(color.s).eql(1);
        chai_1.expect(color.v).eql(1);
        color = new Hsv({
            h: -1,
            s: -1,
            v: -1,
        }).clamp();
        chai_1.expect(color.h).eql(0);
        chai_1.expect(color.s).eql(0);
        chai_1.expect(color.v).eql(0);
        color = new Hsv({
            h: 361,
            s: 1.1,
            v: 1.1,
        }).clamp();
        chai_1.expect(color.h).eql(360);
        chai_1.expect(color.s).eql(1);
        chai_1.expect(color.v).eql(1);
        for (var key in colors) {
            if (colors[key]) {
                var hsv = colors[key].hsv;
                color = new Hsv(hsv).clamp();
                chai_1.expect(color.h).eql(hsv.h);
                chai_1.expect(color.s).eql(hsv.s);
                chai_1.expect(color.v).eql(hsv.v);
            }
        }
    });
});
