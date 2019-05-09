/**
 * @typedef {object} Phaser.Types.Physics.Impact.WorldConfig
 * @since 3.0.0
 *
 * @property {number} [gravity=0] - Sets {@link Phaser.Physics.Impact.World#gravity}
 * @property {number} [cellSize=64] - The size of the cells used for the broadphase pass. Increase this value if you have lots of large objects in the world.
 * @property {number} [timeScale=1] - A number that allows per-body time scaling, e.g. a force-field where bodies inside are in slow-motion, while others are at full speed.
 * @property {number} [maxStep=0.05] - [description]
 * @property {boolean} [debug=false] - Sets {@link Phaser.Physics.Impact.World#debug}.
 * @property {number} [maxVelocity=100] - The maximum velocity a body can move.
 * @property {boolean} [debugShowBody=true] - Whether the Body's boundary is drawn to the debug display.
 * @property {boolean} [debugShowVelocity=true] - Whether the Body's velocity is drawn to the debug display.
 * @property {number} [debugBodyColor=0xff00ff] - The color of this Body on the debug display.
 * @property {number} [debugVelocityColor=0x00ff00] - The color of the Body's velocity on the debug display.
 * @property {number} [maxVelocityX=maxVelocity] - Maximum X velocity objects can move.
 * @property {number} [maxVelocityY=maxVelocity] - Maximum Y velocity objects can move.
 * @property {number} [minBounceVelocity=40] - The minimum velocity an object can be moving at to be considered for bounce.
 * @property {number} [gravityFactor=1] - Gravity multiplier. Set to 0 for no gravity.
 * @property {number} [bounciness=0] - The default bounce, or restitution, of bodies in the world.
 * @property {(object|boolean)} [setBounds] - Should the world have bounds enabled by default?
 * @property {number} [setBounds.x=0] - The x coordinate of the world bounds.
 * @property {number} [setBounds.y=0] - The y coordinate of the world bounds.
 * @property {number} [setBounds.width] - The width of the world bounds.
 * @property {number} [setBounds.height] - The height of the world bounds.
 * @property {number} [setBounds.thickness=64] - The thickness of the walls of the world bounds.
 * @property {boolean} [setBounds.left=true] - Should the left-side world bounds wall be created?
 * @property {boolean} [setBounds.right=true] - Should the right-side world bounds wall be created?
 * @property {boolean} [setBounds.top=true] - Should the top world bounds wall be created?
 * @property {boolean} [setBounds.bottom=true] - Should the bottom world bounds wall be created?
 */
