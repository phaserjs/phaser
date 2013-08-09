var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Phaser;
(function (Phaser) {
    /// <reference path="../Phaser/Game.ts" />
    /// <reference path="../Phaser/core/Plugin.ts" />
    /**
    * Phaser - Example Plugin
    */
    (function (Plugins) {
        var Example = (function (_super) {
            __extends(Example, _super);
            function Example(game, parent) {
                _super.call(this, game, parent);

                this.active = true;
                this.visible = true;

                this.hasPreUpdate = false;
                this.hasUpdate = false;
                this.hasPostUpdate = false;

                this.hasPreRender = false;
                this.hasRender = false;
                this.hasPostRender = false;
            }
            /**
            * Pre-update is called at the start of the update cycle, before any other updates have taken place.
            * It is only called if active is set to true.
            */
            Example.prototype.preUpdate = function () {
            };

            /**
            * Pre-update is called at the start of the update cycle, after all the core system updates have taken place, but before the world update.
            * It is only called if active is set to true.
            */
            Example.prototype.update = function () {
            };

            /**
            * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
            * It is only called if active is set to true.
            */
            Example.prototype.postUpdate = function () {
            };

            /**
            * Pre-render is called right before the Game Renderer starts and before any custom preRender callbacks have been run.
            * It is only called if visible is set to true.
            */
            Example.prototype.preRender = function () {
            };

            /**
            * Pre-render is called right before the Game Renderer starts and before any custom preRender callbacks have been run.
            * It is only called if visible is set to true.
            */
            Example.prototype.render = function () {
            };

            /**
            * Post-render is called after every camera and game object has been rendered, also after any custom postRender callbacks have been run.
            * It is only called if visible is set to true.
            */
            Example.prototype.postRender = function () {
            };
            return Example;
        })(Phaser.Plugin);
        Plugins.Example = Example;
    })(Phaser.Plugins || (Phaser.Plugins = {}));
    var Plugins = Phaser.Plugins;
})(Phaser || (Phaser = {}));
