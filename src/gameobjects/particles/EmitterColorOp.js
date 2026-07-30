/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
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
 * A specialized emitter op that manages the `color` property of a Particle over
 * its lifetime. Unlike scalar emitter ops, `EmitterColorOp` accepts an array of
 * hexadecimal color values (e.g. `[0xff0000, 0x00ff00, 0x0000ff]`) and smoothly
 * interpolates between them as the particle ages, producing gradient color
 * transitions from birth to death.
 *
 * The color array is decomposed into separate red, green, and blue component
 * arrays on configuration, and a linear interpolation function is used each
 * update step to recombine them into the current packed RGB color value.
 *
 * This class is created and managed automatically by the `ParticleEmitter` when
 * a `color` property is present in the emitter configuration; you do not normally
 * need to instantiate it directly.
 *
 * See the `ParticleEmitter` class for more details on emitter op configuration.
 *
 * @class EmitterColorOp
 * @extends Phaser.GameObjects.Particles.EmitterOp
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.60.0
 *
 * @param {string} key - The name of the property.
 */
var EmitterColorOp = new Class({

    Extends: EmitterOp,

    initialize:

    function EmitterColorOp (key)
    {
        EmitterOp.call(this, key, null, false);

        this.active = false;

        this.easeName = 'Linear';

        /**
         * An array containing the red color values.
         *
         * Populated during the `setMethods` method.
         *
         * @name Phaser.GameObjects.Particles.EmitterColorOp#r
         * @type {number[]}
         * @since 3.60.0
         */
        this.r = [];

        /**
         * An array containing the green color values.
         *
         * Populated during the `setMethods` method.
         *
         * @name Phaser.GameObjects.Particles.EmitterColorOp#g
         * @type {number[]}
         * @since 3.60.0
         */
        this.g = [];

        /**
         * An array containing the blue color values.
         *
         * Populated during the `setMethods` method.
         *
         * @name Phaser.GameObjects.Particles.EmitterColorOp#b
         * @type {number[]}
         * @since 3.60.0
         */
        this.b = [];
    },

    /**
     * Checks the type of `EmitterOp.propertyValue` to determine which
     * method is required in order to return values from this op function.
     *
     * @method Phaser.GameObjects.Particles.EmitterColorOp#getMethod
     * @since 3.60.0
     *
     * @return {number} Either `0` if no color property value is set, or `9` if a color array is configured. The result should be passed to `setMethods`.
     */
    getMethod: function ()
    {
        return (this.propertyValue === null) ? 0 : 9;
    },

    /**
     * Configures the emit and update callbacks for this color op based on the
     * current `method` value. When a color array is present (method 9), it
     * decomposes each packed hex color in `propertyValue` into separate red,
     * green, and blue component arrays, sets up the linear easing and
     * interpolation functions, and assigns the eased emit and update handlers.
     * If no color value is set (method 0), the default no-op handlers are used.
     *
     * @method Phaser.GameObjects.Particles.EmitterColorOp#setMethods
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

            this.r.length = 0;
            this.g.length = 0;
            this.b.length = 0;

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

        return this;
    },

    /**
     * Sets the Ease function to use for Color interpolation.
     *
     * @method Phaser.GameObjects.Particles.EmitterColorOp#setEase
     * @since 3.60.0
     *
     * @param {string} ease - The string-based name of the Ease function to use.
     */
    setEase: function (value)
    {
        this.easeName = value;

        this.ease = GetEaseFunction(value);
    },

    /**
     * An `onEmit` callback for an eased property.
     *
     * It prepares the particle for easing by {@link Phaser.GameObjects.Particles.EmitterColorOp#easeValueUpdate}.
     *
     * @method Phaser.GameObjects.Particles.EmitterColorOp#easedValueEmit
     * @since 3.60.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
     * @param {string} key - The name of the property.
     *
     * @return {number} {@link Phaser.GameObjects.Particles.EmitterColorOp#start}, as the new value of the property.
     */
    easedValueEmit: function ()
    {
        this.current = this.start;

        return this.start;
    },

    /**
     * An `onUpdate` callback that returns an interpolated packed RGB color value
     * across the configured color array, based on the particle's current
     * normalized lifetime.
     *
     * @method Phaser.GameObjects.Particles.EmitterColorOp#easeValueUpdate
     * @since 3.60.0
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
