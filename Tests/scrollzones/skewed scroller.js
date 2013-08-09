/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create);

    function preload() {
        game.load.image('balls', 'assets/sprites/balls.png');
    }

    var leftFace;
    var rightFace;
    var topFace;

    function create() {
        topFace = game.add.scrollZone('balls', 200, 0, 204, 204).setSpeed(0, 2.2);
        topFace.transform.skew.setTo(0, Math.tan(game.math.radiansToDegrees(-30)));
        topFace.transform.scale.setTo(1, 1.3);

        leftFace = game.add.scrollZone('balls', 110, 264, 204, 204).setSpeed(0, 2.1);
        leftFace.transform.skew.setTo(0, Math.tan(game.math.radiansToDegrees(30)));

        rightFace = game.add.scrollZone('balls', 200, 466, 204, 204).setSpeed(0, 2);
        rightFace.transform.skew.setTo(0, Math.tan(game.math.radiansToDegrees(-30)));
        rightFace.transform.scale.setTo(1, 0.8);
    }
})();
