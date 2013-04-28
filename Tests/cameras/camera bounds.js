/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.world.setSize(1920, 1200);
        myGame.camera.setBounds(0, 0, 1920, 1200);
        myGame.loader.addImageFile('backdrop', 'assets/pics/remember-me.jpg');
        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');
        myGame.loader.load();
    }
    function create() {
        myGame.createSprite(0, 0, 'backdrop');
        for(var i = 0; i < 100; i++) {
            myGame.createSprite(Math.random() * myGame.world.width, Math.random() * myGame.world.height, 'melon');
        }
        myGame.onRenderCallback = render;
    }
    function update() {
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            myGame.camera.scroll.x -= 4;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            myGame.camera.scroll.x += 4;
        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            myGame.camera.scroll.y -= 4;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            myGame.camera.scroll.y += 4;
        }
    }
    function render() {
        myGame.camera.renderDebugInfo(32, 32);
    }
})();
