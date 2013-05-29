/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create);
    function init() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.loader.addImageFile('fuji', 'assets/pics/atari_fujilogo.png');
        game.loader.load();
    }
    var fuji;
    var tween;
    function create() {
        game.stage.backgroundColor = 'rgb(0,0,100)';
        //  Here we'll assign the new sprite to the local fuji variable
        fuji = game.add.sprite(200, 200, 'fuji');
        //  The sprite is 320 x 200 pixels in size
        //  Here we set the origin to the center of the sprite (half of its width and height, so 160x100)
        //  This will cause it to rotate on its center
        fuji.origin.setTo(160, 100);
        tween = game.add.tween(fuji);
        //  Start it going
        rotate();
    }
    function rotate() {
        tween.clear();
        tween.to({
            rotation: 360
        }, 2000);
        tween.onComplete.add(rotate, this);
        tween.start();
    }
})();
