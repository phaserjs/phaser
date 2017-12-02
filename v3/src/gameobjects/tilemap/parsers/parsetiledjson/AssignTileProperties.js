var Extend = require('../../../../utils/object/Extend');
var GetValue = require('../../../../utils/object/GetValue');

// Copy properties from tileset to tiles
var AssignTileProperties = function (mapData)
{
    var layerData;
    var tile;
    var sid;
    var set;
    var row;

    // go through each of the map data layers
    for (var i = 0; i < mapData.layers.length; i++)
    {
        layerData = mapData.layers[i];

        set = null;

        // rows of tiles
        for (var j = 0; j < layerData.data.length; j++)
        {
            row = layerData.data[j];

            // individual tiles
            for (var k = 0; k < row.length; k++)
            {
                tile = row[k];

                if (tile === null || tile.index < 0)
                {
                    continue;
                }

                // find the relevant tileset
                sid = mapData.tiles[tile.index][2];
                set = mapData.tilesets[sid];

                // Ensure that a tile's size matches its tileset
                tile.width = set.tileWidth;
                tile.height = set.tileHeight;

                // if that tile type has any properties, add them to the tile object
                if (set.tileProperties && set.tileProperties[tile.index - set.firstgid])
                {
                    tile.properties = Extend(
                        tile.properties, set.tileProperties[tile.index - set.firstgid]
                    );
                }

                // If that tile type has any collision info, add that to the tile object
                if (set.tileData && set.tileData[tile.index - set.firstgid])
                {
                    var tileData = set.tileData[tile.index - set.firstgid];
                    var objects = GetValue(tileData, 'objectgroup.objects', null);
                    if (objects && objects.length > 0)
                    {
                        tile.collisionObjects = objects;
                    }
                }
            }
        }
    }
};

module.exports = AssignTileProperties;
