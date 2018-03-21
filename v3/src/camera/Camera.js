var TransformMatrix = require('../components/TransformMatrix');

var Camera = function (x, y, width, height)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.scrollX = 0.0;
    this.scrollY = 0.0;
    this.zoom = 1.0;
    this.rotation = 0.0;
    this.matrix = new TransformMatrix(1, 0, 0, 1, 0, 0);

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

    // origin
    this._follow = null;
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

    startFollow: function (gameObjectOrPoint)
    {
        if (this._follow !== null)
        {
            this.stopFollow();
        }

        this._follow = gameObjectOrPoint;
    },

    stopFollow: function () 
    {
        /* do unfollow work here */
        this._follow = null;
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

    preRender: function ()
    {
        var width = this.width;
        var height = this.height;
        var zoom = this.zoom;
        var matrix = this.matrix;
        var originX = width / 2;
        var originY = height / 2;
        var follow = this._follow;

        if (follow != null)
        {
            originX = follow.x;
            originY = follow.y;
            
            this.scrollX = originX - width * 0.5;
            this.scrollY = originY - height * 0.5;
        }

        matrix.loadIdentity();
        matrix.translate(this.x + originX, this.y + originY);
        matrix.rotate(this.rotation);
        matrix.scale(zoom, zoom);
        matrix.translate(-originX, -originY);
        matrix.translate(this._shakeOffsetX, this._shakeOffsetY);
    },

    destroy: function ()
    {
        this.state = undefined;
    }

};

module.exports = Camera;
