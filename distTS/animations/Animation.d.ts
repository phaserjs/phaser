/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Clamp: any;
declare var Class: any;
declare var FindClosestInSorted: any;
declare var Frame: any;
declare var GetValue: any;
/**
 * @typedef {object} JSONAnimation
 *
 * @property {string} key - The key that the animation will be associated with. i.e. sprite.animations.play(key)
 * @property {string} type - A frame based animation (as opposed to a bone based animation)
 * @property {JSONAnimationFrame[]} frames - [description]
 * @property {integer} frameRate - The frame rate of playback in frames per second (default 24 if duration is null)
 * @property {integer} duration - How long the animation should play for in milliseconds. If not given its derived from frameRate.
 * @property {boolean} skipMissedFrames - Skip frames if the time lags, or always advanced anyway?
 * @property {integer} delay - Delay before starting playback. Value given in milliseconds.
 * @property {integer} repeat - Number of times to repeat the animation (-1 for infinity)
 * @property {integer} repeatDelay - Delay before the animation repeats. Value given in milliseconds.
 * @property {boolean} yoyo - Should the animation yoyo? (reverse back down to the start) before repeating?
 * @property {boolean} showOnStart - Should sprite.visible = true when the animation starts to play?
 * @property {boolean} hideOnComplete - Should sprite.visible = false when the animation finishes?
 */
/**
 * @typedef {object} AnimationFrameConfig
 *
 * @property {string} key - The key that the animation will be associated with. i.e. sprite.animations.play(key)
 * @property {(string|number)} frame - [description]
 * @property {number} [duration=0] - [description]
 * @property {boolean} [visible] - [description]
 */
/**
 * @typedef {object} AnimationConfig
 *
 * @property {string} [key] - The key that the animation will be associated with. i.e. sprite.animations.play(key)
 * @property {AnimationFrameConfig[]} [frames] - An object containing data used to generate the frames for the animation
 * @property {string} [defaultTextureKey=null] - The key of the texture all frames of the animation will use. Can be overridden on a per frame basis.
 * @property {integer} [frameRate] - The frame rate of playback in frames per second (default 24 if duration is null)
 * @property {integer} [duration] - How long the animation should play for in milliseconds. If not given its derived from frameRate.
 * @property {boolean} [skipMissedFrames=true] - Skip frames if the time lags, or always advanced anyway?
 * @property {integer} [delay=0] - Delay before starting playback. Value given in milliseconds.
 * @property {integer} [repeat=0] - Number of times to repeat the animation (-1 for infinity)
 * @property {integer} [repeatDelay=0] - Delay before the animation repeats. Value given in milliseconds.
 * @property {boolean} [yoyo=false] - Should the animation yoyo? (reverse back down to the start) before repeating?
 * @property {boolean} [showOnStart=false] - Should sprite.visible = true when the animation starts to play?
 * @property {boolean} [hideOnComplete=false] - Should sprite.visible = false when the animation finishes?
 */
/**
 * @classdesc
 * A Frame based Animation.
 *
 * This consists of a key, some default values (like the frame rate) and a bunch of Frame objects.
 *
 * The Animation Manager creates these. Game Objects don't own an instance of these directly.
 * Game Objects have the Animation Component, which are like playheads to global Animations (these objects)
 * So multiple Game Objects can have playheads all pointing to this one Animation instance.
 *
 * @class Animation
 * @memberOf Phaser.Animations
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Animations.AnimationManager} manager - [description]
 * @param {string} key - [description]
 * @param {AnimationConfig} config - [description]
 */
declare var Animation: {
    new (effect?: AnimationEffectReadOnly, timeline?: AnimationTimeline): Animation;
    prototype: Animation;
};
