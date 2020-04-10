/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterTileOptions
 * @since 3.0.0
 * 
 * @property {MatterJS.BodyType} [body=null] - An existing Matter body to be used instead of creating a new one.
 * @property {boolean} [isStatic=true] - Whether or not the newly created body should be made static. This defaults to true since typically tiles should not be moved.
 * @property {boolean} [addToWorld=true] - Whether or not to add the newly created body (or existing body if options.body is used) to the Matter world.
 */
