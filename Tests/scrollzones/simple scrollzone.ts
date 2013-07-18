/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        game.load.image('crystal', 'assets/pics/jim_sachs_time_crystal.png');
        game.load.start();

    }

    function create() {

        //  This creates our ScrollZone. It is positioned at x0 y0 (world coodinates) by default and uses
        //  the 'crystal' image from the cache.

        //  The default is for the scroll zone to create 1 new scrolling region the size of the whole image you gave it.
        //  For this example we'll keep that, but look at the other tests to see reasons why you may not want to.

        game.add.scrollZone('crystal').setSpeed(4, 2);

    }

})();
