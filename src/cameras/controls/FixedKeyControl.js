/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var GetValue = require('../../utils/object/GetValue');

/**
 * @classdesc
 * A Fixed Key Camera Control.
 *
 * This allows you to control the movement and zoom of a camera using the defined keys.
 *
 * ```javascript
 * var camControl = new FixedKeyControl({
 *     camera: this.cameras.main,
 *     left: cursors.left,
 *     right: cursors.right,
 *     speed: float OR { x: 0, y: 0 }
 * });
 * ```
 *
 * Movement is precise and has no 'smoothing' applied to it.
 *
 * You must call the `update` method of this controller every frame.
 *
 * @class FixedKeyControl
 * @memberof Phaser.Cameras.Controls
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Types.Cameras.Controls.FixedKeyControlConfig} config - The Fixed Key Control configuration object.
 */
var FixedKeyControl = new Class({

    initialize:

    function FixedKeyControl (config)
    {
        /**
         * The Camera that this Control will update.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#camera
         * @type {?Phaser.Cameras.Scene2D.Camera}
         * @default null
         * @since 3.0.0
         */
        this.camera = GetValue(config, 'camera', null);

        /**
         * The Key to be pressed that will move the Camera left.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#left
         * @type {?Phaser.Input.Keyboard.Key}
         * @default null
         * @since 3.0.0
         */
        this.left = GetValue(config, 'left', null);

        /**
         * The Key to be pressed that will move the Camera right.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#right
         * @type {?Phaser.Input.Keyboard.Key}
         * @default null
         * @since 3.0.0
         */
        this.right = GetValue(config, 'right', null);

        /**
         * The Key to be pressed that will move the Camera up.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#up
         * @type {?Phaser.Input.Keyboard.Key}
         * @default null
         * @since 3.0.0
         */
        this.up = GetValue(config, 'up', null);

        /**
         * The Key to be pressed that will move the Camera down.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#down
         * @type {?Phaser.Input.Keyboard.Key}
         * @default null
         * @since 3.0.0
         */
        this.down = GetValue(config, 'down', null);

        /**
         * The Key to be pressed that will zoom the Camera in.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#zoomIn
         * @type {?Phaser.Input.Keyboard.Key}
         * @default null
         * @since 3.0.0
         */
        this.zoomIn = GetValue(config, 'zoomIn', null);

        /**
         * The Key to be pressed that will zoom the Camera out.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#zoomOut
         * @type {?Phaser.Input.Keyboard.Key}
         * @default null
         * @since 3.0.0
         */
        this.zoomOut = GetValue(config, 'zoomOut', null);

        /**
         * The speed at which the camera will zoom if the `zoomIn` or `zoomOut` keys are pressed.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#zoomSpeed
         * @type {number}
         * @default 0.01
         * @since 3.0.0
         */
        this.zoomSpeed = GetValue(config, 'zoomSpeed', 0.01);

        /**
         * The horizontal speed the camera will move.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#speedX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.speedX = 0;

        /**
         * The vertical speed the camera will move.
         *
         * @name Phaser.Cameras.Controls.FixedKeyControl#speedY
         * @type {number}
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
         * Internal property to track the current zoom level.
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
     * Applies the results of pressing the control keys to the Camera.
     *
     * You must call this every step, it is not called automatically.
     *
     * @method Phaser.Cameras.Controls.FixedKeyControl#update
     * @since 3.0.0
     *
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
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
