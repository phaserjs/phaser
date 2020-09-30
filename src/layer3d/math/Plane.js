/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Matrix3 = require('../../math/Matrix3');
var Vector3 = require('../../math/Vector3');

var tempVec3 = new Vector3();
var tempMat3 = new Matrix3();

var Plane = new Class({

    initialize:

    function Plane (normal, constant)
    {
        if (normal === undefined) { normal = new Vector3(1, 0, 0); }
        if (constant === undefined) { constant = 0; }

        this.normal = normal;
        this.constant = console;
    },

    set: function (normal, constant)
    {
        this.normal.copy(normal);
        this.constant = constant;

        return this;
    },

    setComponents: function (x, y, z, w)
    {
        this.normal.set(x, y, z);
        this.constant = w;

        return this;
    },

    setFromNormalAndCoplanarPoint: function (normal, point)
    {
        this.normal.copy(normal);
        this.constant = -point.dot(this.normal);

        return this;
    },

    normalize: function ()
    {
        // Note: will lead to a divide by zero if the plane is invalid.

        var inverseNormalLength = 1 / this.normal.length();

        this.normal.scale(inverseNormalLength);

        this.constant *= inverseNormalLength;

        return this;
    },

    distanceToPoint: function (point)
    {
        return this.normal.dot(point) + this.constant;
    },

    coplanarPoint: function (optionalTarget)
    {
        var result = optionalTarget || new Vector3();

        return result.copy(this.normal).scale(-this.constant);
    },

    applyMatrix4: function (matrix, optionalNormalMatrix)
    {
        var normalMatrix = optionalNormalMatrix || tempMat3.fromMat4(matrix).invert().transpose();

        var referencePoint = this.coplanarPoint(tempVec3).applyMatrix4(matrix);

        var normal = this.normal.applyMatrix3(normalMatrix).normalize();

        this.constant = -referencePoint.dot(normal);

        return this;
    }

});

module.exports = Plane;
