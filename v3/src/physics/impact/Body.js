//  Phaser.Physics.Impact.Body

var Class = require('../../utils/Class');
var GetVelocity = require('./GetVelocity');
var UpdateMotion = require('./UpdateMotion');
var COLLIDES = require('./COLLIDES');
var TYPE = require('./TYPE');

/**
* An Impact.js compatible physics body.
* This re-creates the properties you'd get on an Entity and the math needed to update them.
*
* @class
*/

var Body = new Class({

    initialize:

    function Body (world, x, y, sx, sy)
    {
        if (sx === undefined) { sx = 16; }
        if (sy === undefined) { sy = 16; }

        this.world = world;

        this.enabled = true;

        this.size = { x: sx, y: sy };
        this.pos = { x: x, y: y };
        this.last = { x: x, y: y };
        this.vel = { x: 0, y: 0 };
        this.accel = { x: 0, y: 0 };
        this.friction = { x: 0, y: 0 };
        this.maxVel = { x: 100, y: 100 };
        this.gravityFactor = 1;
        this.standing = false;
        this.bounciness = 0;
        this.minBounceVelocity = 40;

        this.accelGround = 0;
        this.accelAir = 0;
        this.jumpSpeed = 0;
    
        this.type = TYPE.NONE;
        this.checkAgainst = TYPE.NONE;
        this.collides = COLLIDES.NEVER;
    
        //  min 44 deg, max 136 deg
        this.slopeStanding = { min: 0.767944870877505, max: 2.3736477827122884 };
    },

    reset: function ()
    {
        //  TODO
    },

    update: function (delta)
    {
        this.last.x = this.pos.x;
        this.last.y = this.pos.y;

        this.vel.y += this.world.gravity * delta * this.gravityFactor;
        
        this.vel.x = GetVelocity(delta, this.vel.x, this.accel.x, this.friction.x, this.maxVel.x);
        this.vel.y = GetVelocity(delta, this.vel.y, this.accel.y, this.friction.y, this.maxVel.y);
        
        var mx = this.vel.x * delta;
        var my = this.vel.y * delta;

        var res = this.world.collisionMap.trace(this.pos.x, this.pos.y, mx, my, this.size.x, this.size.y);

        UpdateMotion(this, res);
    },

    skipHash: function ()
    {
        return (!this.enabled || (this.type === 0 && this.checkAgainst === 0 && this.collides === 0));
    },

    touches: function (other)
    {
        return !(
            this.pos.x >= other.pos.x + other.size.x ||
            this.pos.x + this.size.x <= other.pos.x ||
            this.pos.y >= other.pos.y + other.size.y ||
            this.pos.y + this.size.y <= other.pos.y
        );
    },

    setBounce: function (value)
    {
        this.bounciness = value;

        return this;
    },

    setVelocityX: function (x)
    {
        this.vel.x = x;

        return this;
    },

    setVelocityY: function (y)
    {
        this.vel.y = y;

        return this;
    },

    setVelocity: function (x, y)
    {
        this.vel.x = x;
        this.vel.y = y;

        return this;
    },

    setMaxVelocity: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.maxVel.x = x;
        this.maxVel.y = y;

        return this;
    },

    setAccelerationX: function (x)
    {
        this.accel.x = x;

        return this;
    },

    setAccelerationY: function (y)
    {
        this.accel.y = y;

        return this;
    },

    setAcceleration: function (x, y)
    {
        this.accel.x = x;
        this.accel.y = y;

        return this;
    },

    setTypeNone: function ()
    {
        this.type = TYPE.NONE;

        return this;
    },

    setTypeA: function ()
    {
        this.type = TYPE.A;

        return this;
    },

    setTypeB: function ()
    {
        this.type = TYPE.B;

        return this;
    },

    setCheckAgainstNone: function ()
    {
        this.checkAgainst = TYPE.NONE;

        return this;
    },

    setCheckAgainstA: function ()
    {
        this.checkAgainst = TYPE.A;

        return this;
    },

    setCheckAgainstB: function ()
    {
        this.checkAgainst = TYPE.B;

        return this;
    },

    setCollidesNever: function ()
    {
        this.collides = COLLIDES.NEVER;

        return this;
    },

    setLite: function ()
    {
        this.collides = COLLIDES.LITE;

        return this;
    },

    setPassive: function ()
    {
        this.collides = COLLIDES.PASSIVE;

        return this;
    },

    setActive: function ()
    {
        this.collides = COLLIDES.ACTIVE;

        return this;
    },

    setFixed: function ()
    {
        this.collides = COLLIDES.FIXED;

        return this;
    },

    check: function (other)
    {
        //  Overridden by user code
    },

    collideWith: function (other, axis)
    {
        //  Overridden by user code
    }

});

module.exports = Body;
