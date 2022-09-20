/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Tweens
 */

var Tweens = {

    States: require('./tween/const'),

    Builders: require('./builders'),
    Events: require('./events'),

    TweenManager: require('./TweenManager'),
    Tween: require('./tween/Tween'),
    TweenData: require('./tween/TweenData')

};

module.exports = Tweens;
