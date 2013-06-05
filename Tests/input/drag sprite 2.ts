/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('sprite', 'assets/sprites/atari800.png');
        game.load.start();

    }

    var sprite: Phaser.Sprite;

    function create() {

        sprite = game.add.sprite(200, 200, 'sprite');

        sprite.input.start(0, false, true);

        sprite.input.enableDrag(true);

        //  The drag offset allows us to position the sprite relative to the pointer (+ lock) position
        //  In this case it will be positioned -100px above the pointer
        sprite.input.dragOffset.y = -100;

    }

    function render() {

        game.input.renderDebugInfo(32, 32);
        sprite.input.renderDebugInfo(300, 32);

    }

})();
