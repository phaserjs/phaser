Phaser.GameObjectFactory = function (game) {

	this.game = game;
	this._world = this.game.world;

};

Phaser.GameObjectFactory.prototype = {

	_world: null,
	game: null,

	/**
    * Create a new Sprite with specific position and sprite sheet key.
    *
    * @param x {number} X position of the new sprite.
    * @param y {number} Y position of the new sprite.
    * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this sprite
    * @param [frame] {string|number} If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
    * @returns {Sprite} The newly created sprite object.
    */
    sprite: function (x, y, key, frame) {

        if (typeof key === "undefined") { key = ''; }
        if (typeof frame === "undefined") { frame = null; }

        // return this._world.group.add(new Phaser.Sprite(this.game, x, y, key, frame));

    },

};