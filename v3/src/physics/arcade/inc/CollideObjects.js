var CollideObjects = function (object1, object2, collideCallback, processCallback, callbackContext, overlapOnly)
{
    var i;
    var object1isArray = Array.isArray(object1);
    var object2isArray = Array.isArray(object2);

    if (!object1isArray && !object2isArray)
    {
        //  Neither of them are arrays - do this first as it's the most common use-case
        this.collideHandler(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
    }
    else if (!object1isArray && object2isArray)
    {
        //  Object 2 is an Array
        for (i = 0; i < object2.length; i++)
        {
            this.collideHandler(object1, object2[i], collideCallback, processCallback, callbackContext, overlapOnly);
        }
    }
    else if (object1isArray && !object2isArray)
    {
        //  Object 1 is an Array
        for (i = 0; i < object1.length; i++)
        {
            this.collideHandler(object1[i], object2, collideCallback, processCallback, callbackContext, overlapOnly);
        }
    }
    else
    {
        //  They're both arrays
        for (i = 0; i < object1.length; i++)
        {
            for (var j = 0; j < object2.length; j++)
            {
                this.collideHandler(object1[i], object2[j], collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }
    }
};

module.exports = CollideObjects;
