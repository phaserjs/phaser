/**
 * [description]
 *
 * @method Phaser.Animations.Animation#setFrame
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Components.Animation} component - [description]
 */
var SetFrame = function (component)
{
    //  Work out which frame should be set next on the child, and set it
    if (component.forward)
    {
        this.nextFrame(component);
    }
    else
    {
        this.previousFrame(component);
    }
};

module.exports = SetFrame;
