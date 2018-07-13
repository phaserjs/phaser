/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
/**
 * @typedef {object} JSONAnimationFrame
 *
 * @property {string} key - The key of the Texture this AnimationFrame uses.
 * @property {(string|integer)} frame - The key of the Frame within the Texture that this AnimationFrame uses.
 * @property {number} duration - Additional time (in ms) that this frame should appear for during playback.
 */
/**
 * @classdesc
 * A single frame in an Animation sequence.
 *
 * An AnimationFrame consists of a reference to the Texture it uses for rendering, references to other
 * frames in the animation, and index data. It also has the ability to fire its own `onUpdate` callback
 * and modify the animation timing.
 *
 * AnimationFrames are generated automatically by the Animation class.
 *
 * @class AnimationFrame
 * @memberOf Phaser.Animations
 * @constructor
 * @since 3.0.0
 *
 * @param {string} textureKey - The key of the Texture this AnimationFrame uses.
 * @param {(string|integer)} textureFrame - The key of the Frame within the Texture that this AnimationFrame uses.
 * @param {integer} index - The index of this AnimationFrame within the Animation sequence.
 * @param {Phaser.Textures.Frame} frame - A reference to the Texture Frame this AnimationFrame uses for rendering.
 */
declare var AnimationFrame: any;
