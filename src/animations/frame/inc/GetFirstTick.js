/**
 * [description]
 *
 * @method Phaser.Animations.Animation#getFirstTick
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Components.Animation} component - [description]
 * @param {boolean} [includeDelay=true] - [description]
 */
var GetFirstTick = function (component, includeDelay)
{
    if (includeDelay === undefined) { includeDelay = true; }

    //  When is the first update due?
    component.accumulator = 0;
    component.nextTick = component.msPerFrame + component.currentFrame.duration;

    if (includeDelay)
    {
        component.nextTick += (component._delay * 1000);
    }
};

module.exports = GetFirstTick;
