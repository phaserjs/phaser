/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * [description]
 *
 * @class TransformMatrix
 * @memberOf Phaser.GameObjects.Components
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [a=1] - [description]
 * @param {number} [b=0] - [description]
 * @param {number} [c=0] - [description]
 * @param {number} [d=1] - [description]
 * @param {number} [tx=0] - [description]
 * @param {number} [ty=0] - [description]
 */
var TransformMatrix = new Class({

    initialize:

    function TransformMatrix (a, b, c, d, tx, ty)
    {
        if (a === undefined) { a = 1; }
        if (b === undefined) { b = 0; }
        if (c === undefined) { c = 0; }
        if (d === undefined) { d = 1; }
        if (tx === undefined) { tx = 0; }
        if (ty === undefined) { ty = 0; }

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TransformMatrix#matrix
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.matrix = new Float32Array([ a, b, c, d, tx, ty, 0, 0, 1 ]);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TransformMatrix#decomposedMatrix
         * @type {object}
         * @since 3.0.0
         */
        this.decomposedMatrix = {
            translateX: 0,
            translateY: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0
        };
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#loadIdentity
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} This TransformMatrix.
     */
    loadIdentity: function ()
    {
        var matrix = this.matrix;

        matrix[0] = 1;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 1;
        matrix[4] = 0;
        matrix[5] = 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#translate
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} This TransformMatrix.
     */
    translate: function (x, y)
    {
        var matrix = this.matrix;

        matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
        matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#scale
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} This TransformMatrix.
     */
    scale: function (x, y)
    {
        var matrix = this.matrix;

        matrix[0] *= x;
        matrix[1] *= x;
        matrix[2] *= y;
        matrix[3] *= y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#rotate
     * @since 3.0.0
     *
     * @param {number} radian - [description]
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} This TransformMatrix.
     */
    rotate: function (radian)
    {
        var radianSin = Math.sin(radian);
        var radianCos = Math.cos(radian);

        return this.transform(radianCos, radianSin, -radianSin, radianCos, 0, 0);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#multiply
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.TransformMatrix} rhs - [description]
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} This TransformMatrix.
     */
    multiply: function (rhs)
    {
        var matrix = this.matrix;
        var otherMatrix = rhs.matrix;

        var a0 = matrix[0];
        var b0 = matrix[1];
        var c0 = matrix[2];
        var d0 = matrix[3];
        var tx0 = matrix[4];
        var ty0 = matrix[5];

        var a1 = otherMatrix[0];
        var b1 = otherMatrix[1];
        var c1 = otherMatrix[2];
        var d1 = otherMatrix[3];
        var tx1 = otherMatrix[4];
        var ty1 = otherMatrix[5];

        matrix[0] = a1 * a0 + b1 * c0;
        matrix[1] = a1 * b0 + b1 * d0;
        matrix[2] = c1 * a0 + d1 * c0;
        matrix[3] = c1 * b0 + d1 * d0;
        matrix[4] = tx1 * a0 + ty1 * c0 + tx0;
        matrix[5] = tx1 * b0 + ty1 * d0 + ty0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#transform
     * @since 3.0.0
     *
     * @param {number} a - [description]
     * @param {number} b - [description]
     * @param {number} c - [description]
     * @param {number} d - [description]
     * @param {number} tx - [description]
     * @param {number} ty - [description]
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} This TransformMatrix.
     */
    transform: function (a, b, c, d, tx, ty)
    {
        var matrix = this.matrix;

        var a0 = matrix[0];
        var b0 = matrix[1];
        var c0 = matrix[2];
        var d0 = matrix[3];
        var tx0 = matrix[4];
        var ty0 = matrix[5];

        matrix[0] = a * a0 + b * c0;
        matrix[1] = a * b0 + b * d0;
        matrix[2] = c * a0 + d * c0;
        matrix[3] = c * b0 + d * d0;
        matrix[4] = tx * a0 + ty * c0 + tx0;
        matrix[5] = tx * b0 + ty * d0 + ty0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#transformPoint
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {(Phaser.Geom.Point|Phaser.Math.Vector2|object)} point - [description]
     *
     * @return {(Phaser.Geom.Point|Phaser.Math.Vector2|object)} [description]
     */
    transformPoint: function (x, y, point)
    {
        if (point === undefined) { point = { x: 0, y: 0 }; }

        var matrix = this.matrix;

        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];
        var tx = matrix[4];
        var ty = matrix[5];

        point.x = x * a + y * c + tx;
        point.y = x * b + y * d + ty;

        return point;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#invert
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} This TransformMatrix.
     */
    invert: function ()
    {
        var matrix = this.matrix;

        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];
        var tx = matrix[4];
        var ty = matrix[5];

        var n = a * d - b * c;

        matrix[0] = d / n;
        matrix[1] = -b / n;
        matrix[2] = -c / n;
        matrix[3] = a / n;
        matrix[4] = (c * ty - d * tx) / n;
        matrix[5] = -(a * ty - b * tx) / n;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#setTransform
     * @since 3.0.0
     *
     * @param {number} a - [description]
     * @param {number} b - [description]
     * @param {number} c - [description]
     * @param {number} d - [description]
     * @param {number} tx - [description]
     * @param {number} ty - [description]
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} This TransformMatrix.
     */
    setTransform: function (a, b, c, d, tx, ty)
    {
        var matrix = this.matrix;

        matrix[0] = a;
        matrix[1] = b;
        matrix[2] = c;
        matrix[3] = d;
        matrix[4] = tx;
        matrix[5] = ty;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#decomposeMatrix
     * @since 3.0.0
     *
     * @return {object} [description]
     */
    decomposeMatrix: function ()
    {
        var decomposedMatrix = this.decomposedMatrix;

        var matrix = this.matrix;

        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];

        var a2 = a * a;
        var b2 = b * b;
        var c2 = c * c;
        var d2 = d * d;

        var sx = Math.sqrt(a2 + c2);
        var sy = Math.sqrt(b2 + d2);

        decomposedMatrix.translateX = matrix[4];
        decomposedMatrix.translateY = matrix[5];

        decomposedMatrix.scaleX = sx;
        decomposedMatrix.scaleY = sy;

        decomposedMatrix.rotation = Math.acos(a / sx) * (Math.atan(-c / a) < 0 ? -1 : 1);

        return decomposedMatrix;
    },

    /**
     * Identity + Translate + Rotate + Scale
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#applyITRS
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} rotation - [description]
     * @param {number} scaleX - [description]
     * @param {number} scaleY - [description]
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} This TransformMatrix.
     */
    applyITRS: function (x, y, rotation, scaleX, scaleY)
    {
        var matrix = this.matrix;

        var sr = Math.sin(rotation);
        var cr = Math.cos(rotation);

        // Translate
        matrix[4] = x;
        matrix[5] = y;

        // Rotate and Scale
        matrix[0] = cr * scaleX;
        matrix[1] = -sr * scaleX;
        matrix[2] = sr * scaleY;
        matrix[3] = cr * scaleY;

        return this;
    }

});

module.exports = TransformMatrix;
