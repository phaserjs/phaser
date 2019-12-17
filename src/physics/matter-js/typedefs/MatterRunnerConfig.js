/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterRunnerConfig
 * @since 3.22.0
 *              
 * @property {boolean} [isFixed=false] - A boolean that specifies if the runner should use a fixed timestep (otherwise it is variable). If timing is fixed, then the apparent simulation speed will change depending on the frame rate (but behaviour will be deterministic). If the timing is variable, then the apparent simulation speed will be constant (approximately, but at the cost of determininism).
 * @property {number} [fps=60] - A number that specifies the frame rate in seconds. If you don't specify this, but do specify `delta`, those values set the fps rate.
 * @property {number} [correction=1] - A number that specifies the time correction factor to apply to the update. This can help improve the accuracy of the simulation in cases where delta is changing between updates.
 * @property {number} [deltaSampleSize=60] - The size of the delta smoothing array when `isFixed` is `false`.
 * @property {number} [delta=16.666] - A number that specifies the time step between updates in milliseconds. If you set the `fps` property, this value is set based on that. If `isFixed` is set to `true`, then `delta` is fixed. If it is `false`, then `delta` can dynamically change to maintain the correct apparent simulation speed.
 * @property {number} [deltaMin=16.666] - A number that specifies the minimum time step between updates in milliseconds.
 * @property {number} [deltaMax=33.333] - A number that specifies the maximum time step between updates in milliseconds.
 */
