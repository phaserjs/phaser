/**
 * @typedef {object} Phaser.Types.Physics.Impact.CollisionOptions
 * @since 3.0.0
 * 
 * @property {string} [slopeTileProperty=null] - Slope IDs can be stored on tiles directly
 * using Impacts tileset editor. If a tile has a property with the given slopeTileProperty string
 * name, the value of that property for the tile will be used for its slope mapping. E.g. a 45
 * degree slope upward could be given a "slope" property with a value of 2.
 * @property {object} [slopeMap=null] - A tile index to slope definition map.
 * @property {integer} [defaultCollidingSlope=null] - If specified, the default slope ID to
 * assign to a colliding tile. If not specified, the tile's index is used.
 * @property {integer} [defaultNonCollidingSlope=0] - The default slope ID to assign to a
 * non-colliding tile.
 */
