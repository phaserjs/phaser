/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);
    var zombieCamera;
    var zombie;
    var walkSpeed = 2, direction = 1;
    function preload() {
        game.world.setSize(1280, 600, true);
        game.load.image('ground', 'assets/tests/ground-2x.png');
        game.load.image('river', 'assets/tests/river-2x.png');
        game.load.image('sky', 'assets/tests/sky-2x.png');
        game.load.spritesheet('zombie', 'assets/sprites/metalslug_monster39x40.png', 39, 40);
    }
    function create() {
        // Add background images.
        game.add.sprite(0, 0, 'sky');
        game.add.sprite(0, 360, 'ground');
        game.add.sprite(0, 400, 'river');
        // Create zombie spirte
        zombie = game.add.sprite(480, 336, 'zombie');
        zombie.animations.add('walk', null, 30, true);
        zombie.animations.play('walk');
        // Create a small camera which looks at the zombie.
        // Use the same settings as the default camera.
        zombieCamera = game.add.camera(0, 0, 800, 600);
        // Use x and y properties to set the target area.
        zombieCamera.x = 420;
        zombieCamera.y = 240;
        // Resize the camera so that it will only look at 200x200 area.
        zombieCamera.setSize(200, 200);
        // Scale the camera to 2.0, now its target will be 100x100.
        zombieCamera.transform.scale.setTo(2.0, 2.0);
        // Use setPosition() method to set where the camera rendered
        // on the screen.
        zombieCamera.setPosition(0, 0);
    }
    function update() {
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            zombieCamera.x -= 2;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            zombieCamera.x += 2;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            zombieCamera.y -= 2;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            zombieCamera.y += 2;
        }
        // zombie wandering update
        zombie.x += walkSpeed * direction;
        if(zombie.x > 540 || zombie.x < 440) {
            // Change walk direction.
            direction *= -1;
            // Flip zombie's animation.
            zombie.texture.flippedX = !zombie.texture.flippedX;
        }
    }
    function render() {
        Phaser.DebugUtils.renderCameraInfo(game.camera, 32, 32);
        Phaser.DebugUtils.renderCameraInfo(zombieCamera, 32, 128);
    }
})();
