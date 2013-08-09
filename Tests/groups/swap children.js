/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create);

    function preload() {
        game.load.image('atari1', 'assets/sprites/atari130xe.png');
        game.load.image('atari2', 'assets/sprites/atari800xl.png');
    }

    var atari1;
    var atari2;

    function create() {
        //  Items are rendered in the depth order in which they are added to the Group
        atari1 = game.add.sprite(100, 100, 'atari1');
        atari2 = game.add.sprite(250, 90, 'atari2');

        game.input.onTap.add(swapSprites, this);
    }

    function swapSprites() {
        //  The 2 Sprites are in the global world Group, but this will work for any Group:
        game.world.group.swap(atari1, atari2);
    }
})();
