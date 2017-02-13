var Transform = require('../components/Transform');

var Camera = function (x, y, width, height)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.state = null;
    this.statePositionX = 0.0;
    this.statePositionY = 0.0;
    this.scrollX = 0.0;
    this.scrollY = 0.0;
    this.zoom = 1.0;
    this.rotation = 0.0;

    // shake
    this._shakeDuration = 0.0;
    this._shakeIntensity = 0.0;
    this._shakeOffsetX = 0.0;
    this._shakeOffsetY = 0.0;

    // fade
    this._fadeDuration = 0.0;
    this._fadeRed = 0.0;
    this._fadeGreen = 0.0;
    this._fadeBlue = 0.0;
    this._fadeAlpha = 0.0;

    // flash
    this._flashDuration = 0.0;
    this._flashRed = 1.0;
    this._flashGreen = 1.0;
    this._flashBlue = 1.0;
    this._flashAlpha = 0.0;
};

Camera.prototype.constructor = Camera;

Camera.prototype = {

    setViewport: function (x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    },

    setSize: function (width, height)
    {
        this.width = width;
        this.height = height;
    },

    setState: function (state)
    {
        this.state = state;
    },

    update: function (delta)
    {
        if (this._flashAlpha > 0.0)
        {
            this._flashAlpha -= delta / this._flashDuration;

            if (this._flashAlpha < 0.0)
            {
                this._flashAlpha = 0.0;
            }
        }

        if (this._fadeAlpha > 0.0 && this._fadeAlpha < 1.0)
        {
            this._fadeAlpha += delta / this._fadeDuration;

            if (this._fadeAlpha >= 1.0)
            {
                this._fadeAlpha = 1.0;
            }
        }

        if (this._shakeDuration > 0.0)
        {
            var intensity = this._shakeIntensity;

            this._shakeDuration -= delta;

            if (this._shakeDuration <= 0.0)
            {
                this._shakeOffsetX = 0.0;
                this._shakeOffsetY = 0.0;
            }
            else
            {
                this._shakeOffsetX = (Math.random() * intensity * this.width * 2 - intensity * this.width) * this.zoom;
                this._shakeOffsetY = (Math.random() * intensity * this.height * 2 - intensity * this.height) * this.zoom;
            }
        }
    },

    flash: function (duration, red, green, blue, force)
    {
        if (!force && this._flashAlpha > 0.0)
        {
            return;
        }

        if (red === undefined) { red = 1.0; }
        if (green === undefined) { green = 1.0; }
        if (blue === undefined) { blue = 1.0; }

        this._flashRed = red;
        this._flashGreen = green;
        this._flashBlue = blue;

        if (duration <= 0)
        {
            duration = Number.MIN_VALUE;
        }

        this._flashDuration = duration;
        this._flashAlpha = 1.0;
    },

    fade: function (duration, red, green, blue, force)
    {
        if (red === undefined) { red = 0.0; }
        if (green === undefined) { green = 0.0; }
        if (blue === undefined) { blue = 0.0; }

        if (!force && this._fadeAlpha > 0.0)
        {
            return;
        }

        this._fadeRed = red;
        this._fadeGreen = green;
        this._fadeBlue = blue;

        if (duration <= 0)
        {
            duration = Number.MIN_VALUE;
        }

        this._fadeDuration = duration;
        this._fadeAlpha = Number.MIN_VALUE;
    },

    shake: function (duration, intensity, force)
    {
        if (intensity === undefined) { intensity = 0.05; }

        if (!force && (this._shakeOffsetX !== 0.0 || this._shakeOffsetY !== 0.0))
        {
            return;
        }

        this._shakeDuration = duration;
        this._shakeIntensity = intensity;
        this._shakeOffsetX = 0;
        this._shakeOffsetY = 0;
    },

    preRender: function (interpolation, renderer)
    {
        var state = this.state;
        var stateTransform = state.sys.transform;

        this.statePositionX = stateTransform.positionX;
        this.statePositionY = stateTransform.positionY;

        stateTransform.positionX = this.statePositionX + this.x;
        stateTransform.positionY = this.statePositionY + this.y;
        
        Transform.updateRoot(stateTransform, -this.scrollX + this._shakeOffsetX, -this.scrollY + this._shakeOffsetY, this.zoom, this.rotation);
    },

    postRender: function ()
    {
        var stateTransform = this.state.sys.transform;

        stateTransform.positionX = this.statePositionX;
        stateTransform.positionY = this.statePositionY;
    },

    destroy: function ()
    {
        this.state = undefined;
    }

};

module.exports = Camera;
