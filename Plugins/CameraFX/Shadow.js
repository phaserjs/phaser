var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Phaser;
(function (Phaser) {
    (function (Plugins) {
        /// <reference path="../../Phaser/Game.ts" />
        /// <reference path="../../Phaser/core/Plugin.ts" />
        /**
        * Phaser - Plugins - Camera FX - Shadow
        *
        * Creates a drop shadow effect on the camera window.
        */
        (function (CameraFX) {
            var Shadow = (function (_super) {
                __extends(Shadow, _super);
                function Shadow(game, parent) {
                    _super.call(this, game, parent);
                    /**
                    * Render camera shadow or not. (default is false)
                    * @type {boolean}
                    */
                    this.showShadow = false;
                    /**
                    * Color of shadow, in css color string.
                    * @type {string}
                    */
                    this.shadowColor = 'rgb(0,0,0)';
                    /**
                    * Blur factor of shadow.
                    * @type {number}
                    */
                    this.shadowBlur = 10;
                    /**
                    * Offset of the shadow from camera's position.
                    * @type {Point}
                    */
                    this.shadowOffset = new Phaser.Point(4, 4);
                    this.camera = parent;
                }
                /**
                * Pre-render is called at the start of the object render cycle, before any transforms have taken place.
                * It happens directly AFTER a canvas context.save has happened if added to a Camera.
                */
                Shadow.prototype.preRender = function () {
                    if (this.showShadow == true) {
                        this.game.stage.context.shadowColor = this.shadowColor;
                        this.game.stage.context.shadowBlur = this.shadowBlur;
                        this.game.stage.context.shadowOffsetX = this.shadowOffset.x;
                        this.game.stage.context.shadowOffsetY = this.shadowOffset.y;
                    }
                };

                /**
                * render is called during the objects render cycle, right after all transforms have finished, but before any children/image data is rendered.
                */
                Shadow.prototype.render = function () {
                    if (this.showShadow == true) {
                        this.game.stage.context.shadowBlur = 0;
                        this.game.stage.context.shadowOffsetX = 0;
                        this.game.stage.context.shadowOffsetY = 0;
                    }
                };
                return Shadow;
            })(Phaser.Plugin);
            CameraFX.Shadow = Shadow;
        })(Plugins.CameraFX || (Plugins.CameraFX = {}));
        var CameraFX = Plugins.CameraFX;
    })(Phaser.Plugins || (Phaser.Plugins = {}));
    var Plugins = Phaser.Plugins;
})(Phaser || (Phaser = {}));
