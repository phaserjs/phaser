/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Tileset = require('../../Tileset');
var ImageCollection = require('../../ImageCollection');
var ParseObject = require('./ParseObject');

/**
 * Tilesets and Image Collections
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseTilesets
 * @since 3.0.0
 *
 * @param {object} json - [description]
 *
 * @return {object} [description]
 */
var ParseTilesets = function (json)
{
    var tilesets = [];
    var imageCollections = [];
    var lastSet = null;
    var stringID;

    for (var i = 0; i < json.tilesets.length; i++)
    {
        //  name, firstgid, width, height, margin, spacing, properties
        var set = json.tilesets[i];

        if (set.source)
        {
            console.warn('Phaser can\'t load external tilesets. Use the Embed Tileset button and then export the map again.');
        }
        else if (set.image)
        {
            var newSet = new Tileset(set.name, set.firstgid, set.tilewidth, set.tileheight, set.margin, set.spacing);

            if (json.version > 1)
            {
                // Tiled 1.2+

                if (Array.isArray(set.tiles))
                {
                    var tiles = {};
                    var props = {};

                    for (var t = 0; t < set.tiles.length; t++)
                    {
                        var tile = set.tiles[t];

                        //  Convert tileproperties
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
                            tiles[tile.id] = { objectgroup: tile.objectgroup };

                            if (tile.objectgroup.objects)
                            {
                                var parsedObjects2 = tile.objectgroup.objects.map(
                                    function (obj) { return ParseObject(obj); }
                                );

                                tiles[tile.id].objectgroup.objects = parsedObjects2;
                            }
                        }

                        // Copy animation data
                        if (tile.animation)
                        {
                            if (tiles.hasOwnProperty(tile.id))
                            {
                                tiles[tile.id].animation = tile.animation;
                            }
                            else
                            {
                                tiles[tile.id] = { animation: tile.animation };
                            }
                        }
                    }

                    newSet.tileData = tiles;
                    newSet.tileProperties = props;
                }
            }
            else
            {
                // Tiled 1

                // Properties stored per-tile in object with string indexes starting at "0"
                if (set.tileproperties)
                {
                    newSet.tileProperties = set.tileproperties;
                }

                // Object & terrain shapes stored per-tile in object with string indexes starting at "0"
                if (set.tiles)
                {
                    newSet.tileData = set.tiles;

                    // Parse the objects into Phaser format to match handling of other Tiled objects
                    for (stringID in newSet.tileData)
                    {
                        var objectGroup = newSet.tileData[stringID].objectgroup;
                        if (objectGroup && objectGroup.objects)
                        {
                            var parsedObjects1 = objectGroup.objects.map(
                                function (obj) { return ParseObject(obj); }
                            );
                            newSet.tileData[stringID].objectgroup.objects = parsedObjects1;
                        }
                    }
                }
            }

            // For a normal sliced tileset the row/count/size information is computed when updated.
            // This is done (again) after the image is set.
            newSet.updateTileData(set.imagewidth, set.imageheight);

            tilesets.push(newSet);
        }
        else
        {
            var newCollection = new ImageCollection(set.name, set.firstgid, set.tilewidth,
                set.tileheight, set.margin, set.spacing, set.properties);

            for (stringID in set.tiles)
            {
                var image = set.tiles[stringID].image;
                var gid = set.firstgid + parseInt(stringID, 10);
                newCollection.addImage(gid, image);
            }

            imageCollections.push(newCollection);
        }

        //  We've got a new Tileset, so set the lastgid into the previous one
        if (lastSet)
        {
            lastSet.lastgid = set.firstgid - 1;
        }

        lastSet = set;
    }

    return { tilesets: tilesets, imageCollections: imageCollections };
};

module.exports = ParseTilesets;
