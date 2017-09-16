var Class = require('../utils/Class');
var Matrix4 = require('../math/Matrix4');
var RotateVec3 = require('../math/RotateVec3');
var Vector3 = require('../math/Vector3');
var Vector4 = require('../math/Vector4');

//  Local cache vars

var tmpVec3 = new Vector3();
var tmpVec4 = new Vector4();

/** 
 * Abstract base class for cameras to implement.
 * @class Camera
 * @abstract
 */
var Camera3D = new Class({

    initialize: function ()
    {
        this.direction = new Vector3(0, 0, -1);
        this.up = new Vector3(0, 1, 0);
        this.position = new Vector3();

        this.projection = new Matrix4();
        this.view = new Matrix4();
        this.combined = new Matrix4();
        this.invProjectionView = new Matrix4();

        this.near = 1;
        this.far = 100;

        this.ray = {
            origin: new Vector3(),
            direction: new Vector3()
        };

        this.viewportWidth = 0;
        this.viewportHeight = 0;
    },

    /**
     * Sets the width and height of the viewport. Does not
     * update any matrices.
     * 
     * @method  setViewport
     * @param {Number} width  the viewport width
     * @param {Number} height the viewport height
     */
    setViewport: function (width, height)
    {
        this.viewportWidth = width;
        this.viewportHeight = height;

        return this;
    },

    /**
     * Translates this camera by a specified Vector3 object
     * or x, y, z parameters. Any undefined x y z values will
     * default to zero, leaving that component unaffected.
     *
     * @param  {[type]} vec [description]
     * @return {[type]}     [description]
     */
    translate: function (x, y, z)
    {
        if (typeof x === 'object')
        {
            this.position.x += x.x || 0;
            this.position.y += x.y || 0;
            this.position.z += x.z || 0;
        }
        else
        {
            this.position.x += x || 0;
            this.position.y += y || 0;
            this.position.z += z || 0;
        }

        return this;
    },

    lookAt: function (x, y, z)
    {
        var dir = this.direction;
        var up = this.up;

        if (typeof x === 'object')
        {
            dir.copy(x);
        }
        else
        {
            dir.set(x, y, z);
        }

        dir.sub(this.position).normalize();

        //  Calculate right vector
        tmpVec3.copy(dir).cross(up).normalize();

        //  Calculate up vector
        up.copy(tmpVec3).cross(dir).normalize();

        return this;
    },

    rotate: function (radians, axis)
    {
        RotateVec3(this.direction, axis, radians);
        RotateVec3(this.up, axis, radians);

        return this;
    },

    rotateAround: function (point, radians, axis)
    {
        tmpVec.copy(point).sub(this.position);

        this.translate(tmpVec);
        this.rotate(radians, axis);
        this.translate(tmpVec.negate());

        return this;
    },

    project: function (vec, out)
    {
        if (out === undefined) { out = new Vector4(); }

        //  TODO: support viewport XY
        var viewportWidth = this.viewportWidth;
        var viewportHeight = this.viewportHeight;
        var n = Camera3D.NEAR_RANGE;
        var f = Camera3D.FAR_RANGE;

        //  For useful Z and W values we should do the usual steps: clip space -> NDC -> window coords

        //  Implicit 1.0 for w component
        tmpVec4.set(vec.x, vec.y, vec.z, 1.0);

        //  Transform into clip space
        tmpVec4.transformMat4(this.combined);

        //  Now into NDC
        tmpVec4.x = tmpVec4.x / tmpVec4.w;
        tmpVec4.y = tmpVec4.y / tmpVec4.w;
        tmpVec4.z = tmpVec4.z / tmpVec4.w;

        //  And finally into window coordinates
        out.x = viewportWidth / 2 * tmpVec4.x + (0 + viewportWidth / 2);
        out.y = viewportHeight / 2 * tmpVec4.y + (0 + viewportHeight / 2);
        out.z = (f - n) / 2 * tmpVec4.z + (f + n) / 2;

        //  If the out vector has a fourth component, we also store (1/clip.w), same idea as gl_FragCoord.w
        if (out.w === 0 || out.w)
        {
            out.w = 1 / tmpVec4.w;
        }

        return out;
    },

    unproject: function (vec, out)
    {
        if (out === undefined) { out = new Vector3(); }

        var viewport = tmpVec4.set(0, 0, this.viewportWidth, this.viewportHeight);

        return out.copy(vec).unproject(viewport, this.invProjectionView);
    },

    getPickRay: function (x, y)
    {
        var origin = this.ray.origin.set(x, y, 0);
        var direction = this.ray.direction.set(x, y, 1);
        var viewport = tmpVec4.set(0, 0, this.viewportWidth, this.viewportHeight);
        var mtx = this.invProjectionView;

        origin.unproject(viewport, mtx);

        direction.unproject(viewport, mtx);

        direction.sub(origin).normalize();

        return this.ray;
    },

    update: function ()
    {
        //  Left empty for subclasses
    }
});

Camera3D.FAR_RANGE = 1.0;
Camera3D.NEAR_RANGE = 0.0;

module.exports = Camera3D;
