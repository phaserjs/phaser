/**
* Phaser - Tilemap
*
* This GameObject allows for the display of a tilemap within the game world. Tile maps consist of an image, tile data and a size.
* Internally it creates a TilemapLayer for each layer in the tilemap.
*/

/**
* Tilemap constructor
* Create a new <code>Tilemap</code>.
*
* @param game {Phaser.Game} Current game instance.
* @param key {string} Asset key for this map.
* @param mapData {string} Data of this map. (a big 2d array, normally in csv)
* @param format {number} Format of this map data, available: Tilemap.CSV or Tilemap.JSON.
* @param resizeWorld {bool} Resize the world bound automatically based on this tilemap?
* @param tileWidth {number} Width of tiles in this map (used for CSV maps).
* @param tileHeight {number} Height of tiles in this map (used for CSV maps).
*/
Phaser.Tilemap = function (game, key, x, y, resizeWorld, tileWidth, tileHeight) {

    if (typeof resizeWorld === "undefined") { resizeWorld = true; }
    if (typeof tileWidth === "undefined") { tileWidth = 0; }
    if (typeof tileHeight === "undefined") { tileHeight = 0; }

    this.game = game;
    this.group = null;
    this.name = '';
    this.key = key;

    /**
    * Render iteration counter
    */
    this.renderOrderID = 0;

    /**
    * Tilemap collision callback.
    * @type {function}
    */
    this.collisionCallback = null;

    this.exists = true;
    this.visible = true;

    this.tiles = [];
    this.layers = [];

    var map = this.game.cache.getTilemap(key);

    PIXI.DisplayObjectContainer.call(this);
    this.position.x = x;
    this.position.y = y;

    this.renderer = new Phaser.TilemapRenderer(this.game);

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
        this.game.world.setSize(this.currentLayer.widthInPixels, this.currentLayer.heightInPixels, true);
    }
	
};

//  Needed to keep the PIXI.Sprite constructor in the prototype chain (as the core pixi renderer uses an instanceof check sadly)
Phaser.Tilemap.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Phaser.Tilemap.prototype.constructor = Phaser.Tilemap;

Phaser.Tilemap.CSV = 0;
Phaser.Tilemap.JSON = 1;

/**
* Parset csv map data and generate tiles.
* @param data {string} CSV map data.
* @param key {string} Asset key for tileset image.
* @param tileWidth {number} Width of its tile.
* @param tileHeight {number} Height of its tile.
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

    this.generateTiles(tileQuantity);

};

/**
* Parse JSON map data and generate tiles.
* @param data {string} JSON map data.
* @param key {string} Asset key for tileset image.
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
    }

    this.generateTiles(tileQuantity);

};

/**
* Create tiles of given quantity.
* @param qty {number} Quentity of tiles to be generated.
*/
Phaser.Tilemap.prototype.generateTiles = function (qty) {

    for (var i = 0; i < qty; i++)
    {
        this.tiles.push(new Phaser.Tile(this.game, this, i, this.currentLayer.tileWidth, this.currentLayer.tileHeight));
    }

};

/**
* Set callback to be called when this tilemap collides.
* @param context {object} Callback will be called with this context.
* @param callback {function} Callback function.
*/
Phaser.Tilemap.prototype.setCollisionCallback = function (context, callback) {

    this.collisionCallbackContext = context;
    this.collisionCallback = callback;

};

/**
* Set collision configs of tiles in a range index.
* @param start {number} First index of tiles.
* @param end {number} Last index of tiles.
* @param collision {number} Bit field of flags. (see Tile.allowCollision)
* @param resetCollisions {bool} Reset collision flags before set.
* @param separateX {bool} Enable seprate at x-axis.
* @param separateY {bool} Enable seprate at y-axis.
*/
Phaser.Tilemap.prototype.setCollisionRange = function (start, end, left, right, up, down, resetCollisions, separateX, separateY) {

    if (typeof resetCollisions === "undefined") { resetCollisions = false; }
    if (typeof separateX === "undefined") { separateX = true; }
    if (typeof separateY === "undefined") { separateY = true; }

    for (var i = start; i < end; i++)
    {
        //setCollision: function (left, right, up, down, reset, separateX, separateY) {
        this.tiles[i].setCollision(left, right, up, down, resetCollisions, separateX, separateY);
    }

};

/**
* Set collision configs of tiles with given index.
* @param values {number[]} Index array which contains all tile indexes. The tiles with those indexes will be setup with rest parameters.
* @param collision {number} Bit field of flags. (see Tile.allowCollision)
* @param resetCollisions {bool} Reset collision flags before set.
* @param separateX {bool} Enable seprate at x-axis.
* @param separateY {bool} Enable seprate at y-axis.
*/
Phaser.Tilemap.prototype.setCollisionByIndex = function (values, collision, resetCollisions, separateX, separateY) {

    if (typeof collision === "undefined") { collision = Phaser.Types.ANY; }
    if (typeof resetCollisions === "undefined") { resetCollisions = false; }
    if (typeof separateX === "undefined") { separateX = true; }
    if (typeof separateY === "undefined") { separateY = true; }

    for (var i = 0; i < values.length; i++)
    {
        this.tiles[values[i]].setCollision(collision, resetCollisions, separateX, separateY);
    }

};

//  Tile Management

/**
* Get the tile by its index.
* @param value {number} Index of the tile you want to get.
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
* @param x {number} X position of this tile located.
* @param y {number} Y position of this tile located.
* @param [layer] {number} layer of this tile located.
* @return {Tile} The tile with specific properties.
*/
Phaser.Tilemap.prototype.getTile = function (x, y, layer) {

    if (typeof layer === "undefined") { layer = this.currentLayer.ID; }

    return this.tiles[this.layers[layer].getTileIndex(x, y)];

};

/**
* Get the tile located at specific position (in world coordinate) and layer. (thus you give a position of a point which is within the tile)
* @param x {number} X position of the point in target tile.
* @param x {number} Y position of the point in target tile.
* @param [layer] {number} layer of this tile located.
* @return {Tile} The tile with specific properties.
*/
Phaser.Tilemap.prototype.getTileFromWorldXY = function (x, y, layer) {

    if (typeof layer === "undefined") { layer = this.currentLayer.ID; }

    return this.tiles[this.layers[layer].getTileFromWorldXY(x, y)];

};

/**
* Gets the tile underneath the Input.x/y position
* @param layer The layer to check, defaults to 0
* @returns {Tile}
*/
Phaser.Tilemap.prototype.getTileFromInputXY = function (layer) {

    if (typeof layer === "undefined") { layer = this.currentLayer.ID; }

    return this.tiles[this.layers[layer].getTileFromWorldXY(this.game.input.worldX, this.game.input.worldY)];

};

/**
* Get tiles overlaps the given object.
* @param object {GameObject} Tiles you want to get that overlaps this.
* @return {array} Array with tiles information. (Each contains x, y and the tile.)
*/
Phaser.Tilemap.prototype.getTileOverlaps = function (object) {

    return this.currentLayer.getTileOverlaps(object);

};

//  COLLIDE

/**
* Check whether this tilemap collides with the given game object or group of objects.
* @param objectOrGroup {function} Target object of group you want to check.
* @param callback {function} This is called if objectOrGroup collides the tilemap.
* @param context {object} Callback will be called with this context.
* @return {bool} Return true if this collides with given object, otherwise return false.
*/
Phaser.Tilemap.prototype.collide = function (objectOrGroup, callback, context) {

    if (typeof objectOrGroup === "undefined") { objectOrGroup = null; }
    if (typeof callback === "undefined") { callback = null; }
    if (typeof context === "undefined") { context = null; }

    if (callback !== null && context !== null)
    {
        this.collisionCallback = callback;
        this.collisionCallbackContext = context;
    }

    if (objectOrGroup == null)
    {
        objectOrGroup = this.game.world.group;
    }

    //  Group?
    if (objectOrGroup instanceof Phaser.Group)
    {
        // objectOrGroup.forEachAlive(this, this.collideGameObject, true);
    }
    else
    {
        this.collideGameObject(objectOrGroup);
    }

};

/**
* Check whether this tilemap collides with the given game object.
* @param object {GameObject} Target object you want to check.
* @return {bool} Return true if this collides with given object, otherwise return false.
*/
Phaser.Tilemap.prototype.collideGameObject = function (object) {

    if (object.exists && object.body.allowCollision.none == false)
    {
        this._tempCollisionData = this.collisionLayer.getTileOverlaps(object);

        if (this.collisionCallback !== null && this._tempCollisionData.length > 0)
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
* @param x {number} X position of this tile.
* @param y {number} Y position of this tile.
* @param index {number} The index of this tile type in the core map data.
* @param [layer] {number} which layer you want to set the tile to.
*/
Phaser.Tilemap.prototype.putTile = function (x, y, index, layer) {

    if (typeof layer === "undefined") { layer = this.currentLayer.ID; }
    
    this.layers[layer].putTile(x, y, index);

};

/**
* Calls the renderer
*/
Phaser.Tilemap.prototype.update = function () {

    this.renderer.render(this);

};

Phaser.Tilemap.prototype.destroy = function () {

    this.tiles.length = 0;
    this.layers.length = 0;

};

Object.defineProperty(Phaser.Tilemap.prototype, "widthInPixels", {

    get: function () {
        return this.currentLayer.widthInPixels;
    }

});

Object.defineProperty(Phaser.Tilemap.prototype, "heightInPixels", {

    get: function () {
        return this.currentLayer.heightInPixels;
    }

});
