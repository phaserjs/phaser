var CollideSpriteVsSprite = function (sprite1, sprite2, collideCallback, processCallback, callbackContext, overlapOnly)
{
    if (!sprite1.body || !sprite2.body)
    {
        return false;
    }

    if (this.separate(sprite1.body, sprite2.body, processCallback, callbackContext, overlapOnly))
    {
        if (collideCallback)
        {
            collideCallback.call(callbackContext, sprite1, sprite2);
        }

        this._total++;
    }

    return true;
};

module.exports = CollideSpriteVsSprite;
