/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var ParticleProcessor = require('./ParticleProcessor');

/**
 * @classdesc
 * The Gravity Well Particle Processor applies a force on the particles to draw
 * them towards, or repel them from, a single point.
 *
 * The force applied is inversely proportional to the square of the distance
 * from the particle to the point, in accordance with Newton's law of gravity.
 *
 * This simulates the effect of gravity over large distances (as between planets, for example).
 *
 * @class GravityWell
 * @extends Phaser.GameObjects.Particles.ParticleProcessor
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 *
 * @param {(number|Phaser.Types.GameObjects.Particles.GravityWellConfig)} [x=0] - The x coordinate of the Gravity Well, in world space.
 * @param {number} [y=0] - The y coordinate of the Gravity Well, in world space.
 * @param {number} [power=0] - The strength of the gravity force - larger numbers produce a stronger force.
 * @param {number} [epsilon=100] - The minimum distance for which the gravity force is calculated.
 * @param {number} [gravity=50] - The gravitational force of this Gravity Well.
 */
var GravityWell = new Class({

    Extends: ParticleProcessor,

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

        ParticleProcessor.call(this, x, y, true);

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
        this._power = power * gravity;

        /**
         * Internal epsilon value.
         *
         * @name Phaser.GameObjects.Particles.GravityWell#_epsilon
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._epsilon = epsilon * epsilon;
    },

    /**
     * Takes a Particle and updates it based on the properties of this Gravity Well.
     *
     * @method Phaser.GameObjects.Particles.GravityWell#update
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The Particle to update.
     * @param {number} delta - The delta time in ms.
     * @param {number} step - The delta value divided by 1000.
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

    /**
     * The minimum distance for which the gravity force is calculated.
     *
     * Defaults to 100.
     *
     * @name Phaser.GameObjects.Particles.GravityWell#epsilon
     * @type {number}
     * @since 3.0.0
     */
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

    /**
     * The strength of the gravity force - larger numbers produce a stronger force.
     *
     * Defaults to 0.
     *
     * @name Phaser.GameObjects.Particles.GravityWell#power
     * @type {number}
     * @since 3.0.0
     */
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

    /**
     * The gravitational force of this Gravity Well.
     *
     * Defaults to 50.
     *
     * @name Phaser.GameObjects.Particles.GravityWell#gravity
     * @type {number}
     * @since 3.0.0
     */
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
