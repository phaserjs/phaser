/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Body = require('./Body');
var Class = require('../../utils/Class');
var COLLIDES = require('./COLLIDES');
var CollisionMap = require('./CollisionMap');
var EventEmitter = require('eventemitter3');
var Events = require('./events');
var GetFastValue = require('../../utils/object/GetFastValue');
var HasValue = require('../../utils/object/HasValue');
var Set = require('../../structs/Set');
var Solver = require('./Solver');
var TILEMAP_FORMATS = require('../../tilemaps/Formats');
var TYPE = require('./TYPE');

/**
 * @classdesc
 * [description]
 *
 * @class World
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Physics.Impact
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Impact World instance belongs.
 * @param {Phaser.Types.Physics.Impact.WorldConfig} config - [description]
 */
var World = new Class({

    Extends: EventEmitter,

    initialize:

    function World (scene, config)
    {
        EventEmitter.call(this);

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.World#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.World#bodies
         * @type {Phaser.Structs.Set.<Phaser.Physics.Impact.Body>}
         * @since 3.0.0
         */
        this.bodies = new Set();

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.World#gravity
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.gravity = GetFastValue(config, 'gravity', 0);

        /**
         * Spatial hash cell dimensions
         *
         * @name Phaser.Physics.Impact.World#cellSize
         * @type {integer}
         * @default 64
         * @since 3.0.0
         */
        this.cellSize = GetFastValue(config, 'cellSize', 64);

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.World#collisionMap
         * @type {Phaser.Physics.Impact.CollisionMap}
         * @since 3.0.0
         */
        this.collisionMap = new CollisionMap();

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.World#timeScale
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.timeScale = GetFastValue(config, 'timeScale', 1);

        /**
         * Impacts maximum time step is 20 fps.
         *
         * @name Phaser.Physics.Impact.World#maxStep
         * @type {number}
         * @default 0.05
         * @since 3.0.0
         */
        this.maxStep = GetFastValue(config, 'maxStep', 0.05);

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.World#enabled
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.enabled = true;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.World#drawDebug
         * @type {boolean}
         * @since 3.0.0
         */
        this.drawDebug = GetFastValue(config, 'debug', false);

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.World#debugGraphic
         * @type {Phaser.GameObjects.Graphics}
         * @since 3.0.0
         */
        this.debugGraphic;

        var _maxVelocity = GetFastValue(config, 'maxVelocity', 100);

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.World#defaults
         * @type {Phaser.Types.Physics.Impact.WorldDefaults}
         * @since 3.0.0
         */
        this.defaults = {
            debugShowBody: GetFastValue(config, 'debugShowBody', true),
            debugShowVelocity: GetFastValue(config, 'debugShowVelocity', true),
            bodyDebugColor: GetFastValue(config, 'debugBodyColor', 0xff00ff),
            velocityDebugColor: GetFastValue(config, 'debugVelocityColor', 0x00ff00),
            maxVelocityX: GetFastValue(config, 'maxVelocityX', _maxVelocity),
            maxVelocityY: GetFastValue(config, 'maxVelocityY', _maxVelocity),
            minBounceVelocity: GetFastValue(config, 'minBounceVelocity', 40),
            gravityFactor: GetFastValue(config, 'gravityFactor', 1),
            bounciness: GetFastValue(config, 'bounciness', 0)
        };

        /**
         * An object containing the 4 wall bodies that bound the physics world.
         *
         * @name Phaser.Physics.Impact.World#walls
         * @type {Phaser.Types.Physics.Impact.WorldWalls}
         * @since 3.0.0
         */
        this.walls = { left: null, right: null, top: null, bottom: null };

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.World#delta
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.delta = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.World#_lastId
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._lastId = 0;

        if (GetFastValue(config, 'setBounds', false))
        {
            var boundsConfig = config['setBounds'];

            if (typeof boundsConfig === 'boolean')
            {
                this.setBounds();
            }
            else
            {
                var x = GetFastValue(boundsConfig, 'x', 0);
                var y = GetFastValue(boundsConfig, 'y', 0);
                var width = GetFastValue(boundsConfig, 'width', scene.sys.scale.width);
                var height = GetFastValue(boundsConfig, 'height', scene.sys.scale.height);
                var thickness = GetFastValue(boundsConfig, 'thickness', 64);
                var left = GetFastValue(boundsConfig, 'left', true);
                var right = GetFastValue(boundsConfig, 'right', true);
                var top = GetFastValue(boundsConfig, 'top', true);
                var bottom = GetFastValue(boundsConfig, 'bottom', true);

                this.setBounds(x, y, width, height, thickness, left, right, top, bottom);
            }
        }

        if (this.drawDebug)
        {
            this.createDebugGraphic();
        }
    },

    /**
     * Sets the collision map for the world either from a Weltmeister JSON level in the cache or from
     * a 2D array. If loading from a Weltmeister level, the map must have a layer called "collision".
     *
     * @method Phaser.Physics.Impact.World#setCollisionMap
     * @since 3.0.0
     *
     * @param {(string|integer[][])} key - Either a string key that corresponds to a Weltmeister level
     * in the cache, or a 2D array of collision IDs.
     * @param {integer} tileSize - The size of a tile. This is optional if loading from a Weltmeister
     * level in the cache.
     *
     * @return {?Phaser.Physics.Impact.CollisionMap} The newly created CollisionMap, or null if the method failed to
     * create the CollisionMap.
     */
    setCollisionMap: function (key, tileSize)
    {
        if (typeof key === 'string')
        {
            var tilemapData = this.scene.cache.tilemap.get(key);

            if (!tilemapData || tilemapData.format !== TILEMAP_FORMATS.WELTMEISTER)
            {
                console.warn('The specified key does not correspond to a Weltmeister tilemap: ' + key);
                return null;
            }

            var layers = tilemapData.data.layer;
            var collisionLayer;
            for (var i = 0; i < layers.length; i++)
            {
                if (layers[i].name === 'collision')
                {
                    collisionLayer = layers[i];
                    break;
                }
            }

            if (tileSize === undefined) { tileSize = collisionLayer.tilesize; }

            this.collisionMap = new CollisionMap(tileSize, collisionLayer.data);
        }
        else if (Array.isArray(key))
        {
            this.collisionMap = new CollisionMap(tileSize, key);
        }
        else
        {
            console.warn('Invalid Weltmeister collision map data: ' + key);
        }

        return this.collisionMap;
    },

    /**
     * Sets the collision map for the world from a tilemap layer. Only tiles that are marked as
     * colliding will be used. You can specify the mapping from tiles to slope IDs in a couple of
     * ways. The easiest is to use Tiled and the slopeTileProperty option. Alternatively, you can
     * manually create a slopeMap that stores the mapping between tile indices and slope IDs.
     *
     * @method Phaser.Physics.Impact.World#setCollisionMapFromTilemapLayer
     * @since 3.0.0
     *
     * @param {(Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} tilemapLayer - The tilemap layer to use.
     * @param {Phaser.Types.Physics.Impact.CollisionOptions} [options] - Options for controlling the mapping from tiles to slope IDs.
     *
     * @return {Phaser.Physics.Impact.CollisionMap} The newly created CollisionMap.
     */
    setCollisionMapFromTilemapLayer: function (tilemapLayer, options)
    {
        if (options === undefined) { options = {}; }
        var slopeProperty = GetFastValue(options, 'slopeProperty', null);
        var slopeMap = GetFastValue(options, 'slopeMap', null);
        var collidingSlope = GetFastValue(options, 'defaultCollidingSlope', null);
        var nonCollidingSlope = GetFastValue(options, 'defaultNonCollidingSlope', 0);

        var layerData = tilemapLayer.layer;
        var tileSize = layerData.baseTileWidth;
        var collisionData = [];

        for (var ty = 0; ty < layerData.height; ty++)
        {
            collisionData[ty] = [];

            for (var tx = 0; tx < layerData.width; tx++)
            {
                var tile = layerData.data[ty][tx];

                if (tile && tile.collides)
                {
                    if (slopeProperty !== null && HasValue(tile.properties, slopeProperty))
                    {
                        collisionData[ty][tx] = parseInt(tile.properties[slopeProperty], 10);
                    }
                    else if (slopeMap !== null && HasValue(slopeMap, tile.index))
                    {
                        collisionData[ty][tx] = slopeMap[tile.index];
                    }
                    else if (collidingSlope !== null)
                    {
                        collisionData[ty][tx] = collidingSlope;
                    }
                    else
                    {
                        collisionData[ty][tx] = tile.index;
                    }
                }
                else
                {
                    collisionData[ty][tx] = nonCollidingSlope;
                }
            }
        }

        this.collisionMap = new CollisionMap(tileSize, collisionData);

        return this.collisionMap;
    },

    /**
     * Sets the bounds of the Physics world to match the given world pixel dimensions.
     * You can optionally set which 'walls' to create: left, right, top or bottom.
     * If none of the walls are given it will default to use the walls settings it had previously.
     * I.e. if you previously told it to not have the left or right walls, and you then adjust the world size
     * the newly created bounds will also not have the left and right walls.
     * Explicitly state them in the parameters to override this.
     *
     * @method Phaser.Physics.Impact.World#setBounds
     * @since 3.0.0
     *
     * @param {number} [x] - The x coordinate of the top-left corner of the bounds.
     * @param {number} [y] - The y coordinate of the top-left corner of the bounds.
     * @param {number} [width] - The width of the bounds.
     * @param {number} [height] - The height of the bounds.
     * @param {number} [thickness=64] - [description]
     * @param {boolean} [left=true] - If true will create the left bounds wall.
     * @param {boolean} [right=true] - If true will create the right bounds wall.
     * @param {boolean} [top=true] - If true will create the top bounds wall.
     * @param {boolean} [bottom=true] - If true will create the bottom bounds wall.
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    setBounds: function (x, y, width, height, thickness, left, right, top, bottom)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.scene.sys.scale.width; }
        if (height === undefined) { height = this.scene.sys.scale.height; }
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

    /**
     * position = 'left', 'right', 'top' or 'bottom'
     *
     * @method Phaser.Physics.Impact.World#updateWall
     * @since 3.0.0
     *
     * @param {boolean} add - [description]
     * @param {string} position - [description]
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     */
    updateWall: function (add, position, x, y, width, height)
    {
        var wall = this.walls[position];

        if (add)
        {
            if (wall)
            {
                wall.resetSize(x, y, width, height);
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

    /**
     * Creates a Graphics Game Object used for debug display and enables the world for debug drawing.
     *
     * @method Phaser.Physics.Impact.World#createDebugGraphic
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Graphics} The Graphics object created that will have the debug visuals drawn to it.
     */
    createDebugGraphic: function ()
    {
        var graphic = this.scene.sys.add.graphics({ x: 0, y: 0 });

        graphic.setDepth(Number.MAX_VALUE);

        this.debugGraphic = graphic;

        this.drawDebug = true;

        return graphic;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#getNextID
     * @since 3.0.0
     *
     * @return {integer} [description]
     */
    getNextID: function ()
    {
        return this._lastId++;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#create
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} sizeX - [description]
     * @param {number} sizeY - [description]
     *
     * @return {Phaser.Physics.Impact.Body} The Body that was added to this World.
     */
    create: function (x, y, sizeX, sizeY)
    {
        var body = new Body(this, x, y, sizeX, sizeY);

        this.bodies.set(body);

        return body;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#remove
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body} object - The Body to remove from this World.
     */
    remove: function (object)
    {
        this.bodies.delete(object);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#pause
     * @fires Phaser.Physics.Impact.Events#PAUSE
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    pause: function ()
    {
        this.enabled = false;

        this.emit(Events.PAUSE);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#resume
     * @fires Phaser.Physics.Impact.Events#RESUME
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    resume: function ()
    {
        this.enabled = true;

        this.emit(Events.RESUME);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#update
     * @since 3.0.0
     *
     * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    update: function (time, delta)
    {
        if (!this.enabled || this.bodies.size === 0)
        {
            return;
        }

        //  Impact uses a divided delta value that is clamped to the maxStep (20fps) maximum

        var clampedDelta = Math.min(delta / 1000, this.maxStep) * this.timeScale;

        this.delta = clampedDelta;

        //  Update all active bodies

        var i;
        var body;
        var bodies = this.bodies.entries;
        var len = bodies.length;
        var hash = {};
        var size = this.cellSize;

        for (i = 0; i < len; i++)
        {
            body = bodies[i];

            if (body.enabled)
            {
                body.update(clampedDelta);
            }
        }

        //  Run collision against them all now they're in the new positions from the update

        for (i = 0; i < len; i++)
        {
            body = bodies[i];

            if (body && !body.skipHash())
            {
                this.checkHash(body, hash, size);
            }
        }

        if (this.drawDebug)
        {
            var graphics = this.debugGraphic;

            graphics.clear();

            for (i = 0; i < len; i++)
            {
                body = bodies[i];

                if (body && body.willDrawDebug())
                {
                    body.drawDebug(graphics);
                }
            }
        }
    },

    /**
     * Check the body against the spatial hash.
     *
     * @method Phaser.Physics.Impact.World#checkHash
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body} body - [description]
     * @param {object} hash - [description]
     * @param {number} size - [description]
     */
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

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#checkBodies
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body} bodyA - [description]
     * @param {Phaser.Physics.Impact.Body} bodyB - [description]
     */
    checkBodies: function (bodyA, bodyB)
    {
        //  2 fixed bodies won't do anything
        if (bodyA.collides === COLLIDES.FIXED && bodyB.collides === COLLIDES.FIXED)
        {
            return;
        }

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

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#setCollidesNever
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body[]} bodies - An Array of Impact Bodies to set the collides value on.
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    setCollidesNever: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].collides = COLLIDES.NEVER;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#setLite
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body[]} bodies - An Array of Impact Bodies to set the collides value on.
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    setLite: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].collides = COLLIDES.LITE;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#setPassive
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body[]} bodies - An Array of Impact Bodies to set the collides value on.
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    setPassive: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].collides = COLLIDES.PASSIVE;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#setActive
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body[]} bodies - An Array of Impact Bodies to set the collides value on.
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    setActive: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].collides = COLLIDES.ACTIVE;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#setFixed
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body[]} bodies - An Array of Impact Bodies to set the collides value on.
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    setFixed: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].collides = COLLIDES.FIXED;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#setTypeNone
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body[]} bodies - An Array of Impact Bodies to set the type value on.
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    setTypeNone: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].type = TYPE.NONE;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#setTypeA
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body[]} bodies - An Array of Impact Bodies to set the type value on.
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    setTypeA: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].type = TYPE.A;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#setTypeB
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body[]} bodies - An Array of Impact Bodies to set the type value on.
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    setTypeB: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].type = TYPE.B;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#setAvsB
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body[]} bodies - An Array of Impact Bodies to set the type value on.
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    setAvsB: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].type = TYPE.A;
            bodies[i].checkAgainst = TYPE.B;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#setBvsA
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body[]} bodies - An Array of Impact Bodies to set the type value on.
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    setBvsA: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].type = TYPE.B;
            bodies[i].checkAgainst = TYPE.A;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#setCheckAgainstNone
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body[]} bodies - An Array of Impact Bodies to set the type value on.
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    setCheckAgainstNone: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].checkAgainst = TYPE.NONE;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#setCheckAgainstA
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body[]} bodies - An Array of Impact Bodies to set the type value on.
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    setCheckAgainstA: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].checkAgainst = TYPE.A;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#setCheckAgainstB
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Impact.Body[]} bodies - An Array of Impact Bodies to set the type value on.
     *
     * @return {Phaser.Physics.Impact.World} This World object.
     */
    setCheckAgainstB: function (bodies)
    {
        for (var i = 0; i < bodies.length; i++)
        {
            bodies[i].checkAgainst = TYPE.B;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.removeAllListeners();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.World#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.removeAllListeners();

        this.scene = null;

        this.bodies.clear();

        this.bodies = null;

        this.collisionMap = null;
    }

});

module.exports = World;
