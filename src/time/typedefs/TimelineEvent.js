/**
 * @typedef {object} Phaser.Types.Time.TimelineEvent
 * @since 3.60.0
 *
 * @property {boolean} complete - Has this event completed yet?
 * @property {boolean} once - Is this a once only event?
 * @property {number} time - The time (in elapsed ms) at which this event will fire.
 * @property {function} [run=null] - User-land callback which will be called when the Event fires if set.
 * @property {function} [action=null] - Internal callback which will be called when the Event fires if set.
 * @property {*} [target] - The scope (`this` object) with which to invoke the run `callback`.
 * @property {string} [event] - Optional event name to emit when the Event fires.
 */
