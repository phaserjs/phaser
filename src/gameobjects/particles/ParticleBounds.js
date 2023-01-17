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
 * The Particle Bounds Processor.
 *
 * Defines a rectangular region, in world space, within which particle movement
 * is restrained.
 *
 * Use the properties `collideLeft`, `collideRight`, `collideTop` and
 * `collideBottom` to control if a particle will rebound off the sides
 * of this boundary, or not.
 *
 * This happens when the particles worldPosition x/y coordinate hits the boundary.
 *
 * The strength of the rebound is determined by the `Particle.bounce` property.
 *
 * @class ParticleBounds
 * @extends Phaser.GameObjects.Particles.ParticleProcessor
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.60.0
 *
 * @param {number} x - The x position (top-left) of the bounds, in world space.
 * @param {number} y - The y position (top-left) of the bounds, in world space.
 * @param {number} width - The width of the bounds.
 * @param {number} height - The height of the bounds.
 * @param {boolean} [collideLeft=true] - Whether particles interact with the left edge of the bounds.
 * @param {boolean} [collideRight=true] - Whether particles interact with the right edge of the bounds.
 * @param {boolean} [collideTop=true] - Whether particles interact with the top edge of the bounds.
 * @param {boolean} [collideBottom=true] - Whether particles interact with the bottom edge of the bounds.
 */
var ParticleBounds = new Class({

    Extends: ParticleProcessor,

    initialize:

    function ParticleBounds (x, y, width, height, collideLeft, collideRight, collideTop, collideBottom)
    {
        if (collideLeft === undefined) { collideLeft = true; }
        if (collideRight === undefined) { collideRight = true; }
        if (collideTop === undefined) { collideTop = true; }
        if (collideBottom === undefined) { collideBottom = true; }

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
     * Takes a Particle and updates it against the bounds.
     *
     * @method Phaser.GameObjects.Particles.ParticleBounds#update
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The Particle to update.
     */
    update: function (particle)
    {
        var bounds = this.bounds;
        var bounce = -particle.bounce;
        var pos = particle.worldPosition;

        if (pos.x < bounds.x && this.collideLeft)
        {
            particle.x += bounds.x - pos.x;
            particle.velocityX *= bounce;
        }
        else if (pos.x > bounds.right && this.collideRight)
        {
            particle.x -= pos.x - bounds.right;
            particle.velocityX *= bounce;
        }

        if (pos.y < bounds.y && this.collideTop)
        {
            particle.y += bounds.y - pos.y;
            particle.velocityY *= bounce;
        }
        else if (pos.y > bounds.bottom && this.collideBottom)
        {
            particle.y -= pos.y - bounds.bottom;
            particle.velocityY *= bounce;
        }
    }

});

module.exports = ParticleBounds;
