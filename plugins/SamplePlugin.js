/**
* A Sample Plugin demonstrating how to hook into the Phaser plugin system.
*/
Phaser.Plugin.SamplePlugin = function (game, parent) {

	Phaser.Plugin.call(this, game, parent);

	this.sprite = null;
	
};

//	Extends the Phaser.Plugin template, setting up values we need
Phaser.Plugin.SamplePlugin.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.SamplePlugin.prototype.constructor = Phaser.Plugin.SamplePlugin;

/**
* Add a Sprite reference to this Plugin.
* All this plugin does is move the Sprite across the screen slowly.
* @type {Phaser.Sprite}
*/
Phaser.Plugin.SamplePlugin.prototype.addSprite = function (sprite) {

	this.sprite = sprite;

};

/**
* This is run when the plugins update during the core game loop.
*/
Phaser.Plugin.SamplePlugin.prototype.update = function () {

	if (this.sprite)
	{
		this.sprite.x += 0.5;
	}

};
