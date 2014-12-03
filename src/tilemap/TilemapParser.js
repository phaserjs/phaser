/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.TilemapParser parses data objects from Phaser.Loader that need more preparation before they can be inserted into a Tilemap.
*
* @class Phaser.TilemapParser
*/
Phaser.TilemapParser = {

    /**
    * Parse tilemap data from the cache and creates a Tilemap object.
    *
    * @method Phaser.TilemapParser.parse
    * @param {Phaser.Game} game - Game reference to the currently running game.
    * @param {string} key - The key of the tilemap in the Cache.
    * @param {number} [tileWidth=32] - The pixel width of a single map tile. If using CSV data you must specify this. Not required if using Tiled map data.
    * @param {number} [tileHeight=32] - The pixel height of a single map tile. If using CSV data you must specify this. Not required if using Tiled map data.
    * @param {number} [width=10] - The width of the map in tiles. If this map is created from Tiled or CSV data you don't need to specify this.
    * @param {number} [height=10] - The height of the map in tiles. If this map is created from Tiled or CSV data you don't need to specify this.
    * @return {object} The parsed map object.
    */
    parse: function (game, key, tileWidth, tileHeight, width, height) {

        if (typeof tileWidth === 'undefined') { tileWidth = 32; }
        if (typeof tileHeight === 'undefined') { tileHeight = 32; }
        if (typeof width === 'undefined') { width = 10; }
        if (typeof height === 'undefined') { height = 10; }

        if (typeof key === 'undefined')
        {
            return this.getEmptyData();
        }

        if (key === null)
        {
            return this.getEmptyData(tileWidth, tileHeight, width, height);
        }

        var map = game.cache.getTilemapData(key);

        if (map)
        {
            if (map.format === Phaser.Tilemap.CSV)
            {
                return this.parseCSV(key, map.data, tileWidth, tileHeight);
            }
            else if (!map.format || map.format === Phaser.Tilemap.TILED_JSON)
            {
                return this.parseTiledJSON(map.data);
            }
        }
        else
        {
            console.warn('Phaser.TilemapParser.parse - No map data found for key ' + key);
        }

    },

    /**
    * Parses a CSV file into valid map data.
    *
    * @method Phaser.TilemapParser.parseCSV
    * @param {string} data - The CSV file data.
    * @param {number} [tileWidth=32] - The pixel width of a single map tile. If using CSV data you must specify this. Not required if using Tiled map data.
    * @param {number} [tileHeight=32] - The pixel height of a single map tile. If using CSV data you must specify this. Not required if using Tiled map data.
    * @return {object} Generated map data.
    */
    parseCSV: function (key, data, tileWidth, tileHeight) {

        var map = this.getEmptyData();

        //  Trim any rogue whitespace from the data
        data = data.trim();

        var output = [];
        var rows = data.split("\n");
        var height = rows.length;
        var width = 0;

        for (var y = 0; y < rows.length; y++)
        {
            output[y] = [];

            var column = rows[y].split(",");

            for (var x = 0; x < column.length; x++)
            {
                output[y][x] = new Phaser.Tile(map.layers[0], parseInt(column[x], 10), x, y, tileWidth, tileHeight);
            }

            if (width === 0)
            {
                width = column.length;
            }
        }

        map.format = Phaser.Tilemap.CSV;
        map.name = key;
        map.width = width;
        map.height = height;
        map.tileWidth = tileWidth;
        map.tileHeight = tileHeight;
        map.widthInPixels = width * tileWidth;
        map.heightInPixels = height * tileHeight;

        map.layers[0].width = width;
        map.layers[0].height = height;
        map.layers[0].widthInPixels = map.widthInPixels;
        map.layers[0].heightInPixels = map.heightInPixels;
        map.layers[0].data = output;

        return map;

    },

    /**
    * Returns an empty map data object.
    *
    * @method Phaser.TilemapParser.getEmptyData
    * @return {object} Generated map data.
    */
    getEmptyData: function (tileWidth, tileHeight, width, height) {

        var map = {};

        map.width = 0;
        map.height = 0;
        map.tileWidth = 0;
        map.tileHeight = 0;

        if (typeof tileWidth !== 'undefined' && tileWidth !== null) { map.tileWidth = tileWidth; }
        if (typeof tileHeight !== 'undefined' && tileHeight !== null) { map.tileHeight = tileHeight; }
        if (typeof width !== 'undefined' && width !== null) { map.width = width; }
        if (typeof height !== 'undefined' && height !== null) { map.height = height; }

        map.orientation = 'orthogonal';
        map.version = '1';
        map.properties = {};
        map.widthInPixels = 0;
        map.heightInPixels = 0;

        var layers = [];

        var layer = {

            name: 'layer',
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            widthInPixels: 0,
            heightInPixels: 0,
            alpha: 1,
            visible: true,
            properties: {},
            indexes: [],
            callbacks: [],
            bodies: [],
            data: []

        };

        //  fill with nulls?

        layers.push(layer);

        map.layers = layers;
        map.images = [];
        map.objects = {};
        map.collision = {};
        map.tilesets = [];
        map.tiles = [];

        return map;

    },

    /**
    * Parses a Tiled JSON file into valid map data.
    * @method Phaser.TilemapParser.parseJSON
    * @param {object} json - The JSON map data.
    * @return {object} Generated and parsed map data.
    */
    parseTiledJSON: function (json) {

        if (json.orientation !== 'orthogonal')
        {
            console.warn('TilemapParser.parseTiledJSON - Only orthogonal map types are supported in this version of Phaser');
            return null;
        }

        //  Map data will consist of: layers, objects, images, tilesets, sizes
        var map = {};

        map.width = json.width;
        map.height = json.height;
        map.tileWidth = json.tilewidth;
        map.tileHeight = json.tileheight;
        map.orientation = json.orientation;
        map.format = Phaser.Tilemap.TILED_JSON;
        map.version = json.version;
        map.properties = json.properties;
        map.widthInPixels = map.width * map.tileWidth;
        map.heightInPixels = map.height * map.tileHeight;

        //  Tile Layers
        var layers = [];

        for (var i = 0; i < json.layers.length; i++)
        {
            if (json.layers[i].type !== 'tilelayer')
            {
                continue;
            }

            var layer = {

                name: json.layers[i].name,
                x: json.layers[i].x,
                y: json.layers[i].y,
                width: json.layers[i].width,
                height: json.layers[i].height,
                widthInPixels: json.layers[i].width * json.tilewidth,
                heightInPixels: json.layers[i].height * json.tileheight,
                alpha: json.layers[i].opacity,
                visible: json.layers[i].visible,
                properties: {},
                indexes: [],
                callbacks: [],
                bodies: []

            };

            if (json.layers[i].properties)
            {
                layer.properties = json.layers[i].properties;
            }

            var x = 0;
            var row = [];
            var output = [];

            //  Loop through the data field in the JSON.

            //  This is an array containing the tile indexes, one after the other. -1 = no tile, everything else = the tile index (starting at 1 for Tiled, 0 for CSV)
            //  If the map contains multiple tilesets then the indexes are relative to that which the set starts from.
            //  Need to set which tileset in the cache = which tileset in the JSON, if you do this manually it means you can use the same map data but a new tileset.

            for (var t = 0, len = json.layers[i].data.length; t < len; t++)
            {
                //  index, x, y, width, height
                if (json.layers[i].data[t] > 0)
                {
                    row.push(new Phaser.Tile(layer, json.layers[i].data[t], x, output.length, json.tilewidth, json.tileheight));
                }
                else
                {
                    row.push(new Phaser.Tile(layer, -1, x, output.length, json.tilewidth, json.tileheight));
                }

                x++;

                if (x === json.layers[i].width)
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

            var image = {

                name: json.layers[i].name,
                image: json.layers[i].image,
                x: json.layers[i].x,
                y: json.layers[i].y,
                alpha: json.layers[i].opacity,
                visible: json.layers[i].visible,
                properties: {}

            };

            if (json.layers[i].properties)
            {
                image.properties = json.layers[i].properties;
            }

            images.push(image);

        }

        map.images = images;

        //  Tilesets
        var tilesets = [];

        for (var i = 0; i < json.tilesets.length; i++)
        {
            //  name, firstgid, width, height, margin, spacing, properties
            var set = json.tilesets[i];

            if (!set.tiles)
            {
                var newSet = new Phaser.Tileset(set.name, set.firstgid, set.tilewidth, set.tileheight, set.margin, set.spacing, set.properties);

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
                // TODO: Handle Tileset Image Collections (multiple images in a tileset, no slicing into each image)
                console.warn("Phaser.TilemapParser - Image Collection Tilesets are not support");
            }

        }

        map.tilesets = tilesets;

        //  Objects & Collision Data (polylines, etc)
        var objects = {};
        var collision = {};

        function slice (obj, fields) {
            var sliced = {};
            for (var k in fields) {
                var key = fields[k];
                sliced[key] = obj[key];
            }
            return sliced;
        }

        for (var i = 0; i < json.layers.length; i++)
        {
            if (json.layers[i].type !== 'objectgroup')
            {
                continue;
            }

            objects[json.layers[i].name] = [];
            collision[json.layers[i].name] = [];

            for (var v = 0, len = json.layers[i].objects.length; v < len; v++)
            {
                //  Object Tiles
                if (json.layers[i].objects[v].gid)
                {
                    var object = {

                        gid: json.layers[i].objects[v].gid,
                        name: json.layers[i].objects[v].name,
                        x: json.layers[i].objects[v].x,
                        y: json.layers[i].objects[v].y,
                        visible: json.layers[i].objects[v].visible,
                        properties: json.layers[i].objects[v].properties

                    };

                    objects[json.layers[i].name].push(object);
                }
                else if (json.layers[i].objects[v].polyline)
                {
                    var object = {

                        name: json.layers[i].objects[v].name,
                        type: json.layers[i].objects[v].type,
                        x: json.layers[i].objects[v].x,
                        y: json.layers[i].objects[v].y,
                        width: json.layers[i].objects[v].width,
                        height: json.layers[i].objects[v].height,
                        visible: json.layers[i].objects[v].visible,
                        properties: json.layers[i].objects[v].properties

                    };

                    object.polyline = [];

                    //  Parse the polyline into an array
                    for (var p = 0; p < json.layers[i].objects[v].polyline.length; p++)
                    {
                        object.polyline.push([ json.layers[i].objects[v].polyline[p].x, json.layers[i].objects[v].polyline[p].y ]);
                    }

                    collision[json.layers[i].name].push(object);
                    objects[json.layers[i].name].push(object);
                }
                // polygon
                else if (json.layers[i].objects[v].polygon)
                {
                    var object = slice(json.layers[i].objects[v],
                                       ["name", "type", "x", "y", "visible", "properties" ]);

                    //  Parse the polygon into an array
                    object.polygon = [];
                    for (var p = 0; p < json.layers[i].objects[v].polygon.length; p++)
                    {
                        object.polygon.push([ json.layers[i].objects[v].polygon[p].x, json.layers[i].objects[v].polygon[p].y ]);
                    }
                    objects[json.layers[i].name].push(object);

                }
                // ellipse
                else if (json.layers[i].objects[v].ellipse)
                {
                    var object = slice(json.layers[i].objects[v],
                                       ["name", "type", "ellipse", "x", "y", "width", "height", "visible", "properties" ]);
                    objects[json.layers[i].name].push(object);
                }
                // otherwise it's a rectangle
                else
                {
                    var object = slice(json.layers[i].objects[v],
                                       ["name", "type", "x", "y", "width", "height", "visible", "properties" ]);
                    object.rectangle = true;
                    objects[json.layers[i].name].push(object);
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

        var i,j,k;
        var layer, tile, sid, set;

        // go through each of the map layers
        for (i = 0; i < map.layers.length; i++)
        {
            layer = map.layers[i];

            // rows of tiles
            for (j = 0; j < layer.data.length; j++)
            {
                row = layer.data[j];

                // individual tiles
                for (k = 0; k < row.length; k++)
                {
                    tile = row[k];

                    if(tile.index < 0) { continue; }

                    // find the relevant tileset
                    sid = map.tiles[tile.index][2];
                    set = map.tilesets[sid];

                    // if that tile type has any properties, add them to the tile object
                    if(set.tileProperties && set.tileProperties[tile.index - set.firstgid]) {
                        tile.properties = set.tileProperties[tile.index - set.firstgid];
                    }
                }
            }
        }


        return map;

    }

};
