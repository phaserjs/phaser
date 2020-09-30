/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Plane = require('../math/Plane');
var Vector3 = require('../../math/Vector3');

var tempVec = new Vector3();

var Frustum = new Class({

    initialize:

    function Frustum (p0, p1, p2, p3, p4, p5)
    {
        if (p0 === undefined) { p0 = new Plane(); }
        if (p1 === undefined) { p1 = new Plane(); }
        if (p2 === undefined) { p2 = new Plane(); }
        if (p3 === undefined) { p3 = new Plane(); }
        if (p4 === undefined) { p4 = new Plane(); }
        if (p5 === undefined) { p5 = new Plane(); }

        this.planes = [ p0, p1, p2, p3, p4, p5 ];
    },

    set: function (p0, p1, p2, p3, p4, p5)
    {
        var planes = this.planes;

        planes[0].copy(p0);
        planes[1].copy(p1);
        planes[2].copy(p2);
        planes[3].copy(p3);
        planes[4].copy(p4);
        planes[5].copy(p5);

        return this;
    },

    setFromMatrix: function (mat4)
    {
        var m = mat4.val;

        var m0 = m[0];
        var m1 = m[1];
        var m2 = m[2];
        var m3 = m[3];
        var m4 = m[4];
        var m5 = m[5];
        var m6 = m[6];
        var m7 = m[7];
        var m8 = m[8];
        var m9 = m[9];
        var m10 = m[10];
        var m11 = m[11];
        var m12 = m[12];
        var m13 = m[13];
        var m14 = m[14];
        var m15 = m[15];

        var planes = this.planes;

        planes[0].setComponents(m3 - m0, m7 - m4, m11 - m8, m15 - m12).normalize();
        planes[1].setComponents(m3 + m0, m7 + m4, m11 + m8, m15 + m12).normalize();
        planes[2].setComponents(m3 + m1, m7 + m5, m11 + m9, m15 + m13).normalize();
        planes[3].setComponents(m3 - m1, m7 - m5, m11 - m9, m15 - m13).normalize();
        planes[4].setComponents(m3 - m2, m7 - m6, m11 - m10, m15 - m14).normalize();
        planes[5].setComponents(m3 + m2, m7 + m6, m11 + m10, m15 + m14).normalize();

        return this;
    },

    intersectsSphere: function (sphere)
    {
        var planes = this.planes;
        var center = sphere.center;
        var negRadius = -sphere.radius;

        for (var i = 0; i < 6; i++)
        {
            var distance = planes[i].distanceToPoint(center);

            if (distance < negRadius)
            {
                return false;
            }
        }

        return true;
    },

    intersectsBox: function (box)
    {
        var planes = this.planes;

        for (var i = 0; i < 6; i++)
        {
            var plane = planes[i];

            // corner at max distance

            tempVec.x = (plane.normal.x > 0) ? box.max.x : box.min.x;
            tempVec.y = (plane.normal.y > 0) ? box.max.y : box.min.y;
            tempVec.z = (plane.normal.z > 0) ? box.max.z : box.min.z;

            // if both outside plane, no intersection

            if (plane.distanceToPoint(tempVec) < 0)
            {
                return false;
            }
        }

        return true;
    }

});

module.exports = Frustum;
