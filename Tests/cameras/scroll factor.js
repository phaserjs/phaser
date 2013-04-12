/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/Sprite.ts" />
(function () {
    var myGame = new Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.world.setSize(1920, 1200);
        myGame.loader.addImageFile('backdrop', 'assets/pics/remember-me.jpg');
        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');
        myGame.loader.addImageFile('carrot', 'assets/sprites/carrot.png');
        myGame.loader.load();
    }
    var melon;
    function create() {
        //  scrolls in time with the camera
        myGame.createSprite(0, 0, 'backdrop');
        melon = myGame.createSprite(600, 650, 'melon');
        melon.scrollFactor.setTo(1.5, 1.5);
        //  scrolls x2 camera speed
        for(var i = 0; i < 100; i++) {
            var tempSprite = myGame.createSprite(Math.random() * myGame.world.width, Math.random() * myGame.world.height, 'carrot');
            tempSprite.scrollFactor.setTo(2, 2);
        }
    }
    function update() {
        myGame.camera.renderDebugInfo(32, 32);
        melon.renderDebugInfo(200, 32);
        if(myGame.input.keyboard.isDown(Keyboard.LEFT)) {
            myGame.camera.scroll.x -= 1;
        } else if(myGame.input.keyboard.isDown(Keyboard.RIGHT)) {
            myGame.camera.scroll.x += 1;
        }
        if(myGame.input.keyboard.isDown(Keyboard.UP)) {
            myGame.camera.scroll.y -= 1;
        } else if(myGame.input.keyboard.isDown(Keyboard.DOWN)) {
            myGame.camera.scroll.y += 1;
        }
    }
})();
