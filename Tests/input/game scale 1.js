/// <reference path="../../Phaser/Game.ts" />
(function () {
    //  Here we create a tiny game (320x240 in size)
    var game = new Phaser.Game(this, 'game', 320, 240, preload, create, update, render);
    function preload() {
        //  This sets a limit on the up-scale
        game.stage.scale.maxWidth = 800;
        game.stage.scale.maxHeight = 600;
        //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
        game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
        game.load.image('melon', 'assets/sprites/melon.png');
    }
    function create() {
        game.world.setSize(2000, 2000);
        for(var i = 0; i < 1000; i++) {
            game.add.sprite(game.world.randomX, game.world.randomY, 'melon');
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
        Phaser.DebugUtils.renderInputInfo(16, 16);
    }
})();
