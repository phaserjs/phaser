/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Box3 = require('./Box3');
var Class = require('../../utils/Class');
var Vector3 = require('../../math/Vector3');

var tempBox3 = new Box3();
var tempVec3 = new Vector3();

/**
 * @classdesc
 *
 * @class Sphere
 * @memberof Phaser.Layer3D.Math
 * @constructor
 * @since 3.50.0
 *
 * @param {number} [x] - The x component.
 * @param {number} [y] - The y component.
 * @param {number} [z] - The z component.
 */
var Sphere = new Class({

    initialize:

    function Sphere (center, radius)
    {
        if (center === undefined) { center = new Vector3(); }
        if (radius === undefined) { radius = 0; }

        this.center = center;
        this.radius = radius;
    },

    set: function (center, radius)
    {
        this.center.copy(center);

        this.radius = radius;

        return this;
    },

    setFromArray: function (array, gap)
    {
        if (gap === undefined) { gap = 3; }

        var center = this.center;

        tempBox3.setFromArray(array, gap).getCenter(center);

        var maxRadiusSq = 0;

        for (var i = 0; i < array.length; i += gap)
        {
            tempVec3.fromArray(array, i);

            maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(tempVec3));
        }

        this.radius = Math.sqrt(maxRadiusSq);

        return this;
    },

    applyMatrix4: function (matrix)
    {
        this.center.applyMatrix4(matrix);

        this.radius = this.radius * matrix.getMaxScaleOnAxis();

        return this;
    },

    getBoundingBox: function (target)
    {
        if (target === undefined) { target = new Box3(); }

        target.set(this.center, this.center);
        target.expandByScalar(this.radius);

        return target;
    },

    copy: function (sphere)
    {
        this.center.copy(sphere.center);
        this.radius = sphere.radius;

        return this;
    },

    clone: function ()
    {
        return new Sphere().copy(this);
    }

});

module.exports = Sphere;
