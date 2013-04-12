/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/Sprite.ts" />
(function () {
    var myGame = new Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addImageFile('car', 'assets/sprites/asteroids_ship.png');
        myGame.loader.load();
    }
    var car;
    function create() {
        car = myGame.createSprite(200, 300, 'car');
    }
    function update() {
        car.renderDebugInfo(16, 16);
        car.velocity.x = 0;
        car.velocity.y = 0;
        car.angularVelocity = 0;
        car.angularAcceleration = 0;
        if(myGame.input.keyboard.isDown(Keyboard.LEFT)) {
            car.angularVelocity = -200;
        } else if(myGame.input.keyboard.isDown(Keyboard.RIGHT)) {
            car.angularVelocity = 200;
        }
        if(myGame.input.keyboard.isDown(Keyboard.UP)) {
            var motion = myGame.math.velocityFromAngle(car.angle, 200);
            //  instant
            car.velocity.copyFrom(motion);
            //  acceleration
            //car.acceleration.copyFrom(motion);
                    } else if(myGame.input.keyboard.isDown(Keyboard.DOWN)) {
            //car.velocity.y = 200;
                    }
    }
})();
