/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, null, render);

    function preload() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('atari1', 'assets/sprites/atari130xe.png');
        game.load.image('atari2', 'assets/sprites/atari800xl.png');
        game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
        

    }

    var atari1: Phaser.Sprite;
    var atari2: Phaser.Sprite;
    var sonic: Phaser.Sprite;

    function create() {

        atari1 = game.add.sprite(200, 200, 'atari1');
        atari2 = game.add.sprite(500, 400, 'atari2');
        sonic = game.add.sprite(400, 500, 'sonic');

        atari1.origin.setTo(0.5, 0.5);
        atari1.rotation = 35;

        atari2.origin.setTo(1, 1);
        atari2.rotation = 80;

        sonic.rotation = 140;

        atari1.input.start(0, false, true);
        atari2.input.start(1, false, true);
        sonic.input.start(2, false, true);

        atari1.input.enableDrag();
        atari2.input.enableDrag();
        sonic.input.enableDrag();

    }

    function render() {
        Phaser.DebugUtils.renderInputInfo(32, 32);
    }

})();
