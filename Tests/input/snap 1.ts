/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('grid', 'assets/tests/debug-grid-1920x1920.png');
        game.load.image('atari1', 'assets/sprites/atari130xe.png');
        game.load.image('atari2', 'assets/sprites/atari800xl.png');
        game.load.start();

    }

    var atari1: Phaser.Sprite;
    var atari2: Phaser.Sprite;
    var sonic: Phaser.Sprite;

    function create() {

        game.add.sprite(0, 0, 'grid');

        atari1 = game.add.sprite(128, 128, 'atari1');
        atari2 = game.add.sprite(256, 256, 'atari2');

        //  Input Enable the sprites
        atari1.input.start(0, false, true);
        atari2.input.start(1, false, true);

        //  Allow dragging
        atari1.input.enableDrag();
        atari2.input.enableDrag();

        //  Enable snapping. For the atari1 sprite it will snap as its dragged around and on release.
        //  The snap is set to every 32x32 pixels.
        atari1.input.enableSnap(32, 32, true, true);

        //  For the atari2 sprite it will snap only when released, not on drag.
        atari2.input.enableSnap(32, 32, false, true);

    }

    function render() {
        game.input.renderDebugInfo(32, 32);
    }

})();
