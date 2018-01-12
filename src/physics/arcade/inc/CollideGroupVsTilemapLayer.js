var CollideGroupVsTilemapLayer = function (group, tilemapLayer, collideCallback, processCallback, callbackContext, overlapOnly)
{
    var children = group.getChildren();

    if (children.length === 0)
    {
        return false;
    }

    var didCollide = false;

    for (var i = 0; i < children.length; i++)
    {
        if (children[i].body)
        {
            if (this.collideSpriteVsTilemapLayer(children[i], tilemapLayer, collideCallback, processCallback, callbackContext, overlapOnly)) {
                didCollide = true;
            }
        }
    }

    return didCollide;
};

module.exports = CollideGroupVsTilemapLayer;
