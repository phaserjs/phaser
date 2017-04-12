//  Load an Animation into a Game Objects Animation Component
var LoadAnimationToGameObject = function (child, key, startFrame)
{
    var anim = this.get(key);

    if (anim)
    {
        anim.load(child, startFrame);
    }

    return child;
};

module.exports = LoadAnimationToGameObject;
