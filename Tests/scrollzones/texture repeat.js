/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addImageFile('starfield', 'assets/misc/starfield.jpg');
        myGame.loader.load();
    }
    var scroller;
    var ship;
    function create() {
        //  512 x 512
        scroller = myGame.createScrollZone('starfield', 0, 0, 1024, 512);
        //  Some sin/cos data for the movement
        myGame.math.sinCosGenerator(256, 4, 4, 2);
    }
    function update() {
        scroller.currentRegion.scrollSpeed.x = myGame.math.shiftSinTable();
        scroller.currentRegion.scrollSpeed.y = myGame.math.shiftCosTable();
    }
})();
