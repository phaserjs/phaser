/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Body: any;
declare var Class: any;
declare var COLLIDES: any;
declare var CollisionMap: any;
declare var EventEmitter: any;
declare var GetFastValue: any;
declare var HasValue: any;
declare var Set: SetConstructor;
declare var Solver: (world: any, bodyA: any, bodyB: any) => void;
declare var TILEMAP_FORMATS: any;
declare var TYPE: any;
/**
 * @typedef {object} Phaser.Physics.Impact.WorldConfig
 *
 * @property {number} [gravity=0] - [description]
 * @property {number} [cellSize=64] - [description]
 * @property {number} [timeScale=1] - [description]
 * @property {number} [maxStep=0.05] - [description]
 * @property {boolean} [debug=false] - [description]
 * @property {number} [maxVelocity=100] - [description]
 * @property {boolean} [debugShowBody=true] - [description]
 * @property {boolean} [debugShowVelocity=true] - [description]
 * @property {number} [debugBodyColor=0xff00ff] - [description]
 * @property {number} [debugVelocityColor=0x00ff00] - [description]
 * @property {number} [maxVelocityX=maxVelocity] - [description]
 * @property {number} [maxVelocityY=maxVelocity] - [description]
 * @property {number} [minBounceVelocity=40] - [description]
 * @property {number} [gravityFactor=1] - [description]
 * @property {number} [bounciness=0] - [description]
 * @property {(object|boolean)} [setBounds] - [description]
 * @property {number} [setBounds.x=0] - [description]
 * @property {number} [setBounds.y=0] - [description]
 * @property {number} [setBounds.width] - [description]
 * @property {number} [setBounds.height] - [description]
 * @property {number} [setBounds.thickness=64] - [description]
 * @property {boolean} [setBounds.left=true] - [description]
 * @property {boolean} [setBounds.right=true] - [description]
 * @property {boolean} [setBounds.top=true] - [description]
 * @property {boolean} [setBounds.bottom=true] - [description]
 */
/**
 * An object containing the 4 wall bodies that bound the physics world.
 *
 * @typedef {object} Phaser.Physics.Impact.WorldDefaults
 *
 * @property {boolean} debugShowBody - [description]
 * @property {boolean} debugShowVelocity - [description]
 * @property {number} bodyDebugColor - [description]
 * @property {number} velocityDebugColor - [description]
 * @property {number} maxVelocityX - [description]
 * @property {number} maxVelocityY - [description]
 * @property {number} minBounceVelocity - [description]
 * @property {number} gravityFactor - [description]
 * @property {number} bounciness - [description]
 */
/**
 * @typedef {object} Phaser.Physics.Impact.WorldWalls
 *
 * @property {?Phaser.Physics.Impact.Body} left - [description]
 * @property {?Phaser.Physics.Impact.Body} right - [description]
 * @property {?Phaser.Physics.Impact.Body} top - [description]
 * @property {?Phaser.Physics.Impact.Body} bottom - [description]
 */
/**
 * @classdesc
 * [description]
 *
 * @class World
 * @extends Phaser.Events.EventEmitter
 * @memberOf Phaser.Physics.Impact
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {Phaser.Physics.Impact.WorldConfig} config - [description]
 */
declare var World: any;
