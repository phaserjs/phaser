/**
 * [description]
 *
 * @method Phaser.Animations.AnimationManager#play
 * @since 3.0.0
 * 
 * @param {string} key - [description]
 * @param {Phaser.GameObjects.GameObject} child - [description]
 * @return {Phaser.Animations.AnimationManager} The Animation Manager for method chaining.
 */
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
