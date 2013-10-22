
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('grid', 'assets/tests/debug-grid-1920x1920.png');
    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('atari2', 'assets/sprites/atari800xl.png');

}

function create() {

    game.add.sprite(0, 0, 'grid');

    atari1 = game.add.sprite(128, 128, 'atari1');
    atari2 = game.add.sprite(256, 256, 'atari2');

    //  Input Enable the sprites
    atari1.inputEnabled = true;
    atari2.inputEnabled = true;

    //  Allow dragging
    //  enableDrag parameters = (lockCenter, bringToTop, pixelPerfect, alphaThreshold, boundsRect, boundsSprite)
    atari1.input.enableDrag();
    atari2.input.enableDrag();

    //  Enable snapping. For the atari1 sprite it will snap as its dragged around and on release.
    //  The snap is set to every 32x32 pixels.
    atari1.input.enableSnap(32, 32, true, true);

    //  For the atari2 sprite it will snap only when released, not on drag.
    atari2.input.enableSnap(32, 32, false, true);

}
