var FloatBetween = require('../../math/FloatBetween');
var GetEaseFunction = require('../../tweens/builder/GetEaseFunction');
var GetFastValue = require('../../utils/object/GetFastValue');
var Wrap = require('../../math/Wrap');

function has (object, key)
{
    return (object.hasOwnProperty(key));
}

function hasBoth (object, key1, key2)
{
    return (object.hasOwnProperty(key1) && object.hasOwnProperty(key2));
}

function hasGetters (def)
{
    return (has(def, 'onEmit')) || (has(def, 'onUpdate'));
}

var steps = 0;
var counter = 0;

var GetValueOp = function (config, key, defaultValue)
{
    var propertyValue = GetFastValue(config, key, defaultValue);

    //  The returned value sets what the property will be at the START of the particles life, on emit
    var particleEmit = function (particle, key, value) { return value; };

    //  The returned value updates the property for the duration of the particles life
    var particleUpdate = function (particle, key, t, value) { return value; };

    var t = typeof(propertyValue);

    if (t === 'number')
    {
        //  Explicit static value:

        //  x: 400

        particleEmit = function ()
        {
            return propertyValue;
        };

        particleUpdate = function ()
        {
            return propertyValue;
        };
    }
    else if (Array.isArray(propertyValue))
    {
        //  Picks a random element from the array:

        //  x: [ 100, 200, 300, 400 ]

        particleEmit = function ()
        {
            var randomIndex = Math.floor(Math.random() * propertyValue.length);

            return propertyValue[randomIndex];
        };
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

        particleUpdate = propertyValue;
    }
    else if (t === 'object' && (has(propertyValue, 'random') || hasBoth(propertyValue, 'start', 'end') || hasBoth(propertyValue, 'min', 'max')))
    {
        var start = (propertyValue.hasOwnProperty('start')) ? propertyValue.start : propertyValue.min;
        var end = (propertyValue.hasOwnProperty('end')) ? propertyValue.end : propertyValue.max;
        var isRandom = false;

        //  A random starting value:

        //  x: { start: 100, end: 400, random: true } OR { min: 100, max: 400, random: true } OR { random: [ 100, 400 ] }

        if (has(propertyValue, 'random'))
        {
            isRandom = true;

            var rnd = propertyValue.random;

            //  x: { random: [ 100, 400 ] } = the same as doing: x: { start: 100, end: 400, random: true }
            if (Array.isArray(rnd))
            {
                start = rnd[0];
                end = rnd[1];
            }

            particleEmit = function (particle, key)
            {
                var data = particle.data[key];

                var value = FloatBetween(start, end);

                data.min = value;

                return value;
            };
        }

        if (has(propertyValue, 'steps'))
        {
            //  A stepped (per emit) range

            //  x: { start: 100, end: 400, steps: 64 }

            //  Increments a value stored in the emitter

            steps = propertyValue.steps;
            counter = start;

            particleEmit = function ()
            {
                var value = counter;

                var i = value + ((end - start) / steps);

                counter = Wrap(i, start, end);

                return counter;
            };
        }
        else
        {
            //  An eased range (defaults to Linear if not specified)

            //  x: { start: 100, end: 400, [ ease: 'Linear' ] }

            var ease = (propertyValue.hasOwnProperty('ease')) ? propertyValue.ease : 'Linear';

            var easeFunc = GetEaseFunction(ease);

            if (!isRandom)
            {
                particleEmit = function (particle, key)
                {
                    var data = particle.data[key];

                    data.min = start;
                    data.max = end;

                    return start;
                };
            }

            particleUpdate = function (particle, key, t, value)
            {
                var data = particle.data[key];

                return (data.max - data.min) * easeFunc(t) + data.min;
            };
        }
    }
    else if (t === 'object' && hasGetters(propertyValue))
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

        if (has(propertyValue, 'onEmit'))
        {
            particleEmit = propertyValue.onEmit;
        }

        if (has(propertyValue, 'onUpdate'))
        {
            particleUpdate = propertyValue.onUpdate;
        }
    }

    return {
        onEmit: particleEmit,
        onUpdate: particleUpdate
    };
};

module.exports = GetValueOp;
