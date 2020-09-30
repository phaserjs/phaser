/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var GameObject3D = require('../GameObject3D');
var Frustum = require('./Frustum');
var Vector3 = require('../../math/Vector3');
var Vector4 = require('../../math/Vector4');
var Matrix4 = require('../../math/Matrix4');

var tempMatrix = new Matrix4();

var Camera = new Class({

    Extends: GameObject3D,

    initialize:

    function Camera ()
    {
        GameObject3D.call(this);

        this.type = CONST.OBJECT_TYPE.CAMERA;

        /**
         * This is the inverse of worldMatrix.
         */
        this.viewMatrix = new Matrix4();

        /**
         * This is the matrix which contains the projection.
         */
        this.projectionMatrix = new Matrix4();

        /**
         * This is the matrix which contains the projection.
         */
        this.projectionMatrixInverse = new Matrix4();

        /**
         * The frustum of the camera.
         */
        this.frustum = new Frustum();

        /**
         * The factor of gamma.
         */
        this.gammaFactor = 2.0;

        /**
         * Output pixel encoding.
         * @type {TEXEL_ENCODING_TYPE}
         */
        this.outputEncoding = 'linear';

        /**
         * Where on the screen is the camera rendered in normalized coordinates.
         * @type {Vector4}
         */
        this.rect = new Vector4(0, 0, 1, 1);

        /**
         * When this is set, it checks every frame if objects are in the frustum of the camera before rendering objects.
         * Otherwise objects gets rendered every frame even if it isn't visible.
         */
        this.frustumCulled = true;
    },

    /**
     * Set view by look at, this func will set quaternion of this camera.
     *
     * @method
     * @param {zen3d.Vector3} target - The target that the camera look at.
     * @param {zen3d.Vector3} up - The up direction of the camera.
     */
    lookAt: function (target, up)
    {
        tempMatrix.lookAtRH(this.position, target, up);

        this.quaternion.setFromRotationMatrix(tempMatrix);
    },

    /**
     * Set orthographic projection matrix.
     *
     * @param {number} left — Camera frustum left plane.
     * @param {number} right — Camera frustum right plane.
     * @param {number} bottom — Camera frustum bottom plane.
     * @param {number} top — Camera frustum top plane.
     * @param {number} near — Camera frustum near plane.
     * @param {number} far — Camera frustum far plane.
     */
    setOrtho: function (left, right, bottom, top, near, far)
    {
        this.projectionMatrix.set([
            2 / (right - left), 0, 0, -(right + left) / (right - left),
            0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
            0, 0, -2 / (far - near), -(far + near) / (far - near),
            0, 0, 0, 1
        ]);

        this.projectionMatrixInverse.getInverse(this.projectionMatrix);
    },

    /**
     * Set perspective projection matrix.
     * @param {number} fov — Camera frustum vertical field of view.
     * @param {number} aspect — Camera frustum aspect ratio.
     * @param {number} near — Camera frustum near plane.
     * @param {number} far — Camera frustum far plane.
     */
    setPerspective: function (fov, aspect, near, far)
    {
        this.projectionMatrix.set([
            1 / (aspect * Math.tan(fov / 2)), 0, 0, 0,
            0, 1 / (Math.tan(fov / 2)), 0, 0,
            0, 0, -(far + near) / (far - near), -2 * far * near / (far - near),
            0, 0, -1, 0
        ]);

        this.projectionMatrixInverse.getInverse(this.projectionMatrix);
    },

    getWorldDirection: function (optionalTarget)
    {
        optionalTarget = optionalTarget || new Vector3();

        var e = this.worldMatrix.val;

        return optionalTarget.set(-e[8], -e[9], -e[10]).normalize();
    },

    updateMatrix: function (force)
    {
        GameObject3D.prototype.updateMatrix.call(this, force);

        this.viewMatrix.getInverse(this.worldMatrix);

        tempMatrix.multiplyMatrices(this.projectionMatrix, this.viewMatrix);

        this.frustum.setFromMatrix(tempMatrix);
    }

});

module.exports = Camera;
