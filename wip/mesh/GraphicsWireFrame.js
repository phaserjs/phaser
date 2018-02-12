var Camera = require('../../cameras/2d/Camera.js');
var Matrix4 = require('../../math/Matrix4');
var Mesh = require('../../geom/mesh/Mesh');
var Vector3 = require('../../math/Vector3');

var GraphicsWireFrame = new Class({

    Extends: Graphics,

    initialize:

    function GraphicsWireFrame (scene, options)
    {
        Graphics.call(this, scene, 'Graphics');

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#viewportWidth
         * @type {number}
         * @since 3.0.0
         */
        this.viewportWidth = scene.sys.game.config.width;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#viewportHeight
         * @type {number}
         * @since 3.0.0
         */
        this.viewportHeight = scene.sys.game.config.height;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#camera
         * @type {object}
         * @since 3.0.0
         */
        this.camera = {
            position: new Vector3(),
            target: new Vector3()
        };

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#up
         * @type {Phaser.Math.Vector3}
         * @since 3.0.0
         */
        this.up = new Vector3().up();

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#projectionMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.0.0
         */
        this.projectionMatrix = new Matrix4();

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#viewMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.0.0
         */
        this.viewMatrix = new Matrix4().lookAt(this.camera.position, this.camera.target, this.up);

        this.setViewport(this.viewportWidth, this.viewportHeight);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#setCameraPosition
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} z - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    setCameraPosition: function (x, y, z)
    {
        this.camera.position.set(x, y, z);

        this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#setCameraTarget
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} z - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    setCameraTarget: function (x, y, z)
    {
        this.camera.target.set(x, y, z);

        this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#setViewport
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {number} fov - Vertical field of view in radians.
     * @param {number} near - Near bounds of the frustum.
     * @param {number} far - Far bounds of the frustum.
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    setViewport: function (width, height, fov, near, far)
    {
        if (fov === undefined) { fov = 0.8; }
        if (near === undefined) { near = 0.01; }
        if (far === undefined) { far = 1; }

        this.viewportWidth = width;
        this.viewportHeight = height;

        //  fov, aspect, near, far
        this.projectionMatrix.perspective(fov, width / height, near, far);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#createMesh
     * @since 3.0.0
     *
     * @param {string} key - [description]
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} z - [description]
     *
     * @return {Phaser.Geom.Mesh} The Mesh that was added to this Graphics object.
     */
    createMesh: function (key, x, y, z)
    {
        var data = this.scene.sys.cache.obj.get(key);

        var mesh = new Mesh(data, x, y, z);

        return mesh;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#fillMesh
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Mesh} mesh - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillMesh: function (mesh)
    {
        mesh.fill(this);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#strokeMesh
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Mesh} mesh - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeMesh: function (mesh)
    {
        mesh.stroke(this);

        return this;
    },

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Graphics#cameraX
     * @type {number}
     * @since 3.0.0
     */
    cameraX: {

        get: function ()
        {
            return this.camera.position.x;
        },

        set: function (value)
        {
            this.camera.position.x = value;
            this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);
        }

    },

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Graphics#cameraY
     * @type {number}
     * @since 3.0.0
     */
    cameraY: {

        get: function ()
        {
            return this.camera.position.y;
        },

        set: function (value)
        {
            this.camera.position.y = value;
            this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);
        }

    },

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Graphics#cameraZ
     * @type {number}
     * @since 3.0.0
     */
    cameraZ: {

        get: function ()
        {
            return this.camera.position.z;
        },

        set: function (value)
        {
            this.camera.position.z = value;
            this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);
        }

    },

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Graphics#cameraTargetX
     * @type {number}
     * @since 3.0.0
     */
    cameraTargetX: {

        get: function ()
        {
            return this.camera.target.x;
        },

        set: function (value)
        {
            this.camera.target.x = value;
            this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);
        }

    },

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Graphics#cameraTargetY
     * @type {number}
     * @since 3.0.0
     */
    cameraTargetY: {

        get: function ()
        {
            return this.camera.target.y;
        },

        set: function (value)
        {
            this.camera.target.y = value;
            this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);
        }

    },

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Graphics#cameraTargetZ
     * @type {number}
     * @since 3.0.0
     */
    cameraTargetZ: {

        get: function ()
        {
            return this.camera.target.z;
        },

        set: function (value)
        {
            this.camera.target.z = value;
            this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);
        }

    }

});

GraphicsWireFrame.TargetCamera = new Camera(0, 0, 0, 0);

module.exports = GraphicsWireFrame;
