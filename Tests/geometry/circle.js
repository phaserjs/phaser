/// <reference path="../../Phaser/Phaser.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, null, create, update);
    var circle;
    var floor;
    function create() {
        circle = myGame.createGeomSprite(200, 0);
        circle.createCircle(64);
        circle.acceleration.y = 100;
        circle.elasticity = 0.8;
        //  A simple floor
        floor = myGame.createGeomSprite(0, 550);
        floor.createRectangle(800, 50);
        floor.immovable = true;
    }
    function update() {
        myGame.collide(circle, floor);
    }
})();
