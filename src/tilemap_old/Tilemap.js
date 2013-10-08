/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser.Tilemap
*/


/**
* Create a new <code>Tilemap</code>.
* @class Phaser.Tilemap
* @classdesc This GameObject allows for the display of a tilemap within the game world. Tile maps consist of an image, tile data and a size.
* Internally it creates a TilemapLayer for each layer in the tilemap.
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {string} key - Asset key for this map.
* @param {object} x - Description.
* @param {object} y - Description.
* @param {boolean} resizeWorld - Resize the world bound automatically based on this tilemap?
* @param {number} tileWidth - Width of tiles in this map (used for CSV maps).
* @param {number} tileHeight - Height of tiles in this map (used for CSV maps).
*/
Phaser.Tilemap = function (game, key, x, y, resizeWorld, tileWidth, tileHeight) {

    if (typeof resizeWorld === "undefined") { resizeWorld = true; }
    if (typeof tileWidth === "undefined") { tileWidth = 0; }
    if (typeof tileHeight === "undefined") { tileHeight = 0; }

    /**
    * @property {Phaser.Game} game - A reference to the currently running game. 
    */
    this.game = game;
    
    /**
    * @property {Description} group - Description. 
    */  
    this.group = null;
    
    /**
    * @property {string} name - The user defined name given to this Description.
    * @default
    */  
    this.name = '';
    
    /**
    * @property {Description} key - Description.
    */   
    this.key = key;

    /**
    * @property {number} renderOrderID - Render iteration counter
    * @default
    */
    this.renderOrderID = 0;

	/**
	* @property {boolean} collisionCallback - Tilemap collision callback.
	* @default
	*/
    this.collisionCallback = null;

	/**
	* @property {boolean} exists - Description.
	* @default
	*/
    this.exists = true;
    
    /**
	* @property {boolean} visible - Description.
	* @default
	*/
    this.visible = true;

    this.width = 0;
    this.height = 0;

    /**
	* @property {boolean} tiles - Description.
	* @default
	*/
    this.tiles = [];
    
    /**
	* @property {boolean} layers - Description.
	* @default
	*/
    this.layers = [];

    var map = this.game.cache.getTilemap(key);

    PIXI.DisplayObjectContainer.call(this);

	/**
	* @property {Description} position - Description.
	*/
    this.position.x = x;
    this.position.y = y;

	/**
	* @property {Description} type - Description.
	*/
    this.type = Phaser.TILEMAP;

    /**
	* @property {Description} renderer - Description.
	*/
    this.renderer = new Phaser.TilemapRenderer(this.game);

    this.fixedToCamera = true;

    /**
	* @property {Description} mapFormat - Description.
	*/
    this.mapFormat = map.format;

    switch (this.mapFormat)
    {
        case Phaser.Tilemap.CSV:
            this.parseCSV(map.mapData, key, tileWidth, tileHeight);
            break;

        case Phaser.Tilemap.JSON:
            this.parseTiledJSON(map.mapData, key);
            break;
    }

    if (this.currentLayer && resizeWorld)
    {
        this.game.world.setBounds(0, 0, this.width, this.heightIn);
    }
	
};

//  Needed to keep the PIXI.Sprite constructor in the prototype chain (as the core pixi renderer uses an instanceof check sadly)
Phaser.Tilemap.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Phaser.Tilemap.prototype.constructor = Phaser.Tilemap;

Phaser.Tilemap.CSV = 0;
Phaser.Tilemap.JSON = 1;

/**
* Parse csv map data and generate tiles.
* 
* @method Phaser.Tilemap.prototype.parseCSV
* @param {string} data - CSV map data.
* @param {string} key - Asset key for tileset image.
* @param {number} tileWidth - Width of its tile.
* @param {number} tileHeight - Height of its tile.
*/
Phaser.Tilemap.prototype.parseCSV = function (data, key, tileWidth, tileHeight) {

    var layer = new Phaser.TilemapLayer(this, 0, key, Phaser.Tilemap.CSV, 'TileLayerCSV' + this.layers.length.toString(), tileWidth, tileHeight);

    //  Trim any rogue whitespace from the data
    data = data.trim();

    var rows = data.split("\n");

    for (var i = 0; i < rows.length; i++)
    {
        var column = rows[i].split(",");

        if (column.length > 0)
        {
            layer.addColumn(column);
        }
    }

    layer.updateBounds();
    layer.createCanvas();

    var tileQuantity = layer.parseTileOffsets();

    this.currentLayer = layer;
    this.collisionLayer = layer;
    this.layers.push(layer);

    this.width = this.currentLayer.widthInPixels;
    this.height = this.currentLayer.heightInPixels;

    this.generateTiles(tileQuantity);

};

/**
* Parse JSON map data and generate tiles.
* 
* @method Phaser.Tilemap.prototype.parseTiledJSON
* @param {string} data - JSON map data.
* @param {string} key - Asset key for tileset image.
*/
Phaser.Tilemap.prototype.parseTiledJSON = function (json, key) {

    for (var i = 0; i < json.layers.length; i++)
    {
        var layer = new Phaser.TilemapLayer(this, i, key, Phaser.Tilemap.JSON, json.layers[i].name, json.tilewidth, json.tileheight);

        //  Check it's a data layer
        if (!json.layers[i].data)
        {
            continue;
        }

        // layer.createQuadTree(json.tilewidth * json.layers[i].width, json.tileheight * json.layers[i].height);

        layer.alpha = json.layers[i].opacity;
        layer.visible = json.layers[i].visible;
        layer.tileMargin = json.tilesets[0].margin;
        layer.tileSpacing = json.tilesets[0].spacing;

        var c = 0;
        var row;

        for (var t = 0; t < json.layers[i].data.length; t++)
        {
            if (c == 0)
            {
                row = [];
            }

            row.push(json.layers[i].data[t]);
            c++;

            if (c == json.layers[i].width)
            {
                layer.addColumn(row);
                c = 0;
            }
        }

        layer.updateBounds();
        layer.createCanvas();
        
        var tileQuantity = layer.parseTileOffsets();
        
        this.currentLayer = layer;
        this.collisionLayer = layer;
        this.layers.push(layer);

        if (this.currentLayer.widthInPixels > this.width)
        {
            this.width = this.currentLayer.widthInPixels;
        }

        if (this.currentLayer.heightInPixels > this.height)
        {
            this.height = this.currentLayer.heightInPixels;
        }
    }

    this.generateTiles(tileQuantity);

};

/**
* Create tiles of given quantity.
* @method Phaser.Tilemap.prototype.generateTiles
* @param {number} qty - Quantity of tiles to be generated.
*/
Phaser.Tilemap.prototype.generateTiles = function (qty) {

    for (var i = 0; i < qty; i++)
    {
        this.tiles.push(new Phaser.Tile(this.game, this, i, this.currentLayer.tileWidth, this.currentLayer.tileHeight));
    }

};

/**
* Set callback to be called when this tilemap collides.
* 
* @method Phaser.Tilemap.prototype.setCollisionCallback
* @param {object} context - Callback will be called with this context.
* @param {Function} callback - Callback function.
*/
Phaser.Tilemap.prototype.setCollisionCallback = function (context, callback) {

    this.collisionCallbackContext = context;
    this.collisionCallback = callback;

};

/**
* Set collision configs of tiles in a range index.
* 
* @method Phaser.Tilemap.prototype.setCollisionRange
* @param {number} start - First index of tiles.
* @param {number} end - Last index of tiles.
* @param {number} collision - Bit field of flags. (see Tile.allowCollision)
* @param {boolean} resetCollisions - Reset collision flags before set.
* @param {boolean} separateX - Enable separate at x-axis.
* @param {boolean} separateY - Enable separate at y-axis.
*/
Phaser.Tilemap.prototype.setCollisionRange = function (start, end, left, right, up, down, resetCollisions, separateX, separateY) {

    if (typeof resetCollisions === "undefined") { resetCollisions = false; }
    if (typeof separateX === "undefined") { separateX = true; }
    if (typeof separateY === "undefined") { separateY = true; }

    for (var i = start; i < end; i++)
    {
        this.tiles[i].setCollision(left, right, up, down, resetCollisions, separateX, separateY);
    }

};

/**
* Set collision configs of tiles with given index.
* @param {number[]} values - Index array which contains all tile indexes. The tiles with those indexes will be setup with rest parameters.
* @param {number} collision - Bit field of flags (see Tile.allowCollision).
* @param {boolean} resetCollisions - Reset collision flags before set.
* @param {boolean} left - Indicating collide with any object on the left.
* @param {boolean} right - Indicating collide with any object on the right.
* @param {boolean} up - Indicating collide with any object on the top.
* @param {boolean} down - Indicating collide with any object on the bottom.
* @param {boolean} separateX - Enable separate at x-axis.
* @param {boolean} separateY  - Enable separate at y-axis.
*/
Phaser.Tilemap.prototype.setCollisionByIndex = function (values, left, right, up, down, resetCollisions, separateX, separateY) {

    if (typeof resetCollisions === "undefined") { resetCollisions = false; }
    if (typeof separateX === "undefined") { separateX = true; }
    if (typeof separateY === "undefined") { separateY = true; }

    for (var i = 0; i < values.length; i++)
    {
        this.tiles[values[i]].setCollision(left, right, up, down, resetCollisions, separateX, separateY);
    }

};

//  Tile Management

/**
* Get the tile by its index.
* @param {number} value - Index of the tile you want to get.
* @return {Tile} The tile with given index.
*/
Phaser.Tilemap.prototype.getTileByIndex = function (value) {

    if (this.tiles[value])
    {
        return this.tiles[value];
    }

    return null;

};

/**
* Get the tile located at specific position and layer.
* @param {number} x - X position of this tile located.
* @param {number} y - Y position of this tile located.
* @param {number} [layer] - layer of this tile located.
* @return {Tile} The tile with specific properties.
*/
Phaser.Tilemap.prototype.getTile = function (x, y, layer) {

    if (typeof layer === "undefined") { layer = this.currentLayer.ID; }

    return this.tiles[this.layers[layer].getTileIndex(x, y)];

};

/**
* Get the tile located at specific position (in world coordinate) and layer (thus you give a position of a point which is within the tile).
* @param {number} x - X position of the point in target tile.
* @param {number} y - Y position of the point in target tile.
* @param {number} [layer] - layer of this tile located.
* @return {Tile} The tile with specific properties.
*/
Phaser.Tilemap.prototype.getTileFromWorldXY = function (x, y, layer) {

    if (typeof layer === "undefined") { layer = this.currentLayer.ID; }

    return this.tiles[this.layers[layer].getTileFromWorldXY(x, y)];

};

/**
* Gets the tile underneath the Input.x/y position.
* @param {number} layer - The layer to check, defaults to 0.
* @return {Tile}
*/
Phaser.Tilemap.prototype.getTileFromInputXY = function (layer) {

    if (typeof layer === "undefined") { layer = this.currentLayer.ID; }

    return this.tiles[this.layers[layer].getTileFromWorldXY(this.game.input.worldX, this.game.input.worldY)];

};

/**
* Get tiles overlaps the given object.
* @param {GameObject} object - Tiles you want to get that overlaps this.
* @return {array} Array with tiles information (Each contains x, y and the tile).
*/
Phaser.Tilemap.prototype.getTileOverlaps = function (object) {

    return this.currentLayer.getTileOverlaps(object);

};

//  COLLIDE

/**
* Check whether this tilemap collides with the given game object or group of objects.
* @param {Function} objectOrGroup - Target object of group you want to check.
* @param {Function} callback - This is called if objectOrGroup collides the tilemap.
* @param {object} context - Callback will be called with this context.
* @return {boolean} Return true if this collides with given object, otherwise return false.
*/
Phaser.Tilemap.prototype.collide = function (objectOrGroup, callback, context) {

    objectOrGroup = objectOrGroup || this.game.world.group;
    callback = callback || null;
    context = context || null;

    if (callback && context)
    {
        this.collisionCallback = callback;
        this.collisionCallbackContext = context;
    }

    if (objectOrGroup instanceof Phaser.Group)
    {
        objectOrGroup.forEachAlive(this.collideGameObject, this);
    }
    else
    {
        this.collideGameObject(objectOrGroup);
    }

};

/**
* Check whether this tilemap collides with the given game object.
* @param {GameObject} object - Target object you want to check.
* @return {boolean} Return true if this collides with given object, otherwise return false.
*/
Phaser.Tilemap.prototype.collideGameObject = function (object) {

    if (object instanceof Phaser.Group || object instanceof Phaser.Tilemap)
    {
        return false;
    }

    if (object.exists && object.body.allowCollision.none == false)
    {
        this._tempCollisionData = this.collisionLayer.getTileOverlaps(object);

        if (this.collisionCallback && this._tempCollisionData.length > 0)
        {
            this.collisionCallback.call(this.collisionCallbackContext, object, this._tempCollisionData);
        }

        return true;
    }
    else
    {
        return false;
    }

};

/**
* Set a tile to a specific layer.
* @param {number} x - X position of this tile.
* @param {number} y - Y position of this tile.
* @param {number} index - The index of this tile type in the core map data.
* @param {number} [layer] - Which layer you want to set the tile to.
*/
Phaser.Tilemap.prototype.putTile = function (x, y, index, layer) {

    if (typeof layer === "undefined") { layer = this.currentLayer.ID; }
    
    this.layers[layer].putTile(x, y, index);

};

/**
* Calls the renderer.
*/
Phaser.Tilemap.prototype.update = function () {

    this.renderer.render(this);

    if (this.fixedToCamera)
    {
        // this.displayObject.position.x = this.game.camera.view.x + this.x;
        // this.displayObject.position.y = this.game.camera.view.y + this.y;
        this.position.x = this.game.camera.view.x + 0;
        this.position.y = this.game.camera.view.y + 0;
    }

};

/**
* Description.
*/
Phaser.Tilemap.prototype.destroy = function () {

    this.tiles.length = 0;
    this.layers.length = 0;

};

/**
* Get width in pixels.
* @return {number}
*/
Object.defineProperty(Phaser.Tilemap.prototype, "widthInPixels", {

    get: function () {
        return this.currentLayer.widthInPixels;
    }

});

/**
* Get height in pixels.
* @return {number}
*/
Object.defineProperty(Phaser.Tilemap.prototype, "heightInPixels", {

    get: function () {
        return this.currentLayer.heightInPixels;
    }

});
