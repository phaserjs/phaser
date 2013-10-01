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
* 
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
	* @property {bool} active - Description.
	* @default
	*/
    this.active = false;
    
    /**
	* @property {bool} visible - Description.
	* @default
	*/
    this.visible = false;
    
    /**
	* @property {bool} hasPreUpdate - Description.
	* @default
	*/
    this.hasPreUpdate = false;
    
    /**
	* @property {bool} hasUpdate - Description.
	* @default
	*/
    this.hasUpdate = false;
    
    /**
	* @property {bool} hasRender - Description.
	* @default
	*/
    this.hasRender = false;
    
    /**
	* @property {bool} hasPostRender - Description.
	* @default
	*/
    this.hasPostRender = false;

};

Phaser.Plugin.prototype = {

    /**
    * Pre-update is called at the start of the update cycle, before any other updates have taken place (including Physics).
    * It is only called if active is set to true.
    */
    preUpdate: function () {
    },

    /**
    * Update is called after all the core subsystems (Input, Tweens, Sound, etc) and the State have updated, but before the render.
    * It is only called if active is set to true.
    */
    update: function () {
    },

    /**
    * Render is called right after the Game Renderer completes, but before the State.render.
    * It is only called if visible is set to true.
    */
    render: function () {
    },

    /**
    * Post-render is called after the Game Renderer and State.render have run.
    * It is only called if visible is set to true.
    */
    postRender: function () {
    },

    /**
    * Clear down this Plugin and null out references
    */
    destroy: function () {

        this.game = null;
        this.parent = null;
        this.active = false;
        this.visible = false;
        
    }

};
