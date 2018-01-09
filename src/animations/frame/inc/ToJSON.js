/**
 * [description]
 *
 * @method Phaser.Animations.Animation#toJSON
 * @since 3.0.0
 *
 * @return {object} [description]
 */
var ToJSON = function ()
{
    var output = {
        key: this.key,
        type: this.type,
        frames: [],
        frameRate: this.frameRate,
        duration: this.duration,
        skipMissedFrames: this.skipMissedFrames,
        delay: this.delay,
        repeat: this.repeat,
        repeatDelay: this.repeatDelay,
        yoyo: this.yoyo,
        showOnStart: this.showOnStart,
        hideOnComplete: this.hideOnComplete
    };

    this.frames.forEach(function (frame)
    {
        output.frames.push(frame.toJSON());
    });

    return output;
};

module.exports = ToJSON;
