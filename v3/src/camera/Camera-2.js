var Transform = require('../components/experimental-Transform-2');

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

Camera.prototype.setViewport = function (x, y, width, height)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

Camera.prototype.setState = function (state)
{
    this.state = state;
    Transform.updateRoot(this.state.transform);
};

Camera.prototype.update = function (delta)
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
        this._shakeDuration -= delta;
        if (this._shakeDuration <= 0.0)
        {
            this._shakeOffsetX = 0.0;
            this._shakeOffsetY = 0.0;
        }
        else
        {
            this._shakeOffsetX = (Math.random() * this._shakeIntensity * this.width * 2 - this._shakeIntensity * this.width) * this.zoom;
            this._shakeOffsetY = (Math.random() * this._shakeIntensity * this.height * 2 - this._shakeIntensity * this.height) * this.zoom;
        }
    }    
};

Camera.prototype.flash = function (duration, red, green, blue, force)
{
    if (!force && this._flashAlpha > 0.0)
    {
        return;
    }
    this._flashRed = typeof red == 'number' ? red : 1.0;
    this._flashGreen = typeof green == 'number' ? green : 1.0;
    this._flashBlue = typeof blue == 'number' ? blue : 1.0;
    if (duration <= 0)
    {
        duration = Number.MIN_VALUE;
    }
    this._flashDuration = duration;
    this._flashAlpha = 1.0;
};

Camera.prototype.fade = function (duration, red, green, blue, force)
{
    if (!force && this._fadeAlpha > 0.0)
    {
        return;
    }
    this._fadeRed = typeof red == 'number' ? red : 0.0;
    this._fadeGreen = typeof green == 'number' ? green : 0.0;
    this._fadeBlue = typeof blue == 'number' ? blue : 0.0;
    if (duration <= 0)
    {
        duration = Number.MIN_VALUE;
    }
    this._fadeDuration = duration;
    this._fadeAlpha = Number.MIN_VALUE;
};

Camera.prototype.shake = function (duration, intensity, force)
{
    if (!force && (this._shakeOffsetX !== 0.0 || this._shakeOffsetY !== 0.0))
    {
        return;
    }
    this._shakeDuration = duration;
    this._shakeIntensity = typeof intensity == 'number' ? intensity : 0.05;
    this._shakeOffsetX = 0;
    this._shakeOffsetY = 0;
};

Camera.prototype.preRender = function (interpolation, renderer)
{
    var state = this.state;
    var stateTransform = state.transform;

    this.statePositionX = stateTransform.positionX;
    this.statePositionY = stateTransform.positionY;

    stateTransform.positionX = this.statePositionX + this.x;
    stateTransform.positionY = this.statePositionY + this.y;
    
    Transform.updateRoot(stateTransform, -this.scrollX + this._shakeOffsetX, -this.scrollY + this._shakeOffsetY, this.zoom, this.rotation);
};

Camera.prototype.postRender = function ()
{
    var stateTransform = this.state.transform;
    stateTransform.positionX = this.statePositionX;
    stateTransform.positionY = this.statePositionY;
};

module.exports = Camera;