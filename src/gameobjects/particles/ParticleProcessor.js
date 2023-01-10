/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * This class provides the structured required for all Particle Processors.
 *
 * You should extend it and add the functionality required for your processor,
 * including tidying up any resources this may create in the `destroy` method.
 *
 * See the GravityWell for an example of a processor.
 *
 * @class ParticleProcessor
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.60.0
 *
 * @param {number} [x=0] - The x coordinate of the Particle Processor, in world space.
 * @param {number} [y=0] - The y coordinate of the Particle Processor, in world space.
 * @param {boolean} [active=true] - The active state of this Particle Processor.
 */
var ParticleProcessor = new Class({

    initialize:

    function ParticleProcessor (x, y, active)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (active === undefined) { active = true; }

        /**
         * A reference to the Particle Emitter that owns this Processor.
         * This is set automatically when the Processor is added to an Emitter
         * and nulled when removed or destroyed.
         *
         * @name Phaser.GameObjects.Particles.ParticleProcessor#manager
         * @type {Phaser.GameObjects.Particles.ParticleEmitter}
         * @since 3.60.0
         */
        this.emitter;

        /**
         * The x coordinate of the Particle Processor, in world space.
         *
         * @name Phaser.GameObjects.Particles.ParticleProcessor#x
         * @type {number}
         * @since 3.60.0
         */
        this.x = x;

        /**
         * The y coordinate of the Particle Processor, in world space.
         *
         * @name Phaser.GameObjects.Particles.ParticleProcessor#y
         * @type {number}
         * @since 3.60.0
         */
        this.y = y;

        /**
         * The active state of the Particle Processor.
         *
         * An inactive Particle Processor will be skipped for processing by
         * its parent Emitter.
         *
         * @name Phaser.GameObjects.Particles.ParticleProcessor#active
         * @type {boolean}
         * @since 3.60.0
         */
        this.active = active;
    },

    /**
     * The Particle Processor update method should be overriden by your own
     * method and handle the processing of the particles, typically modifying
     * their velocityX/Y values based on the criteria of this processor.
     *
     * @method Phaser.GameObjects.Particles.ParticleProcessor#update
     * @since 3.60.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The Particle to update.
     * @param {number} delta - The delta time in ms.
     * @param {number} step - The delta value divided by 1000.
     * @param {number} t - The current normalized lifetime of the particle, between 0 (birth) and 1 (death).
     */
    update: function ()
    {
    },

    /**
     * Destroys this Particle Processor by removing all external references.
     *
     * This is called automatically when the owning Particle Emitter is destroyed.
     *
     * @method Phaser.GameObjects.Particles.ParticleProcessor#destroy
     * @since 3.60.0
     */
    destroy: function ()
    {
        this.emitter = null;
    }

});

module.exports = ParticleProcessor;
