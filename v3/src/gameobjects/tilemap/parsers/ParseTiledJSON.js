var Formats = require('../Formats');
var Tileset = require('../Tileset');
var Tile = require('../Tile');
var Extend = require("../../../utils/object/Extend");

var ParseJSONTiled = function (key, json)
{
    if (json.orientation !== 'orthogonal')
    {
        console.warn('Only orthogonal map types are supported in this version of Phaser');
        return null;
    }

    //  Map data will consist of: layers, objects, images, tilesets, sizes
    var map = {
        width: json.width,
        height: json.height,
        name: key,
        tileWidth: json.tilewidth,
        tileHeight: json.tileheight,
        orientation: json.orientation,
        format: Formats.TILED_JSON,
        version: json.version,
        properties: json.properties,
        widthInPixels: json.width * json.tilewidth,
        heightInPixels: json.height * json.tileheight
    };

    //  Tile Layers
    var layers = [];

    for (var i = 0; i < json.layers.length; i++)
    {
        if (json.layers[i].type !== 'tilelayer')
        {
            continue;
        }

        var curl = json.layers[i];

        // Base64 decode data if necessary
        // NOTE: uncompressed base64 only.

        if (!curl.compression && curl.encoding && curl.encoding === 'base64')
        {
            var binaryString = window.atob(curl.data);
            var len = binaryString.length;
            var bytes = new Array(len);

            // Interpret binaryString as an array of bytes representing
            // little-endian encoded uint32 values.
            for (var j = 0; j < len; j+=4)
            {
                bytes[j / 4] = (
                    binaryString.charCodeAt(j) |
                    binaryString.charCodeAt(j + 1) << 8 |
                    binaryString.charCodeAt(j + 2) << 16 |
                    binaryString.charCodeAt(j + 3) << 24
                ) >>> 0;
            }

            curl.data = bytes;

            delete curl.encoding;
        }
        else if (curl.compression)
        {
            console.warn('TilemapParser.parseTiledJSON - Layer compression is unsupported, skipping layer \'' + curl.name + '\'');
            continue;
        }

        var layer = {

            name: curl.name,
            x: curl.x,
            y: curl.y,
            width: curl.width,
            height: curl.height,
            widthInPixels: curl.width * json.tilewidth,
            heightInPixels: curl.height * json.tileheight,
            alpha: curl.opacity,
            visible: curl.visible,
            properties: {},
            indexes: [],
            callbacks: [],
            bodies: []

        };

        if (curl.properties)
        {
            layer.properties = curl.properties;
        }

        var x = 0;
        var row = [];
        var output = [];
        var rotation, flipped, flippedVal, gid;

        //  Loop through the data field in the JSON.

        //  This is an array containing the tile indexes, one after the other. -1 = no tile, everything else = the tile index (starting at 1 for Tiled, 0 for CSV)
        //  If the map contains multiple tilesets then the indexes are relative to that which the set starts from.
        //  Need to set which tileset in the cache = which tileset in the JSON, if you do this manually it means you can use the same map data but a new tileset.

        for (var t = 0, len = curl.data.length; t < len; t++)
        {
            rotation = 0;
            flipped = false;
            gid = curl.data[t];
            flippedVal = 0;

            //  If true the current tile is flipped or rotated (Tiled TMX format)
            if (gid > 0x20000000)
            {
                // FlippedX
                if (gid > 0x80000000)
                {
                    gid -= 0x80000000;
                    flippedVal += 4;
                }

                // FlippedY
                if (gid > 0x40000000)
                {
                    gid -= 0x40000000;
                    flippedVal += 2;
                }

                // FlippedAD (anti-diagonal = top-right is swapped with bottom-left corners)
                if (gid > 0x20000000)
                {
                    gid -= 0x20000000;
                    flippedVal += 1;
                }

                switch (flippedVal)
                {
                    case 5:
                        rotation = Math.PI / 2;
                        break;

                    case 6:
                        rotation = Math.PI;
                        break;

                    case 3:
                        rotation = 3 * Math.PI / 2;
                        break;

                    case 4:
                        rotation = 0;
                        flipped = true;
                        break;

                    case 7:
                        rotation = Math.PI / 2;
                        flipped = true;
                        break;

                    case 2:
                        rotation = Math.PI;
                        flipped = true;
                        break;

                    case 1:
                        rotation = 3 * Math.PI / 2;
                        flipped = true;
                        break;
                }
            }

            //  index, x, y, width, height
            if (gid > 0)
            {
                var tile = new Tile(layer, gid, x, output.length, json.tilewidth, json.tileheight);

                tile.rotation = rotation;
                tile.flipped = flipped;

                if (flippedVal !== 0)
                {
                    //  The WebGL renderer uses this to flip UV coordinates before drawing
                    tile.flippedVal = flippedVal;
                }

                row.push(tile);
            }
            else
            {
                row.push(new Tile(layer, -1, x, output.length, json.tilewidth, json.tileheight));

                // TODO: enable insert null functionality
                // if (Phaser.TilemapParser.INSERT_NULL)
                // {
                //     row.push(null);
                // }
                // else
                // {
                //     row.push(new Phaser.Tile(layer, -1, x, output.length, json.tilewidth, json.tileheight));
                // }
            }

            x++;

            if (x === curl.width)
            {
                output.push(row);
                x = 0;
                row = [];
            }
        }

        layer.data = output;

        layers.push(layer);
    }

    map.layers = layers;

    //  Images
    var images = [];

    for (var i = 0; i < json.layers.length; i++)
    {
        if (json.layers[i].type !== 'imagelayer')
        {
            continue;
        }

        var curi = json.layers[i];

        var image = {

            name: curi.name,
            image: curi.image,
            x: curi.x,
            y: curi.y,
            alpha: curi.opacity,
            visible: curi.visible,
            properties: {}

        };

        if (curi.properties)
        {
            image.properties = curi.properties;
        }

        images.push(image);

    }

    map.images = images;

    //  Tilesets & Image Collections
    var tilesets = [];
    var imagecollections = [];
    var lastSet = null;

    for (var i = 0; i < json.tilesets.length; i++)
    {
        //  name, firstgid, width, height, margin, spacing, properties
        var set = json.tilesets[i];

        if (set.image)
        {
            var newSet = new Tileset(set.name, set.firstgid, set.tilewidth, set.tileheight, set.margin, set.spacing, set.properties);

            if (set.tileproperties)
            {
                newSet.tileProperties = set.tileproperties;
            }

            // For a normal sliced tileset the row/count/size information is computed when updated.
            // This is done (again) after the image is set.
            newSet.updateTileData(set.imagewidth, set.imageheight);

            tilesets.push(newSet);
        }
        else
        {
            // TODO: ImageCollection

            // var newCollection = new Phaser.ImageCollection(set.name, set.firstgid, set.tilewidth, set.tileheight, set.margin, set.spacing, set.properties);

            // for (var ti in set.tiles)
            // {
            //     var image = set.tiles[ti].image;
            //     var gid = set.firstgid + parseInt(ti, 10);
            //     newCollection.addImage(gid, image);
            // }

            // imagecollections.push(newCollection);
        }

        //  We've got a new Tileset, so set the lastgid into the previous one
        if (lastSet)
        {
            lastSet.lastgid = set.firstgid - 1;
        }

        lastSet = set;
    }

    map.tilesets = tilesets;
    map.imagecollections = imagecollections;

    //  Objects & Collision Data (polylines, etc)
    var objects = {};
    var collision = {};

    function slice (obj, fields) {

        var sliced = {};

        for (var k in fields)
        {
            var key = fields[k];

            if (typeof obj[key] !== 'undefined')
            {
                sliced[key] = obj[key];
            }
        }

        return sliced;
    }

    for (var i = 0; i < json.layers.length; i++)
    {
        if (json.layers[i].type !== 'objectgroup')
        {
            continue;
        }

        var curo = json.layers[i];

        objects[curo.name] = [];
        collision[curo.name] = [];

        for (var v = 0, len = curo.objects.length; v < len; v++)
        {
            //  Object Tiles
            if (curo.objects[v].gid)
            {
                var object = {

                    gid: curo.objects[v].gid,
                    name: curo.objects[v].name,
                    type: curo.objects[v].hasOwnProperty("type") ? curo.objects[v].type : "",
                    x: curo.objects[v].x,
                    y: curo.objects[v].y,
                    visible: curo.objects[v].visible,
                    properties: curo.objects[v].properties

                };

                if (curo.objects[v].rotation)
                {
                    object.rotation = curo.objects[v].rotation;
                }

                objects[curo.name].push(object);
            }
            else if (curo.objects[v].polyline)
            {
                var object = {

                    name: curo.objects[v].name,
                    type: curo.objects[v].type,
                    x: curo.objects[v].x,
                    y: curo.objects[v].y,
                    width: curo.objects[v].width,
                    height: curo.objects[v].height,
                    visible: curo.objects[v].visible,
                    properties: curo.objects[v].properties

                };

                if (curo.objects[v].rotation)
                {
                    object.rotation = curo.objects[v].rotation;
                }

                object.polyline = [];

                //  Parse the polyline into an array
                for (var p = 0; p < curo.objects[v].polyline.length; p++)
                {
                    object.polyline.push([ curo.objects[v].polyline[p].x, curo.objects[v].polyline[p].y ]);
                }

                collision[curo.name].push(object);
                objects[curo.name].push(object);
            }
            // polygon
            else if (curo.objects[v].polygon)
            {
                var object = slice(curo.objects[v], ['name', 'type', 'x', 'y', 'visible', 'rotation', 'properties']);

                //  Parse the polygon into an array
                object.polygon = [];

                for (var p = 0; p < curo.objects[v].polygon.length; p++)
                {
                    object.polygon.push([curo.objects[v].polygon[p].x, curo.objects[v].polygon[p].y]);
                }

                objects[curo.name].push(object);

            }
            // ellipse
            else if (curo.objects[v].ellipse)
            {
                var object = slice(curo.objects[v], ['name', 'type', 'ellipse', 'x', 'y', 'width', 'height', 'visible', 'rotation', 'properties']);
                objects[curo.name].push(object);
            }
            // otherwise it's a rectangle
            else
            {
                var object = slice(curo.objects[v], ['name', 'type', 'x', 'y', 'width', 'height', 'visible', 'rotation', 'properties']);
                object.rectangle = true;
                objects[curo.name].push(object);
            }
        }
    }

    map.objects = objects;
    map.collision = collision;

    map.tiles = [];

    //  Finally lets build our super tileset index
    for (var i = 0; i < map.tilesets.length; i++)
    {
        var set = map.tilesets[i];

        var x = set.tileMargin;
        var y = set.tileMargin;

        var count = 0;
        var countX = 0;
        var countY = 0;

        for (var t = set.firstgid; t < set.firstgid + set.total; t++)
        {
            //  Can add extra properties here as needed
            map.tiles[t] = [x, y, i];

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

    var layer;
    var tile;
    var sid;
    var set;

    // go through each of the map data layers
    for (var i = 0; i < map.layers.length; i++)
    {
        layer = map.layers[i];

        set = null;

        // rows of tiles
        for (var j = 0; j < layer.data.length; j++)
        {
            row = layer.data[j];

            // individual tiles
            for (var k = 0; k < row.length; k++)
            {
                tile = row[k];

                if (tile === null || tile.index < 0)
                {
                    continue;
                }

                // find the relevant tileset

                sid = map.tiles[tile.index][2];
                set = map.tilesets[sid];


                // if that tile type has any properties, add them to the tile object

                if (set.tileProperties && set.tileProperties[tile.index - set.firstgid])
                {
                    tile.properties = Extend(tile.properties, set.tileProperties[tile.index - set.firstgid]);
                }

            }
        }
    }
    return map;
};

module.exports = ParseJSONTiled;
