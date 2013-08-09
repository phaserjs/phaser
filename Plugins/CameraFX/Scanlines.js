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
        * Phaser - Plugins - Camera FX - Scanlines
        *
        * Give your game that classic retro feel!
        */
        (function (CameraFX) {
            var Scanlines = (function (_super) {
                __extends(Scanlines, _super);
                function Scanlines(game, parent) {
                    _super.call(this, game, parent);
                    this.spacing = 4;
                    this.color = 'rgba(0, 0, 0, 0.3)';
                    this.camera = parent;
                }
                Scanlines.prototype.postRender = function () {
                    this.game.stage.context.fillStyle = this.color;

                    for (var y = this.camera.screenView.y; y < this.camera.screenView.height; y += this.spacing) {
                        this.game.stage.context.fillRect(this.camera.screenView.x, y, this.camera.screenView.width, 1);
                    }
                };
                return Scanlines;
            })(Phaser.Plugin);
            CameraFX.Scanlines = Scanlines;
        })(Plugins.CameraFX || (Plugins.CameraFX = {}));
        var CameraFX = Plugins.CameraFX;
    })(Phaser.Plugins || (Phaser.Plugins = {}));
    var Plugins = Phaser.Plugins;
})(Phaser || (Phaser = {}));
