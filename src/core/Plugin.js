/**
* Phaser - Plugin
*
* This is a base Plugin template to use for any Phaser plugin development
*/
Phaser.Plugin = function (game, parent) {

    this.game = game;
    this.parent = parent;
    
    this.active = false;
    this.visible = false;
    
    this.hasPreUpdate = false;
    this.hasUpdate = false;
    this.hasPostUpdate = false;
    this.hasPreRender = false;
    this.hasRender = false;
    this.hasPostRender = false;

};

Phaser.Plugin.prototype = {

    /**
    * Pre-update is called at the start of the update cycle, before any other updates have taken place.
    * It is only called if active is set to true.
    */
    preUpdate: function () {
    },

    /**
    * Pre-update is called at the start of the update cycle, before any other updates have taken place.
    * It is only called if active is set to true.
    */
    update: function () {
    },

    /**
    * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
    * It is only called if active is set to true.
    */
    postUpdate: function () {
    },

    /**
    * Pre-render is called right before the Game Renderer starts and before any custom preRender callbacks have been run.
    * It is only called if visible is set to true.
    */
    preRender: function () {
    },

    /**
    * Pre-render is called right before the Game Renderer starts and before any custom preRender callbacks have been run.
    * It is only called if visible is set to true.
    */
    render: function () {
    },

    /**
    * Post-render is called after every camera and game object has been rendered, also after any custom postRender callbacks have been run.
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
