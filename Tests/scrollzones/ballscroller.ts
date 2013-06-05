/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        game.load.image('balls', 'assets/sprites/balls.png');

        game.load.start();

    }

    var scroller: Phaser.ScrollZone;

    function create() {

        //  The source image (balls.png) is only 102x17 in size, but we want it to create a scroll the size of the whole game window.
        //  We can take advantage of the way a ScrollZone can create a seamless pattern for us automatically.
        //  If you create a ScrollRegion larger than the source texture, it'll create a DynamicTexture and perform a pattern fill on it and use that
        //  for rendering.

        //  We've rounded the height up to 612 because in order to have a seamless pattern it needs to be a multiple of 17 (the height of the source image)
        scroller = game.add.scrollZone('balls', 0, 0, 800, 612);

        //  Some sin/cos data for the movement
		game.math.sinCosGenerator(256, 4, 4, 2);

    }

    function update() {

		//	Cycle through the wave data and apply it to the scroll speed (causes the circular wave motion)
        scroller.currentRegion.scrollSpeed.x = game.math.shiftSinTable();
        scroller.currentRegion.scrollSpeed.y = game.math.shiftCosTable();

    }

})();
