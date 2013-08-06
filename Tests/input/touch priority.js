/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);
    function init() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('atari1', 'assets/sprites/atari130xe.png');
        game.load.image('atari2', 'assets/sprites/atari800xl.png');
        game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
        game.load.start();
    }
    var atari1;
    var atari2;
    var sonic;
    function create() {
        atari1 = game.add.sprite(100, 100, 'atari1');
        atari2 = game.add.sprite(300, 200, 'atari2');
        sonic = game.add.sprite(400, 300, 'sonic');
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
