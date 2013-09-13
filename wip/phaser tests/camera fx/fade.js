/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../build/phaser-fx.d.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addImageFile('background', 'assets/pics/large-color-wheel.png');
        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');
        myGame.loader.load();
    }
    var car;
    var fade;
    function create() {
        myGame.add.sprite(0, 0, 'background');
        car = myGame.add.sprite(400, 300, 'car');
        //  Add our effect to the camera
        fade = myGame.camera.fx.add(Phaser.FX.Camera.Fade);
    }
    function update() {
        car.velocity.x = 0;
        car.velocity.y = 0;
        car.angularVelocity = 0;
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            car.angularVelocity = -200;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            car.angularVelocity = 200;
        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            car.velocity.copyFrom(myGame.motion.velocityFromAngle(car.angle, 300));
        }
        //  Fade when the car hits the edges, a different colour per edge
        if(car.x < 0) {
            fade.start(0x330066, 3);
            car.x = 0;
        } else if(car.x > myGame.world.width) {
            fade.start(0x000066, 3);
            car.x = myGame.world.width - car.width;
        }
        if(car.y < 0) {
            fade.start(0xffffff, 4);
            car.y = 0;
        } else if(car.y > myGame.world.height) {
            fade.start(0x000000, 3);
            car.y = myGame.world.height - car.height;
        }
    }
})();
