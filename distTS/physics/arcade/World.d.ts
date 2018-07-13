/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Body: any;
declare var Clamp: any;
declare var Class: any;
declare var Collider: any;
declare var CONST: {
    VERSION: string;
    BlendModes: any;
    ScaleModes: any;
    AUTO: number;
    CANVAS: number;
    WEBGL: number;
    HEADLESS: number;
    FOREVER: number;
    NONE: number;
    UP: number;
    DOWN: number;
    LEFT: number;
    RIGHT: number;
};
declare var DistanceBetween: any;
declare var EventEmitter: any;
declare var FuzzyEqual: any;
declare var FuzzyGreaterThan: any;
declare var FuzzyLessThan: any;
declare var GetOverlapX: (body1: any, body2: any, overlapOnly: any, bias: any) => number;
declare var GetOverlapY: (body1: any, body2: any, overlapOnly: any, bias: any) => number;
declare var GetValue: any;
declare var ProcessQueue: any;
declare var ProcessTileCallbacks: any;
declare var Rectangle: any;
declare var RTree: any;
declare var SeparateTile: any;
declare var SeparateX: (body1: any, body2: any, overlapOnly: any, bias: any) => any;
declare var SeparateY: (body1: any, body2: any, overlapOnly: any, bias: any) => any;
declare var Set: SetConstructor;
declare var StaticBody: any;
declare var TileIntersectsBody: any;
declare var Vector2: any;
declare var Wrap: any;
/**
 * @event Phaser.Physics.Arcade.World#pause
 */
/**
 * @event Phaser.Physics.Arcade.World#resume
 */
/**
 * @event Phaser.Physics.Arcade.World#collide
 * @param {Phaser.GameObjects.GameObject} gameObject1
 * @param {Phaser.GameObjects.GameObject} gameObject2
 * @param {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody} body1
 * @param {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody} body2
 */
/**
 * @event Phaser.Physics.Arcade.World#overlap
 * @param {Phaser.GameObjects.GameObject} gameObject1
 * @param {Phaser.GameObjects.GameObject} gameObject2
 * @param {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody} body1
 * @param {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody} body2
 */
/**
 * @event Phaser.Physics.Arcade.World#worldbounds
 * @param {Phaser.Physics.Arcade.Body} body
 * @param {boolean} up
 * @param {boolean} down
 * @param {boolean} left
 * @param {boolean} right
 */
/**
 * @typedef {object} ArcadeWorldConfig
 *
 * @property {number} [fps=60] - Sets {@link Phaser.Physics.Arcade.World#fps}.
 * @property {number} [timeScale=1] - Sets {@link Phaser.Physics.Arcade.World#timeScale}.
 * @property {object} [gravity] - Sets {@link Phaser.Physics.Arcade.World#gravity}.
 * @property {number} [gravity.x=0] - The horizontal world gravity value.
 * @property {number} [gravity.y=0] - The vertical world gravity value.
 * @property {number} [x=0] - Sets {@link Phaser.Physics.Arcade.World#bounds bounds.x}.
 * @property {number} [y=0] - Sets {@link Phaser.Physics.Arcade.World#bounds bounds.y}.
 * @property {number} [width=0] - Sets {@link Phaser.Physics.Arcade.World#bounds bounds.width}.
 * @property {number} [height=0] - Sets {@link Phaser.Physics.Arcade.World#bounds bounds.height}.
 * @property {object} [checkCollision] - Sets {@link Phaser.Physics.Arcade.World#checkCollision}.
 * @property {boolean} [checkCollision.up=true] - Should bodies collide with the top of the world bounds?
 * @property {boolean} [checkCollision.down=true] - Should bodies collide with the bottom of the world bounds?
 * @property {boolean} [checkCollision.left=true] - Should bodies collide with the left of the world bounds?
 * @property {boolean} [checkCollision.right=true] - Should bodies collide with the right of the world bounds?
 * @property {number} [overlapBias=4] - Sets {@link Phaser.Physics.Arcade.World#OVERLAP_BIAS}.
 * @property {number} [tileBias=16] - Sets {@link Phaser.Physics.Arcade.World#TILE_BIAS}.
 * @property {boolean} [forceX=false] - Sets {@link Phaser.Physics.Arcade.World#forceX}.
 * @property {boolean} [isPaused=false] - Sets {@link Phaser.Physics.Arcade.World#isPaused}.
 * @property {boolean} [debug=false] - Sets {@link Phaser.Physics.Arcade.World#debug}.
 * @property {boolean} [debugShowBody=true] - Sets {@link Phaser.Physics.Arcade.World#defaults debugShowBody}.
 * @property {boolean} [debugShowStaticBody=true] - Sets {@link Phaser.Physics.Arcade.World#defaults debugShowStaticBody}.
 * @property {boolean} [debugShowVelocity=true] - Sets {@link Phaser.Physics.Arcade.World#defaults debugShowStaticBody}.
 * @property {number} [debugBodyColor=0xff00ff] - Sets {@link Phaser.Physics.Arcade.World#defaults debugBodyColor}.
 * @property {number} [debugStaticBodyColor=0x0000ff] - Sets {@link Phaser.Physics.Arcade.World#defaults debugStaticBodyColor}.
 * @property {number} [debugVelocityColor=0x00ff00] - Sets {@link Phaser.Physics.Arcade.World#defaults debugVelocityColor}.
 * @property {number} [maxEntries=16] - Sets {@link Phaser.Physics.Arcade.World#maxEntries}.
 * @property {boolean} [useTree=true] - Sets {@link Phaser.Physics.Arcade.World#useTree}.
 */
/**
 * @typedef {object} CheckCollisionObject
 *
 * @property {boolean} up - [description]
 * @property {boolean} down - [description]
 * @property {boolean} left - [description]
 * @property {boolean} right - [description]
 */
/**
 * @typedef {object} ArcadeWorldDefaults
 *
 * @property {boolean} debugShowBody - [description]
 * @property {boolean} debugShowStaticBody - [description]
 * @property {boolean} debugShowVelocity - [description]
 * @property {number} bodyDebugColor - [description]
 * @property {number} staticBodyDebugColor - [description]
 * @property {number} velocityDebugColor - [description]
 */
/**
 * @typedef {object} ArcadeWorldTreeMinMax
 *
 * @property {number} minX - [description]
 * @property {number} minY - [description]
 * @property {number} maxX - [description]
 * @property {number} maxY - [description]
 */
/**
 * An Arcade Physics Collider Type.
 *
 * @typedef {(
 * Phaser.GameObjects.GameObject|
 * Phaser.GameObjects.Group|
 * Phaser.Physics.Arcade.Sprite|
 * Phaser.Physics.Arcade.Image|
 * Phaser.Physics.Arcade.StaticGroup|
 * Phaser.Physics.Arcade.Group|
 * Phaser.Tilemaps.DynamicTilemapLayer|
 * Phaser.Tilemaps.StaticTilemapLayer|
 * Phaser.GameObjects.GameObject[]|
 * Phaser.Physics.Arcade.Sprite[]|
 * Phaser.Physics.Arcade.Image[]|
 * Phaser.Physics.Arcade.StaticGroup[]|
 * Phaser.Physics.Arcade.Group[]|
 * Phaser.Tilemaps.DynamicTilemapLayer[]|
 * Phaser.Tilemaps.StaticTilemapLayer[]
 * )} ArcadeColliderType
 */
/**
 * @classdesc
 * The Arcade Physics World.
 *
 * The World is responsible for creating, managing, colliding and updating all of the bodies within it.
 *
 * An instance of the World belongs to a Phaser.Scene and is accessed via the property `physics.world`.
 *
 * @class World
 * @extends Phaser.Events.EventEmitter
 * @memberOf Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this World instance belongs.
 * @param {ArcadeWorldConfig} config - An Arcade Physics Configuration object.
 */
declare var World: any;
