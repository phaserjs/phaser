/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, null, render);

    function preload() {
        game.load.image('atari1', 'assets/sprites/atari130xe.png');
        game.load.image('atari2', 'assets/sprites/atari800xl.png');
        game.load.image('atari4', 'assets/sprites/atari800.png');
        game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
        game.load.image('duck', 'assets/sprites/darkwing_crazy.png');
        game.load.image('firstaid', 'assets/sprites/firstaid.png');
        game.load.image('diamond', 'assets/sprites/diamond.png');
        game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    }

    function create() {
        //  This returns an array of all the image keys in the cache
        var images = game.cache.getImageKeys();

        for (var i = 0; i < 20; i++) {
            var tempSprite = game.add.sprite(game.stage.randomX, game.stage.randomY, game.rnd.pick(images));
            tempSprite.input.start(i, false, true);
            tempSprite.input.enableDrag(false, true);
        }
    }

    function render() {
        Phaser.DebugUtils.renderInputInfo(32, 32);
    }
})();
