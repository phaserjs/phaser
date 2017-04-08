var PlayAnimation = function (items, key, startFrame)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].anims.play(key, startFrame);
    }

    return items;
};

module.exports = PlayAnimation;
