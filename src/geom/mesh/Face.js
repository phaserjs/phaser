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
 * A Face Geometry Object.
 *
 * A Face is used by the Mesh Game Object. A Mesh consists of one, or more, faces that are
 * used to render the Mesh Game Objects in WebGL.
 *
 * A Face consists of 3 Vertex instances, for the 3 corners of the face and methods to help
 * you modify and test them.
 *
 * @class Face
 * @memberof Phaser.Geom.Mesh
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Geom.Mesh.Vertex} vertex1 - The first vertex of the Face.
 * @param {Phaser.Geom.Mesh.Vertex} vertex2 - The second vertex of the Face.
 * @param {Phaser.Geom.Mesh.Vertex} vertex3 - The third vertex of the Face.
 */
var Face = new Class({

    initialize:

    function Face (vertex1, vertex2, vertex3)
    {
        /**
         * The first vertex in this Face.
         *
         * @name Phaser.Geom.Mesh.Face#vertex1
         * @type {Phaser.Geom.Mesh.Vertex}
         * @since 3.50.0
         */
        this.vertex1 = vertex1;

        /**
         * The second vertex in this Face.
         *
         * @name Phaser.Geom.Mesh.Face#vertex2
         * @type {Phaser.Geom.Mesh.Vertex}
         * @since 3.50.0
         */
        this.vertex2 = vertex2;

        /**
         * The third vertex in this Face.
         *
         * @name Phaser.Geom.Mesh.Face#vertex3
         * @type {Phaser.Geom.Mesh.Vertex}
         * @since 3.50.0
         */
        this.vertex3 = vertex3;

        /**
         * The face inCenter. Do not access directly, instead use the `getInCenter` method.
         *
         * @name Phaser.Geom.Mesh.Face#_inCenter
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.50.0
         */
        this._inCenter = new Vector2();
    },

    /**
     * Calculates and returns the in center position of this Face.
     *
     * @method Phaser.Geom.Mesh.Face#getInCenter
     * @since 3.50.0
     *
     * @param {boolean} [local=true] Return the in center from the un-transformed vertex positions (`true`), or transformed? (`false`)
     *
     * @return {Phaser.Math.Vector2} A Vector2 containing the in center position of this Face.
     */
    getInCenter: function (local)
    {
        if (local === undefined) { local = true; }

        var v1 = this.vertex1;
        var v2 = this.vertex2;
        var v3 = this.vertex3;

        var v1x;
        var v1y;

        var v2x;
        var v2y;

        var v3x;
        var v3y;

        if (local)
        {
            v1x = v1.x;
            v1y = v1.y;

            v2x = v2.x;
            v2y = v2.y;

            v3x = v3.x;
            v3y = v3.y;
        }
        else
        {
            v1x = v1.vx;
            v1y = v1.vy;

            v2x = v2.vx;
            v2y = v2.vy;

            v3x = v3.vx;
            v3y = v3.vy;
        }

        var d1 = GetLength(v3x, v3y, v2x, v2y);
        var d2 = GetLength(v1x, v1y, v3x, v3y);
        var d3 = GetLength(v2x, v2y, v1x, v1y);

        var p = d1 + d2 + d3;

        return this._inCenter.set(
            (v1x * d1 + v2x * d2 + v3x * d3) / p,
            (v1y * d1 + v2y * d2 + v3y * d3) / p
        );
    },

    /**
     * Translates the vertices of this Face by the given amounts.
     *
     * The actual vertex positions are adjusted, not their transformed position.
     *
     * Therefore, this updates the vertex data directly.
     *
     * @method Phaser.Geom.Mesh.Face#translate
     * @since 3.50.0
     *
     * @param {number} x - The amount to horizontally translate by.
     * @param {number} [y=0] - The amount to vertically translate by.
     *
     * @return {this} This Face instance.
     */
    translate: function (x, y)
    {
        if (y === undefined) { y = 0; }

        var v1 = this.vertex1;
        var v2 = this.vertex2;
        var v3 = this.vertex3;

        v1.x += x;
        v1.y += y;

        v2.x += x;
        v2.y += y;

        v3.x += x;
        v3.y += y;

        return this;
    },

    /**
     * Rotates the vertices of this Face to the given angle.
     *
     * The actual vertex positions are adjusted, not their transformed positions.
     *
     * Therefore, this updates the vertex data directly.
     *
     * @method Phaser.Geom.Mesh.Face#rotate
     * @since 3.50.0
     *
     * @param {number} angle - The angle to rotate to, in radians.
     * @param {number} [cx] - An optional center of rotation. If not given, the Face in center is used.
     * @param {number} [cy] - An optional center of rotation. If not given, the Face in center is used.
     *
     * @return {this} This Face instance.
     */
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

        v1.set(tx * c - ty * s + x, tx * s + ty * c + y);

        tx = v2.x - x;
        ty = v2.y - y;

        v2.set(tx * c - ty * s + x, tx * s + ty * c + y);

        tx = v3.x - x;
        ty = v3.y - y;

        v3.set(tx * c - ty * s + x, tx * s + ty * c + y);

        return this;
    },

    /**
     * Checks if the given coordinates are within this Face.
     *
     * You can optionally provide a transform matrix. If given, the Face vertices
     * will be transformed first, before being checked against the coordinates.
     *
     * @method Phaser.Geom.Mesh.Face#contains
     * @since 3.50.0
     *
     * @param {number} x - The horizontal position to check.
     * @param {number} y - The vertical position to check.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [calcMatrix] - Optional transform matrix to apply to the vertices before comparison.
     *
     * @return {boolean} `true` if the coordinates lay within this Face, otherwise `false`.
     */
    contains: function (x, y, calcMatrix)
    {
        var vertex1 = this.vertex1;
        var vertex2 = this.vertex2;
        var vertex3 = this.vertex3;

        var v1x = vertex1.vx;
        var v1y = vertex1.vy;

        var v2x = vertex2.vx;
        var v2y = vertex2.vy;

        var v3x = vertex3.vx;
        var v3y = vertex3.vy;

        if (calcMatrix)
        {
            var a = calcMatrix.a;
            var b = calcMatrix.b;
            var c = calcMatrix.c;
            var d = calcMatrix.d;
            var e = calcMatrix.e;
            var f = calcMatrix.f;

            v1x = vertex1.vx * a + vertex1.vy * c + e;
            v1y = vertex1.vx * b + vertex1.vy * d + f;

            v2x = vertex2.vx * a + vertex2.vy * c + e;
            v2y = vertex2.vx * b + vertex2.vy * d + f;

            v3x = vertex3.vx * a + vertex3.vy * c + e;
            v3y = vertex3.vx * b + vertex3.vy * d + f;
        }

        var t0x = v3x - v1x;
        var t0y = v3y - v1y;

        var t1x = v2x - v1x;
        var t1y = v2y - v1y;

        var t2x = x - v1x;
        var t2y = y - v1y;

        var dot00 = (t0x * t0x) + (t0y * t0y);
        var dot01 = (t0x * t1x) + (t0y * t1y);
        var dot02 = (t0x * t2x) + (t0y * t2y);
        var dot11 = (t1x * t1x) + (t1y * t1y);
        var dot12 = (t1x * t2x) + (t1y * t2y);

        //  Compute barycentric coordinates
        var bc = ((dot00 * dot11) - (dot01 * dot01));
        var inv = (bc === 0) ? 0 : (1 / bc);
        var u = ((dot11 * dot02) - (dot01 * dot12)) * inv;
        var v = ((dot00 * dot12) - (dot01 * dot02)) * inv;

        return (u >= 0 && v >= 0 && (u + v < 1));
    },

    /**
     * Checks if the vertices in this Face are orientated counter-clockwise, or not.
     *
     * It checks the transformed position of the vertex.
     *
     * @method Phaser.Geom.Mesh.Face#isCounterClockwise
     * @since 3.50.0
     *
     * @return {boolean} `true` if the vertices in this Face run counter-clockwise, otherwise `false`.
     */
    isCounterClockwise: function ()
    {
        var v1 = this.vertex1;
        var v2 = this.vertex2;
        var v3 = this.vertex3;

        return (v2.vx - v1.vx) * (v3.vy - v1.vy) - (v2.vy - v1.vy) * (v3.vx - v1.vx) >= 0;
    },

    /**
     * The x coordinate of this Face, based on the in center position of the Face.
     *
     * @name Phaser.Geom.Mesh.Face#x
     * @type {number}
     * @since 3.50.0
     */
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

    /**
     * The y coordinate of this Face, based on the in center position of the Face.
     *
     * @name Phaser.Geom.Mesh.Face#y
     * @type {number}
     * @since 3.50.0
     */
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

    /**
     * The depth of this Face, which is an average of the z component of all three vertices.
     *
     * The depth is calculated based on the transformed z value, not the local one.
     *
     * @name Phaser.Geom.Mesh.Face#depth
     * @type {number}
     * @readonly
     * @since 3.50.0
     */
    depth: {

        get: function ()
        {
            var v1 = this.vertex1;
            var v2 = this.vertex2;
            var v3 = this.vertex3;

            return (v1.vz + v2.vz + v3.vz) / 3;
        }

    },

    /**
     * Destroys this Face and nulls the references to the vertices.
     *
     * @method Phaser.Geom.Mesh.Face#destroy
     * @since 3.50.0
     */
    destroy: function ()
    {
        this.vertex1 = null;
        this.vertex2 = null;
        this.vertex3 = null;
    }

});

module.exports = Face;
