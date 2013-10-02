/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Plugin
*/


/** 
* This is a base Plugin template to use for any Phaser plugin development.
* 
* @class Phaser.Plugin
* @classdesc Phaser - Plugin
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Description} parent - Description.
*/
Phaser.Plugin = function (game, parent) {

	/**
	* @property {Phaser.Game} game - A reference to the currently running game.
	*/
    this.game = game;
    
    /**
	* @property {Description} parent - Description.
	*/
    this.parent = parent;
    
    /**
	* @property {boolean} active - Description.
	* @default
	*/
    this.active = false;
    
    /**
	* @property {boolean} visible - Description.
	* @default
	*/
    this.visible = false;
    
    /**
	* @property {boolean} hasPreUpdate - Description.
	* @default
	*/
    this.hasPreUpdate = false;
    
    /**
	* @property {boolean} hasUpdate - Description.
	* @default
	*/
    this.hasUpdate = false;
    
    /**
	* @property {boolean} hasRender - Description.
	* @default
	*/
    this.hasRender = false;
    
    /**
	* @property {boolean} hasPostRender - Description.
	* @default
	*/
    this.hasPostRender = false;

};

Phaser.Plugin.prototype = {

    /**
    * Pre-update is called at the start of the update cycle, before any other updates have taken place (including Physics).
    * It is only called if active is set to true.
    * @method preUpdate
    * @memberof Phaser.Plugin
    */
    preUpdate: function () {
    },

    /**
    * Update is called after all the core subsystems (Input, Tweens, Sound, etc) and the State have updated, but before the render.
    * It is only called if active is set to true.
    * @method update
    * @memberof Phaser.Plugin
    */
    update: function () {
    },

    /**
    * Render is called right after the Game Renderer completes, but before the State.render.
    * It is only called if visible is set to true.
    * @method render
    * @memberof Phaser.Plugin
    */
    render: function () {
    },

    /**
    * Post-render is called after the Game Renderer and State.render have run.
    * It is only called if visible is set to true.
    * @method postRender
    * @memberof Phaser.Plugin
    */
    postRender: function () {
    },

    /**
    * Clear down this Plugin and null out references
    * @method destroy
    * @memberof Phaser.Plugin
    */
    destroy: function () {

        this.game = null;
        this.parent = null;
        this.active = false;
        this.visible = false;
        
    }

};
