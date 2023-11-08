/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Between = require('../../math/Between');
var Clamp = require('../../math/Clamp');
var Class = require('../../utils/Class');
var FloatBetween = require('../../math/FloatBetween');
var GetEaseFunction = require('../../tweens/builders/GetEaseFunction');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetInterpolationFunction = require('../../tweens/builders/GetInterpolationFunction');
var SnapTo = require('../../math/snap/SnapTo');
var Wrap = require('../../math/Wrap');

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
 * @class EmitterOp
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 *
 * @param {string} key - The name of the property.
 * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} defaultValue - The default value of the property.
 * @param {boolean} [emitOnly=false] - Whether the property can only be modified when a Particle is emitted.
 */
var EmitterOp = new Class({

    initialize:

    function EmitterOp (key, defaultValue, emitOnly)
    {
        if (emitOnly === undefined) { emitOnly = false; }

        /**
         * The name of this property.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#propertyKey
         * @type {string}
         * @since 3.0.0
         */
        this.propertyKey = key;

        /**
         * The current value of this property.
         *
         * This can be a simple value, an array, a function or an onEmit
         * configuration object.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#propertyValue
         * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType}
         * @since 3.0.0
         */
        this.propertyValue = defaultValue;

        /**
         * The default value of this property.
         *
         * This can be a simple value, an array, a function or an onEmit
         * configuration object.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#defaultValue
         * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType}
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
         * When the step counter reaches it's maximum, should it then
         * yoyo back to the start again, or flip over to it?
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#yoyo
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.yoyo = false;

        /**
         * The counter direction. 0 for up and 1 for down.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#direction
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.direction = 0;

        /**
         * The start value for this property to ease between.
         *
         * If an interpolation this holds a reference to the number data array.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#start
         * @type {number|number[]}
         * @default 0
         * @since 3.0.0
         */
        this.start = 0;

        /**
         * The most recently calculated value. Updated every time an
         * emission or update method is called. Treat as read-only.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#current
         * @type {number}
         * @since 3.60.0
         */
        this.current = 0;

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
         * The easing function to use for updating this property, if any.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#ease
         * @type {?function}
         * @since 3.0.0
         */
        this.ease = null;

        /**
         * The interpolation function to use for updating this property, if any.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#interpolation
         * @type {?function}
         * @since 3.60.0
         */
        this.interpolation = null;

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
         * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback}
         * @since 3.0.0
         */
        this.onEmit = this.defaultEmit;

        /**
         * The callback to run for Particles when they are updated.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#onUpdate
         * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateCallback}
         * @since 3.0.0
         */
        this.onUpdate = this.defaultUpdate;

        /**
         * Set to `false` to disable this EmitterOp.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#active
         * @type {boolean}
         * @since 3.60.0
         */
        this.active = true;

        /**
         * The onEmit method type of this EmitterOp.
         *
         * Set as part of `setMethod` and cached here to avoid
         * re-setting when only the value changes.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#method
         * @type {number}
         * @since 3.60.0
         */
        this.method = 0;

        /**
         * The callback to run for Particles when they are emitted from the Particle Emitter.
         * This is set during `setMethods` and used by `proxyEmit`.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#_onEmit
         * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback}
         * @private
         * @since 3.60.0
         */
        this._onEmit;

        /**
         * The callback to run for Particles when they are updated.
         * This is set during `setMethods` and used by `proxyUpdate`.
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#_onUpdate
         * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateCallback}
         * @private
         * @since 3.60.0
         */
        this._onUpdate;
    },

    /**
     * Load the property from a Particle Emitter configuration object.
     *
     * Optionally accepts a new property key to use, replacing the current one.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#loadConfig
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} [config] - Settings for the Particle Emitter that owns this property.
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

        this.method = this.getMethod();

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
        return JSON.stringify(this.propertyValue);
    },

    /**
     * Change the current value of the property and update its callback methods.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#onChange
     * @since 3.0.0
     *
     * @param {number} value - The new numeric value of this property.
     *
     * @return {this} This Emitter Op object.
     */
    onChange: function (value)
    {
        var current;

        switch (this.method)
        {
            //  Number
            //  Custom Callback (onEmit only)
            //  Custom onEmit and/or onUpdate callbacks
            case 1:
            case 3:
            case 8:
                current = value;
                break;

            //  Random Array
            case 2:
                if (this.propertyValue.indexOf(value) >= 0)
                {
                    current = value;
                }
                break;

            //  Stepped start/end
            case 4:
                var step = (this.end - this.start) / this.steps;
                current = SnapTo(value, step);
                this.counter = current;
                break;

            //  Eased start/end
            //  min/max (random float or int)
            //  Random object (random integer)
            case 5:
            case 6:
            case 7:
                current = Clamp(value, this.start, this.end);
                break;

            //  Interpolation
            case 9:
                current = this.start[0];
                break;
        }

        this.current = current;

        return this;
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
        var value = this.propertyValue;

        //  `moveToX` and `moveToY` are null by default
        if (value === null)
        {
            return 0;
        }

        var t = typeof value;

        if (t === 'number')
        {
            //  Number
            return 1;
        }
        else if (Array.isArray(value))
        {
            //  Random Array
            return 2;
        }
        else if (t === 'function')
        {
            //  Custom Callback
            return 3;
        }
        else if (t === 'object')
        {
            if (this.hasBoth(value, 'start', 'end'))
            {
                if (this.has(value, 'steps'))
                {
                    //  Stepped start/end
                    return 4;
                }
                else
                {
                    //  Eased start/end
                    return 5;
                }
            }
            else if (this.hasBoth(value, 'min', 'max'))
            {
                //  min/max
                return 6;
            }
            else if (this.has(value, 'random'))
            {
                //  Random object
                return 7;
            }
            else if (this.hasEither(value, 'onEmit', 'onUpdate'))
            {
                //  Custom onEmit onUpdate
                return 8;
            }
            else if (this.hasEither(value, 'values', 'interpolation'))
            {
                //  Interpolation
                return 9;
            }
        }

        return 0;
    },

    /**
     * Update the {@link Phaser.GameObjects.Particles.EmitterOp#onEmit} and
     * {@link Phaser.GameObjects.Particles.EmitterOp#onUpdate} callbacks based on the method returned
     * from `getMethod`. The method is stored in the `EmitterOp.method` property
     * and is a number between 0 and 9 inclusively.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#setMethods
     * @since 3.0.0
     *
     * @return {this} This Emitter Op object.
     */
    setMethods: function ()
    {
        var value = this.propertyValue;
        var current = value;

        var onEmit = this.defaultEmit;
        var onUpdate = this.defaultUpdate;

        switch (this.method)
        {
            //  Number
            case 1:
                onEmit = this.staticValueEmit;
                break;

            //  Random Array
            case 2:
                onEmit = this.randomStaticValueEmit;
                current = value[0];
                break;

            //  Custom Callback (onEmit only)
            case 3:
                this._onEmit = value;
                onEmit = this.proxyEmit;
                break;

            //  Stepped start/end
            case 4:
                this.start = value.start;
                this.end = value.end;
                this.steps = value.steps;
                this.counter = this.start;
                this.yoyo = this.has(value, 'yoyo') ? value.yoyo : false;
                this.direction = 0;
                onEmit = this.steppedEmit;
                current = this.start;
                break;

            //  Eased start/end
            case 5:
                this.start = value.start;
                this.end = value.end;
                var easeType = this.has(value, 'ease') ? value.ease : 'Linear';
                this.ease = GetEaseFunction(easeType, value.easeParams);
                onEmit = (this.has(value, 'random') && value.random) ? this.randomRangedValueEmit : this.easedValueEmit;
                onUpdate = this.easeValueUpdate;
                current = this.start;
                break;

            //  min/max (random float or int)
            case 6:
                this.start = value.min;
                this.end = value.max;
                onEmit = (this.has(value, 'int') && value.int) ? this.randomRangedIntEmit : this.randomRangedValueEmit;
                current = this.start;
                break;

            //  Random object (random integer)
            case 7:
                var rnd = value.random;

                if (Array.isArray(rnd))
                {
                    this.start = rnd[0];
                    this.end = rnd[1];
                }

                onEmit = this.randomRangedIntEmit;
                current = this.start;
                break;

            //  Custom onEmit and/or onUpdate callbacks
            case 8:
                this._onEmit = (this.has(value, 'onEmit')) ? value.onEmit : this.defaultEmit;
                this._onUpdate = (this.has(value, 'onUpdate')) ? value.onUpdate : this.defaultUpdate;
                onEmit = this.proxyEmit;
                onUpdate = this.proxyUpdate;
                break;

            //  Interpolation
            case 9:
                this.start = value.values;
                var easeTypeI = this.has(value, 'ease') ? value.ease : 'Linear';
                this.ease = GetEaseFunction(easeTypeI, value.easeParams);
                this.interpolation = GetInterpolationFunction(value.interpolation);
                onEmit = this.easedValueEmit;
                onUpdate = this.easeValueUpdate;
                current = this.start[0];
                break;
        }

        this.onEmit = onEmit;
        this.onUpdate = onUpdate;
        this.current = current;

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
     * @return {number} The new value of the property.
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
     * @param {number} t - The current normalized lifetime of the particle, between 0 (birth) and 1 (death).
     * @param {number} value - The current value of the property.
     *
     * @return {number} The new value of the property.
     */
    defaultUpdate: function (particle, key, t, value)
    {
        return value;
    },

    /**
     * The returned value sets what the property will be at the START of the particles life, on emit.
     *
     * This method is only used when you have provided a custom emit callback.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#proxyEmit
     * @since 3.60.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
     * @param {string} key - The name of the property.
     * @param {number} [value] - The current value of the property.
     *
     * @return {number} The new value of the property.
     */
    proxyEmit: function (particle, key, value)
    {
        var result = this._onEmit(particle, key, value);

        this.current = result;

        return result;
    },

    /**
     * The returned value updates the property for the duration of the particles life.
     *
     * This method is only used when you have provided a custom update callback.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#proxyUpdate
     * @since 3.60.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
     * @param {string} key - The name of the property.
     * @param {number} t - The current normalized lifetime of the particle, between 0 (birth) and 1 (death).
     * @param {number} value - The current value of the property.
     *
     * @return {number} The new value of the property.
     */
    proxyUpdate: function (particle, key, t, value)
    {
        var result = this._onUpdate(particle, key, t, value);

        this.current = result;

        return result;
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
        return this.current;
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
        return this.current;
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

        this.current = this.propertyValue[randomIndex];

        return this.current;
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
            particle.data[key].max = this.end;
        }

        this.current = value;

        return value;
    },

    /**
     * An `onEmit` callback that returns a value between the {@link Phaser.GameObjects.Particles.EmitterOp#start} and
     * {@link Phaser.GameObjects.Particles.EmitterOp#end} range.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#randomRangedIntEmit
     * @since 3.60.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
     * @param {string} key - The key of the property.
     *
     * @return {number} The new value of the property.
     */
    randomRangedIntEmit: function (particle, key)
    {
        var value = Between(this.start, this.end);

        if (particle && particle.data[key])
        {
            particle.data[key].min = value;
            particle.data[key].max = this.end;
        }

        this.current = value;

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

        var next = current;

        var step = (this.end - this.start) / this.steps;

        if (this.yoyo)
        {
            var over;

            if (this.direction === 0)
            {
                //  Add step to the current value
                next += step;

                if (next >= this.end)
                {
                    over = next - this.end;

                    next = this.end - over;

                    this.direction = 1;
                }
            }
            else
            {
                //  Down
                next -= step;

                if (next <= this.start)
                {
                    over = this.start - next;

                    next = this.start + over;

                    this.direction = 0;
                }
            }

            this.counter = next;
        }
        else
        {
            this.counter = Wrap(next + step, this.start, this.end);
        }

        this.current = current;

        return current;
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
    easedValueEmit: function (particle, key)
    {
        if (particle && particle.data[key])
        {
            var data = particle.data[key];

            data.min = this.start;
            data.max = this.end;
        }

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
        var data = particle.data[key];

        var current;
        var v = this.ease(t);

        if (this.interpolation)
        {
            current = this.interpolation(this.start, v);
        }
        else
        {
            current = (data.max - data.min) * v + data.min;
        }

        this.current = current;

        return current;
    },

    /**
     * Destroys this EmitterOp instance and all of its references.
     *
     * Called automatically when the ParticleEmitter that owns this
     * EmitterOp is destroyed.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#destroy
     * @since 3.60.0
     */
    destroy: function ()
    {
        this.propertyValue = null;
        this.defaultValue = null;
        this.ease = null;
        this.interpolation = null;
        this._onEmit = null;
        this._onUpdate = null;
    }
});

module.exports = EmitterOp;
