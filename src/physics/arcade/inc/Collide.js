var Collide = function (object1, object2, collideCallback, processCallback, callbackContext)
{
    if (collideCallback === undefined) { collideCallback = null; }
    if (processCallback === undefined) { processCallback = null; }
    if (callbackContext === undefined) { callbackContext = collideCallback; }

    return this.collideObjects(object1, object2, collideCallback, processCallback, callbackContext, false);
};

module.exports = Collide;
