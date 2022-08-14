/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Tileset = require('../../Tileset');
var ParseObject = require('./ParseObject');
var ParseWangsets = require('./ParseWangsets');

/**
 * A full tileset definition.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseTileset
 * @since 3.x.x
 *
 * @param {object} set - The tileset data.
 * @param {string | number} version - The version of Tiled that exported the tileset data.
 *
 * @return {Tileset} An object containing the tileset and image collection data.
 */
var ParseTileset = function (set, version)
{
    var tileSet = new Tileset(set.name, set.firstgid, set.tilewidth, set.tileheight, set.margin, set.spacing, undefined, undefined, set.tileoffset);

    if (version > 1)
    {
        var datas = undefined;
        var props = undefined;

        if (Array.isArray(set.tiles))
        {
            datas = datas || {};
            props = props || {};

            // Tiled 1.2+
            for (var t = 0; t < set.tiles.length; t++)
            {
                var tile = set.tiles[t];

                //  Convert tileproperties.
                if (tile.properties)
                {
                    var newPropData = {};

                    tile.properties.forEach(function (propData)
                    {
                        newPropData[propData['name']] = propData['value'];
                    });

                    props[tile.id] = newPropData;
                }

                //  Convert objectgroup
                if (tile.objectgroup)
                {
                    (datas[tile.id] || (datas[tile.id] = {})).objectgroup = tile.objectgroup;

                    if (tile.objectgroup.objects)
                    {
                        var parsedObjects2 = tile.objectgroup.objects.map(function (obj)
                        {
                            return ParseObject(obj);
                        });

                        datas[tile.id].objectgroup.objects = parsedObjects2;
                    }
                }

                // Copy animation data
                if (tile.animation)
                {
                    (datas[tile.id] || (datas[tile.id] = {})).animation = tile.animation;
                }

                // Copy tile `type` field
                // (see https://doc.mapeditor.org/en/latest/manual/custom-properties/#typed-tiles).
                if (tile.type)
                {
                    (datas[tile.id] || (datas[tile.id] = {})).type = tile.type;
                }
            }
        }

        if (Array.isArray(set.wangsets))
        {
            datas = datas || {};
            props = props || {};

            ParseWangsets(set.wangsets, datas);
        }

        if (datas) // Implies also props is set.
        {
            tileSet.tileData = datas;
            tileSet.tileProperties = props;
        }
    }
    else
    {
        // Tiled 1

        // Properties stored per-tile in object with string indexes starting at "0"
        if (set.tileproperties)
        {
            tileSet.tileProperties = set.tileproperties;
        }

        // Object & terrain shapes stored per-tile in object with string indexes starting at "0"
        if (set.tiles)
        {
            var stringID;
            tileSet.tileData = set.tiles;

            // Parse the objects into Phaser format to match handling of other Tiled objects
            for (stringID in tileSet.tileData)
            {
                var objectGroup = tileSet.tileData[stringID].objectgroup;

                if (objectGroup && objectGroup.objects)
                {
                    var parsedObjects1 = objectGroup.objects.map(function (obj)
                    {
                        return ParseObject(obj);
                    });

                    tileSet.tileData[stringID].objectgroup.objects = parsedObjects1;
                }
            }
        }
    }

    // For a normal sliced tileset the row/count/size information is computed when updated.
    // This is done (again) after the image is set.
    tileSet.updateTileData(set.imagewidth, set.imageheight);
    return tileSet;
};

module.exports = ParseTileset;
