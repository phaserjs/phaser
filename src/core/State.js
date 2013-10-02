/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* This is a base State class which can be extended if you are creating your own game.
* It provides quick access to common functions such as the camera, cache, input, match, sound and more.
*
* @class Phaser.State
* @constructor
*/

Phaser.State = function () {

    /**
	* @property {Phaser.Game} game - A reference to the currently running Game.
	*/
    this.game = null;
    
	/**
	* @property {Phaser.GameObjectFactory} add - Reference to the GameObjectFactory.
	* @default
	*/
    this.add = null;
    
    /**
	* @property {Phaser.Physics.PhysicsManager} camera - A handy reference to world.camera.
	* @default
	*/
    this.camera = null;
    
    /**
	* @property {Phaser.Cache} cache - Reference to the assets cache.
	* @default
	*/
    this.cache = null;
    
    /**
	* @property {Phaser.Input} input - Reference to the input manager
	* @default
	*/
    this.input = null;
    
    /**
	* @property {Phaser.Loader} load - Reference to the assets loader.
	* @default
	*/
    this.load = null;
    
    /**
	* @property {Phaser.GameMath} math - Reference to the math helper.
	* @default
	*/
    this.math = null;
    
    /**
	* @property {Phaser.SoundManager} sound - Reference to the sound manager.
	* @default
	*/
    this.sound = null;
    
    /**
	* @property {Phaser.Stage} stage - Reference to the stage.
	* @default
	*/
    this.stage = null;
    
    /**
	* @property {Phaser.TimeManager} time - Reference to game clock.
	* @default
	*/
    this.time = null;
    
    /**
	* @property {Phaser.TweenManager} tweens - Reference to the tween manager.
	* @default
	*/
    this.tweens = null;
    
    /**
	* @property {Phaser.World} world - Reference to the world.
	* @default
	*/
    this.world = null;
    
	/**
	* @property {Description} add - Description.
	* @default
	*/
    this.particles = null;
    
    /**
	* @property {Phaser.Physics.PhysicsManager} physics - Reference to the physics manager.
	* @default
	*/
    this.physics = null;

};

Phaser.State.prototype = {

    /**
    * Override this method to add some load operations.
    * If you need to use the loader, you may need to use them here.
    * 
    * @method Phaser.State#preload
    */
    preload: function () {
    },

    /**
    * Put update logic here.
    * 
    * @method Phaser.State#loadUpdate
    */
    loadUpdate: function () {
    },

    /**
    * Put render operations here.
    * 
    * @method Phaser.State#loadRender
    */
    loadRender: function () {
    },

    /**
    * This method is called after the game engine successfully switches states.
    * Feel free to add any setup code here (do not load anything here, override preload() instead).
    * 
    * @method Phaser.State#create
    */
    create: function () {
    },

    /**
    * Put update logic here.
    * 
    * @method Phaser.State#update
    */
    update: function () {
    },

    /**
    * Put render operations here.
    * 
    * @method Phaser.State#render
    */
    render: function () {
    },

    /**
    * This method will be called when game paused.
    * 
    * @method Phaser.State#paused
    */
    paused: function () {
    },

    /**
    * This method will be called when the state is destroyed.
    * @method Phaser.State#destroy
    */
    destroy: function () {
    }

};
