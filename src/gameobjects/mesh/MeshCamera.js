/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');
var Matrix4 = require('../../math/Matrix4');
var Vector3 = require('../../math/Vector3');

/**
 * @classdesc
 * The Mesh Camera.
 *
 * @class MeshCamera
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 */
var MeshCamera = new Class({

    initialize:

    function MeshCamera (fov, x, y, z, near, far)
    {
        this.dirty = true;
        this.aspectRatio = 1;

        this._fov = fov;
        this._near = near;
        this._far = far;

        this._position = new Vector3(x, y, z);
        this._target = new Vector3();

        this.orientation = Vector3.DOWN;

        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();
    },

    update: function (width, height)
    {
        this.aspectRatio = width / height;

        this.viewMatrix.lookAt(this._position, this._target, this.orientation);

        this.projectionMatrix.perspective(DegToRad(this._fov), this.aspectRatio, this._near, this._far);
    },

    fov: {

        get: function ()
        {
            return this._fov;
        },

        set: function (value)
        {
            if (value > 0 && value < 180)
            {
                this._fov = value;
                this.dirty = true;
            }
        }

    },

    near: {

        get: function ()
        {
            return this._near;
        },

        set: function (value)
        {
            if (value > 0)
            {
                this._near = value;
                this.dirty = true;
            }
        }

    },

    far: {

        get: function ()
        {
            return this._far;
        },

        set: function (value)
        {
            if (value > 0)
            {
                this._far = value;
                this.dirty = true;
            }
        }

    },

    x: {

        get: function ()
        {
            return this._position.x;
        },

        set: function (value)
        {
            this._position.x = value;
            this.dirty = true;
        }

    },

    y: {

        get: function ()
        {
            return this._position.y;
        },

        set: function (value)
        {
            this._position.y = value;
            this.dirty = true;
        }

    },

    z: {

        get: function ()
        {
            return this._position.z;
        },

        set: function (value)
        {
            this._position.z = value;
            this.dirty = true;
        }

    },

    destroy: function ()
    {
        this._position = null;
        this._target = null;
        this.viewMatrix = null;
        this.projectionMatrix = null;
    }

});

module.exports = MeshCamera;
