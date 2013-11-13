var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="phaser.d.ts" />
var BasicGame;
(function (BasicGame) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
            this.background = null;
            this.preloadBar = null;
            this.ready = false;
        }
        Preloader.prototype.preload = function () {
            this.background = this.add.sprite(0.0, 0.0, "preloaderBackground");
            this.preloadBar = this.add.sprite(300, 400, "preloaderBar");

            this.load.setPreloadSprite(this.preloadBar, 0);

            this.load.image("titlepage", "assets/title.jpg", false);
            this.load.image("playButton", "assets/play_button.png", false);
            this.load.audio("titleMusic", ["assets/main_menu.mp3", "assets/main_menu.ogg"], false);

            this.load.atlas("breakout", "assets/breakout.png", "assets/breakout.json");
            this.load.image("starfield", "assets/starfield.jpg", false);
        };

        Preloader.prototype.create = function () {
            this.preloadBar.cropEnabled = false;
        };

        Preloader.prototype.update = function () {
            if (this.cache.isSoundDecoded("titleMusic") && this.ready == false) {
                this.ready = true;
                this.game.state.start("MainMenu");
            }
        };
        return Preloader;
    })(Phaser.State);
    BasicGame.Preloader = Preloader;
})(BasicGame || (BasicGame = {}));
