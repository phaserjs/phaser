var Update = function (timestep, delta)
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
};

module.exports = Update;
