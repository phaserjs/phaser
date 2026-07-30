/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var LayerData = require('../../mapdata/LayerData');
var Tile = require('../../Tile');

/**
 * Parses all tilemap layers in an Impact JSON object into new LayerData objects.
 *
 * @function Phaser.Tilemaps.Parsers.Impact.ParseTileLayers
 * @since 3.0.0
 *
 * @param {object} json - The Impact JSON object.
 * @param {boolean} insertNull - Controls how empty tiles (those with an index of -1) are stored in
 * the LayerData. If `true`, empty tile positions are stored as `null`. If `false`, a Tile object
 * with an index of -1 is created for each empty position instead.
 *
 * @return {Phaser.Tilemaps.LayerData[]} - An array of LayerData objects, one for each entry in
 * json.layer.
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
