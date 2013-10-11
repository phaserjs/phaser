
Phaser.Tileset = function (key, tileWidth, tileHeight) {

    /**
    * @property {string} key - The cache ID.
    */
    this.key = key;

    this.tilewidth = tileWidth;
    this.tileHeight = tileHeight;

    this._tiles = [];

}

Phaser.Tileset.prototype = {

    addTile: function (tile) {

        this._tiles.push(tile);

        return tile;

    },

    getTile: function (index) {

        if (this._tiles[index])
        {
            return this._tiles[index];
        }

        return null;

    }

}

/**
* @name Phaser.Tileset#total
* @property {number} total - The total number of tiles in this Tileset.
* @readonly
*/
Object.defineProperty(Phaser.Tileset.prototype, "total", {

    get: function () {
        return this._ties.length;
    }

});
