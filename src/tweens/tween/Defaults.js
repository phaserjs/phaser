/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @typedef {object} Phaser.Tweens.Tween~ConfigDefaults
 * @property {object|object[]} targets - [description]
 * @property {number} [delay=0] - [description]
 * @property {number} [duration=1000] - [description]
 * @property {string} [ease='Power0'] - [description]
 * @property {array} [easeParams] - [description]
 * @property {number} [hold=0] - [description]
 * @property {number} [repeat=0] - [description]
 * @property {number} [repeatDelay=0] - [description]
 * @property {boolean} [yoyo=false] - [description]
 * @property {boolean} [flipX=false] - [description]
 * @property {boolean} [flipY=false] - [description]
 */

var TWEEN_DEFAULTS = {
    targets: null,
    delay: 0,
    duration: 1000,
    ease: 'Power0',
    easeParams: null,
    hold: 0,
    repeat: 0,
    repeatDelay: 0,
    yoyo: false,
    flipX: false,
    flipY: false
};

module.exports = TWEEN_DEFAULTS;
