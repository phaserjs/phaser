var CollideHandler = function (object1, object2, collideCallback, processCallback, callbackContext, overlapOnly)
{
    //  Only collide valid objects
    if (object2 === undefined && object1.isParent)
    {
        return this.collideGroupVsSelf(object1, collideCallback, processCallback, callbackContext, overlapOnly);
    }

    //  If neither of the objects are set then bail out
    if (!object1 || !object2)
    {
        return;
    }

    //  A Body
    if (object1.body)
    {
        if (object2.body)
        {
            this.collideSpriteVsSprite(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
        }
        else if (object2.isParent)
        {
            this.collideSpriteVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
        }
        else if (object2.isTilemap)
        {
            this.collideSpriteVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
        }
    }
    //  GROUPS
    else if (object1.isParent)
    {
        if (object2.body)
        {
            this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
        }
        else if (object2.isParent)
        {
            this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
        }
        else if (object2.isTilemap)
        {
            this.collideGroupVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
        }
    }
    //  TILEMAP LAYERS
    else if (object1.isTilemap)
    {
        if (object2.body)
        {
            this.collideSpriteVsTilemapLayer(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
        }
        else if (object2.isParent)
        {
            this.collideGroupVsTilemapLayer(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
        }
    }
};

module.exports = CollideHandler;
