var __extends = this.__extends || function (d, b) {
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
        * Phaser - Plugins - Camera FX - Border
        *
        * Creates a border around a camera.
        */
        (function (CameraFX) {
            var Border = (function (_super) {
                __extends(Border, _super);
                function Border(game, parent) {
                                _super.call(this, game, parent);
                    /**
                    * Whether render border of this camera or not. (default is true)
                    * @type {bool}
                    */
                    this.showBorder = true;
                    /**
                    * Color of border of this camera. (in css color string)
                    * @type {string}
                    */
                    this.borderColor = 'rgb(255,255,255)';
                    this.camera = parent;
                }
                Border.prototype.postRender = function () {
                    if(this.showBorder == true) {
                        this.game.stage.context.strokeStyle = this.borderColor;
                        this.game.stage.context.lineWidth = 1;
                        this.game.stage.context.rect(this.camera.x, this.camera.y, this.camera.width, this.camera.height);
                        this.game.stage.context.stroke();
                    }
                };
                return Border;
            })(Phaser.Plugin);
            CameraFX.Border = Border;            
        })(Plugins.CameraFX || (Plugins.CameraFX = {}));
        var CameraFX = Plugins.CameraFX;
    })(Phaser.Plugins || (Phaser.Plugins = {}));
    var Plugins = Phaser.Plugins;
})(Phaser || (Phaser = {}));
