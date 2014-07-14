/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
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
    * Create a new `Image` object. An Image is a light-weight object you can use to display anything that doesn't need physics or animation.
    * It can still rotate, scale, crop and receive input events. This makes it perfect for logos, backgrounds, simple buttons and other non-Sprite graphics.
    *
    * @method Phaser.GameObjectFactory#image
    * @param {number} x - X position of the image.
    * @param {number} y - Y position of the image.
    * @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
    * @param {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
    * @returns {Phaser.Sprite} the newly created sprite object.
    */
    image: function (x, y, key, frame, group) {

        if (typeof group === 'undefined') { group = this.world; }

        return group.add(new Phaser.Image(this.game, x, y, key, frame));

    },

    /**
    * Create a new Sprite with specific position and sprite sheet key.
    *
    * @method Phaser.GameObjectFactory#sprite
    * @param {number} x - X position of the new sprite.
    * @param {number} y - Y position of the new sprite.
    * @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
    * @param {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
    * @returns {Phaser.Sprite} the newly created sprite object.
    */
    sprite: function (x, y, key, frame, group) {

        if (typeof group === 'undefined') { group = this.world; }

        return group.create(x, y, key, frame);

    },

    /**
    * Create a tween on a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
    *
    * @method Phaser.GameObjectFactory#tween
    * @param {object} obj - Object the tween will be run on.
    * @return {Phaser.Tween} The newly created Phaser.Tween object.
    */
    tween: function (obj) {

        return this.game.tweens.create(obj);

    },

    /**
    * A Group is a container for display objects that allows for fast pooling, recycling and collision checks.
    *
    * @method Phaser.GameObjectFactory#group
    * @param {any} [parent] - The parent Group or DisplayObjectContainer that will hold this group, if any. If set to null the Group won't be added to the display list. If undefined it will be added to World by default.
    * @param {string} [name='group'] - A name for this Group. Not used internally but useful for debugging.
    * @param {boolean} [addToStage=false] - If set to true this Group will be added directly to the Game.Stage instead of Game.World.
    * @param {boolean} [enableBody=false] - If true all Sprites created with `Group.create` or `Group.createMulitple` will have a physics body created on them. Change the body type with physicsBodyType.
    * @param {number} [physicsBodyType=0] - If enableBody is true this is the type of physics body that is created on new Sprites. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA, etc.
    * @return {Phaser.Group} The newly created group.
    */
    group: function (parent, name, addToStage, enableBody, physicsBodyType) {

        return new Phaser.Group(this.game, parent, name, addToStage, enableBody, physicsBodyType);

    },

    /**
    * A Group is a container for display objects that allows for fast pooling, recycling and collision checks.
    * A Physics Group is the same as an ordinary Group except that is has enableBody turned on by default, so any Sprites it creates
    * are automatically given a physics body.
    *
    * @method Phaser.GameObjectFactory#physicsGroup
    * @param {number} [physicsBodyType=Phaser.Physics.ARCADE] - If enableBody is true this is the type of physics body that is created on new Sprites. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA, etc.
    * @param {any} [parent] - The parent Group or DisplayObjectContainer that will hold this group, if any. If set to null the Group won't be added to the display list. If undefined it will be added to World by default.
    * @param {string} [name='group'] - A name for this Group. Not used internally but useful for debugging.
    * @param {boolean} [addToStage=false] - If set to true this Group will be added directly to the Game.Stage instead of Game.World.
    * @return {Phaser.Group} The newly created group.
    */
    physicsGroup: function (physicsBodyType, parent, name, addToStage) {

        return new Phaser.Group(this.game, parent, name, addToStage, true, physicsBodyType);

    },

    /**
    * A SpriteBatch is a really fast version of a Phaser Group built solely for speed.
    * Use when you need a lot of sprites or particles all sharing the same texture.
    * The speed gains are specifically for WebGL. In Canvas mode you won't see any real difference.
    *
    * @method Phaser.GameObjectFactory#spriteBatch
    * @param {Phaser.Group|null} parent - The parent Group that will hold this Sprite Batch. Set to `undefined` or `null` to add directly to game.world.
    * @param {string} [name='group'] - A name for this Sprite Batch. Not used internally but useful for debugging.
    * @param {boolean} [addToStage=false] - If set to true this Sprite Batch will be added directly to the Game.Stage instead of the parent.
    * @return {Phaser.Group} The newly created group.
    */
    spriteBatch: function (parent, name, addToStage) {

        if (typeof parent === 'undefined') { parent = null; }
        if (typeof name === 'undefined') { name = 'group'; }
        if (typeof addToStage === 'undefined') { addToStage = false; }

        return new Phaser.SpriteBatch(this.game, parent, name, addToStage);

    },

    /**
    * Creates a new Sound object.
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
    * Creates a new Sound object.
    *
    * @method Phaser.GameObjectFactory#sound
    * @param {string} key - The Game.cache key of the sound that this object will use.
    * @param {number} [volume=1] - The volume at which the sound will be played.
    * @param {boolean} [loop=false] - Whether or not the sound will loop.
    * @param {boolean} [connect=true] - Controls if the created Sound object will connect to the master gainNode of the SoundManager when running under WebAudio.
    * @return {Phaser.Sound} The newly created text object.
    */
    sound: function (key, volume, loop, connect) {

        return this.game.sound.add(key, volume, loop, connect);

    },

    /**
    * Creates a new TileSprite object.
    *
    * @method Phaser.GameObjectFactory#tileSprite
    * @param {number} x - The x coordinate (in world space) to position the TileSprite at.
    * @param {number} y - The y coordinate (in world space) to position the TileSprite at.
    * @param {number} width - The width of the TileSprite.
    * @param {number} height - The height of the TileSprite.
    * @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the TileSprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
    * @param {string|number} frame - If this TileSprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
    * @return {Phaser.TileSprite} The newly created tileSprite object.
    */
    tileSprite: function (x, y, width, height, key, frame, group) {

        if (typeof group === 'undefined') { group = this.world; }

        return group.add(new Phaser.TileSprite(this.game, x, y, width, height, key, frame));

    },

    /**
    * Creates a new Text object.
    *
    * @method Phaser.GameObjectFactory#text
    * @param {number} x - X position of the new text object.
    * @param {number} y - Y position of the new text object.
    * @param {string} text - The actual text that will be written.
    * @param {object} style - The style object containing style attributes like font, font size , etc.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
    * @return {Phaser.Text} The newly created text object.
    */
    text: function (x, y, text, style, group) {

        if (typeof group === 'undefined') { group = this.world; }

        return group.add(new Phaser.Text(this.game, x, y, text, style));

    },

    /**
    * Creates a new Button object.
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
    * @param {string|number} [upFrame] This is the frame or frameName that will be set when this button is in an up state. Give either a number to use a frame ID or a string for a frame name.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
    * @return {Phaser.Button} The newly created button object.
    */
    button: function (x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame, group) {

        if (typeof group === 'undefined') { group = this.world; }

        return group.add(new Phaser.Button(this.game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame));

    },

    /**
    * Creates a new Graphics object.
    *
    * @method Phaser.GameObjectFactory#graphics
    * @param {number} x - X position of the new graphics object.
    * @param {number} y - Y position of the new graphics object.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
    * @return {Phaser.Graphics} The newly created graphics object.
    */
    graphics: function (x, y, group) {

        if (typeof group === 'undefined') { group = this.world; }

        return group.add(new Phaser.Graphics(this.game, x, y));

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
    * Create a new RetroFont object to be used as a texture for an Image or Sprite and optionally add it to the Cache.
    * A RetroFont uses a bitmap which contains fixed with characters for the font set. You use character spacing to define the set.
    * If you need variable width character support then use a BitmapText object instead. The main difference between a RetroFont and a BitmapText
    * is that a RetroFont creates a single texture that you can apply to a game object, where-as a BitmapText creates one Sprite object per letter of text.
    * The texture can be asssigned or one or multiple images/sprites, but note that the text the RetroFont uses will be shared across them all,
    * i.e. if you need each Image to have different text in it, then you need to create multiple RetroFont objects.
    *
    * @method Phaser.GameObjectFactory#retroFont
    * @param {string} font - The key of the image in the Game.Cache that the RetroFont will use.
    * @param {number} characterWidth - The width of each character in the font set.
    * @param {number} characterHeight - The height of each character in the font set.
    * @param {string} chars - The characters used in the font set, in display order. You can use the TEXT_SET consts for common font set arrangements.
    * @param {number} charsPerRow - The number of characters per row in the font set.
    * @param {number} [xSpacing=0] - If the characters in the font set have horizontal spacing between them set the required amount here.
    * @param {number} [ySpacing=0] - If the characters in the font set have vertical spacing between them set the required amount here.
    * @param {number} [xOffset=0] - If the font set doesn't start at the top left of the given image, specify the X coordinate offset here.
    * @param {number} [yOffset=0] - If the font set doesn't start at the top left of the given image, specify the Y coordinate offset here.
    * @return {Phaser.RetroFont} The newly created RetroFont texture which can be applied to an Image or Sprite.
    */
    retroFont: function (font, characterWidth, characterHeight, chars, charsPerRow, xSpacing, ySpacing, xOffset, yOffset) {

        return new Phaser.RetroFont(this.game, font, characterWidth, characterHeight, chars, charsPerRow, xSpacing, ySpacing, xOffset, yOffset);

    },

    /**
    * Create a new BitmapText object.
    *
    * @method Phaser.GameObjectFactory#bitmapText
    * @param {number} x - X position of the new bitmapText object.
    * @param {number} y - Y position of the new bitmapText object.
    * @param {string} font - The key of the BitmapText font as stored in Game.Cache.
    * @param {string} [text] - The actual text that will be rendered. Can be set later via BitmapText.text.
    * @param {number} [size] - The size the font will be rendered in, in pixels.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
    * @return {Phaser.BitmapText} The newly created bitmapText object.
    */
    bitmapText: function (x, y, font, text, size, group) {

        if (typeof group === 'undefined') { group = this.world; }

        return group.add(new Phaser.BitmapText(this.game, x, y, font, text, size));

    },

    /**
    * Creates a new Phaser.Tilemap object. The map can either be populated with data from a Tiled JSON file or from a CSV file.
    * To do this pass the Cache key as the first parameter. When using Tiled data you need only provide the key.
    * When using CSV data you must provide the key and the tileWidth and tileHeight parameters.
    * If creating a blank tilemap to be populated later, you can either specify no parameters at all and then use `Tilemap.create` or pass the map and tile dimensions here.
    * Note that all Tilemaps use a base tile size to calculate dimensions from, but that a TilemapLayer may have its own unique tile size that overrides it.
    *
    * @method Phaser.GameObjectFactory#tilemap
    * @param {string} [key] - The key of the tilemap data as stored in the Cache. If you're creating a blank map either leave this parameter out or pass `null`.
    * @param {number} [tileWidth=32] - The pixel width of a single map tile. If using CSV data you must specify this. Not required if using Tiled map data.
    * @param {number} [tileHeight=32] - The pixel height of a single map tile. If using CSV data you must specify this. Not required if using Tiled map data.
    * @param {number} [width=10] - The width of the map in tiles. If this map is created from Tiled or CSV data you don't need to specify this.
    * @param {number} [height=10] - The height of the map in tiles. If this map is created from Tiled or CSV data you don't need to specify this.
    * @return {Phaser.Tilemap} The newly created tilemap object.
    */
    tilemap: function (key, tileWidth, tileHeight, width, height) {

        return new Phaser.Tilemap(this.game, key, tileWidth, tileHeight, width, height);

    },

    /**
    * A dynamic initially blank canvas to which images can be drawn.
    *
    * @method Phaser.GameObjectFactory#renderTexture
    * @param {number} [width=100] - the width of the RenderTexture.
    * @param {number} [height=100] - the height of the RenderTexture.
    * @param {string} [key=''] - Asset key for the RenderTexture when stored in the Cache (see addToCache parameter).
    * @param {boolean} [addToCache=false] - Should this RenderTexture be added to the Game.Cache? If so you can retrieve it with Cache.getTexture(key)
    * @return {Phaser.RenderTexture} The newly created RenderTexture object.
    */
    renderTexture: function (width, height, key, addToCache) {

        if (typeof key === 'undefined' || key === '') { key = this.game.rnd.uuid(); }
        if (typeof addToCache === 'undefined') { addToCache = false; }

        var texture = new Phaser.RenderTexture(this.game, width, height, key);

        if (addToCache)
        {
            this.game.cache.addRenderTexture(key, texture);
        }

        return texture;

    },

    /**
    * A BitmapData object which can be manipulated and drawn to like a traditional Canvas object and used to texture Sprites.
    *
    * @method Phaser.GameObjectFactory#bitmapData
    * @param {number} [width=100] - The width of the BitmapData in pixels.
    * @param {number} [height=100] - The height of the BitmapData in pixels.
    * @param {string} [key=''] - Asset key for the BitmapData when stored in the Cache (see addToCache parameter).
    * @param {boolean} [addToCache=false] - Should this BitmapData be added to the Game.Cache? If so you can retrieve it with Cache.getBitmapData(key)
    * @return {Phaser.BitmapData} The newly created BitmapData object.
    */
    bitmapData: function (width, height, key, addToCache) {

        if (typeof addToCache === 'undefined') { addToCache = false; }
        if (typeof key === 'undefined' || key === '') { key = this.game.rnd.uuid(); }

        var texture = new Phaser.BitmapData(this.game, key, width, height);

        if (addToCache)
        {
            this.game.cache.addBitmapData(key, texture);
        }

        return texture;

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

    },

    /**
    * Add a new Plugin into the PluginManager.
    * The Plugin must have 2 properties: game and parent. Plugin.game is set to the game reference the PluginManager uses, and parent is set to the PluginManager.
    *
    * @method Phaser.GameObjectFactory#plugin
    * @param {object|Phaser.Plugin} plugin - The Plugin to add into the PluginManager. This can be a function or an existing object.
    * @param {...*} parameter - Additional parameters that will be passed to the Plugin.init method.
    * @return {Phaser.Plugin} The Plugin that was added to the manager.
    */
    plugin: function (plugin) {

        return this.game.plugins.add(plugin);

    }



};

Phaser.GameObjectFactory.prototype.constructor = Phaser.GameObjectFactory;
