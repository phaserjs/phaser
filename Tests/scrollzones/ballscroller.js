/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addImageFile('balls', 'assets/sprites/balls.png');
        myGame.loader.load();
    }
    var scroller;
    function create() {
        //  This creates a ScrollZone the size of the game window
        //  However the source image (balls.png) is only 102x17 so it will automatically create a fill pattern
        scroller = myGame.createScrollZone('balls', 0, 0, 800, 600);
        //  Some sin/cos data for the movement
        myGame.math.sinCosGenerator(256, 4, 4, 2);
    }
    function update() {
        //	Cycle through the wave data and apply it to the scroll speed (causes the circular wave motion)
        scroller.scrollSpeed.x = myGame.math.shiftSinTable();
        scroller.scrollSpeed.y = myGame.math.shiftCosTable();
    }
})();
