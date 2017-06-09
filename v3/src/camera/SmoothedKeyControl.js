var GetValue = require('../utils/object/GetValue');

//  var camControl = new SmoothedKeyControl({
//      camera: this.cameras.main,
//      left: cursors.left,
//      right: cursors.right,
//      acceleration: float || { x: 0, y: 0 }
//      drag: float || { x: 0, y: 0 }
//      maxSpeed: float || { x: 0, y: 0 }
//  })

var SmoothedKeyControl = function (config)
{
    this.camera = GetValue(config, 'camera', null);

    this.left = GetValue(config, 'left', null);
    this.right = GetValue(config, 'right', null);
    this.up = GetValue(config, 'up', null);
    this.down = GetValue(config, 'down', null);

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

    this.active = (this.camera !== null);
};

SmoothedKeyControl.prototype.constructor = SmoothedKeyControl;

SmoothedKeyControl.prototype = {

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

        if (this.up.isDown)
        {
            this._speedY += this.accelY;

            if (this._speedY > this.maxSpeedY)
            {
                this._speedY = this.maxSpeedY;
            }
        }
        else if (this.down.isDown)
        {
            this._speedY -= this.accelY;

            if (this._speedY < -this.maxSpeedY)
            {
                this._speedY = -this.maxSpeedY;
            }
        }

        if (this.left.isDown)
        {
            this._speedX += this.accelX;

            if (this._speedX > this.maxSpeedX)
            {
                this._speedX = this.maxSpeedX;
            }
        }
        else if (this.right.isDown)
        {
            this._speedX -= this.accelX;

            if (this._speedX < -this.maxSpeedX)
            {
                this._speedX = -this.maxSpeedX;
            }
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
    },

    destroy: function ()
    {
        this.camera = null;

        this.left = null;
        this.right = null;
        this.up = null;
        this.down = null;
    }
};

module.exports = SmoothedKeyControl;
