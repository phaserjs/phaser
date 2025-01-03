/**
 * Configuration for the Matter Physics Runner.
 *
 * Set only one of `fps` and `delta`.
 *
 * `delta` is the size of the Runner's fixed time step (one physics update).
 * The "frame delta" is the time elapsed since the last game step.
 * Depending on the size of the frame delta, the Runner makes zero or more updates per game step.
 *
 * @typedef {object} Phaser.Types.Physics.Matter.MatterRunnerConfig
 * @since 3.22.0
 *
 * @property {number} [fps] - The number of physics updates per second. If set, this overrides `delta`.
 * @property {number} [delta=16.666] - The size of the update time step in milliseconds. If `fps` is set, it overrides `delta`.
 * @property {boolean} [frameDeltaSmoothing=true] - Whether to smooth the frame delta values.
 * @property {boolean} [frameDeltaSnapping=true] - Whether to round the frame delta values to the nearest 1 Hz.
 * @property {number} [frameDeltaHistorySize=100] - The number of frame delta values to record, when smoothing is enabled. The 10th to 90th percentiles are sampled.
 * @property {number} [maxUpdates=null] - The maximum number of updates per frame.
 * @property {number} [maxFrameTime=33.333] - The maximum amount of time to simulate in one frame, in milliseconds.
 * @property {boolean} [enabled=true] - Whether the Matter Runner is enabled.
 *
 * @see Phaser.Physics.Matter.World#runner
 */
