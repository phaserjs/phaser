var TWEEN_CONST = require('../const');

/**
 * Stops the Tween immediately, whatever stage of progress it is at and flags it for removal by the TweenManager.
 *
 * @method Phaser.Tweens.Tween#stop
 * @since 3.0.0
 */
var Stop = function (resetTo)
{
    if (resetTo !== undefined)
    {
        this.seek(resetTo);
    }

    this.state = TWEEN_CONST.PENDING_REMOVE;
};

module.exports = Stop;
