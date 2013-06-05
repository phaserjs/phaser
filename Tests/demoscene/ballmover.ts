/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />

(function () {

    var game = new Phaser.Game(this, 'demo1', 320, 200, init, create, update);

    function init() {

        game.load.image('balls', '../assets/sprites/balls.png');
        game.load.start();

    }

    var scroller: Phaser.ScrollZone;

    function create() {

        scroller = game.add.scrollZone('balls', 0, 0, 800, 612);
		game.math.sinCosGenerator(256, 4, 4, 2);

    }

    function update() {

        scroller.currentRegion.scrollSpeed.x = game.math.shiftSinTable();
        scroller.currentRegion.scrollSpeed.y = game.math.shiftCosTable();

    }

})();
