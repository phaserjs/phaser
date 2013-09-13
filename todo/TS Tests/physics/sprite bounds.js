/// <reference path="../../Phaser/_definitions.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);
    function preload() {
        game.load.image('fuji', 'assets/pics/atari_fujilogo.png');
    }
    var fuji;
    var tween;
    var b;
    function create() {
        game.stage.backgroundColor = 'rgb(0,0,100)';
        fuji = game.add.sprite(game.stage.centerX, game.stage.centerY, 'fuji');
        fuji.origin.setTo(0, 0.5);
        fuji.rotation = 34;
        b = new Phaser.Rectangle(fuji.transform.center.x, fuji.transform.center.y, fuji.width, fuji.height);
        //game.add.tween(fuji).to({ rotation: 360 }, 20000, Phaser.Easing.Linear.None, true, 0, true);
            }
    function update() {
        if(game.input.activePointer.justPressed()) {
            //fuji.transform.centerOn(game.input.x, game.input.y);
            fuji.x = game.input.x;
            fuji.y = game.input.y;
        }
        b.x = fuji.transform.center.x - fuji.transform.halfWidth;
        b.y = fuji.transform.center.y - fuji.transform.halfHeight;
    }
    function render() {
        //Phaser.DebugUtils.renderSpriteWorldViewBounds(fuji);
        //Phaser.DebugUtils.renderSpriteBounds(fuji);
        Phaser.DebugUtils.renderSpriteCorners(fuji);
        //Phaser.DebugUtils.renderSpriteWorldView(fuji, 32, 32);
        Phaser.DebugUtils.renderRectangle(b, 'rgba(237,20,91,0.3)');
    }
})();
