/**
 * [description]
 *
 * @method Phaser.Animations.AnimationManager#staggerPlay
 * @since 3.0.0
 * 
 * @param {string} key - [description]
 * @param {Phaser.GameObjects.GameObject} child - [description]
 * @param {number} [stagger=0] - [description]
 * 
 * @return {Phaser.Animations.AnimationManager} The Animation Manager for method chaining.
 */
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
