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

    getTypeIncludingTile: function (obj)
    {
        if (obj.type !== undefined)
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

    setTextureAndFrame: function (sprite, key, frame, obj)
    {
        if (((key === null) || (frame === null)) && this.gids && obj.gid !== undefined)
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

    setProperties: function (sprite, obj)
    {
        var propertieses = [];
        if (this.gids !== undefined && obj.gid !== undefined)
        {
            var tileset = this.gids[obj.gid];
            if (tileset !== undefined)
            {
                propertieses.push(tileset.getTileProperties(obj.gid));
            }
        }
        propertieses.push(obj.properties);

        for (var p = 0; p < propertieses.length; ++p)
        {
            var properties = propertieses[p];
            if (properties === undefined)
            {
                continue;
            }

            //  Set properties the class may have, or setData those it doesn't
            if (Array.isArray(properties))
            {
                // Tiled objects custom properties format
                properties.forEach(function (propData)
                {
                    var key = propData['name'];
                    if (sprite[key] !== undefined)
                    {
                        sprite[key] = propData['value'];
                    }
                    else
                    {
                        sprite.setData(key, propData['value']);
                    }
                });
            }
            else
            {
                for (var key in properties)
                {
                    if (sprite[key] !== undefined)
                    {
                        sprite[key] = properties[key];
                    }
                    else
                    {
                        sprite.setData(key, properties[key]);
                    }
                }
            }

        }
    }
});

module.exports = ObjectHelper;
