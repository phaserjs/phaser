/**
 * [description]
 *
 * @method Phaser.Animations.Animation#previousFrame
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Components.Animation} component - [description]
 */
var PreviousFrame = function (component)
{
    var frame = component.currentFrame;

    //  TODO: Add frame skip support

    if (frame.isFirst)
    {
        //  We're at the start of the animation

        if (component.repeatCounter > 0)
        {
            //  Repeat (happens before complete)
            this.repeatAnimation(component);
        }
        else
        {
            this.completeAnimation(component);
        }
    }
    else
    {
        component.updateFrame(frame.prevFrame);

        this.getNextTick(component);
    }
};

module.exports = PreviousFrame;
