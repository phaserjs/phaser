/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    var radar;
    var ships = [];

    var button;

    function init() {
        game.world.setSize(800, 600, true);
        game.load.image('radar-surface', 'assets/tests/radar-surface.png');
        game.load.image('ship', 'assets/sprites/asteroids_ship_white.png');
        game.load.image('enemy-ship', 'assets/sprites/asteroids_ship.png');

        game.load.image('button', 'assets/tests/320x200.png');

        game.load.start();
    }
    function create() {
        for (var i = 0; i < 4; i++) {
            ships.push(game.add.sprite(100 + i * 10, 300 + i * 16, 'ship'));
        }
        ships.push(game.add.sprite(160, 320, 'enemy-ship'));
        radar = game.add.sprite(0, 0, 'radar-surface');

        game.camera.setSize(400, 600);
        var camera2 = game.add.camera(0, 0, 400, 600);
        camera2.x = 400;

        button = game.add.sprite(500, 100, 'button');
        button.input.start(0, false, true);
    }
    function update() {
        if (button.input.justReleased(0, 20)) {
        }

        for (var i = 0; i < ships.length; i++) {
            ships[i].x += 1;
            if (ships[i].x > 400) {
                ships[i].x = 40;
            }
        }
    }
    function render() {
    }
})();
