Phaser.Physics.Arcade.Body = function (sprite) {

	this.sprite = sprite;
	this.game = sprite.game;
	this.bounds = new Phaser.Rectangle(sprite.x, sprite.y, sprite.currentFrame.sourceSizeW, sprite.currentFrame.sourceSizeH);

	this.offset = new Phaser.Point;

	this._w = sprite.width;
	this._h = sprite.height;

};

Phaser.Physics.Arcade.Body.prototype = {

	sprite: null,
	game: null,
	bounds: null,

	update: function () {

		this.bounds.x = this.sprite.x - (this.sprite.anchor.x * (this.offset.x * this.sprite.scale.x));
		this.bounds.y = this.sprite.y - (this.sprite.anchor.y * (this.offset.y * this.sprite.scale.y));
		this.bounds.width = this._w * this.sprite.scale.x;
		this.bounds.height = this._h * this.sprite.scale.y;

	},

};