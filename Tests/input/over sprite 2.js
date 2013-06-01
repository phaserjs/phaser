/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);
    function init() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.loader.addImageFile('sprite', 'assets/sprites/shinyball.png');
        game.loader.load();
    }
    var sprite;
    function create() {
        //  Create a load of sprites
        for(var i = 0; i < 26; i++) {
            var tempSprite = game.add.sprite(i * 32, 100, 'sprite', Phaser.Types.BODY_DYNAMIC);
            tempSprite.input.enabled = true;
            tempSprite.events.onInputOver.add(dropSprite, this);
        }
    }
    function dropSprite(sprite) {
        sprite.body.velocity.y = 300;
        sprite.input.enabled = false;
    }
    function render() {
        game.input.renderDebugInfo(32, 32);
    }
})();
