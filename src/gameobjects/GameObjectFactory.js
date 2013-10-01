/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.GameObjectFactory
*/

/**
* Description.
*
* @class Phaser.GameObjectFactory
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.GameObjectFactory = function (game) {

    /**
	* @property {Phaser.Game} game - A reference to the currently running Game.
	*/
	this.game = game;
	
    /**
	* @property {Phaser.World} world - A reference to the game world.
	*/
	this.world = this.game.world;

};

Phaser.GameObjectFactory.prototype = {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    * @default
    */
	game: null,
	
    /**
	* @property {Phaser.World} world - A reference to the game world.
	* @default
	*/
    world: null,

    /**
    * Description.
    * @method existing.
    * @param {object} - Description.
    * @return {boolean} Description.
    */
    existing: function (object) {

        return this.world.group.add(object);

    },

	/**
    * Create a new Sprite with specific position and sprite sheet key.
    *
    * @method sprite
    * @param {number} x - X position of the new sprite.
    * @param {number} y - Y position of the new sprite.
    * @param {string|RenderTexture} [key] - The image key as defined in the Game.Cache to use as the texture for this sprite OR a RenderTexture.
    * @param {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
    * @returns {Description} Description.
    */
    sprite: function (x, y, key, frame) {

        return this.world.group.add(new Phaser.Sprite(this.game, x, y, key, frame));

    },

    /**
    * Create a new Sprite with specific position and sprite sheet key that will automatically be added as a child of the given parent.
    *
    * @method child
    * @param {number} x - X position of the new sprite.
    * @param {number} y - Y position of the new sprite.
    * @param {string|RenderTexture} [key] - The image key as defined in the Game.Cache to use as the texture for this sprite OR a RenderTexture.
    * @param  {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
    * @returns {Description} Description.
    */
    child: function (parent, x, y, key, frame) {

        var child = this.world.group.add(new Phaser.Sprite(this.game, x, y, key, frame));
        parent.addChild(child);
        return child;

    },

    /**
    * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
    *
    * @method tween
    * @param {object} obj - Object the tween will be run on.
    * @return {Description} Description.
    */
    tween: function (obj) {

        return this.game.tweens.create(obj);

    },

    /**
    * Description.
    *
    * @method group
    * @param {Description} parent - Description.
    * @param {Description} name - Description.
    * @return {Description} Description.
    */
    group: function (parent, name) {

        return new Phaser.Group(this.game, parent, name);

    },

    /**
     * Description.
     *
     * @method audio
     * @param {Description} key - Description.
     * @param {Description} volume - Description.
     * @param {Description} loop - Description.
     * @return {Description} Description.
     */
    audio: function (key, volume, loop) {

        return this.game.sound.add(key, volume, loop);
        
    },

    /**
     * Description.
     *
     * @method tileSprite
     * @param {Description} x - Description.
     * @param {Description} y - Description.
     * @param {Description} width - Description.
     * @param {Description} height - Description.
     * @param {Description} key - Description.
     * @param {Description} frame - Description.
     * @return {Description} Description.
     */
    tileSprite: function (x, y, width, height, key, frame) {

        return this.world.group.add(new Phaser.TileSprite(this.game, x, y, width, height, key, frame));

    },

    /**
     * Description.
     *
     * @method text
     * @param {Description} x - Description.
     * @param {Description} y - Description.
     * @param {Description} text - Description.
     * @param {Description} style - Description.
     */
    text: function (x, y, text, style) {

        return this.world.group.add(new Phaser.Text(this.game, x, y, text, style));

    },

    /**
    * Description.
    *
    * @method button
    * @param {Description} x - Description.
    * @param {Description} y - Description.
    * @param {Description} callback - Description.
    * @param {Description} callbackContext - Description.
    * @param {Description} overFrame - Description.
    * @param {Description} outFrame - Description.
    * @param {Description} downFrame - Description.
    * @return {Description} Description.
    */
    button: function (x, y, key, callback, callbackContext, overFrame, outFrame, downFrame) {

        return this.world.group.add(new Phaser.Button(this.game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame));

    },

    /**
     * Description.
     *
     * @method graphics
     * @param {Description} x - Description.
     * @param {Description} y - Description.
     * @return {Description} Description.
     */
    graphics: function (x, y) {

        return this.world.group.add(new Phaser.Graphics(this.game, x, y));

    },

    /**
    * Description.
    *
    * @method emitter
    * @param {Description} x - Description.
    * @param {Description} y - Description.
    * @param {Description} maxParticles - Description.
    * @return {Description} Description.
    */
    emitter: function (x, y, maxParticles) {

        return this.game.particles.add(new Phaser.Particles.Arcade.Emitter(this.game, x, y, maxParticles));

    },

    /**
    * Description.
    *
    * @method bitmapText
    * @param {Description} x - Description.
    * @param {Description} y - Description.
    * @param {Description} text - Description.
    * @param {Description} style - Description.
    * @return {Description} Description.
    */
    bitmapText: function (x, y, text, style) {

        return this.world.group.add(new Phaser.BitmapText(this.game, x, y, text, style));

    },

    /**
    * Description.
    *
    * @method tilemap
    * @param {Description} x - Description.
    * @param {Description} y - Description.
    * @param {Description} key - Description.
    * @param {Description} resizeWorld - Description.
    * @param {Description} tileWidth - Description.
    * @param {Description} tileHeight - Description.
    * @return {Description} Description.
    */
    tilemap: function (x, y, key, resizeWorld, tileWidth, tileHeight) {

        return this.world.group.add(new Phaser.Tilemap(this.game, key, x, y, resizeWorld, tileWidth, tileHeight));

    },

    /**
    * Description.
    *
    * @method renderTexture
    * @param {Description} key - Description.
    * @param {Description} width - Description.
    * @param {Description} height - Description.
    * @return {Description} Description.
    */
    renderTexture: function (key, width, height) {

        var texture = new Phaser.RenderTexture(this.game, key, width, height);

        this.game.cache.addRenderTexture(key, texture);

        return texture;

    },

};