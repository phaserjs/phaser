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

        /**
        * @property {object} walls - An object containing the 4 wall bodies that bound the physics world.
        */
        this.walls = { left: null, right: null, top: null, bottom: null };
    
        this._lastId = 0;

        if (this.drawDebug)
        {
            this.createDebugGraphic();
        }
    },

    /**
    * Sets the bounds of the Physics world to match the given world pixel dimensions.
    * You can optionally set which 'walls' to create: left, right, top or bottom.
    * If none of the walls are given it will default to use the walls settings it had previously.
    * I.e. if you previously told it to not have the left or right walls, and you then adjust the world size
    * the newly created bounds will also not have the left and right walls.
    * Explicitly state them in the parameters to override this.
    *
    * @method Phaser.Physics.P2#setBounds
    * @param {number} x - The x coordinate of the top-left corner of the bounds.
    * @param {number} y - The y coordinate of the top-left corner of the bounds.
    * @param {number} width - The width of the bounds.
    * @param {number} height - The height of the bounds.
    * @param {boolean} [left=true] - If true will create the left bounds wall.
    * @param {boolean} [right=true] - If true will create the right bounds wall.
    * @param {boolean} [top=true] - If true will create the top bounds wall.
    * @param {boolean} [bottom=true] - If true will create the bottom bounds wall.
    */
    setBounds: function (x, y, width, height, thickness, left, right, top, bottom)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.scene.sys.game.config.width; }
        if (height === undefined) { height = this.scene.sys.game.config.height; }
        if (thickness === undefined) { thickness = 64; }
        if (left === undefined) { left = true; }
        if (right === undefined) { right = true; }
        if (top === undefined) { top = true; }
        if (bottom === undefined) { bottom = true; }

        this.updateWall(left, 'left', x - thickness, y, thickness, height);
        this.updateWall(right, 'right', x + width, y, thickness, height);
        this.updateWall(top, 'top', x, y - thickness, width, thickness);
        this.updateWall(bottom, 'bottom', x, y + height, width, thickness);

        return this;
    },

    //  position = 'left', 'right', 'top' or 'bottom'
    updateWall: function (add, position, x, y, width, height)
    {
        var wall = this.walls[position];

        if (add)
        {
            if (wall)
            {
                wall.setSize(x, y, width, height);
            }
            else
            {
                this.walls[position] = this.create(x, y, width, height);
                this.walls[position].name = position;
                this.walls[position].gravityFactor = 0;
                this.walls[position].collides = COLLIDES.FIXED;
            }
        }
        else
        {
            if (wall)
            {
                this.bodies.remove(wall);
            }

            this.walls[position] = null;
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
