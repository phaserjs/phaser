
Phaser.Tileset = function (image, key, tileWidth, tileHeight) {

    /**
    * @property {string} key - The cache ID.
    */
    this.key = key;

    this.image = image;

    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    this.tiles = [];

}

Phaser.Tileset.prototype = {

    addTile: function (tile) {

        this.tiles.push(tile);

        return tile;

    },

    getTile: function (index) {

        if (this.tiles[index])
        {
            return this.tiles[index];
        }

        return null;

    },

    checkTileIndex: function (index) {

    	return (this.tiles[index]);

    }

}

/**
* @name Phaser.Tileset#total
* @property {number} total - The total number of tiles in this Tileset.
* @readonly
*/
Object.defineProperty(Phaser.Tileset.prototype, "total", {

    get: function () {
        return this.tiles.length;
    }

});
