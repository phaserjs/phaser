var TWEEN_CONST = require('../const');

/**
 * [description]
 *
 * @method Phaser.Tweens.Tween#pause
 * @since 3.0.0
 *
 * @return {Phaser.Tweens.Tween} [description]
 */
var Pause = function ()
{
    if (this.state === TWEEN_CONST.PAUSED)
    {
        return;
    }

    this.paused = true;

    this._pausedState = this.state;

    this.state = TWEEN_CONST.PAUSED;

    return this;
};

module.exports = Pause;
