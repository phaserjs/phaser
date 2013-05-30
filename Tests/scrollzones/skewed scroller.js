/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create);
    function init() {
        game.loader.addImageFile('balls', 'assets/sprites/balls.png');
        game.loader.load();
    }
    var leftFace;
    var rightFace;
    var topFace;
    function create() {
        topFace = game.add.scrollZone('balls', 200, 0, 204, 204).setSpeed(0, 2.2);
        topFace.skew.setTo(0, Math.tan(game.math.radiansToDegrees(-30)))// 0,-30 + scale(1,1.16)
        ;
        topFace.scale.setTo(1, 1.3);
        leftFace = game.add.scrollZone('balls', 110, 264, 204, 204).setSpeed(0, 2.1);
        leftFace.skew.setTo(0, Math.tan(game.math.radiansToDegrees(30)))// 0,30deg
        ;
        rightFace = game.add.scrollZone('balls', 200, 466, 204, 204).setSpeed(0, 2);
        rightFace.skew.setTo(0, Math.tan(game.math.radiansToDegrees(-30)))// 0,-30 + scale(1,1.16)
        ;
        rightFace.scale.setTo(1, 0.8);
        //var a = Math.tan(game.math.radiansToDegrees(-180))
        //game.add.tween(rightFace.skew).to({ x: 2, y: 4 }, 4000, Phaser.Easing.Linear.None, true, 0, true);
            }
})();
