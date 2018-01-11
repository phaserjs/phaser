//  Phaser.Physics.Arcade.World

var Body = require('./Body');
var Class = require('../../utils/Class');
var Collider = require('./Collider');
var CONST = require('./const');
var GetValue = require('../../utils/object/GetValue');
var Rectangle = require('../../geom/rectangle/Rectangle');
var RTree = require('../../structs/RTree');
var Set = require('../../structs/Set');
var ProcessQueue = require('../../structs/ProcessQueue');
var StaticBody = require('./StaticBody');
var Vector2 = require('../../math/Vector2');

var World = new Class({

    initialize:

    function World (scene, config)
    {
        this.scene = scene;

        this.events = scene.sys.events;

        //  Dynamic Bodies
        this.bodies = new Set();

        //  Static Bodies
        this.staticBodies = new Set();

        this.colliders = new ProcessQueue();

        this.gravity = new Vector2(GetValue(config, 'gravity.x', 0), GetValue(config, 'gravity.y', 0));

        this.bounds = new Rectangle(
            GetValue(config, 'x', 0),
            GetValue(config, 'y', 0),
            GetValue(config, 'width', scene.sys.game.config.width),
            GetValue(config, 'height', scene.sys.game.config.height)
        );

        this.checkCollision = {
            up: GetValue(config, 'checkCollision.up', true),
            down: GetValue(config, 'checkCollision.down', true),
            left: GetValue(config, 'checkCollision.left', true),
            right: GetValue(config, 'checkCollision.right', true)
        };

        this.OVERLAP_BIAS = GetValue(config, 'overlapBias', 4);

        this.TILE_BIAS = GetValue(config, 'tileBias', 16);

        this.forceX = GetValue(config, 'forceX', false);

        this.isPaused = GetValue(config, 'isPaused', false);

        this._total = 0;

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

        this.maxEntries = GetValue(config, 'maxEntries', 16);

        this.tree = new RTree(this.maxEntries, [ '.left', '.top', '.right', '.bottom' ]);
        this.staticTree = new RTree(this.maxEntries, [ '.left', '.top', '.right', '.bottom' ]);

        this.treeMinMax = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

        if (this.drawDebug)
        {
            this.createDebugGraphic();
        }
    },

    enable: function (object, type)
    {
        if (type === undefined) { type = CONST.DYNAMIC_BODY; }

        var i = 1;

        if (Array.isArray(object))
        {
            i = object.length;

            while (i--)
            {
                if (object[i].hasOwnProperty('children'))
                {
                    //  If it's a Group then we do it on the children regardless
                    this.enable(object[i].children.entries, type);
                }
                else
                {
                    this.enableBody(object[i], type);
                }
            }
        }
        else if (object.hasOwnProperty('children'))
        {
            //  If it's a Group then we do it on the children regardless
            this.enable(object.children.entries, type);
        }
        else
        {
            this.enableBody(object, type);
        }
    },

    enableBody: function (object, type)
    {
        if (object.body === null)
        {
            if (type === CONST.DYNAMIC_BODY)
            {
                object.body = new Body(this, object);

                this.bodies.set(object.body);
            }
            else if (type === CONST.STATIC_BODY)
            {
                object.body = new StaticBody(this, object);

                this.staticBodies.set(object.body);

                this.staticTree.insert(object.body);
            }
        }

        return object;
    },

    remove: function (object)
    {
        this.disableBody(object);
    },

    disable: function (object)
    {
        var i = 1;

        if (Array.isArray(object))
        {
            i = object.length;

            while (i--)
            {
                if (object[i].hasOwnProperty('children'))
                {
                    //  If it's a Group then we do it on the children regardless
                    this.disable(object[i].children.entries);
                }
                else
                {
                    this.disableBody(object[i]);
                }
            }
        }
        else if (object.hasOwnProperty('children'))
        {
            //  If it's a Group then we do it on the children regardless
            this.disable(object.children.entries);
        }
        else
        {
            this.disableBody(object);
        }
    },

    disableBody: function (object)
    {
        if (object.body)
        {
            if (object.body.physicsType === CONST.DYNAMIC_BODY)
            {
                this.bodies.delete(object.body);
            }
            else if (object.body.physicsType === CONST.STATIC_BODY)
            {
                this.staticBodies.delete(object.body);
                this.staticTree.remove(object.body);
            }

            object.body.destroy();
            object.body = null;
        }

        return object;
    },

    createDebugGraphic: function ()
    {
        var graphic = this.scene.sys.add.graphics({ x: 0, y: 0 });

        graphic.setZ(Number.MAX_SAFE_INTEGER);

        this.debugGraphic = graphic;

        this.drawDebug = true;

        return graphic;
    },

    setBounds: function (x, y, width, height, checkLeft, checkRight, checkUp, checkDown)
    {
        this.bounds.setTo(x, y, width, height);

        if (checkLeft !== undefined)
        {
            this.setBoundsCollision(checkLeft, checkRight, checkUp, checkDown);
        }

        return this;
    },

    setBoundsCollision: function (left, right, up, down)
    {
        if (left === undefined) { left = true; }
        if (right === undefined) { right = true; }
        if (up === undefined) { up = true; }
        if (down === undefined) { down = true; }

        this.checkCollision.left = left;
        this.checkCollision.right = right;
        this.checkCollision.up = up;
        this.checkCollision.down = down;

        return this;
    },

    pause: function ()
    {
        this.isPaused = true;

        return this;
    },

    resume: function ()
    {
        this.isPaused = false;

        return this;
    },

    addCollider: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        var collider = new Collider(this, false, object1, object2, collideCallback, processCallback, callbackContext);

        this.colliders.add(collider);

        return collider;
    },

    addOverlap: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        var collider = new Collider(this, true, object1, object2, collideCallback, processCallback, callbackContext);

        this.colliders.add(collider);

        return collider;
    },

    removeCollider: function (collider)
    {
        this.colliders.remove(collider);
    },

    update: function (time, delta)
    {
        if (this.isPaused || this.bodies.size === 0)
        {
            return;
        }

        // this.delta = Math.min(delta / 1000, this.maxStep) * this.timeScale;
        delta /= 1000;

        this.delta = delta;

        //  Update all active bodies

        var i;
        var body;
        var bodies = this.bodies.entries;
        var len = bodies.length;

        for (i = 0; i < len; i++)
        {
            body = bodies[i];

            if (body.enable)
            {
                body.update(delta);
            }
        }

        //  Populate our dynamic collision tree
        this.tree.clear();
        this.tree.load(bodies);

        //  Process any colliders
        var colliders = this.colliders.update();

        for (i = 0; i < colliders.length; i++)
        {
            var collider = colliders[i];

            if (collider.active)
            {
                collider.update();
            }
        }
    },

    postUpdate: function ()
    {
        var i;
        var body;
        var bodies = this.bodies.entries;
        var len = bodies.length;

        for (i = 0; i < len; i++)
        {
            body = bodies[i];

            if (body.enable)
            {
                body.postUpdate();
            }
        }

        if (this.drawDebug)
        {
            var graphics = this.debugGraphic;

            graphics.clear();

            for (i = 0; i < len; i++)
            {
                body = bodies[i];

                if (body.willDrawDebug())
                {
                    body.drawDebug(graphics);
                }
            }

            bodies = this.staticBodies.entries;
            len = bodies.length;

            for (i = 0; i < len; i++)
            {
                body = bodies[i];

                if (body.willDrawDebug())
                {
                    body.drawDebug(graphics);
                }
            }
        }
    },

    updateMotion: require('./inc/UpdateMotion'),
    computeVelocity: require('./inc/ComputeVelocity'),
    separate: require('./inc/Separate'),
    separateCircle: require('./inc/SeparateCircle'),
    intersects: require('./inc/Intersects'),
    circleBodyIntersects: require('./inc/CircleBodyIntersects'),
    overlap: require('./inc/Overlap'),
    collide: require('./inc/Collide'),
    collideObjects: require('./inc/CollideObjects'),
    collideHandler: require('./inc/CollideHandler'),
    collideSpriteVsSprite: require('./inc/CollideSpriteVsSprite'),
    collideSpriteVsGroup: require('./inc/CollideSpriteVsGroup'),
    collideGroupVsTilemapLayer: require('./inc/CollideGroupVsTilemapLayer'),
    collideSpriteVsTilemapLayer: require('./inc/CollideSpriteVsTilemapLayer'),

    //  Utils
    accelerateTo: require('./utils/AccelerateTo'),
    accelerateToObject: require('./utils/AccelerateToObject'),
    closest: require('./utils/Closest'),
    furthest: require('./utils/Furthest'),
    moveTo: require('./utils/MoveTo'),
    moveToObject: require('./utils/MoveToObject'),
    velocityFromAngle: require('./utils/VelocityFromAngle'),
    velocityFromRotation: require('./utils/VelocityFromRotation'),

    //  TODO
    collideGroupVsGroup: function (group1, group2, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        if (group1.length === 0 || group2.length === 0)
        {
            return;
        }
    },

    shutdown: function ()
    {

    },

    destroy: function ()
    {

    }

});

module.exports = World;
