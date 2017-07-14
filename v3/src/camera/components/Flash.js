var Flash = function (duration, red, green, blue, force)
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
};

module.exports = Flash;
