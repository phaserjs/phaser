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
        this.paused = false;

        this.state = this._pausedState;
    }

    return this;
};

module.exports = Pause;
