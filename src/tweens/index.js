/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('./tween/const');
var Extend = require('../utils/object/Extend');

/**
 * @namespace Phaser.Tweens
 */

var Tweens = {

    Builders: require('./builders'),
    Events: require('./events'),

    TweenManager: require('./TweenManager'),
    Tween: require('./tween/Tween'),
    TweenData: require('./tween/TweenData'),
    Timeline: require('./Timeline')

};

//   Merge in the consts
Tweens = Extend(false, Tweens, CONST);

module.exports = Tweens;
