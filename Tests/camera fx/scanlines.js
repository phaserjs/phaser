/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Plugins/CameraFX/Scanlines.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        game.load.image('backdrop', 'assets/pics/ninja-masters2.png');
        game.load.start();
    }
    var scanlines;
    function create() {
        game.world.setSize(1216, 896);
        //  Add our effect to the camera
        scanlines = game.camera.plugins.add(Phaser.Plugins.CameraFX.Scanlines);
        //  We'll have the scanlines spaced out every 2 pixels
        scanlines.spacing = 2;
        //  This is the color the lines will be drawn in
        scanlines.color = 'rgba(0, 0, 0, 0.8)';
        game.add.sprite(0, 0, 'backdrop');
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
})();
