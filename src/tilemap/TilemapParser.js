/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.TilemapParser parses data objects from Phaser.Loader that need more preparation before they can be inserted into a Tilemap.
*
* @class Phaser.TilemapParser
* @static
*/
Phaser.TilemapParser = {

    /**
     * When scanning the Tiled map data the TilemapParser can either insert a null value (true) or 
     * a Phaser.Tile instance with an index of -1 (false, the default). Depending on your game type
     * depends how this should be configured. If you've a large sparsely populated map and the tile
     * data doesn't need to change then setting this value to `true` will help with memory consumption.
     * However if your map is small, or you need to update the tiles (perhaps the map dynamically changes
     * during the game) then leave the default value set.
     *
     * @constant
     * @type {boolean}
     */
    INSERT_NULL: false,

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

        if (tileWidth === undefined) { tileWidth = 32; }
        if (tileHeight === undefined) { tileHeight = 32; }
        if (width === undefined) { width = 10; }
        if (height === undefined) { height = 10; }

        if (key === undefined)
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
    * @param {string} key - The name you want to give the map data.
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

            var curl = json.layers[i];
            
            // Base64 decode data if necessary
            // NOTE: uncompressed base64 only. 
            if (!curl.compression && curl.encoding && curl.encoding === "base64") {
                var binaryString =  window.atob(curl.data);
                var len = binaryString.length;
                var bytes = new Array( len );
                // Interpret binaryString as an array of bytes representing
                // little-endian encoded uint32 values. 
                for (var j = 0; j < len; j+=4) {
                    bytes[j/4] = (binaryString.charCodeAt(j) |
                                 binaryString.charCodeAt(j+1) << 8 |
                                 binaryString.charCodeAt(j+2) << 16 |
                                 binaryString.charCodeAt(j+3) << 24) >>> 0;
                }
                curl.data = bytes;
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

                //  If true the current tile is flipped or rotated (Tiled TMX format) 
                if (gid > 0x20000000)
                {
                    flippedVal = 0;

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

                    // FlippedAD
                    if (gid > 0x20000000)
                    {
                        gid -= 0x20000000;
                        flippedVal += 1;
                    }
                   
                    switch (flippedVal)
                    {
                        case 5:
                            rotation = Math.PI/2;
                            break;
                        case 6:
                            rotation = Math.PI;
                            break;
                        case 3:
                            rotation = 3*Math.PI/2;
                            break;
                        case 4:
                            rotation = 0;
                            flipped = true;
                            break;
                        case 7:
                            rotation = Math.PI/2;
                            flipped = true;
                            break;
                        case 2:
                            rotation = Math.PI;
                            flipped = true;
                            break;
                        case 1:
                            rotation = 3*Math.PI/2;
                            flipped = true;
                            break;
                    }
                }

                //  index, x, y, width, height
                if (gid > 0)
                {
                    row.push(new Phaser.Tile(layer, gid, x, output.length, json.tilewidth, json.tileheight));
                    row[row.length - 1].rotation = rotation;
                    row[row.length - 1].flipped = flipped;
                }
                else
                {
                    if (Phaser.TilemapParser.INSERT_NULL)
                    {
                        row.push(null);
                    }
                    else
                    {
                        row.push(new Phaser.Tile(layer, -1, x, output.length, json.tilewidth, json.tileheight));
                    }
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

        for (var i = 0; i < json.tilesets.length; i++)
        {
            //  name, firstgid, width, height, margin, spacing, properties
            var set = json.tilesets[i];

            if (set.image)
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
                var newCollection = new Phaser.ImageCollection(set.name, set.firstgid, set.tilewidth, set.tileheight, set.margin, set.spacing, set.properties);
                
                for (var ti in set.tiles)
                {
                    var image = set.tiles[ti].image;
                    var gid = set.firstgid + parseInt(ti, 10);
                    newCollection.addImage(gid, image);
                }

                imagecollections.push(newCollection);
            }

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
                    var object = slice(curo.objects[v],
                                       ["name", "type", "x", "y", "visible", "rotation", "properties" ]);

                    //  Parse the polygon into an array
                    object.polygon = [];

                    for (var p = 0; p < curo.objects[v].polygon.length; p++)
                    {
                        object.polygon.push([ curo.objects[v].polygon[p].x, curo.objects[v].polygon[p].y ]);
                    }

                    objects[curo.name].push(object);

                }
                // ellipse
                else if (curo.objects[v].ellipse)
                {
                    var object = slice(curo.objects[v],
                                       ["name", "type", "ellipse", "x", "y", "width", "height", "visible", "rotation", "properties" ]);
                    objects[curo.name].push(object);
                }
                // otherwise it's a rectangle
                else
                {
                    var object = slice(curo.objects[v],
                                       ["name", "type", "x", "y", "width", "height", "visible", "rotation", "properties" ]);
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

        // go through each of the map layers
        for (var i = 0; i < map.layers.length; i++)
        {
            layer = map.layers[i];

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
                        tile.properties = Phaser.Utils.mixin(set.tileProperties[tile.index - set.firstgid], tile.properties);
                    }
                }
            }
        }

        return map;

    }

};
