var AnimationComponent = require('../../gameobjects/components/Animation');
var Bodies = require('./lib/factory/Bodies');
var Class = require('../../utils/Class');
var Components = require('./components');
var GetFastValue = require('../../utils/object/GetFastValue');
var HasValue = require('../../utils/object/HasValue');
var Extend = require('../../utils/object/Extend');
var Body = require('./lib/body/Body');
var Vertices = require('./lib/geometry/Vertices');

var MatterTileBody = new Class({

    Mixins: [
        Components.Bounce,
        Components.Collision,
        Components.Friction,
        Components.Gravity,
        Components.Mass,
        Components.Sensor,
        Components.Sleep,
        Components.Static
    ],

    initialize:

    function MatterTileBody (world, tile, options)
    {
        this.tile = tile;
        this.world = world;

        // A tile is only allowed one matter body
        if (tile.physics.matterBody)
        {
            tile.physics.matterBody.destroy();
        }
        tile.physics.matterBody = this;

        // Set the body either from an existing body (if provided), the shapes in the tileset
        // collision layer (if it exists) or a rectangle matching the tile.
        var body = GetFastValue(options, 'body', null);
        var addToWorld = GetFastValue(options, 'addToWorld', true);
        if (!body)
        {
            var collisionGroup = tile.getCollisionGroup();
            var collisionObjects = GetFastValue(collisionGroup, 'objects', []);
            if (collisionObjects.length > 0)
            {
                this.setFromTileCollision(options);
            }
            else
            {
                this.setFromTileRectangle(options);
            }
        }
        else
        {
            this.setBody(body, addToWorld);
        }
    },

    setFromTileRectangle: function (options)
    {
        if (options === undefined) { options = {}; }
        if (!HasValue(options, "isStatic")) { options.isStatic = true; }
        if (!HasValue(options, "addToWorld")) { options.addToWorld = true; }

        var bounds = this.tile.getBounds();
        var cx = bounds.x + (bounds.w / 2);
        var cy = bounds.y + (bounds.y / 2);
        var body = Bodies.rectangle(cx, cy, bounds.w, bounds.h, options);
        this.setBody(body, options.addToWorld);

        return this;
    },

    setFromTileCollision: function (options)
    {
        if (options === undefined) { options = {}; }
        if (!HasValue(options, "isStatic")) { options.isStatic = true; }
        if (!HasValue(options, "addToWorld")) { options.addToWorld = true; }

        var tileX = this.tile.getLeft();
        var tileY = this.tile.getTop();
        var collisionGroup = this.tile.getCollisionGroup();
        var collisionObjects = GetFastValue(collisionGroup, 'objects', []);

        var parts = [];
        for (var i = 0; i < collisionObjects.length; i++)
        {
            var object = collisionObjects[i];
            var ox = tileX + object.x;
            var oy = tileY + object.y;
            var ow = object.width;
            var oh = object.height;
            var body = null;

            if (object.rectangle)
            {
                body = Bodies.rectangle(ox + ow / 2, oy + oh / 2, ow, oh, options);
            }
            else if (object.ellipse)
            {
                body = Bodies.circle(ox + ow / 2, oy + oh / 2, ow / 2, options);
            }
            else if (object.polygon || object.polyline)
            {
                // Polygons and polylines are both treated as closed polygons. Concave shapes are
                // supported if poly-decomp library is included, but it's best to manually create
                // convex polygons.
                var originalPoints = object.polygon ? object.polygon : object.polyline;
                var points = originalPoints.map(function (p) {
                    return { x: p[0], y: p[1] };
                });
                var vertices = Vertices.create(points);

                // Translate from object position to center of mass
                var center = Vertices.centre(vertices);
                body = Bodies.fromVertices(ox + center.x, oy + center.y, vertices, options);
            }

            if (body)
            {
                parts.push(body);
            }
        }

        if (parts.length === 1)
        {
            this.setBody(parts[0], options.addToWorld);
        }
        else if (parts.length > 1)
        {
            options.parts = parts;
            this.setBody(Body.create(options), options.addToWorld);
        }

        return this;
    },

    setBody: function (body, addToWorld)
    {
        if (addToWorld === undefined) { addToWorld = true; }

        if (this.body)
        {
            this.removeBody();
        }

        this.body = body;
        this.body.gameObject = this;

        if (addToWorld)
        {
            this.world.add(this.body);
        }

        return this;
    },

    removeBody: function ()
    {
        if (this.body)
        {
            this.world.remove(this.body);
            this.body.gameObject = undefined;
            this.body = undefined;
        }
    },

    destroy: function ()
    {
        this.removeBody();
        tile.physics.matterBody = undefined;
    }
});

module.exports = MatterTileBody;
