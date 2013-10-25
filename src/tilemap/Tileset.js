
Phaser.Tileset = function (image, key, tileWidth, tileHeight, tileMargin, tileSpacing) {

    if (typeof tileMargin === "undefined") { tileMargin = 0; }
    if (typeof tileSpacing === "undefined") { tileSpacing = 0; }

    /**
    * @property {string} key - The cache ID.
    */
    this.key = key;

    this.image = image;

    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.margin = tileMargin;
    this.spacing = tileSpacing;

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

    setSpacing: function (margin, spacing) {

        this.tileMargin = margin;
        this.tileSpacing = spacing;

    },

    canCollide: function (index) {

        if (this.tiles[index])
        {
            return this.tiles[index].collideNone;
        }

        return null;

    },

    checkTileIndex: function (index) {

    	return (this.tiles[index]);

    },

    setCollisionRange: function (start, stop, left, right, up, down) {

        if (this.tiles[start] && this.tiles[stop] && start < stop)
        {
            for (var i = start; i <= stop; i++)
            {
                this.tiles[i].setCollision(left, right, up, down);
            }
        }

    },

    setCollision: function (index, left, right, up, down) {

        if (this.tiles[index])
        {
            this.tiles[index].setCollision(left, right, up, down);
        }

    },

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
