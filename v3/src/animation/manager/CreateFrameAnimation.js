var Animation = require('../frame/Animation');

var CreateFrameAnimation = function (key, config)
{
    if (this.anims.has(key))
    {
        console.error('Animation with key', key, 'already exists');
        return;
    }

    var anim = new Animation(this, key, config);

    this.anims.set(key, anim);

    return anim;
};

module.exports = CreateFrameAnimation;
