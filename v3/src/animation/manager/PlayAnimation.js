var PlayAnimation = function (key, child)
{
    if (!Array.isArray(child))
    {
        child = [ child ];
    }

    var anim = this.get(key);

    if (!anim)
    {
        return;
    }

    for (var i = 0; i < child.length; i++)
    {
        child[i].anims.play(key);
    }

    return this;
};

module.exports = PlayAnimation;
