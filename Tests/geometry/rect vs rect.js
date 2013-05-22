/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, null, create, update);
    var box1;
    var box2;
    function create() {
        box2 = myGame.add.geomSprite(300, 300).createRectangle(128, 128);
        box1 = myGame.add.geomSprite(320, 100).createRectangle(64, 64);
        box1.velocity.y = 50;
    }
    function update() {
        if(box1.collide(box2) == true) {
            box1.fillColor = 'rgb(255,0,0)';
        } else {
            box1.fillColor = 'rgb(0,255,0)';
        }
    }
    function checkPoints() {
        if(box2.rect.containsPoint(box1.rect.topLeft)) {
        }
    }
})();
