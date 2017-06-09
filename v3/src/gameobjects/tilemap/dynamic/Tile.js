function Tile(properties)
{
	this.id = properties.id;
	this.x =  properties.x;
	this.y = properties.y;
	this.width = properties.width;
	this.height = properties.height;
	this.frame = properties.frame;
	this.alpha = 1.0;
	this.tint = 0xFFFFFF;
	this.visible = false;
}

module.exports = Tile;
