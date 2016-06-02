"use strict";
var chai_1 = require('chai');
var Rgb = require('../source/pixel/color/rgb');
var Hex = require('../source/pixel/color/hex');
var colorMap = require('./colors');
describe('RGB color', function () {
    it('Should have all channels 0 initially', function () {
        var color = new Rgb();
        chai_1.expect(color.r).eql(0);
        chai_1.expect(color.g).eql(0);
        chai_1.expect(color.b).eql(0);
    });
    var colors = colorMap;
    var _loop_1 = function(key) {
        if (colors[key]) {
            it("Should convert " + key + " correctly to HSV", function () {
                var rgb = colors[key].rgb;
                var hsv = colors[key].hsv;
                var color = new Rgb(rgb);
                var result = color.toHsv();
                chai_1.expect(result.h).approximately(hsv.h, 1);
                chai_1.expect(result.s).approximately(hsv.s, 1);
                chai_1.expect(result.v).approximately(hsv.v, 1);
            });
            it("Should convert " + key + " correctly to HEX", function () {
                var rgb = colors[key].rgb;
                var hex = new Hex(colors[key].hex);
                var color = new Rgb(rgb);
                var result = color.toHex();
                chai_1.expect(parseInt(result.value.substring(1), 16)).approximately(parseInt(hex.value.substring(1), 16), 80000);
            });
            it("Should convert " + key + " correctly to CMYK", function () {
                var rgb = colors[key].rgb;
                var cmyk = colors[key].cmyk;
                var color = new Rgb(rgb);
                var result = color.toCmyk();
                chai_1.expect(result.c).equals(cmyk.c);
                chai_1.expect(result.m).equals(cmyk.m);
                chai_1.expect(result.y).equals(cmyk.y);
                chai_1.expect(result.k).equals(cmyk.k);
            });
            it("Should convert " + key + " correctly to RGB", function () {
                var rgb = new Rgb(colors[key].rgb);
                var color = rgb.toRgb();
                chai_1.expect(color.r).eql(rgb.r);
                chai_1.expect(color.g).eql(rgb.g);
                chai_1.expect(color.b).eql(rgb.b);
            });
        }
    };
    for (var key in colors) {
        _loop_1(key);
    }
    it('Should clamp correctly', function () {
        var color = new Rgb({
            r: 0,
            g: 0,
            b: 0,
        }).clamp();
        chai_1.expect(color.r).eql(0);
        chai_1.expect(color.g).eql(0);
        chai_1.expect(color.b).eql(0);
        color = new Rgb({
            r: 255,
            g: 255,
            b: 255,
        }).clamp();
        chai_1.expect(color.r).eql(255);
        chai_1.expect(color.g).eql(255);
        chai_1.expect(color.b).eql(255);
        color = new Rgb({
            r: -1,
            g: -1,
            b: -1,
        }).clamp();
        chai_1.expect(color.r).eql(0);
        chai_1.expect(color.g).eql(0);
        chai_1.expect(color.b).eql(0);
        color = new Rgb({
            r: 256,
            g: 256,
            b: 256,
        }).clamp();
        chai_1.expect(color.r).eql(255);
        chai_1.expect(color.g).eql(255);
        chai_1.expect(color.b).eql(255);
        for (var key in colors) {
            if (colors[key]) {
                var rgb = colors[key].rgb;
                color = new Rgb(rgb).clamp();
                chai_1.expect(color.r).eql(rgb.r);
                chai_1.expect(color.g).eql(rgb.g);
                chai_1.expect(color.b).eql(rgb.b);
            }
        }
    });
});
