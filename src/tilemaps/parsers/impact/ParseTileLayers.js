/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var LayerData = require('../../mapdata/LayerData');
var Tile = require('../../Tile');

/**
 * [description]
 *
 * @function Phaser.Tilemaps.Parsers.Impact.ParseTileLayers
 * @since 3.0.0
 *
 * @param {object} json - [description]
 * @param {boolean} insertNull - [description]
 *
 * @return {array} [description]
 */
var ParseTileLayers = function (json, insertNull)
{
    var tileLayers = [];

    for (var i = 0; i < json.layer.length; i++)
    {
        var layer = json.layer[i];

        var layerData = new LayerData({
            name: layer.name,
            width: layer.width,
            height: layer.height,
            tileWidth: layer.tilesize,
            tileHeight: layer.tilesize,
            visible: layer.visible === 1
        });

        var row = [];
        var tileGrid = [];

        //  Loop through the data field in the JSON. This is a 2D array containing the tile indexes,
        //  one after the other. The indexes are relative to the tileset that contains the tile.
        for (var y = 0; y < layer.data.length; y++)
        {
            for (var x = 0; x < layer.data[y].length; x++)
            {
                // In Weltmeister, 0 = no tile, but the Tilemap API expects -1 = no tile.
                var index = layer.data[y][x] - 1;

                var tile;

                if (index > -1)
                {
                    tile = new Tile(layerData, index, x, y, layer.tilesize, layer.tilesize);
                }
                else
                {
                    tile = insertNull
                        ? null
                        : new Tile(layerData, -1, x, y, layer.tilesize, layer.tilesize);
                }

                row.push(tile);
            }

            tileGrid.push(row);
            row = [];
        }

        layerData.data = tileGrid;

        tileLayers.push(layerData);
    }

    return tileLayers;
};

module.exports = ParseTileLayers;
