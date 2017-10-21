var GetEaseFunction = require('../../tweens/builder/GetEaseFunction');
var GetValue = require('../../utils/object/GetValue');
var GetFastValue = require('../../utils/object/GetFastValue');
var FloatBetween = require('../../math/FloatBetween');

function hasOnEmit (def)
{
    return (!!def.onEmit && typeof def.onEmit === 'function');
}

function hasOnUpdate (def)
{
    return (!!def.onUpdate && typeof def.onUpdate === 'function');
}

function hasGetters (def)
{
    return hasOnEmit(def) || hasOnUpdate(def);
}

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
    else if (t === 'object' && propertyValue.hasOwnProperty('start') && propertyValue.hasOwnProperty('end'))
    {
        var start = propertyValue.start;
        var end = propertyValue.end;

        //  A random starting value:

        //  x: { start: 100, end: 400, randomStart: true }

        if (propertyValue.hasOwnProperty('randomStart'))
        {
            particleEmit = function ()
            {
                return FloatBetween(start, end);
            };
        }
        else
        {
            particleEmit = function ()
            {
                return start;
            };
        }

        if (propertyValue.hasOwnProperty('steps'))
        {
            //  A stepped (per emit) range

            //  x: { start: 100, end: 400, steps: 64 }

            //  Increments a value stored in the emitter

            particleUpdate = function (particle, key)
            {
                var emitter = particle.emitter;

                return emitter.getNext(key);
            };
        }
        else
        {
            //  An eased range (defaults to Linear if not specified)

            //  x: { start: 100, end: 400, [ ease: 'Linear' ] }

            var ease = (propertyValue.hasOwnProperty('ease')) ? propertyValue.ease : 'Linear';

            var easeFunc = GetEaseFunction(ease);

            particleUpdate = function (particle, key, t, value)
            {
                var data = particle.data[key];

                return data.calc * easeFunc(t) + data.min;
            }
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

        if (hasOnEmit(propertyValue))
        {
            particleEmit = propertyValue.onEmit;
        }

        if (hasOnUpdate(propertyValue))
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
