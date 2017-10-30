var BlendModes = require('../../renderer/BlendModes');
var Class = require('../../utils/Class');
var Components = require('../components');
var DeathZone = require('./zones/DeathZone');
var EdgeZone = require('./zones/EdgeZone');
var EmitterOp = require('./EmitterOp');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetRandomElement = require('../../utils/array/GetRandomElement');
var GetValue = require('../../utils/object/GetValue');
var HasValue = require('../../utils/object/HasValue');
var HasAny = require('../../utils/object/HasAny');
var Particle = require('./Particle');
var RandomZone = require('./zones/RandomZone');
var Rectangle = require('../../geom/rectangle/Rectangle');
var StableSort = require('../../utils/array/StableSort');
var Vector2 = require('../../math/Vector2');
var Wrap = require('../../math/Wrap');

var ParticleEmitter = new Class({

    Mixins: [
        Components.BlendMode,
        Components.ScrollFactor,
        Components.Visible
    ],

    initialize:

    function ParticleEmitter (manager, config)
    {
        this.manager = manager;

        this.texture = manager.texture;

        this.frames = [ manager.defaultFrame ];

        this.defaultFrame = manager.defaultFrame;

        this.configFastMap = [
            'active',
            'blendMode',
            'collideBottom',
            'collideLeft',
            'collideRight',
            'collideTop',
            'deathCallback',
            'deathCallbackScope',
            'emitCallback',
            'emitCallbackScope',
            'follow',
            'frequency',
            'gravityX',
            'gravityY',
            'maxParticles',
            'name',
            'on',
            'particleBringToTop',
            'particleClass',
            'radial',
            'timeScale',
            'trackVisible',
            'visible'
        ];

        this.configOpMap = [
            'accelerationX',
            'accelerationY',
            'alpha',
            'bounce',
            'delay',
            'lifespan',
            'maxVelocityX',
            'maxVelocityY',
            'moveToX',
            'moveToY',
            'quantity',
            'rotate',
            'scaleX',
            'scaleY',
            'speedX',
            'speedY',
            'tint',
            'x',
            'y'
        ];

        this.name = '';

        this.particleClass = Particle;

        this.x = new EmitterOp(config, 'x', 0);
        this.y = new EmitterOp(config, 'y', 0);

        //  A radial emitter will emit particles in all directions between angle min and max, using speed as the value
        //  A point emitter will emit particles only in the direction derived from the speedX and speedY values
        this.radial = true;

        this.gravityX = 0;
        this.gravityY = 0;

        this.acceleration = false;
        this.accelerationX = new EmitterOp(config, 'accelerationX', 0, true);
        this.accelerationY = new EmitterOp(config, 'accelerationY', 0, true);

        this.maxVelocityX = new EmitterOp(config, 'maxVelocityX', 10000, true);
        this.maxVelocityY = new EmitterOp(config, 'maxVelocityY', 10000, true);

        this.speedX = new EmitterOp(config, 'speedX', 0, true);
        this.speedY = new EmitterOp(config, 'speedY', 0, true);

        this.moveTo = false;
        this.moveToX = new EmitterOp(config, 'moveToX', 0, true);
        this.moveToY = new EmitterOp(config, 'moveToY', 0, true);

        this.bounce = new EmitterOp(config, 'bounce', 0, true);

        this.scaleX = new EmitterOp(config, 'scaleX', 1);
        this.scaleY = new EmitterOp(config, 'scaleY', 1);

        this.tint = new EmitterOp(config, 'tint', 0xffffffff);
        this.alpha = new EmitterOp(config, 'alpha', 1);

        this.lifespan = new EmitterOp(config, 'lifespan', 1000);

        this.angle = new EmitterOp(config, 'angle', { min: 0, max: 360 });

        this.rotate = new EmitterOp(config, 'rotate', 0);

        this.emitCallback = null;
        this.emitCallbackScope = null;

        this.deathCallback = null;
        this.deathCallbackScope = null;

        //  Set to hard limit the amount of particle objects this emitter is allowed to create. 0 means unlimited.
        this.maxParticles = 0;

        //  How many particles are emitted each time the emitter updates
        this.quantity = new EmitterOp(config, 'quantity', 1, true);

        //  How many ms to wait after emission before the particles start updating
        this.delay = new EmitterOp(config, 'delay', 0, true);

        //  How often a particle is emitted in ms (if emitter is a constant / flow emitter)
        //  If emitter is an explosion emitter this value will be -1.
        //  Anything > -1 sets this to be a flow emitter
        this.frequency = 0;

        //  Controls if the emitter is currently emitting particles. Already alive particles will continue to update until they expire.
        this.on = true;

        //  Newly emitted particles are added to the top of the particle list, i.e. rendered above those already alive. Set to false to send them to the back.
        this.particleBringToTop = true;

        this.timeScale = 1;

        this.emitZone = null;
        this.deathZone = null;

        this.bounds = null;

        this.collideLeft = true;
        this.collideRight = true;
        this.collideTop = true;
        this.collideBottom = true;

        this.active = true;
        this.visible = true;

        this.blendMode = BlendModes.NORMAL;

        this.follow = null;
        this.followOffset = new Vector2();
        this.trackVisible = false;

        this.currentFrame = 0;

        this.randomFrame = true;

        this.frameQuantity = 1;

        //  private
        this.dead = [];
        this.alive = [];

        this._counter = 0;
        this._frameCounter = 0;

        if (config)
        {
            this.fromJSON(config);
        }
    },

    fromJSON: function (config)
    {
        if (!config)
        {
            return this;
        }

        //  Only update properties from their current state if they exist in the given config

        var i = 0;
        var key = '';

        for (i = 0; i < this.configFastMap.length; i++)
        {
            key = this.configFastMap[i];

            if (HasValue(config, key))
            {
                this[key] = GetFastValue(config, key);
            }
        }

        for (i = 0; i < this.configOpMap.length; i++)
        {
            key = this.configOpMap[i];

            if (HasValue(config, key))
            {
                this[key].loadConfig(config);
            }
        }

        this.acceleration = (this.accelerationX.propertyValue !== 0 || this.accelerationY.propertyValue !== 0);

        this.moveTo = (this.moveToX.propertyValue !== 0 || this.moveToY.propertyValue !== 0);

        //  Special 'speed' override

        if (HasValue(config, 'speed'))
        {
            this.speedX.loadConfig(config, 'speed');
            this.speedY = null;
        }

        //  If you specify speedX, speedY ot moveTo then it changes the emitter from radial to a point emitter
        if (HasAny(config, [ 'speedX', 'speedY' ]) || this.moveTo)
        {
            this.radial = false;
        }

        //  Special 'scale' override

        if (HasValue(config, 'scale'))
        {
            this.scaleX.loadConfig(config, 'scale');
            this.scaleY = null;
        }

        if (HasValue(config, 'callbackScope'))
        {
            var callbackScope = GetFastValue(config, 'callbackScope', null);

            this.emitCallbackScope = callbackScope;
            this.deathCallbackScope = callbackScope;
        }

        if (HasValue(config, 'emitZone'))
        {
            this.setEmitZone(config.emitZone);
        }

        if (HasValue(config, 'deathZone'))
        {
            this.setDeathZone(config.deathZone);
        }

        if (HasValue(config, 'bounds'))
        {
            this.setBounds(config.bounds);
        }

        if (HasValue(config, 'followOffset'))
        {
            this.followOffset.setFromObject(GetFastValue(config, 'followOffset', 0));
        }

        if (HasValue(config, 'frame'))
        {
            this.setFrame(config.frame);
        }

        return this;
    },

    toJSON: function (output)
    {
        if (output === undefined) { output = {}; }

        var i = 0;
        var key = '';

        for (i = 0; i < this.configFastMap.length; i++)
        {
            key = this.configFastMap[i];

            output[key] = this[key];
        }

        for (i = 0; i < this.configOpMap.length; i++)
        {
            key = this.configOpMap[i];

            if (this[key])
            {
                output[key] = this[key].toJSON();
            }
        }

        //  special handlers
        if (!this.speedY)
        {
            delete output.speedX;
            output.speed = this.speedX.toJSON();
        }

        if (!this.scaleY)
        {
            delete output.scaleX;
            output.scale = this.scaleX.toJSON();
        }

        return output;
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
        else if (this.randomFrame)
        {
            return GetRandomElement(this.frames);
        }
        else
        {
            var frame = this.frames[this.currentFrame];

            this._frameCounter++;

            if (this._frameCounter === this.frameQuantity)
            {
                this._frameCounter = 0;
                this.currentFrame = Wrap(this.currentFrame + 1, 0, this._frameLength);                
            }

            return frame;
        }
    },

    // frame: 0
    // frame: 'red'
    // frame: [ 0, 1, 2, 3 ]
    // frame: [ 'red', 'green', 'blue', 'pink', 'white' ]
    // frame: { frames: [ 'red', 'green', 'blue', 'pink', 'white' ], [cycle: bool], [quantity: int] }

    setFrame: function (frames, pickRandom, quantity)
    {
        if (pickRandom === undefined) { pickRandom = true; }
        if (quantity === undefined) { quantity = 1; }

        this.randomFrame = pickRandom;
        this.frameQuantity = quantity;
        this.currentFrame = 0;
        this._frameCounter = 0;

        var t = typeof (frames);

        if (Array.isArray(frames) || t === 'string' || t === 'number')
        {
            this.manager.setEmitterFrames(frames, this);
        }
        else if (t === 'object')
        {
            var frameConfig = frames;
            var frames = GetFastValue(frameConfig, 'frames', null);

            if (frames)
            {
                this.manager.setEmitterFrames(frames, this);
            }

            var isCycle = GetFastValue(frameConfig, 'cycle', false);

            this.randomFrame = (isCycle) ? false : true;

            this.frameQuantity = GetFastValue(frameConfig, 'quantity', quantity);
        }

        this._frameLength = this.frames.length;

        if (this._frameLength === 1)
        {
            this.frameQuantity = 1;
            this.randomFrame = false;
        }

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
            var width = (HasValue(obj, 'w')) ? obj.w : obj.width;
            var height = (HasValue(obj, 'h')) ? obj.h : obj.height;
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
        if (this.speedY)
        {
            this.speedY.onChange(value);

            //  If you specify speedX and Y then it changes the emitter from radial to a point emitter
            this.radial = false;
        }

        return this;
    },

    setSpeed: function (value)
    {
        this.speedX.onChange(value);
        this.speedY = null;

        //  If you specify speedX and Y then it changes the emitter from radial to a point emitter
        this.radial = true;

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

    //  The zone must have a function called `getPoint` that takes a particle object and sets
    //  its x and y properties accordingly then returns that object
    setEmitZone: function (zoneConfig)
    {
        if (zoneConfig === undefined)
        {
            this.emitZone = null;
        }
        else
        {
            //  Where source = Geom like Circle, or a Path or Curve
            //  emitZone: { type: 'random', source: X }
            //  emitZone: { type: 'edge', source: X, quantity: 32, [stepRate=0], [yoyo=false] }

            var type = GetFastValue(zoneConfig, 'type', 'random');
            var source = GetFastValue(zoneConfig, 'source', null);

            if (source && typeof source.getPoint === 'function')
            {
                switch (type)
                {
                    case 'random':
                        this.emitZone = new RandomZone(source);
                        break;

                    case 'edge':
                        var quantity = GetFastValue(zoneConfig, 'quantity', 1);
                        var stepRate = GetFastValue(zoneConfig, 'stepRate', 0);
                        var yoyo = GetFastValue(zoneConfig, 'yoyo', false);
                        this.emitZone = new EdgeZone(source, quantity, stepRate, yoyo);
                        break;
                }
            }
        }

        return this;
    },

    setDeathZone: function (zoneConfig)
    {
        if (zoneConfig === undefined)
        {
            this.deathZone = null;
        }
        else
        {
            //  Where source = Geom like Circle or Rect that suppors a 'contains' function
            //  deathZone: { type: 'onEnter', source: X }
            //  deathZone: { type: 'onLeave', source: X }

            var type = GetFastValue(zoneConfig, 'type', 'onEnter');
            var source = GetFastValue(zoneConfig, 'source', null);

            if (source && typeof source.contains === 'function')
            {
                var killOnEnter = (type === 'onEnter') ? true : false;

                this.deathZone = new DeathZone(source, killOnEnter);
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
