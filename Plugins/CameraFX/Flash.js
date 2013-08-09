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
        * Phaser - Plugins - Camera FX - Flash
        *
        * The camera is filled with the given color and returns to normal at the given duration.
        */
        (function (CameraFX) {
            var Flash = (function (_super) {
                __extends(Flash, _super);
                function Flash(game, parent) {
                    _super.call(this, game, parent);
                    this._fxFlashComplete = null;
                    this._fxFlashDuration = 0;
                    this._fxFlashAlpha = 0;
                    this.camera = parent;
                }
                /**
                * The camera is filled with this color and returns to normal at the given duration.
                *
                * @param	Color		The color you want to use in 0xRRGGBB format, i.e. 0xffffff for white.
                * @param	Duration	How long it takes for the flash to fade.
                * @param	OnComplete	An optional function you want to run when the flash finishes. Set to null for no callback.
                * @param	Force		Force an already running flash effect to reset.
                */
                Flash.prototype.start = function (color, duration, onComplete, force) {
                    if (typeof color === "undefined") { color = 0xffffff; }
                    if (typeof duration === "undefined") { duration = 1; }
                    if (typeof onComplete === "undefined") { onComplete = null; }
                    if (typeof force === "undefined") { force = false; }
                    if (force === false && this._fxFlashAlpha > 0) {
                        //  You can't flash again unless you force it
                        return;
                    }

                    if (duration <= 0) {
                        duration = 1;
                    }

                    var red = color >> 16 & 0xFF;
                    var green = color >> 8 & 0xFF;
                    var blue = color & 0xFF;

                    this._fxFlashColor = 'rgba(' + red + ',' + green + ',' + blue + ',';
                    this._fxFlashDuration = duration;
                    this._fxFlashAlpha = 1;
                    this._fxFlashComplete = onComplete;
                };

                Flash.prototype.postUpdate = function () {
                    if (this._fxFlashAlpha > 0) {
                        this._fxFlashAlpha -= this.game.time.elapsed / this._fxFlashDuration;

                        if (this.game.math.roundTo(this._fxFlashAlpha, -2) <= 0) {
                            this._fxFlashAlpha = 0;

                            if (this._fxFlashComplete !== null) {
                                this._fxFlashComplete();
                            }
                        }
                    }
                };

                Flash.prototype.postRender = function () {
                    if (this._fxFlashAlpha > 0) {
                        this.game.stage.context.fillStyle = this._fxFlashColor + this._fxFlashAlpha + ')';
                        this.game.stage.context.fillRect(this.camera.screenView.x, this.camera.screenView.y, this.camera.width, this.camera.height);
                    }
                };
                return Flash;
            })(Phaser.Plugin);
            CameraFX.Flash = Flash;
        })(Plugins.CameraFX || (Plugins.CameraFX = {}));
        var CameraFX = Plugins.CameraFX;
    })(Phaser.Plugins || (Phaser.Plugins = {}));
    var Plugins = Phaser.Plugins;
})(Phaser || (Phaser = {}));
