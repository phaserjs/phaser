var Class = require('../../utils/Class');
var FloatBetween = require('../../math/FloatBetween');
var GetEaseFunction = require('../../tweens/builder/GetEaseFunction');
var GetFastValue = require('../../utils/object/GetFastValue');
var Wrap = require('../../math/Wrap');

var EmitterOp = new Class({

    initialize:

    function EmitterOp (config, key, defaultValue)
    {
        this.propertyKey = key;
        this.propertyValue = GetFastValue(config, key, defaultValue);
        this.defaultValue = defaultValue;

        this.steps = 0;
        this.counter = 0;

        this.start = 0;
        this.end = 0;
        this.ease;

        this.onEmit = this.defaultEmit;
        this.onUpdate = this.defaultUpdate;

        this.setMethods();
    },

    onChange: function (value)
    {
        this.propertyValue = value;

        return this.setMethods();
    },

    setMethods: function ()
    {
        var value = this.propertyValue;

        var t = typeof(value);

        if (t === 'number')
        {
            //  Explicit static value:
            //  x: 400

            this.onEmit = this.staticValueEmit;
            this.onUpdate = this.staticValueUpdate;
        }
        else if (Array.isArray(value))
        {
            //  Picks a random element from the array:
            //  x: [ 100, 200, 300, 400 ]

            this.onEmit = this.randomStaticValueEmit;
        }
        else if (t === 'function')
        {
            //  The same as setting just the onUpdate function and no onEmit
            //  Custom callback, must return a value:

            /*
            x: function (particle, key, t, value)
               {
                   return value + 50;
               }
            */

            this.onUpdate = value;
        }
        else if (t === 'object' && (this.has(value, 'random') || this.hasBoth(value, 'start', 'end') || this.hasBoth(value, 'min', 'max')))
        {
            this.start = (this.has(value, 'start')) ? value.start : value.min;
            this.end = (this.has(value, 'end')) ? value.end : value.max;

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

                var easeType = (this.has(value, 'ease')) ? value.ease : 'Linear';

                this.ease = GetEaseFunction(easeType);

                if (!isRandom)
                {
                    this.onEmit = this.easedValueEmit;
                }

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

    has: function (object, key)
    {
        return (object.hasOwnProperty(key));
    },

    hasBoth: function (object, key1, key2)
    {
        return (object.hasOwnProperty(key1) && object.hasOwnProperty(key2));
    },

    hasEither: function (object, key1, key2)
    {
        return (object.hasOwnProperty(key1) || object.hasOwnProperty(key2));
    },

    //  The returned value sets what the property will be at the START of the particles life, on emit
    defaultEmit: function (particle, key, value)
    {
        return value;
    },

    //  The returned value updates the property for the duration of the particles life
    defaultUpdate: function (particle, key, t, value)
    {
        return value;
    },

    staticValueEmit: function ()
    {
        return this.propertyValue;
    },

    staticValueUpdate: function ()
    {
        return this.propertyValue;
    },

    randomStaticValueEmit: function ()
    {
        var randomIndex = Math.floor(Math.random() * this.propertyValue.length);

        return this.propertyValue[randomIndex];
    },

    randomRangedValueEmit: function (particle, key)
    {
        var value = FloatBetween(this.start, this.end);

        if (particle && particle.data[key])
        {
            particle.data[key].min = value;
        }

        return value;
    },

    steppedEmit: function ()
    {
        var next = this.counter + ((this.end - this.start) / this.steps);

        this.counter = Wrap(next, this.start, this.end);

        return this.counter;
    },

    easedValueEmit: function (particle, key)
    {
        if (particle)
        {
            var data = particle.data[key];

            data.min = this.start;
            data.max = this.end;
        }

        return this.start;
    },

    easeValueUpdate: function (particle, key, t, value)
    {
        var data = particle.data[key];

        return (data.max - data.min) * this.ease(t) + data.min;
    }

});

module.exports = EmitterOp;
