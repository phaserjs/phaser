/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        game.load.image('balls', 'assets/sprites/balls.png');
        game.load.start();

    }

    var leftFace: Phaser.ScrollZone;
    var rightFace: Phaser.ScrollZone;
    var topFace: Phaser.ScrollZone;

    function create() {

        topFace = game.add.scrollZone('balls', 200, 0, 204, 204).setSpeed(0, 2.2);
        topFace.skew.setTo(0, Math.tan(game.math.radiansToDegrees(-30)));
        topFace.scale.setTo(1, 1.3);

        leftFace = game.add.scrollZone('balls', 110, 264, 204, 204).setSpeed(0, 2.1);
        leftFace.skew.setTo(0, Math.tan(game.math.radiansToDegrees(30)));

        rightFace = game.add.scrollZone('balls', 200, 466, 204, 204).setSpeed(0, 2);
        rightFace.skew.setTo(0, Math.tan(game.math.radiansToDegrees(-30)));
        rightFace.scale.setTo(1, 0.8);

    }

})();
