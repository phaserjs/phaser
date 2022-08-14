/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ParseTileset = require('./ParseTileset');
var ParseImageCollection = require('./ParseImageCollection');

/**
 * Tilesets and Image Collections.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseTilesets
 * @since 3.0.0
 *
 * @param {object} json - The Tiled JSON data.
 * @param {object} externalTilesets - An optional object mapping external tileset file names to their data.
 * Specifically, an object whose OwnProperties (keys) match the "source" entries of the exported map's external tilesets,
 * and whose values are parsed json objects acquired by exporting an external tileset.  
 *
 * @return {object} An object containing the tileset and image collection data.
 */
var ParseTilesets = function (json, externalTilesets)
{
    var tilesets = [];
    var imageCollections = [];
    var lastSet = null;
    var newSet, newCollection;

    for (var i = 0; i < json.tilesets.length; i++)
    {
        //  name, firstgid, width, height, margin, spacing, properties
        var set = json.tilesets[i];

        if (set.source)
        {
            if (externalTilesets !== undefined && externalTilesets[set.source])
            {
                var externalSet = externalTilesets[set.source];
                externalSet.firstgid = set.firstgid;

                if (externalSet.image)
                {
                    newSet = ParseTileset(externalSet, externalSet.version);
                    tilesets.push(newSet);
                }
                else
                {
                    newCollection = ParseImageCollection(externalSet);
                    imageCollections.push(newCollection);
                }
            }
            else
            {
                console.warn('Map uses external tileset with source "' + set.source + '" which was not given.');
            }
        }
        else if (set.image)
        {
            newSet = ParseTileset(set, json.version);
            tilesets.push(newSet);
        }
        else
        {
            newCollection = ParseImageCollection(set);
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
