function Tile(properties)
{
    this.index = properties.index;
	this.id = properties.id;
	this.x =  properties.x;
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
}

Tile.prototype.setId = function (id)
{
    var tileId = this.id = id;
    var tileWidth = this.width;
    var tileHeight = this.height;
    var setWidth = this.textureWidth / tileWidth;
    var halfTileWidth = (tileWidth) * 0.5;
    var halfTileHeight = (tileHeight) * 0.5;
    var rectx = (((tileId % setWidth)|0) * tileWidth) + halfTileWidth;
    var recty = (((tileId / setWidth)|0) * tileHeight) + halfTileHeight;

    this.frameX = rectx;
    this.frameY = recty;

};

module.exports = Tile;
