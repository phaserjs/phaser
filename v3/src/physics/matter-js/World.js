//  Phaser.Physics.Matter.World

var Bodies = require('./lib/factory/Bodies');
var Class = require('../../utils/Class');
var Engine = require('./lib/core/Engine');
var EventDispatcher = require('../../events/EventDispatcher');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetValue = require('../../utils/object/GetValue');
var MatterBody = require('./lib/body/Body');
var MatterEvents = require('./lib/core/Events');
var MatterWorld = require('./lib/body/World');
var PhysicsEvent = require('./events/');

var World = new Class({

    initialize:

    function World (scene, config)
    {
        this.scene = scene;

        this.engine = Engine.create(config);

        this.localWorld = this.engine.world;

        this.events = new EventDispatcher();

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

        this.setEventsProxy();
    },

    setEventsProxy: function ()
    {
        var localEvents = this.events;

        MatterEvents.on(this.engine, 'beforeUpdate', function (event) {

            localEvents.dispatch(new PhysicsEvent.BEFORE_UPDATE(event));

        });

        MatterEvents.on(this.engine, 'afterUpdate', function (event) {

            localEvents.dispatch(new PhysicsEvent.AFTER_UPDATE(event));

        });

        MatterEvents.on(this.engine, 'collisionStart', function (event) {

            localEvents.dispatch(new PhysicsEvent.COLLISION_START(event.pairs));

        });

        MatterEvents.on(this.engine, 'collisionActive', function (event) {

            localEvents.dispatch(new PhysicsEvent.COLLISION_ACTIVE(event));

        });

        MatterEvents.on(this.engine, 'collisionEnd', function (event) {

            localEvents.dispatch(new PhysicsEvent.COLLISION_END(event));

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
                this.localWorld.remove(wall);
            }

            //  adjust center
            x += (width / 2);
            y += (height / 2);

            this.walls[position] = this.create(x, y, width, height, { isStatic: true });
        }
        else
        {
            if (wall)
            {
                this.localWorld.remove(wall);
            }

            this.walls[position] = null;
        }
    },

    setGravity: function (x, y, scale)
    {
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

    //  body can be single or an array
    add: function (body)
    {
        MatterWorld.add(this.localWorld, body);

        return this;
    },

    nextGroup: function (isNonColliding)
    {
        return Body.nextGroup(isNonColliding);
    },

    nextCategory: function ()
    {
        return MatterBody.nextCategory();
    },

    update: function (time, delta)
    {
        var correction = 1;

        Engine.update(this.engine, delta, correction);
    },

    postUpdate: function ()
    {
        //  NOOP
    },

    shutdown: function ()
    {

    },

    destroy: function ()
    {

    }

});

module.exports = World;
