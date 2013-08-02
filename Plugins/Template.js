var Phaser;
(function (Phaser) {
    /// <reference path="../Phaser/Game.ts" />
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
            */
            function () {
            };
            Example.prototype.postUpdate = /**
            * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
            */
            function () {
            };
            Example.prototype.preRender = /**
            * Pre-render is called at the start of the object render cycle, before any transforms have taken place.
            * It happens directly AFTER a canvas context.save has happened if added to a Camera.
            * @param {Camera} camera
            */
            function (camera) {
            };
            Example.prototype.render = /**
            * render is called during the objects render cycle, right after all transforms have finished, but before any children/image data is rendered.
            * @param {Camera} camera
            */
            function (camera) {
            };
            Example.prototype.postRender = /**
            * Post-render is called during the objects render cycle, after the children/image data has been rendered.
            */
            function (camera) {
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
