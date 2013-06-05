/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 320, 200, init, create);

    function init() {

        game.load.image('crystal', '../assets/pics/jim_sachs_time_crystal.png');
        game.load.start();

    }

    function create() {

        game.add.scrollZone('crystal').setSpeed(4, 2);

    }

})();
