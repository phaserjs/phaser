/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var StarRender = require('./StarRender');
var Class = require('../../../utils/Class');
var Earcut = require('../../../geom/polygon/Earcut');
var Shape = require('../Shape');

/**
 * @classdesc
 *
 * @class Star
 * @extends Phaser.GameObjects.Shape
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 */
var Star = new Class({

    Extends: Shape,

    Mixins: [
        StarRender
    ],

    initialize:

    function Star (scene, x, y, points, innerRadius, outerRadius, fillColor, fillAlpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (points === undefined) { points = 5; }
        if (innerRadius === undefined) { innerRadius = 32; }
        if (outerRadius === undefined) { outerRadius = 64; }

        Shape.call(this, scene, 'Star', null);

        this._points = points;
        this._innerRadius = innerRadius;
        this._outerRadius = outerRadius;

        this.setPosition(x, y);
        this.setSize(outerRadius * 2, outerRadius * 2);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    },

    setPoints: function (value)
    {
        this._points = value;

        return this.updateData();
    },

    setInnerRadius: function (value)
    {
        this._innerRadius = value;

        return this.updateData();
    },

    setOuterRadius: function (value)
    {
        this._outerRadius = value;

        return this.updateData();
    },

    points: {

        get: function ()
        {
            return this._points;
        },

        set: function (value)
        {
            this._points = value;

            this.updateData();
        }

    },

    innerRadius: {

        get: function ()
        {
            return this._innerRadius;
        },

        set: function (value)
        {
            this._innerRadius = value;

            this.updateData();
        }

    },

    outerRadius: {

        get: function ()
        {
            return this._outerRadius;
        },

        set: function (value)
        {
            this._outerRadius = value;

            this.updateData();
        }

    },

    updateData: function ()
    {
        var path = [];

        var points = this._points;
        var innerRadius = this._innerRadius;
        var outerRadius = this._outerRadius;

        var rot = Math.PI / 2 * 3;
        var step = Math.PI / points;

        //  So origin 0.5 = the center of the star
        var x = outerRadius;
        var y = outerRadius;
    
        path.push(x, y + -outerRadius);

        for (var i = 0; i < points; i++)
        {
            path.push(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);

            rot += step;

            path.push(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
    
            rot += step;
        }

        path.push(x, y + -outerRadius);

        this.pathIndexes = Earcut(path);
        this.pathData = path;

        return this;
    }

});

module.exports = Star;
