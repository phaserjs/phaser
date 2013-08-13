/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);
    function preload() {
        game.world.setSize(1600, 800, true);
        game.load.image('disk', 'assets/pics/devilstar_demo_download_disk.png');
    }
    function create() {
        for(var i = 0; i < 10; i++) {
            var temp = game.add.sprite(600 + (10 * i), 200 + (10 * i), 'disk');
            temp.transform.scrollFactor.setTo(i / 2, i / 2);
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
        Phaser.DebugUtils.renderCameraInfo(game.camera, 32, 32);
    }
})();
