/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    function init() {

        game.load.image('atari1', 'assets/sprites/atari130xe.png');
        game.load.image('atari2', 'assets/sprites/atari800xl.png');
        game.load.image('atari4', 'assets/sprites/atari800.png');
        game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
        game.load.image('duck', 'assets/sprites/darkwing_crazy.png');
        game.load.image('firstaid', 'assets/sprites/firstaid.png');
        game.load.image('diamond', 'assets/sprites/diamond.png');
        game.load.image('mushroom', 'assets/sprites/mushroom2.png');
        game.load.start();

    }

    function create() {

        //  This returns an array of all the image keys in the cache
        var images = game.cache.getImageKeys()

        //  Now let's create some random sprites and enable them all for drag and 'bring to top'
        for (var i = 0; i < 20; i++)
        {
            var tempSprite: Phaser.Sprite = game.add.sprite(game.stage.randomX, game.stage.randomY, game.rnd.pick(images));
            tempSprite.input.start(i, false, true);
            tempSprite.input.enableDrag(false, true);
        }

    }

    function render() {
        game.input.renderDebugInfo(32, 32);
    }

})();
