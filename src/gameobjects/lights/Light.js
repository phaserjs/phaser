/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Utils = require('../../renderer/webgl/Utils');

var Light = new Class({

    initialize:

    function Light (x, y, radius, r, g, b, intensity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.r = r;
        this.g = g;
        this.b = b;
        this.intensity = intensity;
        this.scrollFactorX = 1.0;
        this.scrollFactorY = 1.0;
    },

    set: function (x, y, radius, r, g, b, intensity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.r = r;
        this.g = g;
        this.b = b;
        this.intensity = intensity;
        this.scrollFactorX = 1.0;
        this.scrollFactorY = 1.0;
    },

    setScrollFactor: function (x, y)
    {
        this.scrollFactorX = x;
        this.scrollFactorY = (y === undefined) ? x : y;
        return this;
    },

    setColor: function (rgb)
    {
        var color = Utils.getFloatsFromUintRGB(rgb);
        
        this.r = color[0];
        this.g = color[1];
        this.b = color[2];
        
        return this;
    },

    setIntensity: function (intensity)
    {
        this.intensity = intensity;

        return this;
    },

    setPosition: function (x, y)
    {
        this.x = x;
        this.y = y;

        return this;
    },

    setRadius: function (radius)
    {
        this.radius = radius;

        return this;
    }

});

module.exports = Light;
