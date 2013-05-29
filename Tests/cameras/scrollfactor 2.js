/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        game.world.setSize(1600, 800, true);
        game.loader.addImageFile('disk', 'assets/pics/devilstar_demo_download_disk.png');
        game.loader.load();
    }
    function create() {
        for(var i = 0; i < 10; i++) {
            var temp = game.add.sprite(600 + (10 * i), 200 + (10 * i), 'disk');
            temp.scrollFactor.setTo(i / 2, i / 2);
        }
    }
    function update() {
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            game.camera.scroll.x -= 4;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            game.camera.scroll.x += 4;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            game.camera.scroll.y -= 4;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            game.camera.scroll.y += 4;
        }
    }
    function render() {
        game.camera.renderDebugInfo(32, 32);
    }
})();
