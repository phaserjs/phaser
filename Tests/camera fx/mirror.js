/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Plugins/CameraFX/Mirror.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        game.load.image('backdrop', 'assets/pics/ninja-masters2.png');
        game.load.start();
    }
    var mirror;
    function create() {
        //  Just set the world to be the size of the image we're loading in
        game.world.setSize(1216, 896);
        //  What we need is a camera 800x400 pixels in size as the mirror effect will be 200px tall and sit below it.
        //  So we resize our default camera to 400px
        game.camera.height = 400;
        //  Add our effect to the camera
        mirror = game.camera.plugins.add(Phaser.Plugins.CameraFX.Mirror);
        //  The first 2 parameters are the x and y coordinates of where to display the effect. They are in STAGE coordinates, not World.
        //  The next is a Rectangle making up the region of the Camera that we'll create the effect from (in this case the whole camera).
        //  Finally we set the fill color that is put over the top of the mirror effect.
        mirror.start(0, 400, new Phaser.Rectangle(0, 0, 800, 400), 'rgba(0, 0, 100, 0.7)');
        //  Experiment with variations on these to see the different mirror effects that can be achieved.
        //mirror.flipX = true;
        //mirror.flipY = true;
        //  The Mirror FX will literally mirror EVERYTHING that was rendered to the camera, in the case of this test it's
        //  just a single image, but when used on a full game it can look really quite neat.
        game.add.sprite(0, 0, 'backdrop');
    }
    function update() {
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            game.camera.x -= 4;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            game.camera.x += 4;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            game.camera.y -= 4;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            game.camera.y += 4;
        }
    }
})();
