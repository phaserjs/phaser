/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var FloatBetween = require('../../math/FloatBetween');
var GetEaseFunction = require('../../tweens/builders/GetEaseFunction');
var GetFastValue = require('../../utils/object/GetFastValue');
var Wrap = require('../../math/Wrap');

/**
 * The returned value sets what the property will be at the START of the particle's life, on emit.
 * @callback EmitterOpOnEmitCallback
 *
 * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
 * @param {string} key - The name of the property.
 * @param {number} value - The current value of the property.
 *
 * @return {number} The new value of the property.
 */

/**
 * The returned value updates the property for the duration of the particle's life.
 * @callback EmitterOpOnUpdateCallback
 *
 * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
 * @param {string} key - The name of the property.
 * @param {number} t - The normalized lifetime of the particle, between 0 (start) and 1 (end).
 * @param {number} value - The current value of the property.
 *
 * @return {number} The new value of the property.
 */

/**
 * Defines an operation yielding a random value within a range.
 * @typedef {object} EmitterOpRandomConfig
 *
 * @property {number[]} random - The minimum and maximum values, as [min, max].
 */

/**
 * Defines an operation yielding a random value within a range.
 * @typedef {object} EmitterOpRandomMinMaxConfig
 *
 * @property {number} min - The minimum value.
 * @property {number} max - The maximum value.
 */

/**
 * Defines an operation yielding a random value within a range.
 * @typedef {object} EmitterOpRandomStartEndConfig
 *
 * @property {number} start - The starting value.
 * @property {number} end - The ending value.
 * @property {boolean} random - If false, this becomes {@link EmitterOpEaseConfig}.
 */

/**
 * Defines an operation yielding a value incremented continuously across a range.
 * @typedef {object} EmitterOpEaseConfig
 *
 * @property {number} start - The starting value.
 * @property {number} end - The ending value.
 * @property {string} [ease='Linear'] - The name of the easing function.
 */

/**
 * Defines an operation yielding a value incremented by steps across a range.
 * @typedef {object} EmitterOpSteppedConfig
 *
 * @property {number} start - The starting value.
 * @property {number} end - The ending value.
 * @property {number} steps - The number of steps between start and end.
 */

/**
 * @typedef {object} EmitterOpCustomEmitConfig
 *
 * @property {EmitterOpOnEmitCallback} onEmit - A callback that is invoked each time the emitter emits a particle.
 */

/**
 * @typedef {object} EmitterOpCustomUpdateConfig
 *
 * @property {EmitterOpOnEmitCallback} [onEmit] - A callback that is invoked each time the emitter emits a particle.
 * @property {EmitterOpOnUpdateCallback} onUpdate - A callback that is invoked each time the emitter updates.
 */

/**
 * @classdesc
 * A Particle Emitter property.
 *
 * Facilitates changing Particle properties as they are emitted and throughout their lifetime.
 *
 * @class EmitterOp
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 *
 * @param {ParticleEmitterConfig} config - Settings for the Particle Emitter that owns this property.
 * @param {string} key - The name of the property.
 * @param {number} defaultValue - The default value of the property.
 * @param {boolean} [emitOnly=false] - Whether the property can only be modified when a Particle is emitted.
 */
var EmitterOp = new Class({

    initialize:

    function EmitterOp (config, key, defaultValue, emitOnly)
    {
        if (emitOnly === undefined)
        {
            emitOnly = false;
        }

        /**
         * The name of this property.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#propertyKey
         * @type {string}
         * @since 3.0.0
         */
        this.propertyKey = key;

        /**
         * The value of this property.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#propertyValue
         * @type {number}
         * @since 3.0.0
         */
        this.propertyValue = defaultValue;

        /**
         * The default value of this property.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#defaultValue
         * @type {number}
         * @since 3.0.0
         */
        this.defaultValue = defaultValue;

        /**
         * The number of steps for stepped easing between {@link Phaser.GameObjects.Particles.EmitterOp#start} and
         * {@link Phaser.GameObjects.Particles.EmitterOp#end} values, per emit.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#steps
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.steps = 0;

        /**
         * The step counter for stepped easing, per emit.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#counter
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.counter = 0;

        /**
         * The start value for this property to ease between.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#start
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.start = 0;

        /**
         * The end value for this property to ease between.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#end
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.end = 0;

        /**
         * The easing function to use for updating this property.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#ease
         * @type {?function}
         * @since 3.0.0
         */
        this.ease;

        /**
         * Whether this property can only be modified when a Particle is emitted.
         *
         * Set to `true` to allow only {@link Phaser.GameObjects.Particles.EmitterOp#onEmit} callbacks to be set and
         * affect this property.
         *
         * Set to `false` to allow both {@link Phaser.GameObjects.Particles.EmitterOp#onEmit} and
         * {@link Phaser.GameObjects.Particles.EmitterOp#onUpdate} callbacks to be set and affect this property.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#emitOnly
         * @type {boolean}
         * @since 3.0.0
         */
        this.emitOnly = emitOnly;

        /**
         * The callback to run for Particles when they are emitted from the Particle Emitter.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#onEmit
         * @type {EmitterOpOnEmitCallback}
         * @since 3.0.0
         */
        this.onEmit = this.defaultEmit;

        /**
         * The callback to run for Particles when they are updated.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#onUpdate
         * @type {EmitterOpOnUpdateCallback}
         * @since 3.0.0
         */
        this.onUpdate = this.defaultUpdate;

        this.loadConfig(config);
    },

    /**
     * Load the property from a Particle Emitter configuration object.
     *
     * Optionally accepts a new property key to use, replacing the current one.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#loadConfig
     * @since 3.0.0
     *
     * @param {ParticleEmitterConfig} [config] - Settings for the Particle Emitter that owns this property.
     * @param {string} [newKey] - The new key to use for this property, if any.
     */
    loadConfig: function (config, newKey)
    {
        if (config === undefined)
        {
            config = {};
        }

        if (newKey)
        {
            this.propertyKey = newKey;
        }

        this.propertyValue = GetFastValue(
            config,
            this.propertyKey,
            this.defaultValue
        );

        this.setMethods();

        if (this.emitOnly)
        {
            //  Reset it back again
            this.onUpdate = this.defaultUpdate;
        }
    },

    /**
     * Build a JSON representation of this Particle Emitter property.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#toJSON
     * @since 3.0.0
     *
     * @return {object} A JSON representation of this Particle Emitter property.
     */
    toJSON: function ()
    {
        return this.propertyValue;
    },

    /**
     * Change the current value of the property and update its callback methods.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#onChange
     * @since 3.0.0
     *
     * @param {number} value - The value of the property.
     *
     * @return {Phaser.GameObjects.Particles.EmitterOp} This Emitter Op object.
     */
    onChange: function (value)
    {
        this.propertyValue = value;

        return this.setMethods();
    },

    /**
     * Update the {@link Phaser.GameObjects.Particles.EmitterOp#onEmit} and
     * {@link Phaser.GameObjects.Particles.EmitterOp#onUpdate} callbacks based on the type of the current
     * {@link Phaser.GameObjects.Particles.EmitterOp#propertyValue}.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#setMethods
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Particles.EmitterOp} This Emitter Op object.
     */
    setMethods: function ()
    {
        var value = this.propertyValue;

        var t = typeof value;

        if (t === 'number')
        {
            //  Explicit static value:
            //  x: 400

            this.onEmit = this.staticValueEmit;
            this.onUpdate = this.staticValueUpdate; // How?
        }
        else if (Array.isArray(value))
        {
            //  Picks a random element from the array:
            //  x: [ 100, 200, 300, 400 ]

            this.onEmit = this.randomStaticValueEmit;
        }
        else if (t === 'function')
        {
            //  The same as setting just the onUpdate function and no onEmit (unless this op is an emitOnly one)
            //  Custom callback, must return a value:

            /*
            x: function (particle, key, t, value)
               {
                   return value + 50;
               }
            */

            if (this.emitOnly)
            {
                this.onEmit = value;
            }
            else
            {
                this.onUpdate = value;
            }
        }
        else if (t === 'object' && (this.has(value, 'random') || this.hasBoth(value, 'start', 'end') || this.hasBoth(value, 'min', 'max')))
        {
            this.start = this.has(value, 'start') ? value.start : value.min;
            this.end = this.has(value, 'end') ? value.end : value.max;

            var isRandom = (this.hasBoth(value, 'min', 'max') || this.has(value, 'random'));

            //  A random starting value (using 'min | max' instead of 'start | end' automatically implies a random value)

            //  x: { start: 100, end: 400, random: true } OR { min: 100, max: 400 } OR { random: [ 100, 400 ] }

            if (isRandom)
            {
                var rnd = value.random;

                //  x: { random: [ 100, 400 ] } = the same as doing: x: { start: 100, end: 400, random: true }
                if (Array.isArray(rnd))
                {
                    this.start = rnd[0];
                    this.end = rnd[1];
                }

                this.onEmit = this.randomRangedValueEmit;
            }

            if (this.has(value, 'steps'))
            {
                //  A stepped (per emit) range

                //  x: { start: 100, end: 400, steps: 64 }

                //  Increments a value stored in the emitter

                this.steps = value.steps;
                this.counter = this.start;

                this.onEmit = this.steppedEmit;
            }
            else
            {
                //  An eased range (defaults to Linear if not specified)

                //  x: { start: 100, end: 400, [ ease: 'Linear' ] }

                var easeType = this.has(value, 'ease') ? value.ease : 'Linear';

                this.ease = GetEaseFunction(easeType);

                if (!isRandom)
                {
                    this.onEmit = this.easedValueEmit;
                }

                //  BUG: alpha, rotate, scaleX, scaleY, or tint are eased here if {min, max} is given.
                //  Probably this branch should exclude isRandom entirely.

                this.onUpdate = this.easeValueUpdate;
            }
        }
        else if (t === 'object' && this.hasEither(value, 'onEmit', 'onUpdate'))
        {
            //  Custom onEmit and onUpdate callbacks

            /*
            x: {
                //  Called at the start of the particles life, when it is being created
                onEmit: function (particle, key, t, value)
                {
                    return value;
                },

                //  Called during the particles life on each update
                onUpdate: function (particle, key, t, value)
                {
                    return value;
                }
            }
            */

            if (this.has(value, 'onEmit'))
            {
                this.onEmit = value.onEmit;
            }

            if (this.has(value, 'onUpdate'))
            {
                this.onUpdate = value.onUpdate;
            }
        }

        return this;
    },

    /**
     * Check whether an object has the given property.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#has
     * @since 3.0.0
     *
     * @param {object} object - The object to check.
     * @param {string} key - The key of the property to look for in the object.
     *
     * @return {boolean} `true` if the property exists in the object, `false` otherwise.
     */
    has: function (object, key)
    {
        return object.hasOwnProperty(key);
    },

    /**
     * Check whether an object has both of the given properties.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#hasBoth
     * @since 3.0.0
     *
     * @param {object} object - The object to check.
     * @param {string} key1 - The key of the first property to check the object for.
     * @param {string} key2 - The key of the second property to check the object for.
     *
     * @return {boolean} `true` if both properties exist in the object, `false` otherwise.
     */
    hasBoth: function (object, key1, key2)
    {
        return object.hasOwnProperty(key1) && object.hasOwnProperty(key2);
    },

    /**
     * Check whether an object has at least one of the given properties.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#hasEither
     * @since 3.0.0
     *
     * @param {object} object - The object to check.
     * @param {string} key1 - The key of the first property to check the object for.
     * @param {string} key2 - The key of the second property to check the object for.
     *
     * @return {boolean} `true` if at least one of the properties exists in the object, `false` if neither exist.
     */
    hasEither: function (object, key1, key2)
    {
        return object.hasOwnProperty(key1) || object.hasOwnProperty(key2);
    },

    /**
     * The returned value sets what the property will be at the START of the particles life, on emit.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#defaultEmit
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
     * @param {string} key - The name of the property.
     * @param {number} [value] - The current value of the property.
     *
     * @return {number} The new value of hte property.
     */
    defaultEmit: function (particle, key, value)
    {
        return value;
    },

    /**
     * The returned value updates the property for the duration of the particles life.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#defaultUpdate
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
     * @param {string} key - The name of the property.
     * @param {number} t - The T value (between 0 and 1)
     * @param {number} value - The current value of the property.
     *
     * @return {number} The new value of the property.
     */
    defaultUpdate: function (particle, key, t, value)
    {
        return value;
    },

    /**
     * An `onEmit` callback that returns the current value of the property.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#staticValueEmit
     * @since 3.0.0
     *
     * @return {number} The current value of the property.
     */
    staticValueEmit: function ()
    {
        return this.propertyValue;
    },

    /**
     * An `onUpdate` callback that returns the current value of the property.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#staticValueUpdate
     * @since 3.0.0
     *
     * @return {number} The current value of the property.
     */
    staticValueUpdate: function ()
    {
        return this.propertyValue;
    },

    /**
     * An `onEmit` callback that returns a random value from the current value array.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#randomStaticValueEmit
     * @since 3.0.0
     *
     * @return {number} The new value of the property.
     */
    randomStaticValueEmit: function ()
    {
        var randomIndex = Math.floor(Math.random() * this.propertyValue.length);

        return this.propertyValue[randomIndex];
    },

    /**
     * An `onEmit` callback that returns a value between the {@link Phaser.GameObjects.Particles.EmitterOp#start} and
     * {@link Phaser.GameObjects.Particles.EmitterOp#end} range.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#randomRangedValueEmit
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
     * @param {string} key - The key of the property.
     *
     * @return {number} The new value of the property.
     */
    randomRangedValueEmit: function (particle, key)
    {
        var value = FloatBetween(this.start, this.end);

        if (particle && particle.data[key])
        {
            particle.data[key].min = value;
        }

        return value;
    },

    /**
     * An `onEmit` callback that returns a stepped value between the
     * {@link Phaser.GameObjects.Particles.EmitterOp#start} and {@link Phaser.GameObjects.Particles.EmitterOp#end}
     * range.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#steppedEmit
     * @since 3.0.0
     *
     * @return {number} The new value of the property.
     */
    steppedEmit: function ()
    {
        var current = this.counter;

        var next = this.counter + (this.end - this.start) / this.steps;

        this.counter = Wrap(next, this.start, this.end);

        return current;
    },

    /**
     * An `onEmit` callback that returns an eased value between the
     * {@link Phaser.GameObjects.Particles.EmitterOp#start} and {@link Phaser.GameObjects.Particles.EmitterOp#end}
     * range.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#easedValueEmit
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
     * @param {string} key - The name of the property.
     *
     * @return {number} The new value of the property.
     */
    easedValueEmit: function (particle, key)
    {
        if (particle && particle.data[key])
        {
            var data = particle.data[key];

            data.min = this.start;
            data.max = this.end;
        }

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
     * @param {number} t - The T value (between 0 and 1)
     *
     * @return {number} The new value of the property.
     */
    easeValueUpdate: function (particle, key, t)
    {
        var data = particle.data[key];

        return (data.max - data.min) * this.ease(t) + data.min;
    }
});

module.exports = EmitterOp;
