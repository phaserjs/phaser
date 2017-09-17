var Class = require('../../utils/Class');
var GetValue = require('../../utils/object/GetValue');

// var controlConfig = {
//     camera: this.cameras.main,
//     left: cursors.left,
//     right: cursors.right,
//     up: cursors.up,
//     down: cursors.down,
//     zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
//     zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
//     zoomSpeed: 0.02,
//     acceleration: 0.06,
//     drag: 0.0005,
//     maxSpeed: 1.0
// };

var SmoothedKeyControl = new Class({

    initialize:

    function SmoothedKeyControl (config)
    {
        this.camera = GetValue(config, 'camera', null);

        this.left = GetValue(config, 'left', null);
        this.right = GetValue(config, 'right', null);
        this.up = GetValue(config, 'up', null);
        this.down = GetValue(config, 'down', null);

        this.zoomIn = GetValue(config, 'zoomIn', null);
        this.zoomOut = GetValue(config, 'zoomOut', null);
        this.zoomSpeed = GetValue(config, 'zoomSpeed', 0.01);

        var accel = GetValue(config, 'acceleration', null);

        if (typeof accel === 'number')
        {
            this.accelX = accel;
            this.accelY = accel;
        }
        else
        {
            this.accelX = GetValue(config, 'acceleration.x', 0);
            this.accelY = GetValue(config, 'acceleration.y', 0);
        }

        var drag = GetValue(config, 'drag', null);

        if (typeof drag === 'number')
        {
            this.dragX = drag;
            this.dragY = drag;
        }
        else
        {
            this.dragX = GetValue(config, 'drag.x', 0);
            this.dragY = GetValue(config, 'drag.y', 0);
        }

        var maxSpeed = GetValue(config, 'maxSpeed', null);

        if (typeof maxSpeed === 'number')
        {
            this.maxSpeedX = maxSpeed;
            this.maxSpeedY = maxSpeed;
        }
        else
        {
            this.maxSpeedX = GetValue(config, 'maxSpeed.x', 0);
            this.maxSpeedY = GetValue(config, 'maxSpeed.y', 0);
        }

        this._speedX = 0;
        this._speedY = 0;
        this._zoom = 0;

        this.active = (this.camera !== null);
    },

    start: function ()
    {
        this.active = (this.camera !== null);
    },

    stop: function ()
    {
        this.active = false;
    },

    update: function (delta)
    {
        if (!this.active)
        {
            return;
        }

        if (delta === undefined) { delta = 1; }

        var cam = this.camera;

        //  Apply Deceleration

        if (this._speedX > 0)
        {
            this._speedX -= this.dragX * delta;

            if (this._speedX < 0)
            {
                this._speedX = 0;
            }
        }
        else if (this._speedX < 0)
        {
            this._speedX += this.dragX * delta;

            if (this._speedX > 0)
            {
                this._speedX = 0;
            }
        }

        if (this._speedY > 0)
        {
            this._speedY -= this.dragY * delta;

            if (this._speedY < 0)
            {
                this._speedY = 0;
            }
        }
        else if (this._speedY < 0)
        {
            this._speedY += this.dragY * delta;

            if (this._speedY > 0)
            {
                this._speedY = 0;
            }
        }

        //  Check for keys

        if (this.up && this.up.isDown)
        {
            this._speedY += this.accelY;

            if (this._speedY > this.maxSpeedY)
            {
                this._speedY = this.maxSpeedY;
            }
        }
        else if (this.down && this.down.isDown)
        {
            this._speedY -= this.accelY;

            if (this._speedY < -this.maxSpeedY)
            {
                this._speedY = -this.maxSpeedY;
            }
        }

        if (this.left && this.left.isDown)
        {
            this._speedX += this.accelX;

            if (this._speedX > this.maxSpeedX)
            {
                this._speedX = this.maxSpeedX;
            }
        }
        else if (this.right && this.right.isDown)
        {
            this._speedX -= this.accelX;

            if (this._speedX < -this.maxSpeedX)
            {
                this._speedX = -this.maxSpeedX;
            }
        }

        //  Camera zoom

        if (this.zoomIn && this.zoomIn.isDown)
        {
            this._zoom = -this.zoomSpeed;
        }
        else if (this.zoomOut && this.zoomOut.isDown)
        {
            this._zoom = this.zoomSpeed;
        }
        else
        {
            this._zoom = 0;
        }

        //  Apply to Camera

        if (this._speedX !== 0)
        {
            cam.scrollX -= ((this._speedX * delta) | 0);
        }

        if (this._speedY !== 0)
        {
            cam.scrollY -= ((this._speedY * delta) | 0);
        }

        if (this._zoom !== 0)
        {
            cam.zoom += this._zoom;

            if (cam.zoom < 0.1)
            {
                cam.zoom = 0.1;
            }
        }
    },

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

module.exports = SmoothedKeyControl;
