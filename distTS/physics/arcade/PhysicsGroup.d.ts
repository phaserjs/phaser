/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var ArcadeSprite: any;
declare var Class: any;
declare var CONST: {
    VERSION: string;
    /**
     * @typedef {object} PhysicsGroupConfig
     * @extends GroupConfig
     *
     * @property {boolean} [collideWorldBounds=false] - Sets {@link Phaser.Physics.Arcade.Body#collideWorldBounds}.
     * @property {number} [accelerationX=0] - Sets {@link Phaser.Physics.Arcade.Body#acceleration acceleration.x}.
     * @property {number} [accelerationY=0] - Sets {@link Phaser.Physics.Arcade.Body#acceleration acceleration.y}.
     * @property {boolean} [allowDrag=true] - Sets {@link Phaser.Physics.Arcade.Body#allowDrag}.
     * @property {boolean} [allowGravity=true] - Sets {@link Phaser.Physics.Arcade.Body#allowGravity}.
     * @property {boolean} [allowRotation=true] - Sets {@link Phaser.Physics.Arcade.Body#allowRotation}.
     * @property {number} [bounceX=0] - Sets {@link Phaser.Physics.Arcade.Body#bounce bounce.x}.
     * @property {number} [bounceY=0] - Sets {@link Phaser.Physics.Arcade.Body#bounce bounce.y}.
     * @property {number} [dragX=0] - Sets {@link Phaser.Physics.Arcade.Body#drag drag.x}.
     * @property {number} [dragY=0] - Sets {@link Phaser.Physics.Arcade.Body#drag drag.y}.
     * @property {number} [gravityX=0] - Sets {@link Phaser.Physics.Arcade.Body#gravity gravity.x}.
     * @property {number} [gravityY=0] - Sets {@link Phaser.Physics.Arcade.Body#gravity gravity.y}.
     * @property {number} [frictionX=0] - Sets {@link Phaser.Physics.Arcade.Body#friction friction.x}.
     * @property {number} [frictionY=0] - Sets {@link Phaser.Physics.Arcade.Body#friction friction.y}.
     * @property {number} [velocityX=0] - Sets {@link Phaser.Physics.Arcade.Body#velocity velocity.x}.
     * @property {number} [velocityY=0] - Sets {@link Phaser.Physics.Arcade.Body#velocity velocity.y}.
     * @property {number} [angularVelocity=0] - Sets {@link Phaser.Physics.Arcade.Body#angularVelocity}.
     * @property {number} [angularAcceleration=0] - Sets {@link Phaser.Physics.Arcade.Body#angularAcceleration}.
     * @property {number} [angularDrag=0] - Sets {@link Phaser.Physics.Arcade.Body#angularDrag}.
     * @property {number} [mass=0] - Sets {@link Phaser.Physics.Arcade.Body#mass}.
     * @property {boolean} [immovable=false] - Sets {@link Phaser.Physics.Arcade.Body#immovable}.
     */
    /**
     * @typedef {object} PhysicsGroupDefaults
     *
     * @property {boolean} setCollideWorldBounds - [description]
     * @property {number} setAccelerationX - [description]
     * @property {number} setAccelerationY - [description]
     * @property {boolean} setAllowDrag - [description]
     * @property {boolean} setAllowGravity - [description]
     * @property {boolean} setAllowRotation - [description]
     * @property {number} setBounceX - [description]
     * @property {number} setBounceY - [description]
     * @property {number} setDragX - [description]
     * @property {number} setDragY - [description]
     * @property {number} setGravityX - [description]
     * @property {number} setGravityY - [description]
     * @property {number} setFrictionX - [description]
     * @property {number} setFrictionY - [description]
     * @property {number} setVelocityX - [description]
     * @property {number} setVelocityY - [description]
     * @property {number} setAngularVelocity - [description]
     * @property {number} setAngularAcceleration - [description]
     * @property {number} setAngularDrag - [description]
     * @property {number} setMass - [description]
     * @property {boolean} setImmovable - [description]
     */
    /**
     * @classdesc
     * An Arcade Physics Group object.
     *
     * All Game Objects created by this Group will automatically be dynamic Arcade Physics objects.
     *
     * @class Group
     * @extends Phaser.GameObjects.Group
     * @memberOf Phaser.Physics.Arcade
     * @constructor
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.World} world - [description]
     * @param {Phaser.Scene} scene - [description]
     * @param {array} children - [description]
     * @param {PhysicsGroupConfig} [config] - [description]
     */
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
declare var GetFastValue: any;
declare var Group: any;
/**
 * @typedef {object} PhysicsGroupConfig
 * @extends GroupConfig
 *
 * @property {boolean} [collideWorldBounds=false] - Sets {@link Phaser.Physics.Arcade.Body#collideWorldBounds}.
 * @property {number} [accelerationX=0] - Sets {@link Phaser.Physics.Arcade.Body#acceleration acceleration.x}.
 * @property {number} [accelerationY=0] - Sets {@link Phaser.Physics.Arcade.Body#acceleration acceleration.y}.
 * @property {boolean} [allowDrag=true] - Sets {@link Phaser.Physics.Arcade.Body#allowDrag}.
 * @property {boolean} [allowGravity=true] - Sets {@link Phaser.Physics.Arcade.Body#allowGravity}.
 * @property {boolean} [allowRotation=true] - Sets {@link Phaser.Physics.Arcade.Body#allowRotation}.
 * @property {number} [bounceX=0] - Sets {@link Phaser.Physics.Arcade.Body#bounce bounce.x}.
 * @property {number} [bounceY=0] - Sets {@link Phaser.Physics.Arcade.Body#bounce bounce.y}.
 * @property {number} [dragX=0] - Sets {@link Phaser.Physics.Arcade.Body#drag drag.x}.
 * @property {number} [dragY=0] - Sets {@link Phaser.Physics.Arcade.Body#drag drag.y}.
 * @property {number} [gravityX=0] - Sets {@link Phaser.Physics.Arcade.Body#gravity gravity.x}.
 * @property {number} [gravityY=0] - Sets {@link Phaser.Physics.Arcade.Body#gravity gravity.y}.
 * @property {number} [frictionX=0] - Sets {@link Phaser.Physics.Arcade.Body#friction friction.x}.
 * @property {number} [frictionY=0] - Sets {@link Phaser.Physics.Arcade.Body#friction friction.y}.
 * @property {number} [velocityX=0] - Sets {@link Phaser.Physics.Arcade.Body#velocity velocity.x}.
 * @property {number} [velocityY=0] - Sets {@link Phaser.Physics.Arcade.Body#velocity velocity.y}.
 * @property {number} [angularVelocity=0] - Sets {@link Phaser.Physics.Arcade.Body#angularVelocity}.
 * @property {number} [angularAcceleration=0] - Sets {@link Phaser.Physics.Arcade.Body#angularAcceleration}.
 * @property {number} [angularDrag=0] - Sets {@link Phaser.Physics.Arcade.Body#angularDrag}.
 * @property {number} [mass=0] - Sets {@link Phaser.Physics.Arcade.Body#mass}.
 * @property {boolean} [immovable=false] - Sets {@link Phaser.Physics.Arcade.Body#immovable}.
 */
/**
 * @typedef {object} PhysicsGroupDefaults
 *
 * @property {boolean} setCollideWorldBounds - [description]
 * @property {number} setAccelerationX - [description]
 * @property {number} setAccelerationY - [description]
 * @property {boolean} setAllowDrag - [description]
 * @property {boolean} setAllowGravity - [description]
 * @property {boolean} setAllowRotation - [description]
 * @property {number} setBounceX - [description]
 * @property {number} setBounceY - [description]
 * @property {number} setDragX - [description]
 * @property {number} setDragY - [description]
 * @property {number} setGravityX - [description]
 * @property {number} setGravityY - [description]
 * @property {number} setFrictionX - [description]
 * @property {number} setFrictionY - [description]
 * @property {number} setVelocityX - [description]
 * @property {number} setVelocityY - [description]
 * @property {number} setAngularVelocity - [description]
 * @property {number} setAngularAcceleration - [description]
 * @property {number} setAngularDrag - [description]
 * @property {number} setMass - [description]
 * @property {boolean} setImmovable - [description]
 */
/**
 * @classdesc
 * An Arcade Physics Group object.
 *
 * All Game Objects created by this Group will automatically be dynamic Arcade Physics objects.
 *
 * @class Group
 * @extends Phaser.GameObjects.Group
 * @memberOf Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.World} world - [description]
 * @param {Phaser.Scene} scene - [description]
 * @param {array} children - [description]
 * @param {PhysicsGroupConfig} [config] - [description]
 */
declare var PhysicsGroup: any;
