/// <reference path="../../Phaser/Phaser.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
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
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            car.angularVelocity = -200;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            car.angularVelocity = 200;
        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            var motion = myGame.motion.velocityFromAngle(car.angle, 200);
            //  instant
            car.velocity.copyFrom(motion);
            //  acceleration
            //car.acceleration.copyFrom(motion);
                    } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            //car.velocity.y = 200;
                    }
    }
})();
