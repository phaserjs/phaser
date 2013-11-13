/// <reference path="phaser.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BasicGame;
(function (BasicGame) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            this.music = this.add.audio("titleMusic", 1, false);
            this.music.play("titleMusic", 0);

            this.add.sprite(0, 0, "titlepage");

            this.playButton = this.add.button(200, 300, "playButton", this.startGame, 1, 1, 1);
        };

        MainMenu.prototype.startGame = function () {
            this.music.stop();
            alert("START THE GAME!");
        };
        return MainMenu;
    })(Phaser.State);
    BasicGame.MainMenu = MainMenu;
})(BasicGame || (BasicGame = {}));
