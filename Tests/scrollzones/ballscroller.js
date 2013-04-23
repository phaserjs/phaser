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
        //  The source image (balls.png) is only 102x17 in size, but we want it to create a scroll the size of the whole game window.
        //  We can take advantage of the way a ScrollZone can create a seamless pattern for us automatically.
        //  If you create a ScrollRegion larger than the source texture, it'll create a DynamicTexture and perform a pattern fill on it and use that
        //  for rendering.
        //  We've rounded the height up to 612 because in order to have a seamless pattern it needs to be a multiple of 17 (the height of the source image)
        scroller = myGame.createScrollZone('balls', 0, 0, 800, 612);
        //  Some sin/cos data for the movement
        myGame.math.sinCosGenerator(256, 4, 4, 2);
    }
    function update() {
        //	Cycle through the wave data and apply it to the scroll speed (causes the circular wave motion)
        scroller.currentRegion.scrollSpeed.x = myGame.math.shiftSinTable();
        scroller.currentRegion.scrollSpeed.y = myGame.math.shiftCosTable();
    }
})();
