/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Animation: {
    new (effect?: AnimationEffectReadOnly, timeline?: AnimationTimeline): Animation;
    prototype: Animation;
};
declare var Class: any;
declare var CustomMap: any;
declare var EventEmitter: any;
declare var GetValue: any;
declare var Pad: any;
/**
 * @typedef {object} JSONAnimationManager
 *
 * @property {JSONAnimation[]} anims - [description]
 * @property {number} globalTimeScale - [description]
 */
/**
 * @classdesc
 * The Animation Manager.
 *
 * Animations are managed by the global Animation Manager. This is a singleton class that is
 * responsible for creating and delivering animations and their corresponding data to all Game Objects.
 * Unlike plugins it is owned by the Game instance, not the Scene.
 *
 * Sprites and other Game Objects get the data they need from the AnimationManager.
 *
 * @class AnimationManager
 * @extends Phaser.Events.EventEmitter
 * @memberOf Phaser.Animations
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - [description]
 */
declare var AnimationManager: any;
