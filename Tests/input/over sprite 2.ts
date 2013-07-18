/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('sprite', 'assets/sprites/shinyball.png');
        game.load.start();

    }

    var sprite: Phaser.Sprite;

    function create() {

        //  Create a load of sprites
        for (var i = 0; i < 26; i++)
        {
            var tempSprite: Phaser.Sprite = game.add.sprite(i * 32, 100, 'sprite');
            tempSprite.input.start(0, false, true);
            tempSprite.events.onInputOver.add(dropSprite, this);
        }

    }

    function dropSprite(sprite: Phaser.Sprite) {

        sprite.body.velocity.y = 300;
        sprite.input.enabled = false;

    }

    function render() {

        game.input.renderDebugInfo(32, 32);

    }

})();
