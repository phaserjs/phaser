/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The GameObjects Factory is a quick way to create many common game objects
* using {@linkcode Phaser.Game#add `game.add`}.
*
* Created objects are _automatically added_ to the appropriate Manager, World, or manually specified parent Group.
*
* @class Phaser.GameObject.Factory
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.GameObject.Factory = function (state)
{
    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    * @protected
    */
    this.game = state.game;

    /**
    * @property {Phaser.State} state - The State that owns this Factory
    * @protected
    */
    this.state = state;
};

Phaser.GameObject.Factory.prototype.constructor = Phaser.GameObject.Factory;

Phaser.GameObject.Factory.prototype = {

    /**
    * Adds an existing display object to the game world.
    * 
    * @method Phaser.GameObject.Factory#existing
    * @param {any} object - An instance of Phaser.Sprite, Phaser.Button or any other display object.
    * @return {any} The child that was added to the World.
    */
    existing: function (object)
    {
        return this.state.children.add(object);
    },

    /**
    * Create a tween on a specific object.
    * 
    * The object can be any JavaScript object or Phaser object such as Sprite.
    *
    * @method Phaser.GameObject.Factory#tween
    * @param {object} object - Object the tween will be run on.
    * @return {Phaser.Tween} The newly created Phaser.Tween object.
    */
    tween: function (object)
    {
        return this.state.sys.tweens.create(object);
    },

    /**
    * A Group is a container for display objects that allows for fast pooling, recycling and collision checks.
    *
    * @method Phaser.GameObject.Factory#group
    * @param {any} [parent] - The parent Group or DisplayObjectContainer that will hold this group, if any. If set to null the Group won't be added to the display list. If undefined it will be added to World by default.
    * @param {string} [name='group'] - A name for this Group. Not used internally but useful for debugging.
    * @param {boolean} [addToStage=false] - If set to true this Group will be added directly to the Game.Stage instead of Game.World.
    * @param {boolean} [enableBody=false] - If true all Sprites created with `Group.create` or `Group.createMulitple` will have a physics body created on them. Change the body type with physicsBodyType.
    * @param {number} [physicsBodyType=0] - If enableBody is true this is the type of physics body that is created on new Sprites. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA, etc.
    * @return {Phaser.Group} The newly created Group.
    */
    group: function (parent, name, addToStage, enableBody, physicsBodyType)
    {
        return new Phaser.Group(this.game, parent, name, addToStage, enableBody, physicsBodyType);
    },

    /**
    * A Group is a container for display objects that allows for fast pooling, recycling and collision checks.
    * 
    * A Physics Group is the same as an ordinary Group except that is has enableBody turned on by default, so any Sprites it creates
    * are automatically given a physics body.
    *
    * @method Phaser.GameObject.Factory#physicsGroup
    * @param {number} [physicsBodyType=Phaser.Physics.ARCADE] - If enableBody is true this is the type of physics body that is created on new Sprites. Phaser.Physics.ARCADE, Phaser.Physics.P2JS, Phaser.Physics.NINJA, etc.
    * @param {any} [parent] - The parent Group or DisplayObjectContainer that will hold this group, if any. If set to null the Group won't be added to the display list. If undefined it will be added to World by default.
    * @param {string} [name='group'] - A name for this Group. Not used internally but useful for debugging.
    * @param {boolean} [addToStage=false] - If set to true this Group will be added directly to the Game.Stage instead of Game.World.
    * @return {Phaser.Group} The newly created Group.
    */
    physicsGroup: function (physicsBodyType, parent, name, addToStage)
    {
        return new Phaser.Group(this.game, parent, name, addToStage, true, physicsBodyType);
    },

    /**
    * Creates a new Sound object.
    *
    * @method Phaser.GameObject.Factory#sound
    * @param {string} key - The Game.cache key of the sound that this object will use.
    * @param {number} [volume=1] - The volume at which the sound will be played.
    * @param {boolean} [loop=false] - Whether or not the sound will loop.
    * @param {boolean} [connect=true] - Controls if the created Sound object will connect to the master gainNode of the SoundManager when running under WebAudio.
    * @return {Phaser.Sound} The newly created sound object.
    */
    sound: function (key, volume, loop, connect)
    {
        return this.game.sound.add(key, volume, loop, connect);
    },

    /**
     * Creates a new AudioSprite object.
     *
     * @method Phaser.GameObject.Factory#audioSprite
     * @param {string} key - The Game.cache key of the sound that this object will use.
     * @return {Phaser.AudioSprite} The newly created AudioSprite object.
     */
    audioSprite: function (key)
    {
        return this.game.sound.addSprite(key);
    },

    /**
    * Create a new Emitter.
    *
    * A particle emitter can be used for one-time explosions or for
    * continuous effects like rain and fire. All it really does is launch Particle objects out
    * at set intervals, and fixes their positions and velocities accordingly.
    *
    * @method Phaser.GameObject.Factory#emitter
    * @param {number} [x=0] - The x coordinate within the Emitter that the particles are emitted from.
    * @param {number} [y=0] - The y coordinate within the Emitter that the particles are emitted from.
    * @param {number} [maxParticles=50] - The total number of particles in this emitter.
    * @return {Phaser.Particles.Arcade.Emitter} The newly created emitter object.
    */
    emitter: function (x, y, maxParticles)
    {
        return this.game.particles.add(new Phaser.Particles.Arcade.Emitter(this.game, x, y, maxParticles));
    },

    /**
    * Creates a new Phaser.Tilemap object.
    *
    * The map can either be populated with data from a Tiled JSON file or from a CSV file.
    * To do this pass the Cache key as the first parameter. When using Tiled data you need only provide the key.
    * When using CSV data you must provide the key and the tileWidth and tileHeight parameters.
    * If creating a blank tilemap to be populated later, you can either specify no parameters at all and then use `Tilemap.create` or pass the map and tile dimensions here.
    * Note that all Tilemaps use a base tile size to calculate dimensions from, but that a TilemapLayer may have its own unique tile size that overrides it.
    *
    * @method Phaser.GameObject.Factory#tilemap
    * @param {string} [key] - The key of the tilemap data as stored in the Cache. If you're creating a blank map either leave this parameter out or pass `null`.
    * @param {number} [tileWidth=32] - The pixel width of a single map tile. If using CSV data you must specify this. Not required if using Tiled map data.
    * @param {number} [tileHeight=32] - The pixel height of a single map tile. If using CSV data you must specify this. Not required if using Tiled map data.
    * @param {number} [width=10] - The width of the map in tiles. If this map is created from Tiled or CSV data you don't need to specify this.
    * @param {number} [height=10] - The height of the map in tiles. If this map is created from Tiled or CSV data you don't need to specify this.
    * @return {Phaser.Tilemap} The newly created tilemap object.
    */
    tilemap: function (key, tileWidth, tileHeight, width, height)
    {
        return new Phaser.Tilemap(this.game, key, tileWidth, tileHeight, width, height);
    },

    /**
    * A dynamic initially blank canvas to which images can be drawn.
    *
    * @method Phaser.GameObject.Factory#renderTexture
    * @param {number} [width=100] - the width of the RenderTexture.
    * @param {number} [height=100] - the height of the RenderTexture.
    * @param {string} [key=''] - Asset key for the RenderTexture when stored in the Cache (see addToCache parameter).
    * @param {boolean} [addToCache=false] - Should this RenderTexture be added to the Game.Cache? If so you can retrieve it with Cache.getTexture(key)
    * @return {Phaser.RenderTexture} The newly created RenderTexture object.
    */
    renderTexture: function (width, height, key, addToCache)
    {
        if (key === undefined || key === '') { key = this.game.rnd.uuid(); }
        if (addToCache === undefined) { addToCache = false; }

        var texture = new Phaser.RenderTexture(this.game, width, height, key);

        if (addToCache)
        {
            this.game.cache.addRenderTexture(key, texture);
        }

        return texture;
    },

    /**
    * Create a BitmapData object.
    *
    * A BitmapData object can be manipulated and drawn to like a traditional Canvas object and used to texture Sprites.
    *
    * @method Phaser.GameObject.Factory#bitmapData
    * @param {number} [width=256] - The width of the BitmapData in pixels.
    * @param {number} [height=256] - The height of the BitmapData in pixels.
    * @param {string} [key=''] - Asset key for the BitmapData when stored in the Cache (see addToCache parameter).
    * @param {boolean} [addToCache=false] - Should this BitmapData be added to the Game.Cache? If so you can retrieve it with Cache.getBitmapData(key)
    * @return {Phaser.BitmapData} The newly created BitmapData object.
    */
    bitmapData: function (width, height, key, addToCache)
    {
        if (addToCache === undefined) { addToCache = false; }
        if (key === undefined || key === '') { key = this.game.rnd.uuid(); }

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
    * @method Phaser.GameObject.Factory#filter
    * @param {string} filter - The name of the filter you wish to create, for example HueRotate or SineWave.
    * @param {any} - Whatever parameters are needed to be passed to the filter init function.
    * @return {Phaser.Filter} The newly created Phaser.Filter object.
    */
    filter: function (filter)
    {
        var args = Array.prototype.slice.call(arguments, 1);

        var filter = new Phaser.Filter[filter](this.game);

        filter.init.apply(filter, args);

        return filter;
    },

    /**
    * Add a new Plugin into the PluginManager.
    *
    * The Plugin must have 2 properties: `game` and `parent`. Plugin.game is set to the game reference the PluginManager uses, and parent is set to the PluginManager.
    *
    * @method Phaser.GameObject.Factory#plugin
    * @param {object|Phaser.Plugin} plugin - The Plugin to add into the PluginManager. This can be a function or an existing object.
    * @param {...*} parameter - Additional parameters that will be passed to the Plugin.init method.
    * @return {Phaser.Plugin} The Plugin that was added to the manager.
    */
    plugin: function (plugin)
    {
        return this.game.plugins.add(plugin);
    }

};
