var Phaser;
(function (Phaser) {
    /// <reference path="../Phaser/Game.ts" />
    /// <reference path="IPlugin.ts" />
    /**
    * Phaser - Example Plugin
    */
    (function (Plugins) {
        var Example = (function () {
            function Example(game) {
                this.game = game;
                this.active = true;
                this.visible = true;
            }
            Example.prototype.preUpdate = /**
            * Pre-update is called at the start of the update cycle, before any other updates have taken place.
            * It is only called if active is set to true.
            */
            function () {
            };
            Example.prototype.postUpdate = /**
            * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
            * It is only called if active is set to true.
            */
            function () {
            };
            Example.prototype.preRender = /**
            * Pre-render is called right before the Game Renderer starts and before any custom preRender callbacks have been run.
            * It is only called if visible is set to true.
            */
            function () {
            };
            Example.prototype.postRender = /**
            * Post-render is called after every camera and game object has been rendered, also after any custom postRender callbacks have been run.
            * It is only called if visible is set to true.
            */
            function () {
            };
            Example.prototype.destroy = /**
            * Clear down this Plugin and null out references
            */
            function () {
                this.game = null;
            };
            return Example;
        })();
        Plugins.Example = Example;        
    })(Phaser.Plugins || (Phaser.Plugins = {}));
    var Plugins = Phaser.Plugins;
})(Phaser || (Phaser = {}));
