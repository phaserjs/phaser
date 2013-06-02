/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create);
    function init() {
        game.loader.addImageFile('atari1', 'assets/sprites/atari130xe.png');
        game.loader.addImageFile('atari2', 'assets/sprites/atari800xl.png');
        game.loader.load();
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
