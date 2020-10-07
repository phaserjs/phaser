/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');
var Matrix4 = require('../../math/Matrix4');
var Vector3 = require('../../math/Vector3');
var Vector4 = require('../../math/Vector4');

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

        this.position = new Vector3(x, y, z);
        this.rotation = new Vector3();

        this.forward = new Vector4();
        this.up = new Vector4(); //  What the up direction is, invert to get bottom
        this.right = new Vector4();	//  What the right direction is, invert to get left

        this.matView = new Matrix4();
        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();

        this.mode = MeshCamera.MODE_ORBIT;
    },

    panX: function (v)
    {
        this.position.addScale(this.right, v);

        this.updateViewMatrix();
    },

    panY: function (v)
    {
        this.position.y += this.up.y * v;

        if (this.mode !== MeshCamera.MODE_ORBIT)
        {
            //  Can only move up and down the y axix in orbit mode
            this.position.x += this.up.x * v;
            this.position.z += this.up.z * v;
        }

        this.updateViewMatrix();
    },

    panZ: function (v)
    {
        // this.updateViewMatrix();

        if (this.mode === MeshCamera.MODE_ORBIT)
        {
            //  orbit mode does translate after rotate, so only need to set Z, the rotate will handle the rest.
            this.position.z += v;
        }
        else
        {
            //  In freemode to move forward, we need to move based on our forward which is relative to our current rotation
            this.position.addScale(this.forward, v);
        }

        this.updateViewMatrix();
    },

    //  To have different modes of movements, this function handles the view matrix update for the transform object.
    updateViewMatrix: function ()
    {
        var d = Math.PI / 180;
        var matView = this.matView;
        var rotation = this.rotation;

        matView.identity();

        //  Optimize camera transform update, no need for scale nor rotateZ
        if (this.mode === MeshCamera.MODE_FREE)
        {
            matView.translate(this.position);
            matView.rotateX(rotation.x * d);
            matView.rotateY(rotation.y * d);
        }
        else
        {
            matView.rotateX(rotation.x * d);
            matView.rotateY(rotation.y * d);
            matView.translate(this.position);
        }

        this.updateDirection();

        this.viewMatrix.copy(matView);
        this.viewMatrix.invert();

        this.dirty = true;
    },

    update: function (width, height)
    {
        this.aspectRatio = width / height;

        this.updateViewMatrix();

        this.projectionMatrix.perspective(DegToRad(this._fov), this.aspectRatio, this._near, this._far);
    },

    updateDirection: function ()
    {
        var matView = this.matView;

        this.forward.set(0, 0, 1, 0).transformMat4(matView);
        this.up.set(0, 1, 0, 0).transformMat4(matView);
        this.right.set(1, 0, 0, 0).transformMat4(matView);
    },

    reset: function ()
    {
        this.position.set();
        this.rotation.set();

        this.updateViewMatrix();
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
            return this.position.x;
        },

        set: function (value)
        {
            this.position.x = value;
            this.updateViewMatrix();
        }

    },

    y: {

        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.position.y = value;
            this.updateViewMatrix();
        }

    },

    z: {

        get: function ()
        {
            return this.position.z;
        },

        set: function (value)
        {
            this.position.z = value;
            this.updateViewMatrix();
        }

    },

    rotationX: {

        get: function ()
        {
            return this.rotation.x;
        },

        set: function (value)
        {
            this.rotation.x = value;
            this.updateViewMatrix();
        }

    },

    rotationY: {

        get: function ()
        {
            return this.rotation.y;
        },

        set: function (value)
        {
            this.rotation.y = value;
            this.updateViewMatrix();
        }

    },

    rotationZ: {

        get: function ()
        {
            return this.rotation.z;
        },

        set: function (value)
        {
            this.rotation.z = value;
            this.updateViewMatrix();
        }

    },

    destroy: function ()
    {
        //  TODO - Needed?
    }

});

// Allows free movement of position and rotation
MeshCamera.MODE_FREE = 0;

// Movement is locked to rotate around the origin
MeshCamera.MODE_ORBIT = 1;

module.exports = MeshCamera;
