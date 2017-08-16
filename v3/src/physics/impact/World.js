//  Phaser.Physics.Impact.World

var Body = require('./Body');
var Class = require('../../utils/Class');
var COLLIDES = require('./COLLIDES');
var CollisionMap = require('./CollisionMap');
var GetFastValue = require('../../utils/object/GetFastValue');
var Set = require('../../structs/Set');
var Solver = require('./Solver');
var TYPE = require('./TYPE');

var World = new Class({

    initialize:

    function World (scene, config)
    {
        this.scene = scene;

        this.events = scene.sys.events;

        this.bodies = new Set();

        this.gravity = GetFastValue(config, 'gravity', 0);

        //  Spatial hash cell dimensions
        this.cellSize = GetFastValue(config, 'cellSize', 64);

        this.collisionMap = new CollisionMap();

        this.timeScale = GetFastValue(config, 'timeScale', 1);

        //  Impacts maximum time step is 20 fps.
        this.maxStep = GetFastValue(config, 'maxStep', 0.05);

        this.enabled = true;

        this.drawDebug = GetFastValue(config, 'debug', false);

        this.debugGraphic;

        this.defaults = {
            debugShowBody: GetFastValue(config, 'debugShowBody', true),
            debugShowVelocity: GetFastValue(config, 'debugShowVelocity', true),
            bodyDebugColor: GetFastValue(config, 'debugBodyColor', 0xff00ff),
            velocityDebugColor: GetFastValue(config, 'debugVelocityColor', 0x00ff00),
            maxVelocityX: GetFastValue(config, 'maxVelocityX', 100),
            maxVelocityY: GetFastValue(config, 'maxVelocityY', 100),
            minBounceVelocity: GetFastValue(config, 'minBounceVelocity', 40),
            gravityFactor: GetFastValue(config, 'gravityFactor', 1),
            bounciness: GetFastValue(config, 'bounciness', 0)
        };

        this.delta = 0;

        this._lastId = 0;

        if (this.drawDebug)
        {
            this.createDebugGraphic();
        }
    },

    createDebugGraphic: function ()
    {
        var graphic = this.scene.sys.add.graphics({ x: 0, y: 0 });

        graphic.setZ(Number.MAX_SAFE_INTEGER);

        this.debugGraphic = graphic;

        this.drawDebug = true;

        return graphic;
    },

    getNextID: function ()
    {
        return this._lastId++;
    },

    create: function (x, y, sizeX, sizeY)
    {
        var body = new Body(this, x, y, sizeX, sizeY);

        this.bodies.set(body);

        return body;
    },

    pause: function ()
    {
        this.enabled = false;

        return this;
    },

    resume: function ()
    {
        this.enabled = true;

        return this;
    },

    update: function (time, delta)
    {
        if (!this.enabled || this.bodies.size === 0)
        {
            return;
        }

        //  Impact uses a divided delta value that is clamped to the maxStep (20fps) maximum
        this.delta = Math.min(delta / 1000, this.maxStep) * this.timeScale;

        //  Update all active bodies

        var i;
        var body;
        var bodies = this.bodies.entries;
        var len = bodies.length;
        var hash = {};
        var size = this.cellSize;
        var debug = this.drawDebug;

        if (debug)
        {
            this.debugGraphic.clear();
        }

        for (i = 0; i < len; i++)
        {
            body = bodies[i];

            if (body.enabled)
            {
                body.update(this.delta, debug);
            }
        }

        //  Run collision against them all now they're in the new positions from the udpate

        for (i = 0; i < len; i++)
        {
            body = bodies[i];

            if (!body.skipHash())
            {
                this.checkHash(body, hash, size);
            }
        }
    },

    //  Check the body against the spatial hash
    checkHash: function (body, hash, size)
    {
        var checked = {};

        var xmin = Math.floor(body.pos.x / size);
        var ymin = Math.floor(body.pos.y / size);
        var xmax = Math.floor((body.pos.x + body.size.x) / size) + 1;
        var ymax = Math.floor((body.pos.y + body.size.y) / size) + 1;

        for (var x = xmin; x < xmax; x++)
        {
            for (var y = ymin; y < ymax; y++)
            {
                if (!hash[x])
                {
                    hash[x] = {};
                    hash[x][y] = [ body ];
                }
                else if (!hash[x][y])
                {
                    hash[x][y] = [ body ];
                }
                else
                {
                    var cell = hash[x][y];

                    for (var c = 0; c < cell.length; c++)
                    {
                        if (body.touches(cell[c]) && !checked[cell[c].id])
                        {
                            checked[cell[c].id] = true;

                            this.checkBodies(body, cell[c]);
                        }
                    }

                    cell.push(body);
                }
            }
        }
    },

    checkBodies: function (bodyA, bodyB)
    {
        //  bitwise checks
        if (bodyA.checkAgainst & bodyB.type)
        {
            bodyA.check(bodyB);
        }
        
        if (bodyB.checkAgainst & bodyA.type)
        {
            bodyB.check(bodyA);
        }
        
        if (bodyA.collides && bodyB.collides && bodyA.collides + bodyB.collides > COLLIDES.ACTIVE)
        {
            Solver(this, bodyA, bodyB);
        }
    },

    //////////////
    //  Helpers //
    //////////////

    setCollidesNever: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].collides = COLLIDES.NEVER;
        }

        return this;
    },

    setLite: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].collides = COLLIDES.LITE;
        }

        return this;
    },

    setPassive: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].collides = COLLIDES.PASSIVE;
        }

        return this;
    },

    setActive: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].collides = COLLIDES.ACTIVE;
        }

        return this;
    },

    setFixed: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].collides = COLLIDES.FIXED;
        }

        return this;
    },

    setTypeNone: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].type = TYPE.NONE;
        }

        return this;
    },

    setTypeA: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].type = TYPE.A;
        }

        return this;
    },

    setTypeB: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].type = TYPE.B;
        }

        return this;
    },

    setAvsB: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].type = TYPE.A;
            bodies[i].checkAgainst = TYPE.B;
        }

        return this;
    },

    setBvsA: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].type = TYPE.B;
            bodies[i].checkAgainst = TYPE.A;
        }

        return this;
    },

    setCheckAgainstNone: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].checkAgainst = TYPE.NONE;
        }

        return this;
    },

    setCheckAgainstA: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].checkAgainst = TYPE.A;
        }

        return this;
    },

    setCheckAgainstB: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].checkAgainst = TYPE.B;
        }

        return this;
    },

    destroy: function ()
    {
        this.scene = null;

        this.events = null;

        this.bodies.clear();

        this.bodies = null;

        this.collisionMap = null;
    }

});

module.exports = World;
