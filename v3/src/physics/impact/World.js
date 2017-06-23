//  Phaser.Physics.Impact.World

var Class = require('../../utils/Class');
var Set = require('../../structs/Set');
var Body = require('./Body');
var Solver = require('./Solver');
var CollisionMap = require('./CollisionMap');
var COLLIDES = require('./COLLIDES');
var TYPE = require('./TYPE');

var World = new Class({

    initialize:

    function World (gravity, cellSize)
    {
        if (gravity === undefined) { gravity = 0; }
        if (cellSize === undefined) { cellSize = 64; }

        this.bodies = new Set();

        this.gravity = gravity;

        //  Spatial hash cell dimensions
        this.cellSize = cellSize;

        this.collisionMap = new CollisionMap();

        this.delta = 0;
    },

    create: function (x, y, sizeX, sizeY)
    {
        var body = new Body(this, x, y, sizeX, sizeY);

        this.bodies.set(body);

        return body;
    },

    update: function (time, delta)
    {
        if (this.bodies.size === 0)
        {
            return;
        }

        //  Impact uses a divided delta value
        delta /= 1000;

        this.delta = delta;

        //  Update all bodies

        this.bodies.iterate(function (body) {

            if (body.enabled)
            {
                body.update(delta);
            }

        });

        //  Run collision against them all

        var hash = {};
        var size = this.cellSize;

        var bodies = this.bodies.entries;

        for (var i = 0; i < bodies.length; i++)
        {
            var body = bodies[i];

            if (body.skipHash())
            {
                continue;
            }
            else
            {
                this.checkHash(body, hash, size);
            }
        }
    },

    //  Check the body against the spatial hash
    checkHash: function (body, hash, size)
    {
        console.log('checkHash');

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
            console.log('solve');
            Solver(this, bodyA, bodyB);
        }
    }

});

module.exports = World;
