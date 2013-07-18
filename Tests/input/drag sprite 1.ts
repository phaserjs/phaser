/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('sprite', 'assets/sprites/atari130xe.png');
        game.load.start();

    }

    var sprite: Phaser.Sprite;

    function create() {

        sprite = game.add.sprite(200, 200, 'sprite');

        //  Enable Input detection. Sprites have this disabled by default, 
        //  so you have to start it if you want to interact with them.
        sprite.input.start(0, false, true);

        //  This allows you to drag the sprite. The parameter controls if you drag from the position you touched it (false)
        //  or if it will snap to the center (true)
        sprite.input.enableDrag(true);

    }

    function render() {

        game.input.renderDebugInfo(32, 32);
        //game.input.mousePointer.renderDebug(32, 32);
        sprite.input.renderDebugInfo(300, 32);

    }

})();
