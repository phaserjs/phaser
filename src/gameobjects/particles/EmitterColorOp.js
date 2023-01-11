/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var EmitterOp = require('./EmitterOp');
var GetColor = require('../../display/color/GetColor');
var GetEaseFunction = require('../../tweens/builders/GetEaseFunction');
var GetInterpolationFunction = require('../../tweens/builders/GetInterpolationFunction');
var IntegerToRGB = require('../../display/color/IntegerToRGB');

/**
 * @classdesc
 * This class is responsible for taking control over a single property
 * in the Particle class and managing its emission and updating functions.
 *
 * Particles properties such as `x`, `y`, `scaleX`, `lifespan` and others all use
 * EmitterOp instances to manage them, as they can be given in a variety of
 * formats: from simple values, to functions, to dynamic callbacks.
 *
 * See the `ParticleEmitter` class for more details on emitter op configuration.
 *
 * @class EmitterColorOp
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 *
 * @param {string} key - The name of the property.
 * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} defaultValue - The default value of the property.
 * @param {boolean} [emitOnly=false] - Whether the property can only be modified when a Particle is emitted.
 */
var EmitterColorOp = new Class({

    Extends: EmitterOp,

    initialize:

    function EmitterColorOp (key)
    {
        EmitterOp.call(this, key, null, false);

        this.active = false;

        /**
         * An array containing the red color values.
         *
         * Populated during the `setMethods` method.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#r
         * @type {number[]}
         * @since 3.60.0
         */
        this.r = [];

        /**
         * An array containing the green color values.
         *
         * Populated during the `setMethods` method.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#g
         * @type {number[]}
         * @since 3.60.0
         */
        this.g = [];

        /**
         * An array containing the blue color values.
         *
         * Populated during the `setMethods` method.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#b
         * @type {number[]}
         * @since 3.60.0
         */
        this.b = [];
    },

    /**
     * Checks the type of `EmitterOp.propertyValue` to determine which
     * method is required in order to return values from this op function.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#getMethod
     * @since 3.60.0
     *
     * @return {number} A number between 0 and 9 which should be passed to `setMethods`.
     */
    getMethod: function ()
    {
        return (this.propertyValue === null) ? 0 : 9;
    },

    /**
     * A NOOP for EmitterColorOp
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#setMethods
     * @since 3.60.0
     *
     * @return {this} This Emitter Op object.
     */
    setMethods: function ()
    {
        var value = this.propertyValue;
        var current = value;

        var onEmit = this.defaultEmit;
        var onUpdate = this.defaultUpdate;

        if (this.method === 9)
        {
            this.start = value[0];
            this.ease = GetEaseFunction('Linear');
            this.interpolation = GetInterpolationFunction('linear');

            onEmit = this.easedValueEmit;
            onUpdate = this.easeValueUpdate;
            current = value[0];

            this.active = true;

            //  Populate the r,g,b arrays
            for (var i = 0; i < value.length; i++)
            {
                //  in hex format 0xff0000
                var color = IntegerToRGB(value[i]);

                this.r.push(color.r);
                this.g.push(color.g);
                this.b.push(color.b);
            }
        }

        this.onEmit = onEmit;
        this.onUpdate = onUpdate;
        this.current = current;
    },

    /**
     * An `onEmit` callback for an eased property.
     *
     * It prepares the particle for easing by {@link Phaser.GameObjects.Particles.EmitterOp#easeValueUpdate}.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#easedValueEmit
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
     * @param {string} key - The name of the property.
     *
     * @return {number} {@link Phaser.GameObjects.Particles.EmitterOp#start}, as the new value of the property.
     */
    easedValueEmit: function ()
    {
        this.current = this.start;

        return this.start;
    },

    /**
     * An `onUpdate` callback that returns an eased value between the
     * {@link Phaser.GameObjects.Particles.EmitterOp#start} and {@link Phaser.GameObjects.Particles.EmitterOp#end}
     * range.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#easeValueUpdate
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
     * @param {string} key - The name of the property.
     * @param {number} t - The current normalized lifetime of the particle, between 0 (birth) and 1 (death).
     *
     * @return {number} The new value of the property.
     */
    easeValueUpdate: function (particle, key, t)
    {
        var v = this.ease(t);

        var r = this.interpolation(this.r, v);
        var g = this.interpolation(this.g, v);
        var b = this.interpolation(this.b, v);

        var current = GetColor(r, g, b);

        this.current = current;

        return current;
    }

});

module.exports = EmitterColorOp;
