/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var GetValue = require('../../utils/object/GetValue');

//  var camControl = new CameraControl({
//      camera: this.cameras.main,
//      left: cursors.left,
//      right: cursors.right,
//      speed: float OR { x: 0, y: 0 }
//  })

/**
 * @typedef {object} FixedKeyControlConfig
 *
 * @property {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera that this Control will update.
 * @property {Phaser.Input.Keyboard.Key} [left] - The Key to be pressed that will move the Camera left.
 * @property {Phaser.Input.Keyboard.Key} [right] - The Key to be pressed that will move the Camera right.
 * @property {Phaser.Input.Keyboard.Key} [up] - The Key to be pressed that will move the Camera up.
 * @property {Phaser.Input.Keyboard.Key} [zoomIn] - The Key to be pressed that will zoom the Camera in.
 * @property {Phaser.Input.Keyboard.Key} [zoomOut] - The Key to be pressed that will zoom the Camera out.
 * @property {float} [zoomSpeed=0.01] - The speed at which the camera will zoom if the `zoomIn` or `zoomOut` keys are pressed.
 * @property {(float|{x:float,y:float})} [speed=0] - The horizontal and vertical speed the camera will move.
 */

/**
 * @classdesc
 * [description]
 *
 * @class FixedKeyControl
 * @memberOf Phaser.Cameras.Controls
 * @constructor
 * @since 3.0.0
 *
 * @param {FixedKeyControlConfig} config - [description]
 */
var FixedKeyControl = new Class({

    initialize:

    function FixedKeyControl (config)
    {
        /**
         * The Camera that this Control will update.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#camera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @default null
         * @since 3.0.0
         */
        this.camera = GetValue(config, 'camera', null);

        /**
         * The Key to be pressed that will move the Camera left.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#left
         * @type {Phaser.Input.Keyboard.Key}
         * @default null
         * @since 3.0.0
         */
        this.left = GetValue(config, 'left', null);

        /**
         * The Key to be pressed that will move the Camera right.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#right
         * @type {Phaser.Input.Keyboard.Key}
         * @default null
         * @since 3.0.0
         */
        this.right = GetValue(config, 'right', null);

        /**
         * The Key to be pressed that will move the Camera up.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#up
         * @type {Phaser.Input.Keyboard.Key}
         * @default null
         * @since 3.0.0
         */
        this.up = GetValue(config, 'up', null);

        /**
         * The Key to be pressed that will move the Camera down.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#down
         * @type {Phaser.Input.Keyboard.Key}
         * @default null
         * @since 3.0.0
         */
        this.down = GetValue(config, 'down', null);

        /**
         * The Key to be pressed that will zoom the Camera in.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#zoomIn
         * @type {Phaser.Input.Keyboard.Key}
         * @default null
         * @since 3.0.0
         */
        this.zoomIn = GetValue(config, 'zoomIn', null);

        /**
         * The Key to be pressed that will zoom the Camera out.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#zoomOut
         * @type {Phaser.Input.Keyboard.Key}
         * @default null
         * @since 3.0.0
         */
        this.zoomOut = GetValue(config, 'zoomOut', null);

        /**
         * The speed at which the camera will zoom if the `zoomIn` or `zoomOut` keys are pressed.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#zoomSpeed
         * @type {float}
         * @default 0.01
         * @since 3.0.0
         */
        this.zoomSpeed = GetValue(config, 'zoomSpeed', 0.01);

        /**
         * The horizontal speed the camera will move.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#speedX
         * @type {float}
         * @default 0
         * @since 3.0.0
         */
        this.speedX = 0;

        /**
         * The vertical speed the camera will move.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#speedY
         * @type {float}
         * @default 0
         * @since 3.0.0
         */
        this.speedY = 0;

        var speed = GetValue(config, 'speed', null);

        if (typeof speed === 'number')
        {
            this.speedX = speed;
            this.speedY = speed;
        }
        else
        {
            this.speedX = GetValue(config, 'speed.x', 0);
            this.speedY = GetValue(config, 'speed.y', 0);
        }

        /**
         * [description]
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#_zoom
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._zoom = 0;

        /**
         * A flag controlling if the Controls will update the Camera or not.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#active
         * @type {boolean}
         * @since 3.0.0
         */
        this.active = (this.camera !== null);
    },

    /**
     * Starts the Key Control running, providing it has been linked to a camera.
     *
     * @method Phaser.Cameras.Controls.FixedKeyControl#start
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Controls.FixedKeyControl} This Key Control instance.
     */
    start: function ()
    {
        this.active = (this.camera !== null);

        return this;
    },

    /**
     * Stops this Key Control from running. Call `start` to start it again.
     *
     * @method Phaser.Cameras.Controls.FixedKeyControl#stop
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Controls.FixedKeyControl} This Key Control instance.
     */
    stop: function ()
    {
        this.active = false;

        return this;
    },

    /**
     * Binds this Key Control to a camera.
     *
     * @method Phaser.Cameras.Controls.FixedKeyControl#setCamera
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera to bind this Key Control to.
     *
     * @return {Phaser.Cameras.Controls.FixedKeyControl} This Key Control instance.
     */
    setCamera: function (camera)
    {
        this.camera = camera;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Controls.FixedKeyControl#update
     * @since 3.0.0
     *
     * @param {number} delta - [description]
     */
    update: function (delta)
    {
        if (!this.active)
        {
            return;
        }

        if (delta === undefined) { delta = 1; }

        var cam = this.camera;

        if (this.up && this.up.isDown)
        {
            cam.scrollY -= ((this.speedY * delta) | 0);
        }
        else if (this.down && this.down.isDown)
        {
            cam.scrollY += ((this.speedY * delta) | 0);
        }

        if (this.left && this.left.isDown)
        {
            cam.scrollX -= ((this.speedX * delta) | 0);
        }
        else if (this.right && this.right.isDown)
        {
            cam.scrollX += ((this.speedX * delta) | 0);
        }

        //  Camera zoom

        if (this.zoomIn && this.zoomIn.isDown)
        {
            cam.zoom -= this.zoomSpeed;

            if (cam.zoom < 0.1)
            {
                cam.zoom = 0.1;
            }
        }
        else if (this.zoomOut && this.zoomOut.isDown)
        {
            cam.zoom += this.zoomSpeed;
        }
    },

    /**
     * Destroys this Key Control.
     *
     * @method Phaser.Cameras.Controls.FixedKeyControl#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.camera = null;

        this.left = null;
        this.right = null;
        this.up = null;
        this.down = null;

        this.zoomIn = null;
        this.zoomOut = null;
    }

});

module.exports = FixedKeyControl;
