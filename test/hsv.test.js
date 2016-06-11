"use strict";
var chai_1 = require('chai');
var hsv_1 = require('../source/pixel/color/hsv');
var hex_1 = require('../source/pixel/color/hex');
var colors_1 = require('./colors');
describe('HSV color', function () {
    it('Should have all channels 0 initially', function () {
        var color = new hsv_1.Hsv();
        chai_1.expect(color.h).eql(0);
        chai_1.expect(color.s).eql(0);
        chai_1.expect(color.v).eql(0);
    });
    var colors = colors_1.colorMap;
    var _loop_1 = function(key) {
        if (colors[key]) {
            it("Should convert " + key + " correctly to RGB", function () {
                var rgb = colors[key].rgb;
                var hsv = colors[key].hsv;
                var color = new hsv_1.Hsv(hsv);
                var result = color.toRgb();
                chai_1.expect(result.r).approximately(rgb.r, 1);
                chai_1.expect(result.g).approximately(rgb.g, 1);
                chai_1.expect(result.b).approximately(rgb.b, 1);
            });
            it("Should convert " + key + " correctly to HEX", function () {
                var hsv = colors[key].hsv;
                var hex = new hex_1.Hex(colors[key].hex);
                var color = new hsv_1.Hsv(hsv);
                var result = color.toHex();
                chai_1.expect(parseInt(result.value.substring(1), 16)).approximately(parseInt(hex.value.substring(1), 16), 80000);
            });
            it("Should convert " + key + " correctly to CMYK", function () {
                var hsv = colors[key].hsv;
                var cmyk = colors[key].cmyk;
                var color = new hsv_1.Hsv(hsv);
                var result = color.toCmyk();
                chai_1.expect(result.c).equals(cmyk.c);
                chai_1.expect(result.m).equals(cmyk.m);
                chai_1.expect(result.y).equals(cmyk.y);
                chai_1.expect(result.k).equals(cmyk.k);
            });
            it("Should convert " + key + " correctly to HSV", function () {
                var hsv = new hsv_1.Hsv(colors[key].hsv);
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
        var color = new hsv_1.Hsv({
            h: 0,
            s: 0,
            v: 0,
        }).clamp();
        chai_1.expect(color.h).eql(0);
        chai_1.expect(color.s).eql(0);
        chai_1.expect(color.v).eql(0);
        color = new hsv_1.Hsv({
            h: 360,
            s: 1,
            v: 1,
        }).clamp();
        chai_1.expect(color.h).eql(360);
        chai_1.expect(color.s).eql(1);
        chai_1.expect(color.v).eql(1);
        color = new hsv_1.Hsv({
            h: -1,
            s: -1,
            v: -1,
        }).clamp();
        chai_1.expect(color.h).eql(0);
        chai_1.expect(color.s).eql(0);
        chai_1.expect(color.v).eql(0);
        color = new hsv_1.Hsv({
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
                color = new hsv_1.Hsv(hsv).clamp();
                chai_1.expect(color.h).eql(hsv.h);
                chai_1.expect(color.s).eql(hsv.s);
                chai_1.expect(color.v).eql(hsv.v);
            }
        }
    });
});
