/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Bodies: any;
declare var Body: any;
declare var Class: any;
declare var Components: any;
declare var GetFastValue: any;
declare var HasValue: any;
declare var Vertices: any;
/**
 * @classdesc
 * A wrapper around a Tile that provides access to a corresponding Matter body. A tile can only
 * have one Matter body associated with it. You can either pass in an existing Matter body for
 * the tile or allow the constructor to create the corresponding body for you. If the Tile has a
 * collision group (defined in Tiled), those shapes will be used to create the body. If not, the
 * tile's rectangle bounding box will be used.
 *
 * The corresponding body will be accessible on the Tile itself via Tile.physics.matterBody.
 *
 * Note: not all Tiled collision shapes are supported. See
 * Phaser.Physics.Matter.TileBody#setFromTileCollision for more information.
 *
 * @class TileBody
 * @memberOf Phaser.Physics.Matter
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.Physics.Matter.Components.Bounce
 * @extends Phaser.Physics.Matter.Components.Collision
 * @extends Phaser.Physics.Matter.Components.Friction
 * @extends Phaser.Physics.Matter.Components.Gravity
 * @extends Phaser.Physics.Matter.Components.Mass
 * @extends Phaser.Physics.Matter.Components.Sensor
 * @extends Phaser.Physics.Matter.Components.Sleep
 * @extends Phaser.Physics.Matter.Components.Static
 *
 * @param {Phaser.Physics.Matter.World} world - [description]
 * @param {Phaser.Tilemaps.Tile} tile - The target tile that should have a Matter body.
 * @param {object} [options] - Options to be used when creating the Matter body. See
 * Phaser.Physics.Matter.Matter.Body for a list of what Matter accepts.
 * @param {Phaser.Physics.Matter.Matter.Body} [options.body=null] - An existing Matter body to
 * be used instead of creating a new one.
 * @param {boolean} [options.isStatic=true] - Whether or not the newly created body should be
 * made static. This defaults to true since typically tiles should not be moved.
 * @param {boolean} [options.addToWorld=true] - Whether or not to add the newly created body (or
 * existing body if options.body is used) to the Matter world.
 */
declare var MatterTileBody: any;
