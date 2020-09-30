/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Vector3 = require('../../math/Vector3');

var points = [
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3()
];

/**
 * @classdesc
 *
 * @class Box3
 * @memberof Phaser.Layer3D.Math
 * @constructor
 * @since 3.50.0
 *
 * @param {number} [x] - The x component.
 * @param {number} [y] - The y component.
 * @param {number} [z] - The z component.
 */
var Box3 = new Class({

    initialize:

    function Box3 (min, max)
    {
        if (min === undefined) { min = new Vector3(+Infinity, +Infinity, +Infinity); }
        if (max === undefined) { max = new Vector3(-Infinity, -Infinity, -Infinity); }

        this.min = min;
        this.max = max;
    },

    set: function (min, max)
    {
        this.min.copy(min);
        this.max.copy(max);

        return this;
    },

    setFromPoints: function (points)
    {
        this.makeEmpty();

        for (var i = 0; i < points.length; i++)
        {
            this.expandByPoint(points[i]);
        }

        return this;
    },

    makeEmpty: function ()
    {
        this.min.set(+Infinity, +Infinity, +Infinity);
        this.max.set(-Infinity, -Infinity, -Infinity);

        return this;
    },

    expandByPoint: function (point)
    {
        this.min.min(point);
        this.max.max(point);

        return this;
    },

    expandByScalar: function (scalar)
    {
        this.min.addScalar(-scalar);
        this.max.addScalar(scalar);

        return this;
    },

    expandByBox3: function (box3)
    {
        this.min.min(box3.min);
        this.max.max(box3.max);

        return this;
    },

    setFromArray: function (array, gap)
    {
        if (gap === undefined) { gap = 3; }

        var minX = +Infinity;
        var minY = +Infinity;
        var minZ = +Infinity;

        var maxX = -Infinity;
        var maxY = -Infinity;
        var maxZ = -Infinity;

        for (var i = 0; i < array.length; i += gap)
        {
            var x = array[i];
            var y = array[i + 1];
            var z = array[i + 2];

            if (x < minX) { minX = x; }
            if (y < minY) { minY = y; }
            if (z < minZ) { minZ = z; }

            if (x > maxX) { maxX = x; }
            if (y > maxY) { maxY = y; }
            if (z > maxZ) { maxZ = z; }
        }

        this.min.set(minX, minY, minZ);
        this.max.set(maxX, maxY, maxZ);

        return this;
    },

    isEmpty: function ()
    {
        // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
        return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
    },

    equals: function (box)
    {
        return box.min.equals(this.min) && box.max.equals(this.max);
    },

    getCenter: function (optionalTarget)
    {
        if (optionalTarget === undefined) { optionalTarget = new Vector3(); }

        var result = optionalTarget;

        return this.isEmpty() ? result.set(0, 0, 0) : result.addVectors(this.min, this.max).scale(0.5);
    },

    applyMatrix4: function (matrix)
    {
        // transform of empty box is an empty box.
        if (this.isEmpty())
        {
            return this;
        }

        // NOTE: I am using a binary pattern to specify all 2^3 combinations below
        points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix); // 000
        points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix); // 001
        points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix); // 010
        points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix); // 011
        points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix); // 100
        points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix); // 101
        points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix); // 110
        points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix); // 111

        this.setFromPoints(points);

        return this;
    },

    copy: function (box)
    {
        this.min.copy(box.min);
        this.max.copy(box.max);

        return this;
    }

});

module.exports = Box3;
