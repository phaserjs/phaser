/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        game.world.setSize(1280, 600, true);
        game.load.image('ground', 'assets/tests/ground-2x.png');
        game.load.image('river', 'assets/tests/river-2x.png');
        game.load.image('sky', 'assets/tests/sky-2x.png');
        game.load.image('cloud0', 'assets/tests/cloud-big-2x.png');
        game.load.image('cloud1', 'assets/tests/cloud-narrow-2x.png');
        game.load.image('cloud2', 'assets/tests/cloud-small-2x.png');
        game.load.start();
    }
    function create() {
        // background sky, which does not move at all
        game.add.sprite(0, 0, 'sky')
            .transform.scrollFactor.setTo(0, 0);

        // clouds with different scroll factor which moves slower than camera
        game.add.sprite(200, 120, 'cloud0')
            .transform.scrollFactor.setTo(0.3, 0.3);
        game.add.sprite(-60, 120, 'cloud1')
            .transform.scrollFactor.setTo(0.5, 0.3);
        game.add.sprite(900, 170, 'cloud2')
            .transform.scrollFactor.setTo(0.7, 0.3);

        // forground objects which moves equal or faster than camera
        game.add.sprite(0, 360, 'ground')
            .transform.scrollFactor.setTo(0.5, 0.5);
        game.add.sprite(0, 400, 'river')
            .transform.scrollFactor.setTo(1.3, 1.3);
    }
    function update() {
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            game.camera.x -= 3;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            game.camera.x += 3;
        }
    }
    function render() {
        // game.camera.renderDebugInfo(32, 32);
    }
})();
