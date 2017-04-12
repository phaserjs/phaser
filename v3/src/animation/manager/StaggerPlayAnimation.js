var StaggerPlayAnimation = function (key, child, stagger)
{
    if (stagger === undefined) { stagger = 0; }

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
        child[i].anims.delayedPlay(stagger * i, key);
    }

    return this;
};

module.exports = StaggerPlayAnimation;
