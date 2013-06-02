/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.loader.addImageFile('sprite', 'assets/sprites/atari130xe.png');
        game.loader.load();

    }

    var sprite: Phaser.Sprite;

    function create() {

        sprite = game.add.sprite(200, 200, 'sprite');

        //  Enable Input detection
        sprite.input.start(0, false, true);

        sprite.input.enableDrag(true);

        //sprite.input.allowVerticalDrag = false;
        //sprite.input.dragOffset.setTo(0, 50);

    }

    function render() {

        game.input.renderDebugInfo(32, 32);
        sprite.input.renderDebugInfo(300, 32);

    }

})();
