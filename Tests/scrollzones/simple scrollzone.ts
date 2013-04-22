/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        myGame.loader.addImageFile('dragonsun', 'assets/pics/cougar_dragonsun.png');
        myGame.loader.addImageFile('overlay', 'assets/pics/scrollframe.png');

        myGame.loader.load();

    }

    var scroller: Phaser.ScrollZone;

    function create() {

        //  This creates our ScrollZone. It is positioned at x32 y32 (world coodinates)
        //  and is a size of 352x240 (which matches the window in our overlay image)
        scroller = myGame.createScrollZone('dragonsun', 32, 32, 352, 240);

        //  The speed of the scroll movement
        scroller.scrollSpeed.x = 4;
        scroller.scrollSpeed.y = 2;

        myGame.createSprite(0, 0, 'overlay');

    }

})();
