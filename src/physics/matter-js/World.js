//  Phaser.Physics.Matter.World

var Bodies = require('./lib/factory/Bodies');
var Class = require('../../utils/Class');
var Composite = require('./lib/body/Composite');
var Engine = require('./lib/core/Engine');
var EventEmitter = require('eventemitter3');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetValue = require('../../utils/object/GetValue');
var MatterBody = require('./lib/body/Body');
var MatterEvents = require('./lib/core/Events');
var MatterWorld = require('./lib/body/World');

var World = new Class({

    Extends: EventEmitter,

    initialize:

    function World (scene, config)
    {
        EventEmitter.call(this);

        this.scene = scene;

        this.engine = Engine.create(config);

        this.localWorld = this.engine.world;

        var gravity = GetValue(config, 'gravity', null);

        if (gravity)
        {
            this.setGravity(gravity.x, gravity.y, gravity.scale);
        }

        /**
        * @property {object} walls - An object containing the 4 wall bodies that bound the physics world.
        */
        this.walls = { left: null, right: null, top: null, bottom: null };
    
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
                var width = GetFastValue(boundsConfig, 'width', scene.sys.game.config.width);
                var height = GetFastValue(boundsConfig, 'height', scene.sys.game.config.height);
                var thickness = GetFastValue(boundsConfig, 'thickness', 64);
                var left = GetFastValue(boundsConfig, 'left', true);
                var right = GetFastValue(boundsConfig, 'right', true);
                var top = GetFastValue(boundsConfig, 'top', true);
                var bottom = GetFastValue(boundsConfig, 'bottom', true);

                this.setBounds(x, y, width, height, thickness, left, right, top, bottom);
            }
        }

        this.isPaused = GetValue(config, 'isPaused', false);

        this.drawDebug = GetValue(config, 'debug', false);

        this.debugGraphic;

        this.defaults = {
            debugShowBody: GetValue(config, 'debugShowBody', true),
            debugShowStaticBody: GetValue(config, 'debugShowStaticBody', true),
            debugShowVelocity: GetValue(config, 'debugShowVelocity', true),
            bodyDebugColor: GetValue(config, 'debugBodyColor', 0xff00ff),
            staticBodyDebugColor: GetValue(config, 'debugBodyColor', 0x0000ff),
            velocityDebugColor: GetValue(config, 'debugVelocityColor', 0x00ff00)
        };

        if (this.drawDebug)
        {
            this.createDebugGraphic();
        }

        this.setEventsProxy();
    },

    setEventsProxy: function ()
    {
        var _this = this;
        var engine = this.engine;

        MatterEvents.on(engine, 'beforeUpdate', function (event) {

            _this.emit('beforeupdate', event);

        });

        MatterEvents.on(engine, 'afterUpdate', function (event) {

            _this.emit('afterupdate', event);

        });

        MatterEvents.on(engine, 'collisionStart', function (event) {

            var pairs = event.pairs;
            var bodyA;
            var bodyB;

            if (pairs.length > 0)
            {
                bodyA = pairs[0].bodyA;
                bodyB = pairs[0].bodyB;
            }

            _this.emit('collisionstart', event, bodyA, bodyB);

        });

        MatterEvents.on(engine, 'collisionActive', function (event) {

            var pairs = event.pairs;
            var bodyA;
            var bodyB;

            if (pairs.length > 0)
            {
                bodyA = pairs[0].bodyA;
                bodyB = pairs[0].bodyB;
            }

            _this.emit('collisionactive', event, bodyA, bodyB);

        });

        MatterEvents.on(engine, 'collisionEnd', function (event) {

            var pairs = event.pairs;
            var bodyA;
            var bodyB;

            if (pairs.length > 0)
            {
                bodyA = pairs[0].bodyA;
                bodyB = pairs[0].bodyB;
            }

            _this.emit('collisionend', event, bodyA, bodyB);

        });
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
        if (thickness === undefined) { thickness = 128; }
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
                MatterWorld.remove(this.localWorld, wall);
            }

            //  adjust center
            x += (width / 2);
            y += (height / 2);

            this.walls[position] = this.create(x, y, width, height, { isStatic: true, friction: 0, frictionStatic: 0 });
        }
        else
        {
            if (wall)
            {
                MatterWorld.remove(this.localWorld, wall);
            }

            this.walls[position] = null;
        }
    },

    createDebugGraphic: function ()
    {
        var graphic = this.scene.sys.add.graphics({ x: 0, y: 0 });

        graphic.setZ(Number.MAX_VALUE);

        this.debugGraphic = graphic;

        this.drawDebug = true;

        return graphic;
    },

    disableGravity: function ()
    {
        this.localWorld.gravity.x = 0;
        this.localWorld.gravity.y = 0;
        this.localWorld.gravity.scale = 0;

        return this;
    },

    setGravity: function (x, y, scale)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 1; }

        this.localWorld.gravity.x = x;
        this.localWorld.gravity.y = y;

        if (scale !== undefined)
        {
            this.localWorld.gravity.scale = scale;
        }

        return this;
    },

    create: function (x, y, width, height, options)
    {
        var body = Bodies.rectangle(x, y, width, height, options);

        MatterWorld.add(this.localWorld, body);

        return body;
    },

    //  object can be single or an array, and can be a body, composite or constraint
    add: function (object)
    {
        MatterWorld.add(this.localWorld, object);

        return this;
    },

    remove: function (object, deep)
    {
        var body = (object.body) ? object.body : object;

        Composite.removeBody(this.localWorld, body, deep);

        return this;
    },

    nextGroup: function (isNonColliding)
    {
        return MatterBody.nextGroup(isNonColliding);
    },

    nextCategory: function ()
    {
        return MatterBody.nextCategory();
    },

    update: function (time, delta)
    {
        if (this.isPaused)
        {
            return;
        }

        var correction = 1;

        Engine.update(this.engine, delta, correction);
    },

    postUpdate: function ()
    {
        if (!this.drawDebug)
        {
            return;
        }

        var graphics = this.debugGraphic;
        var bodies = Composite.allBodies(this.localWorld);

        graphics.clear();
        graphics.lineStyle(1, this.defaults.bodyDebugColor);

        for (var i = 0; i < bodies.length; i++)
        {
            var body = bodies[i];

            if (!body.render.visible)
            {
                continue;
            }

            var vertices = body.vertices;

            graphics.moveTo(vertices[0].x, vertices[0].y);

            for (var j = 1; j < vertices.length; j++)
            {
                graphics.lineTo(vertices[j].x, vertices[j].y);
            }

            graphics.lineTo(vertices[0].x, vertices[0].y);

            graphics.strokePath();
        }
    },

    fromPath: function (path, points)
    {
        if (points === undefined) { points = []; }

        var pathPattern = /L?\s*([\-\d\.e]+)[\s,]*([\-\d\.e]+)*/ig;

        path.replace(pathPattern, function(match, x, y)
        {
            points.push({ x: parseFloat(x), y: parseFloat(y) });
        });

        return points;
    },

    shutdown: function ()
    {
        MatterWorld.clear(this.localWorld, false);
        Engine.clear(this.engine);
    },

    destroy: function ()
    {
        this.shutdown();
    }

});

module.exports = World;
