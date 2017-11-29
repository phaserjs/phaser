var Formats = require('../../Formats');
var Tileset = require('../../Tileset');
var Tile = require('../../Tile');
var Extend = require('../../../../utils/object/Extend');
var MapData = require('../../mapdata/MapData');
var LayerData = require('../../mapdata/LayerData');
var ImageCollection = require('../../ImageCollection');
var GetFastValue = require('../../../../utils/object/GetFastValue');
var ParseGID = require('./ParseGID');
var Base64Decode = require('./Base64Decode');
var ParseObject = require('./ParseObject');

var ParseJSONTiled = function (key, json, insertNull)
{
    if (json.orientation !== 'orthogonal')
    {
        console.warn('Only orthogonal map types are supported in this version of Phaser');
        return null;
    }

    //  Map data will consist of: layers, objects, images, tilesets, sizes
    var mapData = new MapData({
        width: json.width,
        height: json.height,
        name: key,
        tileWidth: json.tilewidth,
        tileHeight: json.tileheight,
        orientation: json.orientation,
        format: Formats.TILEMAP_TILED_JSON,
        version: json.version,
        properties: json.properties
    });

    var tileLayers = [];

    for (var i = 0; i < json.layers.length; i++)
    {
        if (json.layers[i].type !== 'tilelayer')
        {
            continue;
        }

        var curl = json.layers[i];

        // Base64 decode data if necessary. NOTE: uncompressed base64 only.
        if (curl.compression)
        {
            console.warn('TilemapParser.parseTiledJSON - Layer compression is unsupported, skipping layer \'' + curl.name + '\'');
            continue;
        }
        else if (curl.encoding && curl.encoding === 'base64')
        {
            curl.data = Base64Decode(curl.data);
        }

        var layerData = new LayerData({
            name: curl.name,
            x: GetFastValue(curl, 'offsetx', 0) + curl.x,
            y: GetFastValue(curl, 'offsety', 0) + curl.y,
            width: curl.width,
            height: curl.height,
            tileWidth: json.tilewidth,
            tileHeight: json.tileheight,
            alpha: curl.opacity,
            visible: curl.visible,
            properties: GetFastValue(curl, 'properties', {})
        });

        var x = 0;
        var row = [];
        var output = [];
        var gid;

        //  Loop through the data field in the JSON.

        //  This is an array containing the tile indexes, one after the other. -1 = no tile,
        //  everything else = the tile index (starting at 1 for Tiled, 0 for CSV) If the map
        //  contains multiple tilesets then the indexes are relative to that which the set starts
        //  from. Need to set which tileset in the cache = which tileset in the JSON, if you do this
        //  manually it means you can use the same map data but a new tileset.

        for (var t = 0, len = curl.data.length; t < len; t++)
        {
            var gidInfo = ParseGID(curl.data[t]);

            //  index, x, y, width, height
            if (gidInfo.gid > 0)
            {
                var tile = new Tile(layerData, gidInfo.gid, x, output.length, json.tilewidth, json.tileheight);

                tile.rotation = gidInfo.rotation;
                tile.flipped = gidInfo.flipped;
                tile.flippedHorizontal = gidInfo.flippedHorizontal;
                tile.flippedVertical = gidInfo.flippedVertical;
                tile.flippedAntiDiagonal = gidInfo.flippedAntiDiagonal;

                row.push(tile);
            }
            else
            {
                var blankTile = insertNull
                    ? null
                    : new Tile(layerData, -1, x, output.length, json.tilewidth, json.tileheight);
                row.push(blankTile);
            }

            x++;

            if (x === curl.width)
            {
                output.push(row);
                x = 0;
                row = [];
            }
        }

        layerData.data = output;

        tileLayers.push(layerData);
    }

    mapData.layers = tileLayers;

    var images = [];

    for (var i = 0; i < json.layers.length; i++)
    {
        if (json.layers[i].type !== 'imagelayer')
        {
            continue;
        }

        var curi = json.layers[i];

        images.push({
            name: curi.name,
            image: curi.image,
            x: GetFastValue(curi, 'offsetx', 0) + curi.x,
            y: GetFastValue(curi, 'offsety', 0) + curi.y,
            alpha: curi.opacity,
            visible: curi.visible,
            properties: GetFastValue(curi, 'properties', {})
        });
    }

    mapData.images = images;

    //  Tilesets & Image Collections
    var tilesets = [];
    var imageCollections = [];
    var lastSet = null;

    for (var i = 0; i < json.tilesets.length; i++)
    {
        //  name, firstgid, width, height, margin, spacing, properties
        var set = json.tilesets[i];

        if (set.image)
        {
            var newSet = new Tileset(set.name, set.firstgid, set.tilewidth, set.tileheight, set.margin, set.spacing, set.properties);

            // Properties stored per-tile in object with string indices starting at "0"
            if (set.tileproperties)
            {
                newSet.tileProperties = set.tileproperties;
            }

            // Object & terrain shapes stored per-tile in object with string indices starting at "0"
            if (set.tiles)
            {
                newSet.tileData = set.tiles;

                // Parse the objects into Phaser format to match handling of other Tiled objects
                for (var stringID in newSet.tileData)
                {
                    var objectGroup = newSet.tileData[stringID].objectgroup;
                    if (objectGroup && objectGroup.objects)
                    {
                        objectGroup.objects = objectGroup.objects.map(ParseObject);
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
            var newCollection = new ImageCollection(set.name, set.firstgid, set.tilewidth, set.tileheight, set.margin, set.spacing, set.properties);

            for (var stringID in set.tiles)
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

    mapData.tilesets = tilesets;
    mapData.imageCollections = imageCollections;

    //  Objects & Collision Data (polylines, etc)
    var objects = {};
    var collision = {};

    for (var i = 0; i < json.layers.length; i++)
    {
        if (json.layers[i].type !== 'objectgroup')
        {
            continue;
        }

        var curo = json.layers[i];
        var layerName = curo.name;
        var offsetX = GetFastValue(curo, 'offsetx', 0);
        var offsetY = GetFastValue(curo, 'offsety', 0);

        objects[layerName] = [];
        collision[layerName] = [];

        for (var j = 0; j < curo.objects.length; j++)
        {
            var parsedObject = ParseObject(curo.objects[j], offsetX, offsetY);

            // Matching v2 where only polylines were added to collision prop of the map
            if (parsedObject.polyline) { collision[layerName].push(parsedObject); }

            objects[layerName].push(parsedObject);
        }
    }

    mapData.objects = objects;
    mapData.collision = collision;

    mapData.tiles = [];

    //  Finally lets build our super tileset index
    for (var i = 0; i < mapData.tilesets.length; i++)
    {
        var set = mapData.tilesets[i];

        var x = set.tileMargin;
        var y = set.tileMargin;

        var count = 0;
        var countX = 0;
        var countY = 0;

        for (var t = set.firstgid; t < set.firstgid + set.total; t++)
        {
            //  Can add extra properties here as needed
            mapData.tiles[t] = [ x, y, i ];

            x += set.tileWidth + set.tileSpacing;

            count++;

            if (count === set.total)
            {
                break;
            }

            countX++;

            if (countX === set.columns)
            {
                x = set.tileMargin;
                y += set.tileHeight + set.tileSpacing;

                countX = 0;
                countY++;

                if (countY === set.rows)
                {
                    break;
                }
            }
        }

    }

    // assign tile properties

    var layerData;
    var tile;
    var sid;
    var set;

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
                    tile.properties = Extend(tile.properties, set.tileProperties[tile.index - set.firstgid]);
                }

            }
        }
    }
    return mapData;
};

module.exports = ParseJSONTiled;
