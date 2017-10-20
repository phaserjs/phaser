var BlendModes = require('../../renderer/BlendModes');
var Class = require('../../utils/Class');
var Components = require('../components');
var Easing = require('../../math/easing');
var GetEaseFunction = require('../../tweens/builder/GetEaseFunction');
var GetRandomElement = require('../../utils/array/GetRandomElement');
var GetValue = require('../../utils/object/GetValue');
var MinMax2 = require('../../math/MinMax2');
var MinMax4 = require('../../math/MinMax4');
var Particle = require('./Particle');
var StableSort = require('../../utils/array/StableSort');

var ParticleEmitter = new Class({

    Mixins: [
        Components.BlendMode,
        Components.ScrollFactor,
        Components.Visible
    ],

    initialize:

    function ParticleEmitter (manager, config)
    {
        if (config === undefined) { config = {}; }

        this.manager = manager;

        this.key = GetValue(config, 'key', '');

        this.particleClass = GetValue(config, 'particleClass', Particle);

        this.texture = manager.texture;

        this.frames = [ manager.defaultFrame ];

        this.defaultFrame = manager.defaultFrame;

        this.x = GetValue(config, 'x', 0);
        this.y = GetValue(config, 'y', 0);

        //  A radial emitter will emit particles in all directions between angle min and max
        //  A point emitter will emit particles only in the direction set by the speed values
        this.radial = GetValue(config, 'radial', true);

        this.speed = new MinMax4(GetValue(config, 'speed', undefined));

        this.scale = new MinMax4(GetValue(config, 'scale', 1));

        this.gravity = new MinMax2(GetValue(config, 'gravity', 0));

        this.alpha = new MinMax2(GetValue(config, 'alpha', 1));

        this.angle = new MinMax2(GetValue(config, 'angle', { min: 0, max: 360 }));

        this.particleAngle = new MinMax2(GetValue(config, 'particleAngle', 0));

        //  The lifespan of the particles (in ms)
        this.lifespan = new MinMax2(GetValue(config, 'lifespan', 1000));

        this.deathCallback = GetValue(config, 'deathCallback', null);
        this.deathCallbackScope = GetValue(config, 'deathCallbackScope', null);

        //  Set to hard limit the amount of particle objects this emitter is allowed to create
        this.maxParticles = GetValue(config, 'maxParticles', 0);

        //  How many particles are emitted each time the emitter updates
        this.quantity = GetValue(config, 'quantity', 1);

        //  How often a particle is emitted in ms (if emitter is a constant / flow emitter)
        //  If emitter is an explosion emitter this value will be -1.
        //  Anything > -1 sets this to be a flow emitter
        this.frequency = GetValue(config, 'frequency', 0);

        //  Controls if the emitter is currently emitting particles. Already alive particles will continue to update until they expire.
        this.on = GetValue(config, 'on', true);

        //  Newly emitted particles are added to the top of the particle list, i.e. rendered above those already alive. Set to false to send them to the back.
        this.particleBringToTop = GetValue(config, 'particleBringToTop', true);

        this.timeScale = GetValue(config, 'timeScale', 1);

        this.dead = [];
        this.alive = [];

        this._counter = 0;

        //  Optional Particle emission zone - must be an object that supports a `getRandomPoint` function, such as a Rectangle, Circle, Path, etc.
        this.zone = GetValue(config, 'zone', null);

        this.active = GetValue(config, 'active', true);
        this.visible = GetValue(config, 'visible', true);

        this.blendMode = GetValue(config, 'blendMode', BlendModes.NORMAL);

        this.easingFunctionAlpha = GetValue(config, 'alphaEase', GetEaseFunction('Linear'));
        this.easingFunctionScale = GetValue(config, 'scaleEase', GetEaseFunction('Linear'));
        this.easingFunctionRotation = GetValue(config, 'rotationEase', GetEaseFunction('Linear'));

        var frame = GetValue(config, 'frame', null);

        if (frame)
        {
            this.setFrame(frame);
        }
    },

    getFrame: function ()
    {
        if (this.frames.length === 1)
        {
            return this.defaultFrame;
        }
        else
        {
            return GetRandomElement(this.frames);
        }
    },

    //  Either a single frame (numeric / string based), or an array of frames to randomly pick from
    setFrame: function (frames)
    {
        this.manager.setEmitterFrames(frames, this);

        return this;
    },

    setRadial: function (value)
    {
        if (value === undefined) { value = true; }

        this.radial = value;

        return this;
    },

    setPosition: function (x, y)
    {
        this.x = x;
        this.y = y;

        return this;
    },

    setEase: function (easeName, easeParam)
    {
        var ease = GetEaseFunction(easeName, easeParam);

        this.easingFunctionAlpha = ease;
        this.easingFunctionScale = ease;
        this.easingFunctionRotation = ease;

        return this;
    },

    setAlphaEase: function (easeName, easeParam)
    {
        this.easingFunctionAlpha = GetEaseFunction(easeName, easeParam);

        return this;
    },

    setScaleEase: function (easeName, easeParam)
    {
        this.easingFunctionScale = GetEaseFunction(easeName, easeParam);

        return this;
    },

    setRotationEase: function (easeName, easeParam)
    {
        this.easingFunctionRotation = GetEaseFunction(easeName, easeParam);

        return this;
    },

    //  Particle Emission

    setSpeed: function (xMin, xMax, yMin, yMax)
    {
        this.speed.set(xMin, xMax, yMin, yMax);

        return this;
    },

    setScale: function (xMin, xMax, yMin, yMax)
    {
        this.scale.set(xMin, xMax, yMin, yMax);

        return this;
    },

    setGravity: function (x, y)
    {
        this.gravity.set(x, y);

        return this;
    },

    setAlpha: function (min, max)
    {
        this.alpha.set(min, max);

        return this;
    },

    setAngle: function (min, max)
    {
        this.angle.set(min, max);

        return this;
    },

    setParticleAngle: function (min, max)
    {
        this.particleAngle.set(min, max);

        return this;
    },

    setLifespan: function (min, max)
    {
        this.lifespan.set(min, max);

        return this;
    },

    setQuantity: function (quantity)
    {
        this.quantity = quantity;

        return this;
    },

    setFrequency: function (frequency, quantity)
    {
        this.frequency = frequency;

        this._counter = 0;

        if (quantity)
        {
            this.quantity = quantity;
        }

        return this;
    },

    //  The zone must have a function called `getRandomPoint` that takes an object and sets
    //  its x and y properties accordingly then returns that object
    setZone: function (zone)
    {
        if (zone === undefined)
        {
            this.zone = null;
        }
        else if (typeof zone.getRandomPoint === 'function')
        {
            this.zone = zone;
        }

        return this;
    },

    //  Particle Management

    reserve: function (particleCount)
    {
        var dead = this.dead;

        for (var i = 0; i < particleCount; i++)
        {
            dead.push(new this.particleClass());
        }

        return this;
    },

    getAliveParticleCount: function ()
    {
        return this.alive.length;
    },

    getDeadParticleCount: function ()
    {
        return this.dead.length;
    },

    getParticleCount: function ()
    {
        return this.getAliveParticleCount() + this.getDeadParticleCount();
    },

    atLimit: function ()
    {
        return (this.maxParticles > 0 && this.getParticleCount() === this.maxParticles);
    },

    onParticleDeath: function (callback, context)
    {
        if (callback === undefined)
        {
            //  Clear any previously set callback
            this.deathCallback = null;
            this.deathCallbackScope = null;
        }
        else if (typeof callback === 'function')
        {
            this.deathCallback = callback;

            if (context)
            {
                this.deathCallbackScope = context;
            }
        }

        return this;
    },

    killAll: function ()
    {
        var dead = this.dead;
        var alive = this.alive;

        while (alive.length > 0)
        {
            dead.push(alive.pop());
        }

        return this;
    },

    forEachAlive: function (callback, thisArg)
    {
        var alive = this.alive;
        var length = alive.length;

        for (var index = 0; index < length; ++index)
        {
            //  Sends the Particle and the Emitter
            callback.call(thisArg, alive[index], this);
        }

        return this;
    },

    forEachDead: function (callback, thisArg)
    {
        var dead = this.dead;
        var length = dead.length;

        for (var index = 0; index < length; ++index)
        {
            //  Sends the Particle and the Emitter
            callback.call(thisArg, dead[index], this);
        }

        return this;
    },

    start: function ()
    {
        this.on = true;

        this._counter = 0;

        return this;
    },

    pause: function ()
    {
        this.active = false;

        return this;
    },

    resume: function ()
    {
        this.active = true;

        return this;
    },

    flow: function (frequency, count)
    {
        if (count === undefined) { count = 1; }

        this.frequency = frequency;

        this.quantity = count;

        return this.start();
    },

    explode: function (count, x, y)
    {
        this.frequency = -1;

        return this.emit(count, x, y);
    },

    emitAt: function (x, y, count)
    {
        return this.emit(count, x, y);
    },

    emit: function (count, x, y)
    {
        if (count === undefined) { count = 1; }

        var output = [];

        if (this.atLimit())
        {
            return output;
        }

        //  Store emitter coordinates in-case this was a placement explode, or emitAt

        var oldX = this.x;
        var oldY = this.y;

        if (x !== undefined)
        {
            this.x = x;
        }

        if (y !== undefined)
        {
            this.y = y;
        }

        var dead = this.dead;

        for (var i = 0; i < count; i++)
        {
            var particle;

            if (dead.length > 0)
            {
                particle = dead.pop();
            }
            else
            {
                particle = new this.particleClass();
            }

            particle.emit(this);

            if (this.particleBringToTop)
            {
                this.alive.push(particle);
            }
            else
            {
                this.alive.unshift(particle);
            }

            output.push(particle);

            if (this.atLimit())
            {
                break;
            }
        }

        this.x = oldX;
        this.y = oldY;

        return output;
    },

    preUpdate: function (time, delta)
    {
        //  Scale the delta
        delta *= this.timeScale;

        var step = (delta / 1000);
        var particles = this.alive;
        var length = particles.length;

        for (var index = 0; index < length; index++)
        {
            var particle = particles[index];

            //  update returns `true` if the particle is now dead (lifeStep < 0)
            if (particle.update(this, delta, step))
            {
                //  Moves the dead particle to the end of the particles array (ready for splicing out later)
                var last = particles[length - 1];

                particles[length - 1] = particle;
                particles[index] = last;

                index -= 1;
                length -= 1;
            }
        }

        //  Move dead particles to the dead array
        var deadLength = particles.length - length;

        if (deadLength > 0)
        {
            var rip = particles.splice(particles.length - deadLength, deadLength);

            var deathCallback = this.deathCallback;
            var deathCallbackScope = this.deathCallbackScope;

            if (deathCallback)
            {
                for (var i = 0; i < rip.length; i++)
                {
                    deathCallback.call(deathCallbackScope, rip[i]);
                }
            }

            this.dead.concat(rip);

            StableSort(particles, this.indexSort);
        }

        if (!this.on)
        {
            return;
        }

        if (this.frequency === 0)
        {
            this.emit(this.quantity);
        }
        else if (this.frequency > 0)
        {
            this._counter -= delta;

            if (this._counter <= 0)
            {
                this.emit(this.quantity);

                //  counter = frequency - remained from previous delta
                this._counter = (this.frequency - Math.abs(this._counter));
            }
        }
    },

    indexSort: function (a, b)
    {
        return a.index - b.index;
    }

});

module.exports = ParticleEmitter;
