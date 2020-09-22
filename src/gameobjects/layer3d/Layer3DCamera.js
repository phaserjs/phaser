/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');
var GetFastValue = require('../../utils/object/GetFastValue');
var INPUT_EVENTS = require('../../input/events');
var Matrix4 = require('../../math/Matrix4');
var Vector3 = require('../../math/Vector3');
var Vector4 = require('../../math/Vector4');

/**
 * @classdesc
 * The Layer3D Camera.
 *
 * @class Layer3DCamera
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 */
var Layer3DCamera = new Class({

    initialize:

    function Layer3DCamera (layer, fov, x, y, z, near, far)
    {
        /**
         * The Layer3D instance this camera belongs to.
         *
         * A camera can only belong to a single Layer3D instance.
         *
         * You should consider this property as being read-only. You cannot move a
         * camera to another Layer3D by simply changing it.
         *
         * @name Phaser.GameObjects.Layer3DCamera#layer
         * @type {Phaser.GameObjects.Layer3D}
         * @since 3.50.0
         */
        this.layer = layer;

        /**
         * The Scene Input Plugin, as referenced via the Layer3D parent.
         *
         * @name Phaser.GameObjects.Layer3DCamera#input
         * @type {Phaser.Input.InputPlugin}
         * @since 3.50.0
         */
        this.input = layer.scene.sys.input;

        /**
         * Internal 'dirty' flag that tells the parent Layer3D if the
         * view matrix of this camera needs recalculating at the next step.
         *
         * @name Phaser.GameObjects.Layer3DCamera#dirtyView
         * @type {boolean}
         * @since 3.50.0
         */
        this.dirtyView = true;

        /**
         * Internal 'dirty' flag that tells the parent Layer3D if the
         * projection matrix of this camera needs recalculating at the next step.
         *
         * @name Phaser.GameObjects.Layer3DCamera#dirtyProjection
         * @type {boolean}
         * @since 3.50.0
         */
        this.dirtyProjection = true;

        /**
         * Internal fov value.
         *
         * @name Phaser.GameObjects.Layer3DCamera#_fov
         * @type {number}
         * @private
         * @since 3.50.0
         */
        this._fov = fov;

        /**
         * Internal near value.
         *
         * @name Phaser.GameObjects.Layer3DCamera#_near
         * @type {number}
         * @private
         * @since 3.50.0
         */
        this._near = near;

        /**
         * Internal far value.
         *
         * @name Phaser.GameObjects.Layer3DCamera#_far
         * @type {number}
         * @private
         * @since 3.50.0
         */
        this._far = far;

        /**
         * The aspect ratio of the camera.
         *
         * @name Phaser.GameObjects.Layer3DCamera#aspectRatio
         * @type {number}
         * @since 3.50.0
         */
        this.aspectRatio = 1;

        /**
         * The position of the camera in 3D space.
         *
         * You can modify this vector directly, or use the `x`, `y` and `z`
         * properties of this class.
         *
         * @name Phaser.GameObjects.Layer3DCamera#position
         * @type {Phaser.Math.Vector3}
         * @since 3.50.0
         */
        this.position = new Vector3(x, y, z);

        /**
         * The rotation of the camera in 3D space.
         *
         * You can modify this vector directly, or use the `rotationX`, `rotationY`
         * and `rotationZ` properties of this class.
         *
         * @name Phaser.GameObjects.Layer3DCamera#rotation
         * @type {Phaser.Math.Vector3}
         * @since 3.50.0
         */
        this.rotation = new Vector3();

        /**
         * The forward facing vector of the camera.
         *
         * Calculated and updated automatically when the view matrix changes.
         *
         * @name Phaser.GameObjects.Layer3DCamera#forward
         * @type {Phaser.Math.Vector4}
         * @since 3.50.0
         */
        this.forward = new Vector4();

        /**
         * The upward facing vector of the camera.
         * Invert it to get the bottom vector.
         *
         * Calculated and updated automatically when the view matrix changes.
         *
         * @name Phaser.GameObjects.Layer3DCamera#up
         * @type {Phaser.Math.Vector4}
         * @since 3.50.0
         */
        this.up = new Vector4();

        /**
         * The right facing vector of the camera.
         * Invert it to get the left vector.
         *
         * Calculated and updated automatically when the view matrix changes.
         *
         * @name Phaser.GameObjects.Layer3DCamera#right
         * @type {Phaser.Math.Vector4}
         * @since 3.50.0
         */
        this.right = new Vector4();

        /**
         * Internal transform matrix.
         *
         * Calculated and updated automatically when the camera is dirty.
         *
         * @name Phaser.GameObjects.Layer3DCamera#matrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.matrix = new Matrix4();

        /**
         * The inverse of the transform matrix.
         *
         * Calculated and updated automatically when the camera is dirty.
         *
         * @name Phaser.GameObjects.Layer3DCamera#viewMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.viewMatrix = new Matrix4();

        /**
         * The perspective projection matrix.
         *
         * Calculated and updated automatically when the camera is dirty.
         *
         * @name Phaser.GameObjects.Layer3DCamera#projectionMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.projectionMatrix = new Matrix4();

        /**
         * The perspective projection matrix, multiplied by the view matrix.
         *
         * Calculated and updated automatically when the camera is dirty.
         *
         * @name Phaser.GameObjects.Layer3DCamera#viewProjectionMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.viewProjectionMatrix = new Matrix4();

        /**
         * The movement and rotation mode of this camera.
         * Either ORBIT, or FREE.
         *
         * @name Phaser.GameObjects.Layer3DCamera#mode
         * @type {number}
         * @since 3.50.0
         */
        this.mode = Layer3DCamera.MODE_ORBIT;

        /**
         * How fast to rotate the camera, in degrees per delta.
         *
         * This value is only used after calling the `enableControls` method,
         * it does not influence changing the rotation values directly.
         *
         * @name Phaser.GameObjects.Layer3DCamera#rotateSpeed
         * @type {number}
         * @since 3.50.0
         */
        this.rotateSpeed = 0.5;

        /**
         * How fast to pan the camera, in units per delta.
         *
         * This value is only used after calling the `enableControls` method,
         * it does not influence calling the pan methods directly.
         *
         * @name Phaser.GameObjects.Layer3DCamera#panSpeed
         * @type {number}
         * @since 3.50.0
         */
        this.panSpeed = 4;

        /**
         * How fast to zoom the camera.
         *
         * This value is only used after calling the `enableControls` method,
         * it does not influence calling the panZ method directly.
         *
         * @name Phaser.GameObjects.Layer3DCamera#zoomSpeed
         * @type {number}
         * @since 3.50.0
         */
        this.zoomSpeed = 3;

        this.allowPan = false;

        this.lockXAxis = false;
        this.lockYAxis = false;
    },

    enableOrbitControls: function (config)
    {
        this.rotateSpeed = GetFastValue(config, 'rotateSpeed', this.rotateSpeed);
        this.panSpeed = GetFastValue(config, 'panSpeed', this.panSpeed);
        this.allowPan = GetFastValue(config, 'allowPan', this.allowPan);
        this.lockXAxis = GetFastValue(config, 'lockXAxis', this.lockXAxis);
        this.lockYAxis = GetFastValue(config, 'lockYAxis', this.lockYAxis);

        this.input.on(INPUT_EVENTS.POINTER_MOVE, this.pointerMoveHandler, this);
    },

    disableOrbitControls: function ()
    {
        this.input.off(INPUT_EVENTS.POINTER_MOVE, this.pointerMoveHandler, this);
    },

    enableZoom: function (zoomSpeed)
    {
        if (zoomSpeed === undefined) { zoomSpeed = 3; }

        this.zoomSpeed = zoomSpeed;

        this.input.on(INPUT_EVENTS.POINTER_WHEEL, this.pointerWheelHandler, this);
    },

    disableZoom: function ()
    {
        this.input.off(INPUT_EVENTS.POINTER_WHEEL, this.pointerWheelHandler, this);
    },

    pointerMoveHandler: function (pointer)
    {
        if (pointer.isDown)
        {
            var width = this.layer.width;
            var height = this.layer.height;

            if (pointer.event.shiftKey && this.allowPan)
            {
                this.panX(pointer.velocity.x * (this.panSpeed / width));
                this.panY(pointer.velocity.y * (this.panSpeed / height));
            }
            else
            {
                if (!this.lockXAxis)
                {
                    this.rotationX -= pointer.velocity.y * (this.rotateSpeed / height);
                }

                if (!this.lockYAxis)
                {
                    this.rotationY -= pointer.velocity.x * (this.rotateSpeed / width);
                }
            }
        }
    },

    pointerWheelHandler: function (pointer, over, deltaX, deltaY)
    {
        this.panZ(deltaY * (this.zoomSpeed / this.layer.height));
    },

    /**
     * Pans this camera on the x axis by the given amount.
     *
     * @method Phaser.GameObjects.Layer3DCamera#panX
     * @since 3.50.0
     *
     * @param {number} v - The amount to pan by.
     */
    panX: function (v)
    {
        this.updateViewMatrix();

        this.position.addScale(this.right, v);
    },

    /**
     * Pans this camera on the y axis by the given amount.
     *
     * @method Phaser.GameObjects.Layer3DCamera#panY
     * @since 3.50.0
     *
     * @param {number} v - The amount to pan by.
     */
    panY: function (v)
    {
        this.updateViewMatrix();

        this.y += this.up.y * v;

        if (this.mode === Layer3DCamera.MODE_ORBIT)
        {
            //  Can only move up and down the y axis in orbit mode
            return;
        }

        this.x += this.up.x * v;
        this.z += this.up.z * v;
    },

    /**
     * Pans this camera on the z axis by the given amount.
     *
     * @method Phaser.GameObjects.Layer3DCamera#panZ
     * @since 3.50.0
     *
     * @param {number} v - The amount to pan by.
     */
    panZ: function (v)
    {
        this.updateViewMatrix();

        if (this.mode === Layer3DCamera.MODE_ORBIT)
        {
            //  Orbit mode translates after rotatation, so only need to set Z. The rotation will handle the rest.
            this.z += v;
        }
        else
        {
            //  In freemode to move forward, we move based on our forward, which is relative to our current rotation.
            this.position.addScale(this.forward, v);
        }
    },

    /**
     * Internal method that is called by the Layer3D instance that owns this camera
     * during its `render` step. If the view matrix is dirty, it is recalculated
     * and then applied to the view projection matrix, ready for rendering.
     *
     * @method Phaser.GameObjects.Layer3DCamera#update
     * @since 3.50.0
     */
    update: function ()
    {
        if (this.dirtyView)
        {
            this.updateViewMatrix();
        }

        if (this.dirtyView || this.dirtyProjection)
        {
            this.projectionMatrix.multiplyToMat4(this.viewMatrix, this.viewProjectionMatrix);
        }
    },

    /**
     * Internal method that handles the update of the view transform matrix, based on the rotation
     * and position of the camera. Called automatically when the camera is updated.
     *
     * @method Phaser.GameObjects.Layer3DCamera#updateViewMatrix
     * @since 3.50.0
     */
    updateViewMatrix: function ()
    {
        var matView = this.matrix;

        if (this.mode === Layer3DCamera.MODE_FREE)
        {
            matView.fromRotationXYTranslation(this.rotation, this.position, true);
        }
        else
        {
            matView.fromRotationXYTranslation(this.rotation, this.position, false);
        }

        this.updateDirection();

        this.viewMatrix.copy(matView).invert();
    },

    /**
     * Internal method that is called by the Layer3D instance that owns this camera
     * during its `preUpdate` step. If the projection matrix is dirty, or the renderer
     * width or height has changed, then a new projection matrix is calculated.
     *
     * @method Phaser.GameObjects.Layer3DCamera#updateProjectionMatrix
     * @since 3.50.0
     *
     * @param {number} width - The width of the renderer.
     * @param {number} height - The height of the renderer.
     */
    updateProjectionMatrix: function (width, height)
    {
        this.aspectRatio = width / height;

        this.projectionMatrix.perspective(DegToRad(this._fov), this.aspectRatio, this._near, this._far);
    },

    /**
     * Internal method that sets the forward, up and right vectors from
     * the view matrix. This is called automatically as part of the
     * `updateViewMatrix` method.
     *
     * @method Phaser.GameObjects.Layer3DCamera#updateDirection
     * @since 3.50.0
     */
    updateDirection: function ()
    {
        var matView = this.matrix;

        this.forward.set(0, 0, 1, 0).transformMat4(matView);
        this.up.set(0, 1, 0, 0).transformMat4(matView);
        this.right.set(1, 0, 0, 0).transformMat4(matView);
    },

    /**
     * The field of view, in degrees, of this camera.
     *
     * Limited to the range of 0 to 180.
     *
     * @name Phaser.GameObjects.Layer3DCamera#fov
     * @type {number}
     * @since 3.50.0
     */
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
                this.dirtyProjection = true;
            }
        }

    },

    /**
     * The minimum distance the camera can see from.
     *
     * It's important to consider that depth buffers are not infinite and the closer
     * a camera starts, the more you may encounter depth fighting issues.
     *
     * @name Phaser.GameObjects.Layer3DCamera#near
     * @type {number}
     * @since 3.50.0
     */
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
                this.dirtyProjection = true;
            }
        }

    },

    /**
     * The maximum distance the camera can see to.
     *
     * It's important to consider that depth buffers are not infinite and the further
     * a camera ends, the more you may encounter depth fighting issues.
     *
     * @name Phaser.GameObjects.Layer3DCamera#far
     * @type {number}
     * @since 3.50.0
     */
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
                this.dirtyProjection = true;
            }
        }

    },

    /**
     * The x position of the camera.
     *
     * @name Phaser.GameObjects.Layer3DCamera#x
     * @type {number}
     * @since 3.50.0
     */
    x: {

        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.position.x = value;
            this.dirtyView = true;
        }

    },

    /**
     * The y position of the camera.
     *
     * @name Phaser.GameObjects.Layer3DCamera#y
     * @type {number}
     * @since 3.50.0
     */
    y: {

        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.position.y = value;
            this.dirtyView = true;
        }

    },

    /**
     * The z position of the camera.
     *
     * @name Phaser.GameObjects.Layer3DCamera#z
     * @type {number}
     * @since 3.50.0
     */
    z: {

        get: function ()
        {
            return this.position.z;
        },

        set: function (value)
        {
            this.position.z = value;
            this.dirtyView = true;
        }

    },

    /**
     * The x axis rotation, in radians, of the camera.
     *
     * @name Phaser.GameObjects.Layer3DCamera#rotationX
     * @type {number}
     * @since 3.50.0
     */
    rotationX: {

        get: function ()
        {
            return this.rotation.x;
        },

        set: function (value)
        {
            this.rotation.x = value;
            this.dirtyView = true;
        }

    },

    /**
     * The y axis rotation, in radians, of the camera.
     *
     * @name Phaser.GameObjects.Layer3DCamera#rotationY
     * @type {number}
     * @since 3.50.0
     */
    rotationY: {

        get: function ()
        {
            return this.rotation.y;
        },

        set: function (value)
        {
            this.rotation.y = value;
            this.dirtyView = true;
        }

    },

    /**
     * The z axis rotation, in radians, of the camera.
     *
     * @name Phaser.GameObjects.Layer3DCamera#rotationZ
     * @type {number}
     * @since 3.50.0
     */
    rotationZ: {

        get: function ()
        {
            return this.rotation.z;
        },

        set: function (value)
        {
            this.rotation.z = value;
            this.dirtyView = true;
        }

    },

    /**
     * Destroy handler for this camera.
     *
     * @method Phaser.GameObjects.Layer3DCamera#destroy
     * @since 3.50.0
     */
    destroy: function ()
    {
        this.layer = null;
        this.position = null;
        this.rotation = null;
        this.forward = null;
        this.up = null;
        this.right = null;
        this.matrix = null;
        this.viewMatrix = null;
        this.projectionMatrix = null;
        this.viewProjectionMatrix = null;
    }

});

// Allows free movement of position and rotation
Layer3DCamera.MODE_FREE = 0;

// Movement is locked to rotate around the origin
Layer3DCamera.MODE_ORBIT = 1;

module.exports = Layer3DCamera;
