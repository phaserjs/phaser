Phaser.GameObjectFactory = function (game) {

	this.game = game;
	this.world = this.game.world;

};

Phaser.GameObjectFactory.prototype = {

	game: null,
    world: null,

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

        return this.world.add(new Phaser.Sprite(this.game, x, y, key, frame));

    },

    /**
    * Create a new Sprite with specific position and sprite sheet key that will automatically be added as a child of the given parent.
    *
    * @param x {number} X position of the new sprite.
    * @param y {number} Y position of the new sprite.
    * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this sprite
    * @param [frame] {string|number} If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
    * @returns {Sprite} The newly created sprite object.
    */
    child: function (parent, x, y, key, frame) {

        var child = this.world.add(new Phaser.Sprite(this.game, x, y, key, frame));
        parent.addChild(child);
        return child;

    },

    /**
    * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
    *
    * @param obj {object} Object the tween will be run on.
    * @param [localReference] {bool} If true the tween will be stored in the object.tween property so long as it exists. If already set it'll be over-written.
    * @return {Phaser.Tween} The newly created tween object.
    */
    tween: function (obj, localReference) {

        return this.game.tweens.create(obj, localReference);

    },

    group: function (parent, name) {

        return new Phaser.Group(this.game, parent, name);

    },

    audio: function (key, volume, loop) {

        return this.game.sound.add(key, volume, loop);
        
    },

    tileSprite: function (x, y, width, height, key, frame) {

        return this.world.add(new Phaser.TileSprite(this.game, x, y, width, height, key, frame));

    },

    text: function (x, y, text, style) {

        return this.world.add(new Phaser.Text(this.game, x, y, text, style));

    },

    button: function (x, y, key, callback, callbackContext, overFrame, outFrame, downFrame) {

        return this.world.add(new Phaser.Button(this.game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame));

    },

    graphics: function (x, y) {

        return this.world.add(new Phaser.Graphics(this.game, x, y));

    },

};