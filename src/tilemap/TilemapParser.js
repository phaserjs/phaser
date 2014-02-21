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
    * Creates a Tileset object.
    * @method Phaser.TilemapParser.tileset
    * @param {Phaser.Game} game - Game reference to the currently running game.
    * @param {string} key - The Cache key of this tileset.
    * @param {number} tileWidth - Width of each single tile in pixels.
    * @param {number} tileHeight - Height of each single tile in pixels.
    * @param {number} [tileMargin=0] - If the tiles have been drawn with a margin, specify the amount here.
    * @param {number} [tileSpacing=0] - If the tiles have been drawn with spacing between them, specify the amount here.
    * @param {number} [rows=-1] - How many tiles are placed horizontally in each row? If -1 it will calculate rows by dividing the image width by tileWidth.
    * @param {number} [columns=-1] - How many tiles are placed vertically in each column? If -1 it will calculate columns by dividing the image height by tileHeight.
    * @param {number} [total=-1] - The maximum number of tiles to extract from the image. If -1 it will extract `rows * columns` worth. You can also set a value lower than the actual number of tiles.
    * @return {Phaser.Tileset} Generated Tileset object.
    */
    tileset: function (game, key, tileWidth, tileHeight, tileMargin, tileSpacing, rows, columns, total) {

        //  How big is our image?
        var img = game.cache.getTilesetImage(key);

        if (img === null)
        {
            console.warn("Phaser.TilemapParser.tileSet: Invalid image key given");
            return null;
        }

        var width = img.width;
        var height = img.height;

        if (rows === -1)
        {
            rows = Math.round(width / tileWidth);
        }

        if (columns === -1)
        {
            columns = Math.round(height / tileHeight);
        }

        if (total === -1)
        {
            total = rows * columns;
        }
        
        //  Zero or smaller than tile sizes?
        if (width === 0 || height === 0 || width < tileWidth || height < tileHeight || total === 0)
        {
            console.warn("Phaser.TilemapParser.tileSet: width/height zero or width/height < given tileWidth/tileHeight");
            return null;
        }

        return new Phaser.Tileset(img, key, tileWidth, tileHeight, tileMargin, tileSpacing, rows, columns, total);

    },

    /**
    * Parse tilemap data from the cache and creates a Tilemap object.
    * @method Phaser.TilemapParser.parse
    * @param {Phaser.Game} game - Game reference to the currently running game.
    * @param {string} key - The key of the tilemap in the Cache.
    * @return {object} The parsed map object.
    */
    parse: function (game, key) {

        var map = game.cache.getTilemapData(key);

        if (map)
        {
            if (map.format === Phaser.Tilemap.CSV)
            {
                return this.parseCSV(map.data);
            }
            else if (map.format === Phaser.Tilemap.TILED_JSON)
            {
                return this.parseTiledJSON(map.data);
            }
        }
        else
        {
            return this.getEmptyData();
        }

    },

    /**
    * Parses a CSV file into valid map data.
    * @method Phaser.TilemapParser.parseCSV
    * @param {string} data - The CSV file data.
    * @return {object} Generated map data.
    */
    parseCSV: function (data) {

        //  Trim any rogue whitespace from the data
        data = data.trim();

        var output = [];
        var rows = data.split("\n");
        var height = rows.length;
        var width = 0;

        for (var i = 0; i < rows.length; i++)
        {
            output[i] = [];

            var column = rows[i].split(",");

            for (var c = 0; c < column.length; c++)
            {
                output[i][c] = parseInt(column[c], 10);
            }

            if (width === 0)
            {
                width = column.length;
            }
        }

        //  Build collision map

        return [{ name: 'csv', width: width, height: height, alpha: 1, visible: true, indexes: [], tileMargin: 0, tileSpacing: 0, data: output }];

    },

    /**
    * Returns an empty map data object.
    * @method Phaser.TilemapParser.getEmptyData
    * @return {object} Generated map data.
    */
    getEmptyData: function () {

        var map = {};

        map.width = 0;
        map.height = 0;
        map.tileWidth = 0;
        map.tileHeight = 0;
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
            data: []

        };

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
            console.warn('TilemapParser.parseTiledJSON: Only orthogonal map types are supported in this version of Phaser');
            return null;
        }

        //  Map data will consist of: layers, objects, images, tilesets, sizes
        var map = {};

        map.width = json.width;
        map.height = json.height;
        map.tileWidth = json.tilewidth;
        map.tileHeight = json.tileheight;
        map.orientation = json.orientation;
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

            //  This is an array containing the tile indexes, one after the other. 0 = no tile, everything else = the tile index (starting at 1)
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
                    row.push(null);
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

        //  Objects & Collision Data (polylines, etc)
        var objects = {};
        var collision = {};

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

                }

            }
        }

        map.objects = objects;
        map.collision = collision;

        //  Tilesets
        var tilesets = [];

        for (var i = 0; i < json.tilesets.length; i++)
        {
            //  name, firstgid, width, height, margin, spacing, properties
            var set = json.tilesets[i];
            var newSet = new Phaser.Tileset(set.name, set.firstgid, set.tilewidth, set.tileheight, set.margin, set.spacing, set.properties);

            if (set.tileproperties)
            {
                newSet.tileProperties = set.tileproperties;
            }

            newSet.rows = (set.imageheight - set.margin) / (set.tileheight + set.spacing);
            newSet.columns = (set.imagewidth - set.margin) / (set.tilewidth + set.spacing);
            newSet.total = newSet.rows * newSet.columns;

            if (newSet.rows % 1 !== 0 || newSet.columns % 1 !== 0)
            {
                console.warn('TileSet image dimensions do not match expected dimensions. Tileset width/height must be evenly divisible by Tilemap tile width/height.');
            }
            else
            {
                tilesets.push(newSet);
            }
        }

        map.tilesets = tilesets;

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

        return map;

    }

}
