/**
 * @typedef {object} Phaser.Types.Core.FPSConfig
 * @since 3.0.0
 *
 * @property {number} [min=5] - The minimum acceptable rendering rate, in frames per second.
 * @property {number} [target=60] - The optimum rendering rate, in frames per second. This does not enforce the fps rate, it merely tells Phaser what rate is considered optimal for this game.
 * @property {number} [limit=0] - Enforces an fps rate limit that the game step will run at, regardless of browser frequency. 0 means 'no limit'. Never set this higher than RAF can handle.
 * @property {boolean} [forceSetTimeOut=false] - Use setTimeout instead of requestAnimationFrame to run the game loop.
 * @property {number} [deltaHistory=10] - Calculate the average frame delta from this many consecutive frame intervals.
 * @property {number} [panicMax=120] - The amount of frames the time step counts before we trust the delta values again.
 * @property {boolean} [smoothStep=true] - Apply delta smoothing during the game update to help avoid spikes?
 */
