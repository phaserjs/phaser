//  Phaser.Physics.Impact.Body

var Class = require('../../utils/Class');
var COLLIDES = require('./COLLIDES');
var GetVelocity = require('./GetVelocity');
var TYPE = require('./TYPE');
var UpdateMotion = require('./UpdateMotion');

/**
* An Impact.js compatible physics body.
* This re-creates the properties you'd get on an Entity and the math needed to update them.
*/

var Body = new Class({

    initialize:

    function Body (world, x, y, sx, sy)
    {
        if (sx === undefined) { sx = 16; }
        if (sy === undefined) { sy = sx; }

        this.world = world;

        this.gameObject = null;

        this.enabled = true;

        this.parent;

        this.id = world.getNextID();

        this.name = '';

        this.size = { x: sx, y: sy };
        this.pos = { x: x, y: y };
        this.last = { x: x, y: y };
        this.vel = { x: 0, y: 0 };
        this.accel = { x: 0, y: 0 };
        this.friction = { x: 0, y: 0 };
        this.maxVel = { x: 100, y: 100 };

        this.standing = false;

        this.gravityFactor = 1;
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

    reset: function (x, y)
    {
        this.pos = { x: x, y: y };
        this.last = { x: x, y: y };
        this.vel = { x: 0, y: 0 };
        this.accel = { x: 0, y: 0 };
        this.friction = { x: 0, y: 0 };
        this.maxVel = { x: 100, y: 100 };

        this.standing = false;

        this.gravityFactor = 1;
        this.bounciness = 0;
        this.minBounceVelocity = 40;

        this.accelGround = 0;
        this.accelAir = 0;
        this.jumpSpeed = 0;
    
        this.type = TYPE.NONE;
        this.checkAgainst = TYPE.NONE;
        this.collides = COLLIDES.NEVER;
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

        if (this.handleMovementTrace(res))
        {
            UpdateMotion(this, res);
        }

        if (this.gameObject)
        {
            this.gameObject.setPosition(this.pos.x, this.pos.y);
        }
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

    setGameObject: function (gameObject)
    {
        this.gameObject = gameObject;

        return this;
    },

    toJSON: function ()
    {
        var output = {
            name: this.name,
            size: { x: this.size.x, y: this.size.y },
            pos: { x: this.pos.x, y: this.pos.y },
            vel: { x: this.vel.x, y: this.vel.y },
            accel: { x: this.accel.x, y: this.accel.y },
            friction: { x: this.friction.x, y: this.friction.y },
            maxVel: { x: this.maxVel.x, y: this.maxVel.y },
            gravityFactor: this.gravityFactor,
            bounciness: this.bounciness,
            minBounceVelocity: this.minBounceVelocity,
            type: this.type,
            checkAgainst: this.checkAgainst,
            collides: this.collides
        };

        return output;
    },

    fromJSON: function (config)
    {
        //  TODO
    },

    check: function (other)
    {
        //  Overridden by user code
    },

    collideWith: function (other, axis)
    {
        //  Overridden by user code
    },

    handleMovementTrace: function (res)
    {
        //  Overridden by user code

        return true;
    },

    destroy: function ()
    {
        this.enabled = false;

        this.world = null;

        this.gameObject = null;

        this.parent = null;
    }

});

module.exports = Body;
