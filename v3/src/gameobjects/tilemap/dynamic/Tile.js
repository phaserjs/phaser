function Tile (properties)
{
    this.index = properties.index;
    this.id = properties.id;
    this.x = properties.x;
    this.y = properties.y;
    this.width = properties.width;
    this.height = properties.height;
    this.frameX = properties.frameX;
    this.frameY = properties.frameY;
    this.frameWidth = properties.frameWidth;
    this.frameHeight = properties.frameHeight;
    this.alpha = 1.0;
    this.tint = 0xFFFFFF;
    this.visible = true;
    this.textureWidth = properties.textureWidth;
    this.textureHeight = properties.textureHeight;
    this.border = properties.border;
}

Tile.prototype.setId = function (id)
{
    var tileId = this.id = id;
    var tileWidth = this.width;
    var tileHeight = this.height;
    var setWidth = this.textureWidth / tileWidth;
    var tileWidthBorder = (tileWidth + this.border * 2);
    var tileHeightBorder = (tileHeight + this.border * 2);
    var halfTileWidth = tileWidthBorder * 0.5;
    var halfTileHeight = tileHeightBorder * 0.5;
    var rectx = (((tileId % setWidth)|0) * tileWidthBorder) + halfTileWidth;
    var recty = (((tileId / setWidth)|0) * tileHeightBorder) + halfTileHeight;

    this.frameX = rectx;
    this.frameY = recty;
};

module.exports = Tile;
