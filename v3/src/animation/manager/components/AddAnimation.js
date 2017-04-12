var AddAnimation = function (key, animation)
{
    if (this.anims.has(key))
    {
        console.error('Animation with key', key, 'already exists');
        return;
    }

    animation.key = key;

    this.anims.set(key, animation);

    return this;
};

module.exports = AddAnimation;
