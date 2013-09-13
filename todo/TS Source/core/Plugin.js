/// <reference path="../_definitions.ts" />
/**
* Phaser - Plugin
*/
var Phaser;
(function (Phaser) {
    var Plugin = (function () {
        function Plugin(game, parent) {
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
        }
        Plugin.prototype.preUpdate = /**
        * Pre-update is called at the start of the update cycle, before any other updates have taken place.
        * It is only called if active is set to true.
        */
        function () {
        };
        Plugin.prototype.update = /**
        * Pre-update is called at the start of the update cycle, before any other updates have taken place.
        * It is only called if active is set to true.
        */
        function () {
        };
        Plugin.prototype.postUpdate = /**
        * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
        * It is only called if active is set to true.
        */
        function () {
        };
        Plugin.prototype.preRender = /**
        * Pre-render is called right before the Game Renderer starts and before any custom preRender callbacks have been run.
        * It is only called if visible is set to true.
        */
        function () {
        };
        Plugin.prototype.render = /**
        * Pre-render is called right before the Game Renderer starts and before any custom preRender callbacks have been run.
        * It is only called if visible is set to true.
        */
        function () {
        };
        Plugin.prototype.postRender = /**
        * Post-render is called after every camera and game object has been rendered, also after any custom postRender callbacks have been run.
        * It is only called if visible is set to true.
        */
        function () {
        };
        Plugin.prototype.destroy = /**
        * Clear down this Plugin and null out references
        */
        function () {
            this.game = null;
            this.parent = null;
            this.active = false;
            this.visible = false;
        };
        return Plugin;
    })();
    Phaser.Plugin = Plugin;    
})(Phaser || (Phaser = {}));
