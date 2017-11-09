var Overlap = function (object1, object2, overlapCallback, processCallback, callbackContext)
{
    if (overlapCallback === undefined) { overlapCallback = null; }
    if (processCallback === undefined) { processCallback = null; }
    if (callbackContext === undefined) { callbackContext = overlapCallback; }

    return this.collideObjects(object1, object2, overlapCallback, processCallback, callbackContext, true);
};

module.exports = Overlap;
