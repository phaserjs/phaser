/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Vector2 = require('../../math/Vector2');

function GetLength (x1, y1, x2, y2)
{
    var x = x1 - x2;
    var y = y1 - y2;
    var magnitude = (x * x) + (y * y);

    return Math.sqrt(magnitude);
}

/**
 * @classdesc
 * A Face Game Object.
 *
 * This class consists of 3 Vertex instances, for the 3 corners of the face.
 *
 * @class Face
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.GameObjects.Vertex} vertex1 - The first vertex in this Face.
 * @param {Phaser.GameObjects.Vertex} vertex2 - The second vertex in this Face.
 * @param {Phaser.GameObjects.Vertex} vertex3 - The third vertex in this Face.
 */
var Face = new Class({

    initialize:

    function Face (vertex1, vertex2, vertex3)
    {
        /**
         * The first vertex in this Face.
         *
         * @name Phaser.GameObjects.Face#vertex1
         * @type {Phaser.GameObjects.Vertex}
         * @since 3.50.0
         */
        this.vertex1 = vertex1;

        /**
         * The second vertex in this Face.
         *
         * @name Phaser.GameObjects.Face#vertex2
         * @type {Phaser.GameObjects.Vertex}
         * @since 3.50.0
         */
        this.vertex2 = vertex2;

        /**
         * The third vertex in this Face.
         *
         * @name Phaser.GameObjects.Face#vertex3
         * @type {Phaser.GameObjects.Vertex}
         * @since 3.50.0
         */
        this.vertex3 = vertex3;

        /**
         * The face inCenter. Do not access directly, instead use the `getInCenter` method.
         *
         * @name Phaser.GameObjects.Face#_inCenter
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.50.0
         */
        this._inCenter = new Vector2();
    },

    getInCenter: function ()
    {
        var v1 = this.vertex1;
        var v2 = this.vertex2;
        var v3 = this.vertex3;

        var d1 = GetLength(v3.x, v3.y, v2.x, v2.y);
        var d2 = GetLength(v1.x, v1.y, v3.x, v3.y);
        var d3 = GetLength(v2.x, v2.y, v1.x, v1.y);

        var p = d1 + d2 + d3;

        return this._inCenter.set(
            (v1.x * d1 + v2.x * d2 + v3.x * d3) / p,
            (v1.y * d1 + v2.y * d2 + v3.y * d3) / p
        );
    },

    translate: function (x, y)
    {
        if (y === undefined) { y = 0; }

        var v1 = this.vertex1;
        var v2 = this.vertex2;
        var v3 = this.vertex3;

        v1.translate(x, y);
        v2.translate(x, y);
        v3.translate(x, y);

        return this;
    },

    rotate: function (angle, cx, cy)
    {
        var x;
        var y;

        //  No point of rotation? Use the inCenter instead, then.
        if (cx === undefined && cy === undefined)
        {
            var inCenter = this.getInCenter();

            x = inCenter.x;
            y = inCenter.y;
        }

        var c = Math.cos(angle);
        var s = Math.sin(angle);

        var v1 = this.vertex1;
        var v2 = this.vertex2;
        var v3 = this.vertex3;

        var tx = v1.x - x;
        var ty = v1.y - y;

        v1.setPosition(tx * c - ty * s + x, tx * s + ty * c + y);

        tx = v2.x - x;
        ty = v2.y - y;

        v2.setPosition(tx * c - ty * s + x, tx * s + ty * c + y);

        tx = v3.x - x;
        ty = v3.y - y;

        v3.setPosition(tx * c - ty * s + x, tx * s + ty * c + y);

        return this;
    },

    x: {

        get: function ()
        {
            return this.getInCenter().x;
        },

        set: function (value)
        {
            var current = this.getInCenter();

            this.translate(value - current.x, 0);
        }

    },

    y: {

        get: function ()
        {
            return this.getInCenter().y;
        },

        set: function (value)
        {
            var current = this.getInCenter();

            this.translate(0, value - current.y);
        }

    },

    destroy: function ()
    {
        this.vertex1 = null;
        this.vertex2 = null;
        this.vertex3 = null;
    }

});

module.exports = Face;
