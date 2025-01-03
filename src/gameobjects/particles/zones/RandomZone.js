/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Vector2 = require('../../../math/Vector2');

/**
 * @classdesc
 * A zone that places particles randomly within a shapes area.
 *
 * @class RandomZone
 * @memberof Phaser.GameObjects.Particles.Zones
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Particles.RandomZoneSource} source - An object instance with a `getRandomPoint(point)` method.
 */
var RandomZone = new Class({

    initialize:

    function RandomZone (source)
    {
        /**
         * An object instance with a `getRandomPoint(point)` method.
         *
         * @name Phaser.GameObjects.Particles.Zones.RandomZone#source
         * @type {Phaser.Types.GameObjects.Particles.RandomZoneSource}
         * @since 3.0.0
         */
        this.source = source;

        /**
         * Internal calculation vector.
         *
         * @name Phaser.GameObjects.Particles.Zones.RandomZone#_tempVec
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.0.0
         */
        this._tempVec = new Vector2();

        /**
         * The total number of particles this zone will emit before the Emitter
         * transfers control over to the next zone in its emission zone list.
         *
         * By default this is -1, meaning it will never pass over from this
         * zone to another one. You can call the `ParticleEmitter.setEmitZone`
         * method to change it, or set this value to something else via the
         * config, or directly at runtime.
         *
         * A value of 1 would mean the zones rotate in order, but it can
         * be set to any integer value.
         *
         * @name Phaser.GameObjects.Particles.Zones.RandomZone#total
         * @type {number}
         * @since 3.60.0
         */
        this.total = -1;
    },

    /**
     * Get the next point in the Zone and set its coordinates on the given Particle.
     *
     * @method Phaser.GameObjects.Particles.Zones.RandomZone#getPoint
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The Particle.
     */
    getPoint: function (particle)
    {
        var vec = this._tempVec;

        this.source.getRandomPoint(vec);

        particle.x = vec.x;
        particle.y = vec.y;
    }

});

module.exports = RandomZone;
