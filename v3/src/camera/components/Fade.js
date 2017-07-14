var Fade = function (duration, red, green, blue, force)
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
};

module.exports = Fade;
