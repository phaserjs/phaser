/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        game.load.image('grid', 'assets/tests/debug-grid-1920x1920.png');
        game.load.image('car', 'assets/sprites/car90.png');
        game.load.start();
    }
    var car;
    var miniCam;
    function create() {
        game.world.setSize(2240, 2240, true);
        game.add.sprite(0, 0, 'grid');
        car = game.add.sprite(400, 300, 'car');
        game.camera.follow(car, Phaser.Types.CAMERA_FOLLOW_TOPDOWN);
        miniCam = game.add.camera(0, 0, 300, 300);
        miniCam.follow(car, Phaser.Types.CAMERA_FOLLOW_TOPDOWN_TIGHT);
        miniCam.setBounds(0, 0, game.world.width, game.world.height);
        miniCam.texture.alpha = 0.7;
    }
    function update() {
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            car.x -= 4;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            car.x += 4;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            car.y -= 4;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            car.y += 4;
        }
        /*
        car.velocity.x = 0;
        car.velocity.y = 0;
        car.angularVelocity = 0;
        car.angularAcceleration = 0;
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
        car.angularVelocity = -200;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
        car.angularVelocity = 200;
        }
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
        var motion:Phaser.Point = game.motion.velocityFromAngle(car.angle, 300);
        
        car.velocity.copyFrom(motion);
        }
        */
            }
    function render() {
        Phaser.DebugUtils.renderSpriteInfo(car, 32, 32);
        Phaser.DebugUtils.renderCameraInfo(game.camera, 32, 300);
    }
})();
