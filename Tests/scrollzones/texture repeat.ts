/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addImageFile('balls', 'assets/misc/starfield.jpg');

        myGame.loader.load();

    }

    var scroller: Phaser.ScrollZone;
    var ship: Phaser.Sprite;

    function create() {

        //  This creates a ScrollZone the size of the game window
        //  The texture will repeat automatically
        scroller = myGame.createScrollZone('balls', 0, 0, 800, 600);


    }

    function update() {

		//	Cycle through the wave data and apply it to the scroll speed (causes the circular wave motion)
        scroller.scrollSpeed.x = myGame.math.shiftSinTable();
        scroller.scrollSpeed.y = myGame.math.shiftCosTable();

    }

})();
