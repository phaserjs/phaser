/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
