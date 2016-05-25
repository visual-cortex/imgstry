"use strict";
var chai_1 = require('chai');
var Rgb = require('../source/pixel/color/rgb');
describe('Rgb color', function () {
    it('Should have all channels 0', function () {
        var color = new Rgb();
        chai_1.expect(color.r).eql(0);
        chai_1.expect(color.g).eql(0);
        chai_1.expect(color.b).eql(0);
    });
    it('Should convert correctly to HSV', function () {
        var emerald = new Rgb({
            r: 46,
            g: 204,
            b: 113,
        });
        var emeraldHsv = emerald.toHsv();
        chai_1.expect(emeraldHsv.h).approximately(145, 1);
        chai_1.expect(emeraldHsv.s).approximately(77.5 / 100, 1);
        chai_1.expect(emeraldHsv.v).approximately(80 / 100, 1);
        var pomegranate = new Rgb({
            r: 192,
            g: 57,
            b: 43,
        });
        var pomegranateHsv = pomegranate.toHsv();
        chai_1.expect(pomegranateHsv.h).approximately(6, 1);
        chai_1.expect(pomegranateHsv.s).approximately(77.6 / 100, 1);
        chai_1.expect(pomegranateHsv.v).approximately(75.3 / 100, 1);
    });
    it('Should convert correctly to RGB', function () {
        var emerald = new Rgb({
            r: 46,
            g: 204,
            b: 113,
        });
        var clone = emerald.toRgb();
        chai_1.expect(clone.r).eql(emerald.r);
        chai_1.expect(clone.g).eql(emerald.g);
        chai_1.expect(clone.b).eql(emerald.b);
        var pomegranate = new Rgb({
            r: 192,
            g: 57,
            b: 43,
        });
        clone = pomegranate.toRgb();
        chai_1.expect(clone.r).eql(pomegranate.r);
        chai_1.expect(clone.g).eql(pomegranate.g);
        chai_1.expect(clone.b).eql(pomegranate.b);
    });
    it('Should clamp correctly', function () {
        var color = new Rgb({
            r: 0,
            g: -100,
            b: 300,
        }).clamp();
        chai_1.expect(color.r).eql(0);
        chai_1.expect(color.g).eql(0);
        chai_1.expect(color.b).eql(255);
        color = new Rgb({
            r: 200,
            g: 100,
            b: 221,
        }).clamp();
        chai_1.expect(color.r).eql(200);
        chai_1.expect(color.g).eql(100);
        chai_1.expect(color.b).eql(221);
        color = new Rgb({
            r: -1,
            g: 100,
            b: 256,
        }).clamp();
        chai_1.expect(color.r).eql(0);
        chai_1.expect(color.g).eql(100);
        chai_1.expect(color.b).eql(255);
    });
});
