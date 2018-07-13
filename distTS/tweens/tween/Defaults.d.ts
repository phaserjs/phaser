/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * @typedef {object} Phaser.Tweens.TweenConfigDefaults
 *
 * @property {(object|object[])} targets - [description]
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
declare var TWEEN_DEFAULTS: {
    targets: any;
    delay: number;
    duration: number;
    ease: string;
    easeParams: any;
    hold: number;
    repeat: number;
    repeatDelay: number;
    yoyo: boolean;
    flipX: boolean;
    flipY: boolean;
};
