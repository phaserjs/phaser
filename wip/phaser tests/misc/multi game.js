/// <reference path="../../Phaser/Game.ts" />
(function () {
    //  Let's test having 2 totally separate games embedded on the same page
    var myGame = new Phaser.Game(this, 'game', 400, 400, init, create, update);
    //  They can share the same parent div, they'll just butt-up next to each other
    var myGame2 = new Phaser.Game(this, 'game', 400, 400, init2, create2, update2);
    function init() {
        myGame.world.setSize(3000, 3000);
        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');
        myGame.loader.load();
    }
    function create() {
        myGame.camera.setBounds(0, 0, myGame.world.width, myGame.world.height);
        for(var i = 0; i < 1000; i++) {
            myGame.add.sprite(myGame.world.randomX, myGame.world.randomY, 'melon');
        }
    }
    function update() {
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            myGame.camera.scroll.x -= 4;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            myGame.camera.scroll.x += 4;
        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            myGame.camera.scroll.y += 4;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            myGame.camera.scroll.y -= 4;
        }
    }
    //  And now for game 2, we're basically just duplicating the functions from above, but that's fine for this test
    function init2() {
        myGame2.world.setSize(1920, 1920);
        myGame2.loader.addImageFile('grid', 'assets/tests/debug-grid-1920x1920.png');
        myGame2.loader.addImageFile('car', 'assets/sprites/car90.png');
        myGame2.loader.load();
    }
    var car;
    function create2() {
        myGame2.camera.setBounds(0, 0, myGame.world.width, myGame.world.height);
        myGame2.add.sprite(0, 0, 'grid');
        car = myGame2.add.sprite(400, 300, 'car');
        myGame2.camera.follow(car);
    }
    function update2() {
        car.velocity.x = 0;
        car.velocity.y = 0;
        car.angularVelocity = 0;
        car.angularAcceleration = 0;
        if(myGame2.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            car.angularVelocity = -200;
        } else if(myGame2.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            car.angularVelocity = 200;
        }
        if(myGame2.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            car.velocity.copyFrom(myGame.motion.velocityFromAngle(car.angle, 300));
        }
    }
})();
