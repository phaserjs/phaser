/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, preload, create);

    function preload() {

        game.load.image('angelDawn', 'assets/pics/game14_angel_dawn.png');

        

    }

    var scroller: Phaser.ScrollZone;

    function create() {

        //  This creates our ScrollZone centered in the middle of the stage.
        scroller = game.add.scrollZone('angelDawn', game.stage.centerX - 320, 100);

        //  By default we won't scroll the full image, but we will create 3 ScrollRegions within it:

        //  This creates a ScrollRegion which can be thought of as a rectangle within the ScrollZone that can be scrolled
        //  independantly - this one scrolls the image of the spacemans head
        scroller.addRegion(32, 32, 352, 240, 0, 2);

        //  The head in the top right
        scroller.addRegion(480, 30, 96, 96, 4, 0);

        //  The small piece of text
        scroller.addRegion(466, 160, 122, 14, 0, -0.5);

    }

})();
