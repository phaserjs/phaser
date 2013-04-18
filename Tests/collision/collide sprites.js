/// <reference path="../../Phaser/Phaser.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');
        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');
        myGame.loader.load();
    }
    var car;
    var melon;
    function create() {
        car = myGame.createSprite(100, 300, 'car');
        melon = myGame.createSprite(200, 310, 'melon');
        car.name = 'car';
        melon.name = 'melon';
    }
    function update() {
        car.renderDebugInfo(16, 16);
        car.velocity.x = 0;
        car.velocity.y = 0;
        car.angularVelocity = 0;
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            car.angularVelocity = -200;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            car.angularVelocity = 200;
        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            car.velocity.copyFrom(myGame.motion.velocityFromAngle(car.angle, 200));
        }
        myGame.collide(car, melon, collides);
    }
    function collides(a, b) {
        console.log('Collision!!!!!');
    }
})();
