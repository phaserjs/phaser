/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/core/Polygon.ts" />
/// <reference path="../../Phaser/utils/SpriteUtils.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.loader.addImageFile('atari', 'assets/sprites/atari800xl.png');
        game.loader.load();
    }
    var atari;
    var p;
    var atari2;
    var p2;
    function create() {
        atari = game.add.sprite(200, 300, 'atari');
        atari.texture.alpha = 0.2;
        atari2 = game.add.sprite(500, 300, 'atari');
        atari2.texture.alpha = 0.2;
        p = new Phaser.Polygon(game, Phaser.SpriteUtils.getAsPoints(atari));
        p2 = new Phaser.Polygon(game, Phaser.SpriteUtils.getAsPoints(atari2));
    }
    function update() {
        atari.physics.acceleration.x = 0;
        atari.physics.acceleration.y = 0;
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            atari.physics.acceleration.x = -150;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            atari.physics.acceleration.x = 150;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            atari.physics.acceleration.y = -150;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            atari.physics.acceleration.y = 150;
        }
    }
    function render() {
        atari.physics.renderDebugInfo(16, 16);
        p.render();
        p2.render();
    }
})();
