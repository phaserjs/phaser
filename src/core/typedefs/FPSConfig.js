/**
 * @typedef {object} Phaser.Types.Core.FPSConfig
 * @since 3.0.0
 *
 * @property {integer} [min=5] - The minimum acceptable rendering rate, in frames per second.
 * @property {integer} [target=60] - The optimum rendering rate, in frames per second.
 * @property {boolean} [forceSetTimeOut=false] - Use setTimeout instead of requestAnimationFrame to run the game loop.
 * @property {integer} [deltaHistory=10] - Calculate the average frame delta from this many consecutive frame intervals.
 * @property {integer} [panicMax=120] - The amount of frames the time step counts before we trust the delta values again.
 * @property {boolean} [smoothStep=true] - Apply delta smoothing during the game update to help avoid spikes?
 */
