//  Phaser.Physics.Arcade.World

var Body = require('./Body');
var Class = require('../../utils/Class');
var GetValue = require('../../utils/object/GetValue');
var Rectangle = require('../../geom/rectangle/Rectangle');
var RTree = require('../../structs/RTree');
var Set = require('../../structs/Set');
var Vector2 = require('../../math/Vector2');

var World = new Class({

    initialize:

    function World (scene, config)
    {
        this.scene = scene;

        this.events = scene.sys.events;

        this.bodies = new Set();

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

        this.forceX = GetValue(config, 'forceX', false);

        this.isPaused = GetValue(config, 'isPaused', false);

        this._total = 0;

        this.drawDebug = GetValue(config, 'debug', false);

        this.debugGraphic;

        this.defaults = {
            debugShowBody: GetValue(config, 'debugShowBody', true),
            debugShowVelocity: GetValue(config, 'debugShowVelocity', true),
            bodyDebugColor: GetValue(config, 'debugBodyColor', 0xff00ff),
            velocityDebugColor: GetValue(config, 'debugVelocityColor', 0x00ff00)
        };

        this.maxEntries = GetValue(config, 'maxEntries', 16);

        this.tree = new RTree(this.maxEntries, [ '.left', '.top', '.right', '.bottom' ]);

        this.treeMinMax = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

        if (this.drawDebug)
        {
            this.createDebugGraphic();
        }
    },

    enable: function (object)
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
                    this.enable(object[i].children.entries);
                }
                else
                {
                    this.enableBody(object[i]);
                }
            }
        }
        else if (object.hasOwnProperty('children'))
        {
            //  If it's a Group then we do it on the children regardless
            this.enable(object.children.entries);
        }
        else
        {
            this.enableBody(object);
        }
    },

    enableBody: function (object)
    {
        if (object.body === null)
        {
            object.body = new Body(this, object);

            this.bodies.set(object.body);
        }

        return object;
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
            this.bodies.delete(object.body);

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

    setBounds: function (x, y, width, height)
    {
        this.bounds.setTo(x, y, width, height);

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

        //  Populate our collision tree
        this.tree.clear();
        this.tree.load(bodies);
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
