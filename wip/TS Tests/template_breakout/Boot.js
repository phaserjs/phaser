var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="phaser.d.ts" />
var BasicGame;
(function (BasicGame) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image("preloaderBackground", "assets/preloader_background.gif");
            this.load.image("preloaderBar", "assets/preloadr_bar.png");
        };
        Boot.prototype.create = function () {
            this.game.input.maxPointers = 1;
            this.game.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
                this.game.stage.scale.pageAlignHorizontally = true;
            } else {
                this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
                this.game.stage.scale.minWidth = 480;
                this.game.stage.scale.minHeight = 260;
                this.game.stage.scale.maxWidth = 1024;
                this.game.stage.scale.maxHeight = 768;
                this.game.stage.scale.forceLandscape = true;
                this.game.stage.scale.pageAlignHorizontally = true;
                this.game.stage.scale.setScreenSize(true);
            }

            this.game.state.start("Preloader");
        };
        return Boot;
    })(Phaser.State);
    BasicGame.Boot = Boot;
})(BasicGame || (BasicGame = {}));
