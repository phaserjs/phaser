/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var ParticleProcessor = require('./ParticleProcessor');
var Rectangle = require('../../geom/rectangle/Rectangle');

/**
 * @classdesc
 * The Particle Bounds Processor allows particles to rebound off the sides of
 * an invisible Rectangle boundary.
 *
 * @class ParticleBounds
 * @extends Phaser.GameObjects.Particles.ParticleProcessor
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.60.0
 *
 * @param {number} [x=0] - The gravitational force of this Gravity Well.
 */
var ParticleBounds = new Class({

    Extends: ParticleProcessor,

    initialize:

    function ParticleBounds (x, y, width, height, collideLeft, collideRight, collideTop, collideBottom)
    {
        ParticleProcessor.call(this, x, y, true);

        /**
         * A rectangular boundary constraining particle movement. Use the Emitter properties `collideLeft`,
         * `collideRight`, `collideTop` and `collideBottom` to control if a particle will rebound off
         * the sides of this boundary, or not. This happens when the particles x/y coordinate hits
         * the boundary.
         *
         * @name Phaser.GameObjects.Particles.ParticleBounds#bounds
         * @type {Phaser.Geom.Rectangle}
         * @since 3.60.0
         */
        this.bounds = new Rectangle(x, y, width, height);

        /**
         * Whether particles interact with the left edge of the emitter {@link Phaser.GameObjects.Particles.ParticleEmitter#bounds}.
         *
         * @name Phaser.GameObjects.Particles.ParticleBounds#collideLeft
         * @type {boolean}
         * @default true
         * @since 3.60.0
         */
        this.collideLeft = collideLeft;

        /**
         * Whether particles interact with the right edge of the emitter {@link Phaser.GameObjects.Particles.ParticleBounds#bounds}.
         *
         * @name Phaser.GameObjects.Particles.ParticleBounds#collideRight
         * @type {boolean}
         * @default true
         * @since 3.60.0
         */
        this.collideRight = collideRight;

        /**
         * Whether particles interact with the top edge of the emitter {@link Phaser.GameObjects.Particles.ParticleBounds#bounds}.
         *
         * @name Phaser.GameObjects.Particles.ParticleBounds#collideTop
         * @type {boolean}
         * @default true
         * @since 3.60.0
         */
        this.collideTop = collideTop;

        /**
         * Whether particles interact with the bottom edge of the emitter {@link Phaser.GameObjects.Particles.ParticleBounds#bounds}.
         *
         * @name Phaser.GameObjects.Particles.ParticleBounds#collideBottom
         * @type {boolean}
         * @default true
         * @since 3.60.0
         */
        this.collideBottom = collideBottom;
    },

    /**
     * Takes a Particle and updates it based on the properties of this Gravity Well.
     *
     * @method Phaser.GameObjects.Particles.ParticleBounds#update
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The Particle to update.
     * @param {number} delta - The delta time in ms.
     * @param {number} step - The delta value divided by 1000.
     */
    update: function (particle)
    {
        var bounds = this.bounds;
        var bounce = -particle.bounce;

        if (particle.x < bounds.x && this.collideLeft)
        {
            particle.x = bounds.x;
            particle.velocityX *= bounce;
        }
        else if (particle.x > bounds.right && this.collideRight)
        {
            particle.x = bounds.right;
            particle.velocityX *= bounce;
        }

        if (particle.y < bounds.y && this.collideTop)
        {
            particle.y = bounds.y;
            particle.velocityY *= bounce;
        }
        else if (particle.y > bounds.bottom && this.collideBottom)
        {
            particle.y = bounds.bottom;
            particle.velocityY *= bounce;
        }
    }

});

module.exports = ParticleBounds;
