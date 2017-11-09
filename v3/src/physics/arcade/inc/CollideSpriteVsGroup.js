var CONST = require('../const');

var CollideSpriteVsGroup = function (sprite, group, collideCallback, processCallback, callbackContext, overlapOnly)
{
    if (group.length === 0)
    {
        return;
    }

    var bodyA = sprite.body;

    //  Does sprite collide with anything?

    var minMax = this.treeMinMax;

    minMax.minX = bodyA.left;
    minMax.minY = bodyA.top;
    minMax.maxX = bodyA.right;
    minMax.maxY = bodyA.bottom;

    var results = (group.physicsType === CONST.DYNAMIC_BODY) ? this.tree.search(minMax) : this.staticTree.search(minMax);

    if (results.length === 0)
    {
        return;
    }

    var children = group.getChildren();

    for (var i = 0; i < children.length; i++)
    {
        var bodyB = children[i].body;

        if (!bodyB || bodyA === bodyB || results.indexOf(bodyB) === -1)
        {
            continue;
        }

        if (this.separate(bodyA, bodyB, processCallback, callbackContext, overlapOnly))
        {
            if (collideCallback)
            {
                collideCallback.call(callbackContext, bodyA.gameObject, bodyB.gameObject);
            }

            this._total++;
        }
    }
};

module.exports = CollideSpriteVsGroup;
