/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addImageFile('teddy', 'assets/pics/profil-sad_plush.png');
        myGame.loader.load();
    }
    var teddy;
    function create() {
        teddy = myGame.createSprite(0, 0, 'teddy');
        teddy.x = myGame.stage.centerX - teddy.width / 2;
        teddy.y = myGame.stage.centerY - teddy.height / 2;
        myGame.input.onDown.add(click, this);
        teddy.renderDebug = true;
    }
    function click() {
        if(teddy.align == Phaser.GameObject.ALIGN_BOTTOM_RIGHT) {
            teddy.align = Phaser.GameObject.ALIGN_TOP_LEFT;
        } else {
            teddy.align++;
        }
    }
    function update() {
        teddy.x = myGame.input.x;
        teddy.y = myGame.input.y;
    }
})();
