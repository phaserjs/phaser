/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, null, create, update);
    var box;
    function create() {
        box = myGame.add.geomSprite(0, 0);
        box.createRectangle(64, 64);
        box.renderOutline = false;
    }
    function update() {
        box.velocity.x = 0;
        box.velocity.y = 0;
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            box.velocity.x = -200;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            box.velocity.x = 200;
        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            box.velocity.y = -200;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            box.velocity.y = 200;
        }
    }
})();
