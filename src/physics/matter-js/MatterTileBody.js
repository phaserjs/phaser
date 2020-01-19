/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Bodies = require('./lib/factory/Bodies');
var Body = require('./lib/body/Body');
var Class = require('../../utils/Class');
var Components = require('./components');
var GetFastValue = require('../../utils/object/GetFastValue');
var HasValue = require('../../utils/object/HasValue');
var Vertices = require('./lib/geometry/Vertices');

/**
 * @classdesc
 * A wrapper around a Tile that provides access to a corresponding Matter body. A tile can only
 * have one Matter body associated with it. You can either pass in an existing Matter body for
 * the tile or allow the constructor to create the corresponding body for you. If the Tile has a
 * collision group (defined in Tiled), those shapes will be used to create the body. If not, the
 * tile's rectangle bounding box will be used.
 *
 * The corresponding body will be accessible on the Tile itself via Tile.physics.matterBody.
 *
 * Note: not all Tiled collision shapes are supported. See
 * Phaser.Physics.Matter.TileBody#setFromTileCollision for more information.
 *
 * @class TileBody
 * @memberof Phaser.Physics.Matter
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.Physics.Matter.Components.Bounce
 * @extends Phaser.Physics.Matter.Components.Collision
 * @extends Phaser.Physics.Matter.Components.Friction
 * @extends Phaser.Physics.Matter.Components.Gravity
 * @extends Phaser.Physics.Matter.Components.Mass
 * @extends Phaser.Physics.Matter.Components.Sensor
 * @extends Phaser.Physics.Matter.Components.Sleep
 * @extends Phaser.Physics.Matter.Components.Static
 *
 * @param {Phaser.Physics.Matter.World} world - The Matter world instance this body belongs to.
 * @param {Phaser.Tilemaps.Tile} tile - The target tile that should have a Matter body.
 * @param {Phaser.Types.Physics.Matter.MatterTileOptions} [options] - Options to be used when creating the Matter body.
 */
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
        /**
         * The tile object the body is associated with.
         *
         * @name Phaser.Physics.Matter.TileBody#tile
         * @type {Phaser.Tilemaps.Tile}
         * @since 3.0.0
         */
        this.tile = tile;

        /**
         * The Matter world the body exists within.
         *
         * @name Phaser.Physics.Matter.TileBody#world
         * @type {Phaser.Physics.Matter.World}
         * @since 3.0.0
         */
        this.world = world;

        // Install a reference to 'this' on the tile and ensure there can only be one matter body
        // associated with the tile
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

    /**
     * Sets the current body to a rectangle that matches the bounds of the tile.
     *
     * @method Phaser.Physics.Matter.TileBody#setFromTileRectangle
     * @since 3.0.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBodyTileOptions} [options] - Options to be used when creating the Matter body. See MatterJS.Body for a list of what Matter accepts.
     * 
     * @return {Phaser.Physics.Matter.TileBody} This TileBody object.
     */
    setFromTileRectangle: function (options)
    {
        if (options === undefined) { options = {}; }
        if (!HasValue(options, 'isStatic')) { options.isStatic = true; }
        if (!HasValue(options, 'addToWorld')) { options.addToWorld = true; }

        var bounds = this.tile.getBounds();
        var cx = bounds.x + (bounds.width / 2);
        var cy = bounds.y + (bounds.height / 2);
        var body = Bodies.rectangle(cx, cy, bounds.width, bounds.height, options);

        this.setBody(body, options.addToWorld);

        return this;
    },

    /**
     * Sets the current body from the collision group associated with the Tile. This is typically
     * set up in Tiled's collision editor.
     *
     * Note: Matter doesn't support all shapes from Tiled. Rectangles and polygons are directly
     * supported. Ellipses are converted into circle bodies. Polylines are treated as if they are
     * closed polygons. If a tile has multiple shapes, a multi-part body will be created. Concave
     * shapes are supported if poly-decomp library is included. Decomposition is not guaranteed to
     * work for complex shapes (e.g. holes), so it's often best to manually decompose a concave
     * polygon into multiple convex polygons yourself.
     *
     * @method Phaser.Physics.Matter.TileBody#setFromTileCollision
     * @since 3.0.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBodyTileOptions} [options] - Options to be used when creating the Matter body. See MatterJS.Body for a list of what Matter accepts.
     * 
     * @return {Phaser.Physics.Matter.TileBody} This TileBody object.
     */
    setFromTileCollision: function (options)
    {
        if (options === undefined) { options = {}; }
        if (!HasValue(options, 'isStatic')) { options.isStatic = true; }
        if (!HasValue(options, 'addToWorld')) { options.addToWorld = true; }

        var sx = this.tile.tilemapLayer.scaleX;
        var sy = this.tile.tilemapLayer.scaleY;
        var tileX = this.tile.getLeft();
        var tileY = this.tile.getTop();
        var collisionGroup = this.tile.getCollisionGroup();
        var collisionObjects = GetFastValue(collisionGroup, 'objects', []);

        var parts = [];

        for (var i = 0; i < collisionObjects.length; i++)
        {
            var object = collisionObjects[i];
            var ox = tileX + (object.x * sx);
            var oy = tileY + (object.y * sy);
            var ow = object.width * sx;
            var oh = object.height * sy;
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
                // Polygons and polylines are both treated as closed polygons
                var originalPoints = object.polygon ? object.polygon : object.polyline;

                var points = originalPoints.map(function (p)
                {
                    return { x: p.x * sx, y: p.y * sy };
                });

                var vertices = Vertices.create(points);

                // Points are relative to the object's origin (first point placed in Tiled), but
                // matter expects points to be relative to the center of mass. This only applies to
                // convex shapes. When a concave shape is decomposed, multiple parts are created and
                // the individual parts are positioned relative to (ox, oy).
                //
                //  Update: 8th January 2019 - the latest version of Matter needs the Vertices adjusted,
                //  regardless if convex or concave.

                var center = Vertices.centre(vertices);

                ox += center.x;
                oy += center.y;

                body = Bodies.fromVertices(ox, oy, vertices, options);
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

    /**
     * Sets the current body to the given body. This will remove the previous body, if one already
     * exists.
     *
     * @method Phaser.Physics.Matter.TileBody#setBody
     * @since 3.0.0
     *
     * @param {MatterJS.BodyType} body - The new Matter body to use.
     * @param {boolean} [addToWorld=true] - Whether or not to add the body to the Matter world.
     * 
     * @return {Phaser.Physics.Matter.TileBody} This TileBody object.
     */
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

    /**
     * Removes the current body from the TileBody and from the Matter world
     *
     * @method Phaser.Physics.Matter.TileBody#removeBody
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Matter.TileBody} This TileBody object.
     */
    removeBody: function ()
    {
        if (this.body)
        {
            this.world.remove(this.body);
            this.body.gameObject = undefined;
            this.body = undefined;
        }

        return this;
    },

    /**
     * Removes the current body from the tile and the world.
     *
     * @method Phaser.Physics.Matter.TileBody#destroy
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Matter.TileBody} This TileBody object.
     */
    destroy: function ()
    {
        this.removeBody();
        this.tile.physics.matterBody = undefined;
    }

});

module.exports = MatterTileBody;
