var Collide = function (object1, object2, collideCallback, processCallback, callbackContext)
{
    if (collideCallback === undefined) { collideCallback = null; }
    if (processCallback === undefined) { processCallback = null; }
    if (callbackContext === undefined) { callbackContext = collideCallback; }

    this._total = 0;

    this.collideObjects(object1, object2, collideCallback, processCallback, callbackContext, false);

    return (this._total > 0);
};

module.exports = Collide;
