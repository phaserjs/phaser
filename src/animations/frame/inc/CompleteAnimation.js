/**
 * [description]
 *
 * @method Phaser.Animations.Animation#completeAnimation
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Components.Animation} component - [description]
 */
var CompleteAnimation = function (component)
{
    if (this.hideOnComplete)
    {
        component.parent.visible = false;
    }

    component.stop(true);
};

module.exports = CompleteAnimation;
