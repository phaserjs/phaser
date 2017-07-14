var StartFollow = function (gameObjectOrPoint, roundPx)
{
    if (this._follow !== null)
    {
        this.stopFollow();
    }

    this._follow = gameObjectOrPoint;

    if (roundPx !== undefined)
    {
        this.roundPixels = roundPx;
    }

    return this;
};

module.exports = StartFollow;
