var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');

var GravityWell = new Class({

    initialize:

    function GravityWell (x, y, power, epsilon, gravity)
    {
        if (typeof x === 'object')
        {
            var config = x;

            x = GetFastValue(config, 'x', 0);
            y = GetFastValue(config, 'y', 0);
            power = GetFastValue(config, 'power', 0);
            epsilon = GetFastValue(config, 'epsilon', 100);
            gravity = GetFastValue(config, 'gravity', 50);
        }
        else
        {
            if (x === undefined) { x = 0; }
            if (y === undefined) { y = 0; }
            if (power === undefined) { power = 0; }
            if (epsilon === undefined) { epsilon = 100; }
            if (gravity === undefined) { gravity = 50; }
        }

        this.x = x;
        this.y = y;
        this.active = true;

        this._gravity = gravity;
        this._power = 0;
        this._epsilon = 0;

        this.power = power;
        this.epsilon = epsilon;
    },

    update: function (particle, delta, step)
    {
        var x = this.x - particle.x;
        var y = this.y - particle.y;
        var dSq = x * x + y * y;

        if (dSq === 0)
        {
            return;
        }

        var d = Math.sqrt(dSq);

        if (dSq < this._epsilon)
        {
            dSq = this._epsilon;
        }

        var factor = ((this._power * delta) / (dSq * d)) * 100;

        particle.velocityX += x * factor;
        particle.velocityY += y * factor;
    },

    epsilon: {

        get: function ()
        {
            return Math.sqrt(this._epsilon);
        },

        set: function (value)
        {
            this._epsilon = value * value;
        }

    },

    power: {

        get: function ()
        {
            return this._power / this._gravity;
        },

        set: function (value)
        {
            this._power = value * this._gravity;
        }

    },

    gravity: {

        get: function ()
        {
            return this._gravity;
        },

        set: function (value)
        {
            var pwr = this.power;
            this._gravity = value;
            this.power = pwr;
        }

    }

});

module.exports = GravityWell;
