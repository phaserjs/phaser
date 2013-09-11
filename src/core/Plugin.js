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
    this.hasRender = false;
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
