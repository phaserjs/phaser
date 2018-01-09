/**
 * [description]
 *
 * @method Phaser.Animations.Animation#repeatAnimation
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Components.Animation} component - [description]
 */
var RepeatAnimation = function (component)
{
    if (component._repeatDelay > 0 && component.pendingRepeat === false)
    {
        component.pendingRepeat = true;
        component.accumulator -= component.nextTick;
        component.nextTick += (component._repeatDelay * 1000);
    }
    else
    {
        component.repeatCounter--;

        component.forward = true;

        component.updateFrame(component.currentFrame.nextFrame);

        this.getNextTick(component);

        component.pendingRepeat = false;

        if (this.onRepeat)
        {
            this.onRepeat.apply(this.callbackScope, component._callbackArgs.concat(this.onRepeatParams));
        }
    }
};

module.exports = RepeatAnimation;
