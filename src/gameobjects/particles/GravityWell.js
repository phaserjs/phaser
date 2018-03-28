/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');

/**
 * @typedef {object} GravityWellConfig
 *
 * @property {number} [x=0] - The x coordinate of the Gravity Well, in world space.
 * @property {number} [y=0] - The y coordinate of the Gravity Well, in world space.
 * @property {number} [power=0] - The power of the Gravity Well.
 * @property {number} [epsilon=100] - [description]
 * @property {number} [gravity=50] - The gravitational force of this Gravity Well.
 */

/**
 * @classdesc
 * [description]
 *
 * @class GravityWell
 * @memberOf Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 *
 * @param {(number|GravityWellConfig)} [x=0] - The x coordinate of the Gravity Well, in world space.
 * @param {number} [y=0] - The y coordinate of the Gravity Well, in world space.
 * @param {number} [power=0] - The power of the Gravity Well.
 * @param {number} [epsilon=100] - [description]
 * @param {number} [gravity=50] - The gravitational force of this Gravity Well.
 */
var GravityWell = new Class({

    initialize:

    function GravityWell (x, y, power, epsilon, gravity)
    {
        if (typeof x === 'object')
        {
            var config = x;

            x = GetFastValue(config, 'x', 0);
            y = GetFastValue(config, 'y', 0);
            power = GetFastValue(config, 'power', 0);
            epsilon = GetFastValue(config, 'epsilon', 100);
            gravity = GetFastValue(config, 'gravity', 50);
        }
        else
        {
            if (x === undefined) { x = 0; }
            if (y === undefined) { y = 0; }
            if (power === undefined) { power = 0; }
            if (epsilon === undefined) { epsilon = 100; }
            if (gravity === undefined) { gravity = 50; }
        }

        /**
         * The x coordinate of the Gravity Well, in world space.
         *
         * @name Phaser.GameObjects.Particles.GravityWell#x
         * @type {number}
         * @since 3.0.0
         */
        this.x = x;

        /**
         * The y coordinate of the Gravity Well, in world space.
         *
         * @name Phaser.GameObjects.Particles.GravityWell#y
         * @type {number}
         * @since 3.0.0
         */
        this.y = y;

        /**
         * The active state of the Gravity Well. An inactive Gravity Well will not influence any particles.
         *
         * @name Phaser.GameObjects.Particles.GravityWell#active
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.active = true;

        /**
         * Internal gravity value.
         *
         * @name Phaser.GameObjects.Particles.GravityWell#_gravity
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._gravity = gravity;

        /**
         * Internal power value.
         *
         * @name Phaser.GameObjects.Particles.GravityWell#_power
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._power = 0;

        /**
         * Internal epsilon value.
         *
         * @name Phaser.GameObjects.Particles.GravityWell#_epsilon
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._epsilon = 0;

        /**
         * The power of the Gravity Well.
         *
         * @name Phaser.GameObjects.Particles.GravityWell#power
         * @type {number}
         * @since 3.0.0
         */
        this.power = power;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.GravityWell#epsilon
         * @type {number}
         * @since 3.0.0
         */
        this.epsilon = epsilon;
    },

    /**
     * Takes a Particle and updates it based on the properties of this Gravity Well.
     *
     * @method Phaser.GameObjects.Particles.GravityWell#update
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The Particle to update.
     * @param {number} delta - The delta time in ms.
     * @param {float} step - The delta value divided by 1000.
     */
    update: function (particle, delta)
    {
        var x = this.x - particle.x;
        var y = this.y - particle.y;
        var dSq = x * x + y * y;

        if (dSq === 0)
        {
            return;
        }

        var d = Math.sqrt(dSq);

        if (dSq < this._epsilon)
        {
            dSq = this._epsilon;
        }

        var factor = ((this._power * delta) / (dSq * d)) * 100;

        particle.velocityX += x * factor;
        particle.velocityY += y * factor;
    },

    epsilon: {

        get: function ()
        {
            return Math.sqrt(this._epsilon);
        },

        set: function (value)
        {
            this._epsilon = value * value;
        }

    },

    power: {

        get: function ()
        {
            return this._power / this._gravity;
        },

        set: function (value)
        {
            this._power = value * this._gravity;
        }

    },

    gravity: {

        get: function ()
        {
            return this._gravity;
        },

        set: function (value)
        {
            var pwr = this.power;
            this._gravity = value;
            this.power = pwr;
        }

    }

});

module.exports = GravityWell;
