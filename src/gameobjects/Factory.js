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
* @class Phaser.GameObjects.Factory
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.GameObjects.Factory = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    * @protected
    */
    this.game = game;

    /**
    * @property {Phaser.World} world - A reference to the game world.
    * @protected
    */
    this.world = this.game.world;

};

Phaser.GameObjects.Factory.prototype.constructor = Phaser.GameObjects.Factory;

Phaser.GameObjects.Factory.prototype = {

    boot: function ()
    {
        for (var gameobject in Phaser.GameObjects)
        {
            if (Phaser.GameObjects[gameobject].hasOwnProperty('FACTORY_KEY'))
            {
                var key = Phaser.GameObjects[gameobject]['FACTORY_KEY'];

                // console.log('found', key);

                Phaser.GameObjects.Factory.prototype[key] = Phaser.GameObjects[gameobject]['FACTORY_ADD'];
            }
        }
    },

    /**
    * Adds an existing display object to the game world.
    * 
    * @method Phaser.GameObjectFactory#existing
    * @param {any} object - An instance of Phaser.Sprite, Phaser.Button or any other display object.
    * @return {any} The child that was added to the World.
    */
    existing: function (object) {

        return this.world.add(object);

    },

    /**
    * Create a tween on a specific object.
    * 
    * The object can be any JavaScript object or Phaser object such as Sprite.
    *
    * @method Phaser.GameObjectFactory#tween
    * @param {object} object - Object the tween will be run on.
    * @return {Phaser.Tween} The newly created Phaser.Tween object.
    */
    tween: function (object) {

        return this.game.tweens.create(object);

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
    * @return {Phaser.Group} The newly created Group.
    */
    group: function (parent, name, addToStage, enableBody, physicsBodyType) {

        return new Phaser.Group(this.game, parent, name, addToStage, enableBody, physicsBodyType);

    },

    /**
    * A Group is a container for display objects that allows for fast pooling, recycling and collision checks.
    * 
    * A Physics Group is the same as an ordinary Group except that is has enableBody turned on by default, so any Sprites it creates
    * are automatically given a physics body.
    *
    * @method Phaser.GameObjectFactory#physicsGroup
    * @param {number} [physicsBodyType=Phaser.Physics.ARCADE] - If enableBody is true this is the type of physics body that is created on new Sprites. Phaser.Physics.ARCADE, Phaser.Physics.P2JS, Phaser.Physics.NINJA, etc.
    * @param {any} [parent] - The parent Group or DisplayObjectContainer that will hold this group, if any. If set to null the Group won't be added to the display list. If undefined it will be added to World by default.
    * @param {string} [name='group'] - A name for this Group. Not used internally but useful for debugging.
    * @param {boolean} [addToStage=false] - If set to true this Group will be added directly to the Game.Stage instead of Game.World.
    * @return {Phaser.Group} The newly created Group.
    */
    physicsGroup: function (physicsBodyType, parent, name, addToStage) {

        return new Phaser.Group(this.game, parent, name, addToStage, true, physicsBodyType);

    },

    /**
    * Creates a new Sound object.
    *
    * @method Phaser.GameObjectFactory#audio
    * @param {string} key - The Game.cache key of the sound that this object will use.
    * @param {number} [volume=1] - The volume at which the sound will be played.
    * @param {boolean} [loop=false] - Whether or not the sound will loop.
    * @param {boolean} [connect=true] - Controls if the created Sound object will connect to the master gainNode of the SoundManager when running under WebAudio.
    * @return {Phaser.Sound} The newly created sound object.
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
    * @return {Phaser.Sound} The newly created sound object.
    */
    sound: function (key, volume, loop, connect) {

        return this.game.sound.add(key, volume, loop, connect);

    },

    /**
     * Creates a new AudioSprite object.
     *
     * @method Phaser.GameObjectFactory#audioSprite
     * @param {string} key - The Game.cache key of the sound that this object will use.
     * @return {Phaser.AudioSprite} The newly created AudioSprite object.
     */
    audioSprite: function (key) {

        return this.game.sound.addSprite(key);

    },


};
