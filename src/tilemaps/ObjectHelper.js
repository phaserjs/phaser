/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2021 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @classdesc
 * An ObjectHelper helps tie objects with `gids` into the tileset that sits behind them.
 *
 * @class ObjectHelper
 * @memberof Phaser.Tilemaps
 * @ignore
 * @constructor
 * @since 3.54.0
 *
 * @param {Phaser.Tilemaps.Tileset[]} tilesets - The backing tileset data.
 */
var ObjectHelper = new Class({

    initialize: function ObjectHelper (tilesets)
    {
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
        this._gids = this.gids;
    },

    /**
     * Enabled if the object helper reaches into tilesets for data. Disabled if it only uses data directly on a gid object.
     * 
     * @name Phaser.Tilemaps.ObjectHelper#enabled
     * @type boolean
     * @since 3.54.0
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
     * @name Phaser.Tilemaps.ObjectHelper#getTypeIncludingTile
     * @param {Phaser.Types.Tilemaps.TiledObject} obj - The tiled Object to investigate
     * @returns string? - The `type` of the object, the tile behind the `gid` of the object, or `undefined`.
     * @since 3.54.0
     */
    getTypeIncludingTile: function (obj)
    {
        if (obj.type !== undefined && obj.type != "")
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
     * Sets the sprite texture data as specified (usually in a config) or, failing that, as specified in the `gid` of the object being loaded (if any).
     * 
     * This fallback will only work if the tileset was loaded as a spritesheet matching the geometry of sprites fed into tiled,
     * so that (for example:) tile id #`3` within the tileset is the same as texture frame `3` from the image of the tileset.
     * 
     * @name Phaser.Tilemaps.ObjectHelper#setTextureAndFrame
     * @param {Phaser.GameObjects.GameObject} sprite - The GameObject to modify.
     * @param {string|Phaser.Textures.Texture} key? - The texture key to set (or else the `obj.gid`'s tile is used if available).
     * @param {string|number|Phaser.Textures.Frame} frame? - The frame's key to set (or else the `obj.gid`'s tile is used if available).
     * @param {Phaser.Types.Tilemaps.TiledObject} obj - The Tiled object for fallbacks.
     * @since 3.54.0
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
     * @name Phaser.Tilemaps.ObjectHelper#setPropertiesFromTiledObject
     * @param {Phaser.GameObjects.GameObject} sprite 
     * @param {Phaser.Types.Tilemaps.TiledObject} obj 
     * @since 3.54.0
     */
    setPropertiesFromTiledObject: function (sprite, obj)
    {
        if (this.gids !== undefined && obj.gid !== undefined)
        {
            var tileset = this.gids[obj.gid];
            if (tileset !== undefined)
            {
                this._setPropertiesFromPropertiesJSON(sprite, tileset.getTileProperties(obj.gid));
            }
        }
        this._setPropertiesFromPropertiesJSON(sprite, obj.properties);
    },

    /**
     * 
     * @name Phaser.Tilemaps.ObjectHelper#_setPropertiesFromPropertiesJSON
     * @ignore
     * @param {Phaser.GameObjects.GameObject} sprite - The object for which to populate `data`.
     * @param {({[key:string]:*}|{name:string, value:*}[])} properties? - The properties to set in either JSON object format or else a list of objects with `name` and `value` fields.
     * @since 3.54.0
     */
    _setPropertiesFromPropertiesJSON: function (sprite, properties)
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
