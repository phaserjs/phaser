/**
 * @typedef {object} Phaser.Types.Time.TimelineEvent
 * @since 3.60.0
 *
 * @property {boolean} complete - Has this event completed yet?
 * @property {boolean} once - Is this a once only event?
 * @property {number} time - The time (in elapsed ms) at which this event will fire.
 * @property {function} [if=null] - User-land callback which will be called if set. If it returns `true` then this event run all of its actions, otherwise it will be skipped.
 * @property {function} [run=null] - User-land callback which will be called when the Event fires.
 * @property {Phaser.Types.Tweens.TweenBuilderConfig|Phaser.Types.Tweens.TweenChainBuilderConfig|Phaser.Tweens.Tween|Phaser.Tweens.TweenChain} [tween=null] - Tween configuration object which will be used to create a Tween when the Event fires if set.
 * @property {object} [set=null] - Object containing properties to set on the `target` when the Event fires if set.
 * @property {string|object} [sound=null] - Sound configuration object which will be used to create a Sound when the Event fires if set.
 * @property {*} [target] - The scope (`this` object) with which to invoke the run `callback`.
 * @property {string} [event] - Optional event name to emit when the Event fires.
 */
