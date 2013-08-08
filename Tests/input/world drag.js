/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);
    function preload() {
        game.world.setSize(1920, 1200, true);
        game.load.image('backdrop', 'assets/pics/remember-me.jpg');
        game.load.image('diamond', 'assets/sprites/diamond.png');
    }
    var test;
    function create() {
        game.add.sprite(0, 0, 'backdrop');
        for(var i = 0; i < 50; i++) {
            var sprite = game.add.sprite(game.world.randomX, game.world.randomY, 'diamond');
            sprite.input.start(i, false, true);
            if(i < 25) {
                sprite.input.enableDrag(false);
            } else {
                sprite.input.enableDrag(true);
                sprite.alpha = 0.5;
            }
        }
    }
    function update() {
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            game.camera.x -= 4;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            game.camera.x += 4;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            game.camera.y -= 4;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            game.camera.y += 4;
        }
    }
    function render() {
        Phaser.DebugUtils.renderCameraInfo(game.camera, 16, 32);
        Phaser.DebugUtils.renderInputInfo(16, 200);
    }
})();
