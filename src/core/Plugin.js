/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* This is a base Plugin template to use for any Phaser plugin development.
*
* @class Phaser.Plugin
* @classdesc Phaser - Plugin
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Any} parent - The object that owns this plugin, usually Phaser.PluginManager.
*/
Phaser.Plugin = function (game, parent) {

    if (typeof parent === 'undefined') { parent = null; }

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {Any} parent - The parent of this plugin. If added to the PluginManager the parent will be set to that, otherwise it will be null.
    */
    this.parent = parent;

    /**
    * @property {boolean} active - A Plugin with active=true has its preUpdate and update methods called by the parent, otherwise they are skipped.
    * @default
    */
    this.active = false;

    /**
    * @property {boolean} visible - A Plugin with visible=true has its render and postRender methods called by the parent, otherwise they are skipped.
    * @default
    */
    this.visible = false;

    /**
    * @property {boolean} hasPreUpdate - A flag to indicate if this plugin has a preUpdate method.
    * @default
    */
    this.hasPreUpdate = false;

    /**
    * @property {boolean} hasUpdate - A flag to indicate if this plugin has an update method.
    * @default
    */
    this.hasUpdate = false;

    /**
    * @property {boolean} hasPostUpdate - A flag to indicate if this plugin has a postUpdate method.
    * @default
    */
    this.hasPostUpdate = false;

    /**
    * @property {boolean} hasRender - A flag to indicate if this plugin has a render method.
    * @default
    */
    this.hasRender = false;

    /**
    * @property {boolean} hasPostRender - A flag to indicate if this plugin has a postRender method.
    * @default
    */
    this.hasPostRender = false;

};

Phaser.Plugin.prototype = {

    /**
    * Pre-update is called at the very start of the update cycle, before any other subsystems have been updated (including Physics).
    * It is only called if active is set to true.
    * @method Phaser.Plugin#preUpdate
    */
    preUpdate: function () {
    },

    /**
    * Update is called after all the core subsystems (Input, Tweens, Sound, etc) and the State have updated, but before the render.
    * It is only called if active is set to true.
    * @method Phaser.Plugin#update
    */
    update: function () {
    },

    /**
    * Render is called right after the Game Renderer completes, but before the State.render.
    * It is only called if visible is set to true.
    * @method Phaser.Plugin#render
    */
    render: function () {
    },

    /**
    * Post-render is called after the Game Renderer and State.render have run.
    * It is only called if visible is set to true.
    * @method Phaser.Plugin#postRender
    */
    postRender: function () {
    },

    /**
    * Clear down this Plugin and null out references
    * @method Phaser.Plugin#destroy
    */
    destroy: function () {

        this.game = null;
        this.parent = null;
        this.active = false;
        this.visible = false;

    }

};

Phaser.Plugin.prototype.constructor = Phaser.Plugin;
