/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AnimationState = require('../../animations/AnimationState');
var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');

/**
 * @classdesc
 * A Particle is a simple Game Object controlled by a Particle Emitter and Manager, and rendered by the Manager.
 * It uses its own lightweight physics system, and can interact only with its Emitter's bounds and zones.
 *
 * @class Particle
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - The Emitter to which this Particle belongs.
 */
var Particle = new Class({

    initialize:

    function Particle (emitter)
    {
        /**
         * The Emitter to which this Particle belongs.
         *
         * A Particle can only belong to a single Emitter and is created, updated and destroyed via it.
         *
         * @name Phaser.GameObjects.Particles.Particle#emitter
         * @type {Phaser.GameObjects.Particles.ParticleEmitter}
         * @since 3.0.0
         */
        this.emitter = emitter;

        /**
         * The texture used to render this Particle.
         *
         * @name Phaser.GameObjects.Particles.Particle#texture
         * @type {Phaser.Textures.Texture}
         * @default null
         * @since 3.60.0
         */
        this.texture = null;

        /**
         * The texture frame used to render this Particle.
         *
         * @name Phaser.GameObjects.Particles.Particle#frame
         * @type {Phaser.Textures.Frame}
         * @default null
         * @since 3.0.0
         */
        this.frame = null;

        /**
         * The x coordinate of this Particle.
         *
         * @name Phaser.GameObjects.Particles.Particle#x
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x = 0;

        /**
         * The y coordinate of this Particle.
         *
         * @name Phaser.GameObjects.Particles.Particle#y
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y = 0;

        /**
         * The x velocity of this Particle.
         *
         * @name Phaser.GameObjects.Particles.Particle#velocityX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.velocityX = 0;

        /**
         * The y velocity of this Particle.
         *
         * @name Phaser.GameObjects.Particles.Particle#velocityY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.velocityY = 0;

        /**
         * The x acceleration of this Particle.
         *
         * @name Phaser.GameObjects.Particles.Particle#accelerationX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.accelerationX = 0;

        /**
         * The y acceleration of this Particle.
         *
         * @name Phaser.GameObjects.Particles.Particle#accelerationY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.accelerationY = 0;

        /**
         * The maximum horizontal velocity this Particle can travel at.
         *
         * @name Phaser.GameObjects.Particles.Particle#maxVelocityX
         * @type {number}
         * @default 10000
         * @since 3.0.0
         */
        this.maxVelocityX = 10000;

        /**
         * The maximum vertical velocity this Particle can travel at.
         *
         * @name Phaser.GameObjects.Particles.Particle#maxVelocityY
         * @type {number}
         * @default 10000
         * @since 3.0.0
         */
        this.maxVelocityY = 10000;

        /**
         * The bounciness, or restitution, of this Particle.
         *
         * @name Phaser.GameObjects.Particles.Particle#bounce
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.bounce = 0;

        /**
         * The horizontal scale of this Particle.
         *
         * @name Phaser.GameObjects.Particles.Particle#scaleX
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.scaleX = 1;

        /**
         * The vertical scale of this Particle.
         *
         * @name Phaser.GameObjects.Particles.Particle#scaleY
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.scaleY = 1;

        /**
         * The alpha value of this Particle.
         *
         * @name Phaser.GameObjects.Particles.Particle#alpha
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.alpha = 1;

        /**
         * The angle of this Particle in degrees.
         *
         * @name Phaser.GameObjects.Particles.Particle#angle
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.angle = 0;

        /**
         * The angle of this Particle in radians.
         *
         * @name Phaser.GameObjects.Particles.Particle#rotation
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.rotation = 0;

        /**
         * The tint applied to this Particle.
         *
         * @name Phaser.GameObjects.Particles.Particle#tint
         * @type {number}
         * @webglOnly
         * @since 3.0.0
         */
        this.tint = 0xffffff;

        /**
         * The lifespan of this Particle in ms.
         *
         * @name Phaser.GameObjects.Particles.Particle#life
         * @type {number}
         * @default 1000
         * @since 3.0.0
         */
        this.life = 1000;

        /**
         * The current life of this Particle in ms.
         *
         * @name Phaser.GameObjects.Particles.Particle#lifeCurrent
         * @type {number}
         * @default 1000
         * @since 3.0.0
         */
        this.lifeCurrent = 1000;

        /**
         * The delay applied to this Particle upon emission, in ms.
         *
         * @name Phaser.GameObjects.Particles.Particle#delayCurrent
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.delayCurrent = 0;

        /**
         * The normalized lifespan T value, where 0 is the start and 1 is the end.
         *
         * @name Phaser.GameObjects.Particles.Particle#lifeT
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.lifeT = 0;

        /**
         * The data used by the ease equation.
         *
         * @name Phaser.GameObjects.Particles.Particle#data
         * @type {object}
         * @since 3.0.0
         */
        this.data = {
            tint: { min: 0xffffff, max: 0xffffff },
            alpha: { min: 1, max: 1 },
            rotate: { min: 0, max: 0 },
            scaleX: { min: 1, max: 1 },
            scaleY: { min: 1, max: 1 },
            x: { min: 0, max: 0 },
            y: { min: 0, max: 0 },
            accelerationX: { min: 0, max: 0 },
            accelerationY: { min: 0, max: 0 },
            maxVelocityX: { min: 0, max: 0 },
            maxVelocityY: { min: 0, max: 0 },
            moveToX: { min: 0, max: 0 },
            moveToY: { min: 0, max: 0 },
            bounce: { min: 0, max: 0 }
        };

        /**
         * Interal private value.
         *
         * @name Phaser.GameObjects.Particles.Particle#isCropped
         * @type {boolean}
         * @private
         * @readonly
         * @since 3.60.0
         */
        this.isCropped = false;

        /**
         * A reference to the Scene to which this Game Object belongs.
         *
         * Game Objects can only belong to one Scene.
         *
         * You should consider this property as being read-only. You cannot move a
         * Game Object to another Scene by simply changing it.
         *
         * @name Phaser.GameObjects.Particles.Particle#scene
         * @type {Phaser.Scene}
         * @since 3.60.0
         */
        this.scene = emitter.manager.scene;

        /**
         * The Animation State component of this Particle.
         *
         * This component provides features to apply animations to this Particle.
         * It is responsible for playing, loading, queuing animations for later playback,
         * mixing between animations and setting the current animation frame to this Particle.
         *
         * @name Phaser.GameObjects.Particles.Particle#anims
         * @type {Phaser.Animations.AnimationState}
         * @since 3.60.0
         */
        this.anims = new AnimationState(this);
    },

    /**
     * The Event Emitter proxy.
     *
     * Passes on all parameters to the `ParticleEmitterManager` to emit directly.
     *
     * @method Phaser.GameObjects.Particles.Particle#emit
     * @since 3.60.0
     *
     * @param {(string|Symbol)} event - The event name.
     * @param {any} [a1] - Optional argument 1.
     * @param {any} [a2] - Optional argument 2.
     * @param {any} [a3] - Optional argument 3.
     * @param {any} [a4] - Optional argument 4.
     * @param {any} [a5] - Optional argument 5.
     *
     * @return {boolean} `true` if the event had listeners, else `false`.
     */
    emit: function (event, a1, a2, a3, a4, a5)
    {
        return this.emitter.manager.emit(event, a1, a2, a3, a4, a5);
    },

    /**
     * Checks to see if this Particle is alive and updating.
     *
     * @method Phaser.GameObjects.Particles.Particle#isAlive
     * @since 3.0.0
     *
     * @return {boolean} `true` if this Particle is alive and updating, otherwise `false`.
     */
    isAlive: function ()
    {
        return (this.lifeCurrent > 0);
    },

    /**
     * Resets the position of this particle back to zero.
     *
     * @method Phaser.GameObjects.Particles.Particle#resetPosition
     * @since 3.16.0
     */
    resetPosition: function ()
    {
        this.x = 0;
        this.y = 0;
    },

    /**
     * Starts this Particle from the given coordinates.
     *
     * @method Phaser.GameObjects.Particles.Particle#fire
     * @since 3.0.0
     *
     * @param {number} [x] - The x coordinate to launch this Particle from.
     * @param {number} [y] - The y coordinate to launch this Particle from.
     */
    fire: function (x, y)
    {
        var emitter = this.emitter;
        var ops = emitter.ops;

        var anim = emitter.getAnim();

        if (anim)
        {
            this.anims.play(anim);
        }
        else
        {
            this.frame = emitter.getFrame();
            this.texture = this.frame.texture;
        }

        if (!this.frame)
        {
            throw new Error('Particle has no texture frame');
        }

        //  Updates particle.x and particle.y during this call
        emitter.getEmitZone(this);

        if (x === undefined)
        {
            this.x += ops.x.onEmit(this, 'x');
        }
        else if (ops.x.steps > 0)
        {
            //  EmitterOp is stepped but x was forced (follower?) so use it
            this.x += x + ops.x.onEmit(this, 'x');
        }
        else
        {
            this.x += x;
        }

        if (y === undefined)
        {
            this.y += ops.y.onEmit(this, 'y');
        }
        else if (ops.y.steps > 0)
        {
            //  EmitterOp is stepped but y was forced (follower?) so use it
            this.y += y + ops.y.onEmit(this, 'y');
        }
        else
        {
            this.y += y;
        }

        this.life = ops.lifespan.onEmit(this, 'lifespan');
        this.lifeCurrent = this.life;
        this.lifeT = 0;

        var sx = ops.speedX.onEmit(this, 'speedX');
        var sy = (ops.speedY.active) ? ops.speedY.onEmit(this, 'speedY') : sx;

        if (emitter.radial)
        {
            var rad = DegToRad(ops.angle.onEmit(this, 'angle'));

            this.velocityX = Math.cos(rad) * Math.abs(sx);
            this.velocityY = Math.sin(rad) * Math.abs(sy);
        }
        else if (emitter.moveTo)
        {
            var mx = ops.moveToX.onEmit(this, 'moveToX');
            var my = ops.moveToY.onEmit(this, 'moveToY');
            var lifeS = this.life / 1000;

            this.velocityX = (mx - this.x) / lifeS;
            this.velocityY = (my - this.y) / lifeS;
        }
        else
        {
            this.velocityX = sx;
            this.velocityY = sy;
        }

        if (emitter.acceleration)
        {
            this.accelerationX = ops.accelerationX.onEmit(this, 'accelerationX');
            this.accelerationY = ops.accelerationY.onEmit(this, 'accelerationY');
        }

        this.maxVelocityX = ops.maxVelocityX.onEmit(this, 'maxVelocityX');
        this.maxVelocityY = ops.maxVelocityY.onEmit(this, 'maxVelocityY');

        this.delayCurrent = ops.delay.onEmit(this, 'delay');

        this.scaleX = ops.scaleX.onEmit(this, 'scaleX');
        this.scaleY = ops.scaleY.onEmit(this, 'scaleY');

        this.angle = ops.rotate.onEmit(this, 'rotate');
        this.rotation = DegToRad(this.angle);

        this.bounce = ops.bounce.onEmit(this, 'bounce');

        this.alpha = ops.alpha.onEmit(this, 'alpha');

        this.tint = ops.tint.onEmit(this, 'tint');
    },

    /**
     * An internal method that calculates the velocity of the Particle.
     *
     * @method Phaser.GameObjects.Particles.Particle#computeVelocity
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - The Emitter that is updating this Particle.
     * @param {number} delta - The delta time in ms.
     * @param {number} step - The delta value divided by 1000.
     * @param {array} processors - Particle processors (gravity wells).
     */
    computeVelocity: function (emitter, delta, step, processors, t)
    {
        var ops = emitter.ops;

        var vx = this.velocityX;
        var vy = this.velocityY;

        var ax = ops.accelerationX.onUpdate(this, 'accelerationX', t, this.accelerationX);
        var ay = ops.accelerationY.onUpdate(this, 'accelerationY', t, this.accelerationY);

        var mx = ops.maxVelocityX.onUpdate(this, 'maxVelocityX', t, this.maxVelocityX);
        var my = ops.maxVelocityY.onUpdate(this, 'maxVelocityY', t, this.maxVelocityY);

        vx += (emitter.gravityX * step);
        vy += (emitter.gravityY * step);

        if (ax)
        {
            vx += (ax * step);
        }

        if (ay)
        {
            vy += (ay * step);
        }

        if (vx > mx)
        {
            vx = mx;
        }
        else if (vx < -mx)
        {
            vx = -mx;
        }

        if (vy > my)
        {
            vy = my;
        }
        else if (vy < -my)
        {
            vy = -my;
        }

        this.velocityX = vx;
        this.velocityY = vy;

        //  Apply any additional processors
        for (var i = 0; i < processors.length; i++)
        {
            processors[i].update(this, delta, step);
        }
    },

    /**
     * Checks if this Particle is still within the bounds defined by the given Emitter.
     *
     * If not, and depending on the Emitter collision flags, the Particle may either stop or rebound.
     *
     * @method Phaser.GameObjects.Particles.Particle#checkBounds
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - The Emitter to check the bounds against.
     */
    checkBounds: function (emitter)
    {
        var bounds = emitter.bounds;
        var bounce = -this.bounce;

        if (this.x < bounds.x && emitter.collideLeft)
        {
            this.x = bounds.x;
            this.velocityX *= bounce;
        }
        else if (this.x > bounds.right && emitter.collideRight)
        {
            this.x = bounds.right;
            this.velocityX *= bounce;
        }

        if (this.y < bounds.y && emitter.collideTop)
        {
            this.y = bounds.y;
            this.velocityY *= bounce;
        }
        else if (this.y > bounds.bottom && emitter.collideBottom)
        {
            this.y = bounds.bottom;
            this.velocityY *= bounce;
        }
    },

    /**
     * The main update method for this Particle.
     *
     * Updates its life values, computes the velocity and repositions the Particle.
     *
     * @method Phaser.GameObjects.Particles.Particle#update
     * @since 3.0.0
     *
     * @param {number} delta - The delta time in ms.
     * @param {number} step - The delta value divided by 1000.
     * @param {array} processors - An optional array of update processors.
     *
     * @return {boolean} Returns `true` if this Particle has now expired and should be removed, otherwise `false` if still active.
     */
    update: function (delta, step, processors)
    {
        if (this.delayCurrent > 0)
        {
            this.delayCurrent -= delta;

            return false;
        }

        this.anims.update(0, delta);

        var emitter = this.emitter;
        var ops = emitter.ops;

        //  How far along in life is this particle? (t = 0 to 1)
        var t = 1 - (this.lifeCurrent / this.life);

        this.lifeT = t;

        this.x = ops.x.onUpdate(this, 'x', t, this.x);
        this.y = ops.y.onUpdate(this, 'y', t, this.y);

        if (emitter.moveTo)
        {
            var mx = ops.moveToX.onUpdate(this, 'moveToX', t, emitter.moveToX);
            var my = ops.moveToY.onUpdate(this, 'moveToY', t, emitter.moveToY);
            var lifeS = this.lifeCurrent / 1000;

            this.velocityX = (mx - this.x) / lifeS;
            this.velocityY = (my - this.y) / lifeS;
        }

        this.computeVelocity(emitter, delta, step, processors, t);

        this.x += this.velocityX * step;
        this.y += this.velocityY * step;

        if (emitter.bounds)
        {
            this.checkBounds(emitter);
        }

        if (emitter.getDeathZone(this))
        {
            this.lifeCurrent = 0;

            //  No need to go any further, particle has been killed
            return true;
        }

        this.scaleX = ops.scaleX.onUpdate(this, 'scaleX', t, this.scaleX);
        this.scaleY = ops.scaleY.onUpdate(this, 'scaleY', t, this.scaleY);

        this.angle = ops.rotate.onUpdate(this, 'rotate', t, this.angle);
        this.rotation = DegToRad(this.angle);

        this.alpha = ops.alpha.onUpdate(this, 'alpha', t, this.alpha);

        this.tint = ops.tint.onUpdate(this, 'tint', t, this.tint);

        this.bounce = ops.bounce.onUpdate(this, 'bounce', t, this.bounce);

        this.lifeCurrent -= delta;

        return (this.lifeCurrent <= 0);
    },

    /**
     * This is a NOOP method and does nothing when called.
     *
     * @method Phaser.GameObjects.Particles.Particle#setSizeToFrame
     * @since 3.60.0
     */
    setSizeToFrame: function ()
    {
        //  NOOP
    },

    /**
     * Destroys this Particle.
     *
     * @method Phaser.GameObjects.Particles.Particle#destroy
     * @since 3.60.0
     */
    destroy: function ()
    {
        this.anims.destroy();

        this.anims = null;
        this.emitter = null;
        this.texture = null;
        this.frame = null;
        this.scene = null;
    }

});

module.exports = Particle;
