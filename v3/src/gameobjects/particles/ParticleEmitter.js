var BlendModes = require('../../renderer/BlendModes');
var Class = require('../../utils/Class');
var Components = require('../components');
var EdgeZone = require('./zones/EdgeZone');
var EmitterOp = require('./EmitterOp');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetRandomElement = require('../../utils/array/GetRandomElement');
var GetValue = require('../../utils/object/GetValue');
var Particle = require('./Particle');
var RandomZone = require('./zones/RandomZone');
var Rectangle = require('../../geom/rectangle/Rectangle');
var StableSort = require('../../utils/array/StableSort');
var Vector2 = require('../../math/Vector2');

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

        this.name = GetFastValue(config, 'name', '');

        this.particleClass = GetFastValue(config, 'particleClass', Particle);

        this.texture = manager.texture;

        this.frames = [ manager.defaultFrame ];

        this.defaultFrame = manager.defaultFrame;

        this.x = new EmitterOp(config, 'x', 0);
        this.y = new EmitterOp(config, 'y', 0);

        //  A radial emitter will emit particles in all directions between angle min and max, using speed as the value
        //  A point emitter will emit particles only in the direction derived from the speedX and speedY values
        this.radial = GetFastValue(config, 'radial', true);

        //  Not a value operation because you should be able to constantly alter this and effect all
        //  alive particles in real-time, instantly
        this.gravityX = GetValue(config, 'gravityX', 0);
        this.gravityY = GetValue(config, 'gravityY', 0);

        this.acceleration = false;
        this.accelerationX = new EmitterOp(config, 'accelerationX', 0, true);
        this.accelerationY = new EmitterOp(config, 'accelerationY', 0, true);

        if (config.hasOwnProperty('accelerationX') || config.hasOwnProperty('accelerationY'))
        {
            this.acceleration = true;
        }

        this.maxVelocityX = new EmitterOp(config, 'maxVelocityX', 10000, true);
        this.maxVelocityY = new EmitterOp(config, 'maxVelocityY', 10000, true);

        this.speedX = new EmitterOp(config, 'speedX', 0, true);
        this.speedY = new EmitterOp(config, 'speedY', 0, true);

        //  If you specify speedX and Y then it changes the emitter from radial to a point emitter
        if (config.hasOwnProperty('speedX') || config.hasOwnProperty('speedY'))
        {
            this.radial = false;
        }

        if (config.hasOwnProperty('speed'))
        {
            this.speedX = new EmitterOp(config, 'speed', 0, true);
            this.speedY = null;
        }

        this.bounce = new EmitterOp(config, 'bounce', 0, true);

        this.scaleX = new EmitterOp(config, 'scaleX', 1);
        this.scaleY = new EmitterOp(config, 'scaleY', 1);

        if (config.hasOwnProperty('scale'))
        {
            this.scaleX = new EmitterOp(config, 'scale', 1);
            this.scaleY = null;
        }

        this.alpha = new EmitterOp(config, 'alpha', 1);

        this.lifespan = new EmitterOp(config, 'lifespan', 1000);

        this.angle = new EmitterOp(config, 'angle', { min: 0, max: 360 });

        this.rotate = new EmitterOp(config, 'rotate', 0);

        //  Callbacks

        this.emitCallback = GetFastValue(config, 'emitCallback', null);
        this.emitCallbackScope = GetFastValue(config, 'emitCallbackScope', null);

        this.deathCallback = GetFastValue(config, 'deathCallback', null);
        this.deathCallbackScope = GetFastValue(config, 'deathCallbackScope', null);

        var callbackScope = GetFastValue(config, 'callbackScope', null);

        if (callbackScope)
        {
            this.emitCallbackScope = callbackScope;
            this.deathCallbackScope = callbackScope;
        }

        //  Set to hard limit the amount of particle objects this emitter is allowed to create. 0 means unlimited.
        this.maxParticles = GetFastValue(config, 'maxParticles', 0);

        //  How many particles are emitted each time the emitter updates
        this.quantity = new EmitterOp(config, 'quantity', 1);

        //  How many ms to wait after emission before the particles start updating
        this.delay = new EmitterOp(config, 'delay', 0, true);

        //  How often a particle is emitted in ms (if emitter is a constant / flow emitter)
        //  If emitter is an explosion emitter this value will be -1.
        //  Anything > -1 sets this to be a flow emitter
        this.frequency = GetFastValue(config, 'frequency', 0);

        //  Controls if the emitter is currently emitting particles. Already alive particles will continue to update until they expire.
        this.on = GetFastValue(config, 'on', true);

        //  Newly emitted particles are added to the top of the particle list, i.e. rendered above those already alive. Set to false to send them to the back.
        this.particleBringToTop = GetFastValue(config, 'particleBringToTop', true);

        this.timeScale = GetFastValue(config, 'timeScale', 1);

        //  private
        this.dead = [];
        this.alive = [];

        this._counter = 0;

        this.zone = null;

        if (config.hasOwnProperty('zone'))
        {
            this.setZone(config.zone);
        }

        //  bounds rectangle
        this.bounds = null;

        if (config.hasOwnProperty('bounds'))
        {
            this.setBounds(config.bounds);
        }

        this.collideLeft = GetFastValue(config, 'collideLeft', true);
        this.collideRight = GetFastValue(config, 'collideRight', true);
        this.collideTop = GetFastValue(config, 'collideTop', true);
        this.collideBottom = GetFastValue(config, 'collideBottom', true);

        this.active = GetFastValue(config, 'active', true);
        this.visible = GetFastValue(config, 'visible', true);

        this.blendMode = GetFastValue(config, 'blendMode', BlendModes.NORMAL);

        this.follow = GetFastValue(config, 'follow', null);
        this.followOffset = new Vector2(GetFastValue(config, 'followOffset', 0));
        this.trackVisible = GetFastValue(config, 'trackVisible', false);

        var frame = GetFastValue(config, 'frame', null);

        if (frame)
        {
            this.setFrame(frame);
        }
    },

    fromJSON: function (config)
    {

    },

    toJSON: function ()
    {

    },

    startFollow: function (target, offsetX, offsetY, trackVisible)
    {
        if (offsetX === undefined) { offsetX = 0; }
        if (offsetY === undefined) { offsetY = 0; }
        if (trackVisible === undefined) { trackVisible = false; }

        this.follow = target;
        this.followOffset.set(offsetX, offsetY);
        this.trackVisible = trackVisible;

        return this;
    },

    stopFollow: function ()
    {
        this.follow = null;
        this.followOffset.set(0, 0);
        this.trackVisible = false;

        return this;
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
        this.x.onChange(x);
        this.y.onChange(y);

        return this;
    },

    setBounds: function (x, y, width, height)
    {
        if (typeof x === 'object')
        {
            var obj = x;

            var x = obj.x;
            var y = obj.y;
            var width = (obj.hasOwnProperty('w')) ? obj.w : obj.width;
            var height = (obj.hasOwnProperty('h')) ? obj.h : obj.height;
        }

        if (this.bounds)
        {
            this.bounds.setTo(x, y, width, height);
        }
        else
        {
            this.bounds = new Rectangle(x, y, width, height);
        }

        return this;
    },

    //  Particle Emission

    setSpeedX: function (value)
    {
        this.speedX.onChange(value);

        //  If you specify speedX and Y then it changes the emitter from radial to a point emitter
        this.radial = false;

        return this;
    },

    setSpeedY: function (value)
    {
        this.speedY.onChange(value);

        //  If you specify speedX and Y then it changes the emitter from radial to a point emitter
        this.radial = false;

        return this;
    },

    setSpeed: function (value)
    {
        this.speedX.onChange(value);
        this.speedY = null;

        //  If you specify speedX and Y then it changes the emitter from radial to a point emitter
        this.radial = false;

        return this;
    },

    setScaleX: function (value)
    {
        this.scaleX.onChange(value);

        return this;
    },

    setScaleY: function (value)
    {
        this.scaleY.onChange(value);

        return this;
    },

    setScale: function (value)
    {
        this.scaleX.onChange(value);
        this.scaleY = null;

        return this;
    },

    setGravityX: function (value)
    {
        this.gravityX = value;

        return this;
    },

    setGravityY: function (value)
    {
        this.gravityY = value;

        return this;
    },

    setGravity: function (x, y)
    {
        this.gravityX = x;
        this.gravityY = y;

        return this;
    },

    setAlpha: function (value)
    {
        this.alpha.onChange(value);

        return this;
    },

    setEmitterAngle: function (value)
    {
        this.angle.onChange(value);

        return this;
    },

    setAngle: function (value)
    {
        this.angle.onChange(value);

        return this;
    },

    setLifespan: function (value)
    {
        this.lifespan.onChange(value);

        return this;
    },

    setQuantity: function (quantity)
    {
        this.quantity.onChange(quantity);

        return this;
    },

    setFrequency: function (frequency, quantity)
    {
        this.frequency = frequency;

        this._counter = 0;

        if (quantity)
        {
            this.quantity.onChange(quantity);
        }

        return this;
    },

    //  The zone must have a function called `getPoint` that takes an object and sets
    //  its x and y properties accordingly then returns that object
    setZone: function (zone)
    {
        if (zone === undefined)
        {
            this.zone = null;
        }
        else
        {
            //  Where source = Geom like Circle, or a Path or Curve
            //  zone: { type: 'random', source: X }
            //  zone: { type: 'edge', source: X, quantity: 32, [stepRate=0], [yoyo=false] }

            var type = GetFastValue(zone, 'type', 'random');
            var source = GetFastValue(zone, 'source', null);

            if (source && typeof source.getPoint === 'function')
            {
                switch (type)
                {
                    case 'random':
                        this.zone = new RandomZone(source);
                        break;

                    case 'edge':
                        var quantity = GetFastValue(zone, 'quantity', 1);
                        var stepRate = GetFastValue(zone, 'stepRate', 0);
                        var yoyo = GetFastValue(zone, 'yoyo', false);
                        this.zone = new EdgeZone(source, quantity, stepRate, yoyo);
                        break;
                }
            }
        }

        return this;
    },

    //  Particle Management

    reserve: function (particleCount)
    {
        var dead = this.dead;

        for (var i = 0; i < particleCount; i++)
        {
            dead.push(new this.particleClass(this));
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

    onParticleEmit: function (callback, context)
    {
        if (callback === undefined)
        {
            //  Clear any previously set callback
            this.emitCallback = null;
            this.emitCallbackScope = null;
        }
        else if (typeof callback === 'function')
        {
            this.emitCallback = callback;

            if (context)
            {
                this.emitCallbackScope = context;
            }
        }

        return this;
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

    depthSort: function ()
    {
        StableSort.inplace(this.alive, this.depthSortCallback);

        return this;
    },

    flow: function (frequency, count)
    {
        if (count === undefined) { count = 1; }

        this.frequency = frequency;

        this.quantity.onChange(count);

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
        if (this.atLimit())
        {
            return;
        }

        if (count === undefined)
        {
            count = this.quantity.onEmit();
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
                particle = new this.particleClass(this);
            }

            particle.emit(x, y);

            if (this.particleBringToTop)
            {
                this.alive.push(particle);
            }
            else
            {
                this.alive.unshift(particle);
            }

            if (this.emitCallback)
            {
                this.emitCallback.call(this.emitCallbackScope, particle, this);
            }

            if (this.atLimit())
            {
                break;
            }
        }

        return particle;
    },

    preUpdate: function (time, delta)
    {
        //  Scale the delta
        delta *= this.timeScale;

        var step = (delta / 1000);

        if (this.trackVisible)
        {
            this.visible = this.follow.visible;
        }

        //  Any particle processors?
        var processors = this.manager.getProcessors();

        var particles = this.alive;
        var length = particles.length;

        for (var index = 0; index < length; index++)
        {
            var particle = particles[index];

            //  update returns `true` if the particle is now dead (lifeStep < 0)
            if (particle.update(delta, step, processors))
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

            StableSort.inplace(particles, this.indexSortCallback);
        }
        
        if (!this.on)
        {
            return;
        }

        if (this.frequency === 0)
        {
            this.emit();
        }
        else if (this.frequency > 0)
        {
            this._counter -= delta;

            if (this._counter <= 0)
            {
                this.emit();

                //  counter = frequency - remained from previous delta
                this._counter = (this.frequency - Math.abs(this._counter));
            }
        }
    },

    depthSortCallback: function (a, b)
    {
        return a.y - b.y;
    },

    indexSortCallback: function (a, b)
    {
        return a.index - b.index;
    }

});

module.exports = ParticleEmitter;
