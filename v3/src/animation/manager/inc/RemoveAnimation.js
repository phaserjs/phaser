var Event = require('../events/');

var RemoveAnimation = function (key)
{
    var anim = this.get(key);

    if (anim)
    {
        this.events.dispatch(new Event.REMOVE_ANIMATION_EVENT(key, anim));

        this.anims.delete(key);
    }

    return anim;
};

module.exports = RemoveAnimation;
