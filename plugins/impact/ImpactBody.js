/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('./components');

/**
 * @classdesc
 * [description]
 *
 * @class ImpactBody
 * @memberof Phaser.Physics.Impact
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.Physics.Impact.Components.Acceleration
 * @extends Phaser.Physics.Impact.Components.BodyScale
 * @extends Phaser.Physics.Impact.Components.BodyType
 * @extends Phaser.Physics.Impact.Components.Bounce
 * @extends Phaser.Physics.Impact.Components.CheckAgainst
 * @extends Phaser.Physics.Impact.Components.Collides
 * @extends Phaser.Physics.Impact.Components.Debug
 * @extends Phaser.Physics.Impact.Components.Friction
 * @extends Phaser.Physics.Impact.Components.Gravity
 * @extends Phaser.Physics.Impact.Components.Offset
 * @extends Phaser.Physics.Impact.Components.SetGameObject
 * @extends Phaser.Physics.Impact.Components.Velocity
 *
 * @param {Phaser.Physics.Impact.World} world - [description]
 * @param {number} x - x - The horizontal position of this physics body in the world.
 * @param {number} y - y - The vertical position of this physics body in the world.
 * @param {number} width - The width of the physics body in the world.
 * @param {number} height - [description]
 */
var ImpactBody = new Class({

    Mixins: [
        Components.Acceleration,
        Components.BodyScale,
        Components.BodyType,
        Components.Bounce,
        Components.CheckAgainst,
        Components.Collides,
        Components.Debug,
        Components.Friction,
        Components.Gravity,
        Components.Offset,
        Components.SetGameObject,
        Components.Velocity
    ],

    initialize:

    function ImpactBody (world, x, y, width, height)
    {
        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactBody#body
         * @type {Phaser.Physics.Impact.Body}
         * @since 3.0.0
         */
        this.body = world.create(x, y, width, height);

        this.body.parent = this;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactBody#size
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.size = this.body.size;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactBody#offset
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.offset = this.body.offset;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactBody#vel
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.vel = this.body.vel;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactBody#accel
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.accel = this.body.accel;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactBody#friction
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.friction = this.body.friction;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactBody#maxVel
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.maxVel = this.body.maxVel;
    }

});

module.exports = ImpactBody;
