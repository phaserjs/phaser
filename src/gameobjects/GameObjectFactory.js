/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Game Object Factory is a quick way to create all of the different sorts of core objects that Phaser uses.
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
    * Adds an existing object to the game world.
    * @method Phaser.GameObjectFactory#existing
    * @param {*} object - An instance of Phaser.Sprite, Phaser.Button or any other display object..
    * @return {*} The child that was added to the Group.
    */
    existing: function (object) {

        return this.world.add(object);

    },

    /**
    * Create a new Sprite with specific position and sprite sheet key.
    *
    * @method Phaser.GameObjectFactory#sprite
    * @param {number} x - X position of the new sprite.
    * @param {number} y - Y position of the new sprite.
    * @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
    * @param {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
    * @returns {Phaser.Sprite} the newly created sprite object.
    */
    sprite: function (x, y, key, frame) {

        return this.world.create(x, y, key, frame);

    },

    /**
    * Create a new Sprite with specific position and sprite sheet key that will automatically be added as a child of the given parent.
    *
    * @method Phaser.GameObjectFactory#child
    * @param {Phaser.Group} group - The Group to add this child to.
    * @param {number} x - X position of the new sprite.
    * @param {number} y - Y position of the new sprite.
    * @param {string|RenderTexture} [key] - The image key as defined in the Game.Cache to use as the texture for this sprite OR a RenderTexture.
    * @param  {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
    * @returns {Phaser.Sprite} the newly created sprite object.
    */
    child: function (group, x, y, key, frame) {

        return group.create(x, y, key, frame);

    },

    /**
    * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
    *
    * @method Phaser.GameObjectFactory#tween
    * @param {object} obj - Object the tween will be run on.
    * @return {Phaser.Tween} Description.
    */
    tween: function (obj) {

        return this.game.tweens.create(obj);

    },

    /**
    * A Group is a container for display objects that allows for fast pooling, recycling and collision checks.
    *
    * @method Phaser.GameObjectFactory#group
    * @param {*} parent - The parent Group or DisplayObjectContainer that will hold this group, if any.
    * @param {string} [name=group] - A name for this Group. Not used internally but useful for debugging.
    * @return {Phaser.Group} The newly created group.
    */
    group: function (parent, name) {

        return new Phaser.Group(this.game, parent, name);

    },

    /**
    * Creates a new instance of the Sound class.
    *
    * @method Phaser.GameObjectFactory#audio
    * @param {string} key - The Game.cache key of the sound that this object will use.
    * @param {number} [volume=1] - The volume at which the sound will be played.
    * @param {boolean} [loop=false] - Whether or not the sound will loop.
    * @param {boolean} [connect=true] - Controls if the created Sound object will connect to the master gainNode of the SoundManager when running under WebAudio.
    * @return {Phaser.Sound} The newly created text object.
    */
    audio: function (key, volume, loop, connect) {

        return this.game.sound.add(key, volume, loop, connect);
        
    },

    /**
    * Creates a new <code>TileSprite</code>.
    *
    * @method Phaser.GameObjectFactory#tileSprite
    * @param {number} x - X position of the new tileSprite.
    * @param {number} y - Y position of the new tileSprite.
    * @param {number} width - the width of the tilesprite.
    * @param {number} height - the height of the tilesprite.
    * @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
    * @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
    * @return {Phaser.TileSprite} The newly created tileSprite object.
    */
    tileSprite: function (x, y, width, height, key, frame) {

        return this.world.add(new Phaser.TileSprite(this.game, x, y, width, height, key, frame));

    },

    /**
    * Creates a new <code>Text</code>.
    *
    * @method Phaser.GameObjectFactory#text
    * @param {number} x - X position of the new text object.
    * @param {number} y - Y position of the new text object.
    * @param {string} text - The actual text that will be written.
    * @param {object} style - The style object containing style attributes like font, font size , etc.
    * @return {Phaser.Text} The newly created text object.
    */
    text: function (x, y, text, style) {

        return this.world.add(new Phaser.Text(this.game, x, y, text, style));

    },

    /**
    * Creates a new <code>Button</code> object.
    *
    * @method Phaser.GameObjectFactory#button
    * @param {number} [x] X position of the new button object.
    * @param {number} [y] Y position of the new button object.
    * @param {string} [key] The image key as defined in the Game.Cache to use as the texture for this button.
    * @param {function} [callback] The function to call when this button is pressed
    * @param {object} [callbackContext] The context in which the callback will be called (usually 'this')
    * @param {string|number} [overFrame] This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
    * @param {string|number} [outFrame] This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
    * @param {string|number} [downFrame] This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
    * @return {Phaser.Button} The newly created button object.
    */
    button: function (x, y, key, callback, callbackContext, overFrame, outFrame, downFrame) {

        return this.world.add(new Phaser.Button(this.game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame));

    },

    /**
    * Creates a new <code>Graphics</code> object.
    *
    * @method Phaser.GameObjectFactory#graphics
    * @param {number} x - X position of the new graphics object.
    * @param {number} y - Y position of the new graphics object.
    * @return {Phaser.Graphics} The newly created graphics object.
    */
    graphics: function (x, y) {

        return this.world.add(new Phaser.Graphics(this.game, x, y));

    },

    /**
    * Emitter is a lightweight particle emitter. It can be used for one-time explosions or for
    * continuous effects like rain and fire. All it really does is launch Particle objects out
    * at set intervals, and fixes their positions and velocities accorindgly.
    *
    * @method Phaser.GameObjectFactory#emitter
    * @param {number} [x=0] - The x coordinate within the Emitter that the particles are emitted from.
    * @param {number} [y=0] - The y coordinate within the Emitter that the particles are emitted from.
    * @param {number} [maxParticles=50] - The total number of particles in this emitter.
    * @return {Phaser.Emitter} The newly created emitter object.
    */
    emitter: function (x, y, maxParticles) {

        return this.game.particles.add(new Phaser.Particles.Arcade.Emitter(this.game, x, y, maxParticles));

    },

    /**
    * * Create a new <code>BitmapText</code>.
    *
    * @method Phaser.GameObjectFactory#bitmapText
    * @param {number} x - X position of the new bitmapText object.
    * @param {number} y - Y position of the new bitmapText object.
    * @param {string} text - The actual text that will be written.
    * @param {object} style - The style object containing style attributes like font, font size , etc.
    * @return {Phaser.BitmapText} The newly created bitmapText object.
    */
    bitmapText: function (x, y, text, style) {

        return this.world.add(new Phaser.BitmapText(this.game, x, y, text, style));

    },

    /**
    * Creates a new Tilemap object.
    *
    * @method Phaser.GameObjectFactory#tilemap
    * @param {string} key - Asset key for the JSON file.
    * @return {Phaser.Tilemap} The newly created tilemap object.
    */
    tilemap: function (key) {

        return new Phaser.Tilemap(this.game, key);

    },

    /**
    * Creates a new Tileset object.
    *
    * @method Phaser.GameObjectFactory#tileset
    * @param {string} key - The image key as defined in the Game.Cache to use as the tileset.
    * @return {Phaser.Tileset} The newly created tileset object.
    */
    tileset: function (key) {

        return this.game.cache.getTileset(key);

    },

    /**
    * Creates a new Tilemap Layer object.
    *
    * @method Phaser.GameObjectFactory#tilemapLayer
    * @param {number} x - X position of the new tilemapLayer.
    * @param {number} y - Y position of the new tilemapLayer.
    * @param {number} width - the width of the tilemapLayer.
    * @param {number} height - the height of the tilemapLayer.
    * @return {Phaser.TilemapLayer} The newly created tilemaplayer object.
    */
    tilemapLayer: function (x, y, width, height, tileset, tilemap, layer) {

        return this.world.add(new Phaser.TilemapLayer(this.game, x, y, width, height, tileset, tilemap, layer));

    },

    /**
    * A dynamic initially blank canvas to which images can be drawn.
    *
    * @method Phaser.GameObjectFactory#renderTexture
    * @param {string} key - Asset key for the render texture.
    * @param {number} width - the width of the render texture.
    * @param {number} height - the height of the render texture.
    * @return {Phaser.RenderTexture} The newly created renderTexture object.
    */
    renderTexture: function (key, width, height) {

        var texture = new Phaser.RenderTexture(this.game, key, width, height);

        this.game.cache.addRenderTexture(key, texture);

        return texture;

    },

    /**
    * A BitmapData object which can be manipulated and drawn to like a traditional Canvas object and used to texture Sprites.
    *
    * @method Phaser.GameObjectFactory#bitmapData
    * @param {number} [width=256] - The width of the BitmapData in pixels.
    * @param {number} [height=256] - The height of the BitmapData in pixels.
    * @return {Phaser.BitmapData} The newly created BitmapData object.
    */
    bitmapData: function (width, height) {

        return new Phaser.BitmapData(this.game, width, height);

    },

    /**
    * A WebGL shader/filter that can be applied to Sprites.
    *
    * @method Phaser.GameObjectFactory#filter
    * @param {string} filter - The name of the filter you wish to create, for example HueRotate or SineWave.
    * @param {any} - Whatever parameters are needed to be passed to the filter init function.
    * @return {Phaser.Filter} The newly created Phaser.Filter object.
    */
    filter: function (filter) {

        var args = Array.prototype.splice.call(arguments, 1);

        var filter = new Phaser.Filter[filter](this.game);

        filter.init.apply(filter, args);

        return filter;

    }

};