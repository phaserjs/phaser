var RemoveAnimation = function (key)
{
    var anim = this.get(key);

    if (anim)
    {
        this.anims.delete(key);
    }

    return anim;
};

module.exports = RemoveAnimation;
