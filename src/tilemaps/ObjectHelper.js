/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2021 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @classdesc
 * The ObjectHelper helps tie objects with `gids` into the tileset
 * that sits behind them.
 *
 * @class ObjectHelper
 * @memberof Phaser.Tilemaps
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Tilemaps.Tileset[]} tilesets - The backing tileset data.
 */
var ObjectHelper = new Class({

    initialize:

    function ObjectHelper (tilesets)
    {
        /**
         * The Tile GIDs array.
         *
         * @name Phaser.Tilemaps.ObjectHelper#gids
         * @type {array}
         * @since 3.60.0
         */
        this.gids = [];

        if (tilesets !== undefined)
        {
            for (var t = 0; t < tilesets.length; ++t)
            {
                var tileset = tilesets[t];

                for (var i = 0; i < tileset.total; ++i)
                {
                    this.gids[tileset.firstgid + i] = tileset;
                }
            }
        }

        /**
         * The Tile GIDs array.
         *
         * @name Phaser.Tilemaps.ObjectHelper#_gids
         * @type {array}
         * @private
         * @since 3.60.0
         */
        this._gids = this.gids;
    },

    /**
     * Enabled if the object helper reaches in to tilesets for data.
     * Disabled if it only uses data directly on a gid object.
     *
     * @name Phaser.Tilemaps.ObjectHelper#enabled
     * @type {boolean}
     * @since 3.60.0
     */
    enabled: {

        get: function ()
        {
            return !!this.gids;
        },

        set: function (v)
        {
            this.gids = v ? this._gids : undefined;
        }

    },

    /**
     * Gets the Tiled `type` field value from the object or the `gid` behind it.
     *
     * @method Phaser.Tilemaps.ObjectHelper#getTypeIncludingTile
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tilemaps.TiledObject} obj - The Tiled object to investigate.
     *
     * @return {?string} The `type` of the object, the tile behind the `gid` of the object, or `undefined`.
     */
    getTypeIncludingTile: function (obj)
    {
        if (obj.type !== undefined && obj.type !== '')
        {
            return obj.type;
        }

        if (!this.gids || obj.gid === undefined)
        {
            return undefined;
        }

        var tileset = this.gids[obj.gid];

        if (!tileset)
        {
            return undefined;
        }

        var tileData = tileset.getTileData(obj.gid);

        if (!tileData)
        {
            return undefined;
        }

        return tileData.type;
    },

    /**
     * Sets the sprite texture data as specified (usually in a config) or, failing that,
     * as specified in the `gid` of the object being loaded (if any).
     *
     * This fallback will only work if the tileset was loaded as a spritesheet matching
     * the geometry of sprites fed into tiled, so that, for example: "tile id #`3`"" within
     * the tileset is the same as texture frame `3` from the image of the tileset.
     *
     * @method Phaser.Tilemaps.ObjectHelper#setTextureAndFrame
     * @since 3.60.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite - The Game Object to modify.
     * @param {string|Phaser.Textures.Texture} [key] - The texture key to set (or else the `obj.gid`'s tile is used if available).
     * @param {string|number|Phaser.Textures.Frame} [frame] - The frames key to set (or else the `obj.gid`'s tile is used if available).
     * @param {Phaser.Types.Tilemaps.TiledObject} [obj] - The Tiled object for fallback.
     */
    setTextureAndFrame: function (sprite, key, frame, obj)
    {
        if ((key === null) && this.gids && obj.gid !== undefined)
        {
            var tileset = this.gids[obj.gid];

            if (tileset)
            {
                if (key === null && tileset.image !== undefined)
                {
                    key = tileset.image.key;
                }

                if (frame === null)
                {
                    // This relies on the tileset texture *also* having been loaded as a spritesheet. This isn't guaranteed!
                    frame = obj.gid - tileset.firstgid;
                }

                // If we can't satisfy the request, probably best to null it out rather than set a whole spritesheet or something.
                if (!sprite.scene.textures.getFrame(key, frame))
                {
                    key = null;
                    frame = null;
                }
            }
        }

        sprite.setTexture(key, frame);
    },

    /**
     * Sets the `sprite.data` field from the tiled properties on the object and its tile (if any).
     *
     * @method Phaser.Tilemaps.ObjectHelper#setPropertiesFromTiledObject
     * @since 3.60.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite
     * @param {Phaser.Types.Tilemaps.TiledObject} obj
     */
    setPropertiesFromTiledObject: function (sprite, obj)
    {
        if (this.gids !== undefined && obj.gid !== undefined)
        {
            var tileset = this.gids[obj.gid];

            if (tileset !== undefined)
            {
                this.setFromJSON(sprite, tileset.getTileProperties(obj.gid));
            }
        }

        this.setFromJSON(sprite, obj.properties);
    },

    /**
     * Sets the sprite data from the JSON object.
     *
     * @method Phaser.Tilemaps.ObjectHelper#setFromJSON
     * @since 3.60.0
     * @private
     *
     * @param {Phaser.GameObjects.GameObject} sprite - The object for which to populate `data`.
     * @param {(Object.<string, *>|Object[])} properties - The properties to set in either JSON object format or else a list of objects with `name` and `value` fields.
     */
    setFromJSON: function (sprite, properties)
    {
        if (!properties)
        {
            return;
        }

        if (Array.isArray(properties))
        {
            // Tiled objects custom properties format
            properties.forEach(function (propData)
            {
                sprite.setData(propData.name, propData.value);
            });

            return;
        }

        for (var key in properties)
        {
            sprite.setData(key, properties[key]);
        }
    }
});

module.exports = ObjectHelper;
