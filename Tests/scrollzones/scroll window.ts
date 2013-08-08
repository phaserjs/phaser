/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, preload, create);

    function preload() {

        game.load.image('dragonsun', 'assets/pics/cougar_dragonsun.png');
        game.load.image('overlay', 'assets/pics/scrollframe.png');

        

    }

    var scroller: Phaser.ScrollZone;

    function create() {

        //  This creates our ScrollZone. It is positioned at x32 y32 (world coodinates)
        //  and is a size of 352x240 (which matches the window in our overlay image)
        scroller = game.add.scrollZone('dragonsun', 32, 32, 352, 240);

        scroller.setSpeed(2, 2);

        game.add.sprite(0, 0, 'overlay');

    }

})();
