var Class = require('../../utils/Class');

var Tileset = new Class({

    initialize:

    function Tileset (name, firstgid, tileWidth, tileHeight, tileMargin, tileSpacing, properties)
    {
        if (tileWidth === undefined || tileWidth <= 0) { tileWidth = 32; }
        if (tileHeight === undefined || tileHeight <= 0) { tileHeight = 32; }
        if (tileMargin === undefined) { tileMargin = 0; }
        if (tileSpacing === undefined) { tileSpacing = 0; }

        this.name = name;
        this.firstgid = firstgid;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileMargin = tileMargin;
        this.tileSpacing = tileSpacing;
        this.properties = properties;
        this.image = null;
        this.rows = 0;
        this.columns = 0;
        this.total = 0;
        this.texCoordinates = [];
    },

    setImage: function (texture)
    {
        this.image = texture;
        this.updateTileData(this.image.source[0].width, this.image.source[0].height);
    },

    containsTileIndex: function (tileIndex)
    {
        return (
            tileIndex >= this.firstgid &&
            tileIndex < (this.firstgid + this.total)
        );
    },

    getTileTextureCoordinates: function (tileIndex)
    {
        if (!this.containsTileIndex(tileIndex)) { return null; }
        return this.texCoordinates[tileIndex - this.firstgid];
    },

    setTileSize: function (tileWidth, tileHeight)
    {
        if (tileWidth !== undefined) { this.tileWidth = tileWidth; }
        if (tileHeight !== undefined) { this.tileHeight = tileHeight; }

        if (this.image)
        {
            this.updateTileData(this.image.source[0].width, this.image.source[0].height);
        }
    },

    setSpacing: function (margin, spacing)
    {
        if (margin !== undefined) { this.tileMargin = margin; }
        if (spacing !== undefined) { this.tileSpacing = spacing; }

        if (this.image)
        {
            this.updateTileData(this.image.source[0].width, this.image.source[0].height);
        }
    },

    updateTileData: function (imageWidth, imageHeight)
    {
        var rowCount = (imageHeight - this.tileMargin * 2 + this.tileSpacing) / (this.tileHeight + this.tileSpacing);
        var colCount = (imageWidth - this.tileMargin * 2 + this.tileSpacing) / (this.tileWidth + this.tileSpacing);

        if (rowCount % 1 !== 0 || colCount % 1 !== 0)
        {
            console.warn('Tileset ' + this.name + ' image tile area is not an even multiple of tile size');
        }

        // In Tiled a tileset image that is not an even multiple of the tile dimensions
        // is truncated - hence the floor when calculating the rows/columns.
        rowCount = Math.floor(rowCount);
        colCount = Math.floor(colCount);

        this.rows = rowCount;
        this.columns = colCount;

        // In Tiled, "empty" spaces in a tileset count as tiles and hence count towards the gid
        this.total = rowCount * colCount;

        this.texCoordinates.length = 0;

        var tx = this.tileMargin;
        var ty = this.tileMargin;

        for (var y = 0; y < this.rows; y++)
        {
            for (var x = 0; x < this.columns; x++)
            {
                this.texCoordinates.push({ x: tx, y: ty });
                tx += this.tileWidth + this.tileSpacing;
            }

            tx = this.tileMargin;
            ty += this.tileHeight + this.tileSpacing;
        }
    }
});

module.exports = Tileset;
