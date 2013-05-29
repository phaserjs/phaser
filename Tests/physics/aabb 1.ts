/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.loader.addImageFile('atari', 'assets/sprites/atari800xl.png');
        game.loader.load();

    }

    var atari: Phaser.Sprite;

    function create() {

        atari = game.add.sprite(200, 200, 'atari');

    }

    function update() {
    }

})();
