var Shake = function (duration, intensity, force)
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
};

module.exports = Shake;
