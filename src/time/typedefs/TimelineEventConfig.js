/**
 * @typedef {object} Phaser.Types.Time.TimelineEventConfig
 * @since 3.60.0
 *
 * @property {number} [at=0] - The time (in ms) at which the Event will fire. The Timeline starts at 0.
 * @property {number} [in] - If the Timeline is already running, this is the time (in ms) at which the Event will fire based on its current elapsed value. If set, overrides the `at` property.
 * @property {number} [from] - Fire this event 'from' milliseconds after the previous event in the Timeline. If set it overrides the `at` and `in` properties.
 * @property {function} [run] - A function which will be called when the Event fires.
 * @property {string} [event] - Optional string-based event name to emit when the Event fires. The event is emitted from the Timeline instance.
 * @property {*} [target] - The scope (`this` object) with which to invoke the run `callback`, if set.
 * @property {boolean} [once=false] - If set, the Event will be removed from the Timeline when it fires.
 * @property {boolean} [stop=false] - If set, the Timeline will stop and enter a complete state when this Event fires, even if there are other events after it.
 * @property {Phaser.Types.Tweens.TweenBuilderConfig|Phaser.Types.Tweens.TweenChainBuilderConfig|Phaser.Tweens.Tween|Phaser.Tweens.TweenChain} [tween] - A Tween or TweenChain configuration object or instance. If set, the Event will create this Tween when it fires.
 * @property {object} [set] - A key-value object of properties to set on the `target` when the Event fires. Ignored if no `target` is given.
 * @property {string|object} [sound] - A key from the Sound Manager to play, or a config object for a sound to play when the Event fires. If a config object it must provide two properties: `key` and `config`. The `key` is the key of the sound to play, and the `config` is the config is a Phaser.Types.Sound.SoundConfig object.
 */
