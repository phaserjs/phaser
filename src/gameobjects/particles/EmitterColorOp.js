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
 * This class is responsible for taking control over the color property
 * in the Particle class and managing its emission and updating functions.
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
     * @return {number} A number between 0 and 9 which should be passed to `setMethods`.
     */
    getMethod: function ()
    {
        return (this.propertyValue === null) ? 0 : 9;
    },

    /**
     * Sets the EmitterColorOp method values, if in use.
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
     * An `onUpdate` callback that returns an eased value between the
     * {@link Phaser.GameObjects.Particles.EmitterColorOp#start} and {@link Phaser.GameObjects.Particles.EmitterColorOp#end}
     * range.
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
