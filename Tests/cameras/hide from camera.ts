/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    var radar: Phaser.Sprite;
    var ships: Phaser.Sprite[] = [];

    var enemyCamera;

    function init() {
        game.world.setSize(800, 600, true);
        game.load.image('radar-surface', 'assets/tests/radar-surface.png');
        game.load.image('ship', 'assets/sprites/asteroids_ship_white.png');
        game.load.image('enemy-ship', 'assets/sprites/asteroids_ship.png');

        game.load.start();
    }
    function create() {
        // Add enemies and our ship the the world.
        for (var i = 0; i < 4; i++) {
            ships.push(game.add.sprite(100 + i * 10, 280 + i * 16, 'enemy-ship'));
        }
        var ourShip: Phaser.Sprite = game.add.sprite(160, 300, 'ship');
        ships.push(ourShip);

        // Radar sprite is a HUD.
        radar = game.add.sprite(0, 0, 'radar-surface');
        radar.transform.scrollFactor.setTo(0, 0);

        // Make the default camera rendered on the left half screen.
        game.camera.setSize(400, 600);
        // Add a new camera and render it on the right half screen.
        // The newly created is the enemies' camera, which cannot "see" our ship.
        enemyCamera = game.add.camera(0, 0, 800, 600);
        enemyCamera.setSize(400, 600);
        enemyCamera.setPosition(400, 0);

        // Hide our ship on the enemies' camera.
        enemyCamera.hide(ourShip);
    }
    function update() {
        for (var i = 0; i < ships.length; i++) {
            ships[i].x += 1;
            if (ships[i].x > 400) {
                ships[i].x = 40;
            }
        }
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Left is the player\'s camera, and right is the enemies\' camera.', 32, 100);
    }
})();
