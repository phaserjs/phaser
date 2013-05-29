/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create);
    function init() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        //  The sprite sheet is a standard frame-by-frame sheet, and each frame is 37 x 45 pixels in size.
        //  The final parameter (18) is the number of frames there are. You can omit this if your frames fill the entire sheet.
        game.loader.addSpriteSheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
        game.loader.load();
    }
    var mummy;
    function create() {
        mummy = game.add.sprite(game.stage.centerX, game.stage.centerY, 'mummy');
        //  Here we add new animation called 'walk'.
        // As it's the only animation in our sprite sheet we don't need to define the frames being used.
        mummy.animations.add('walk');
        //  This plays the animation at 20 frames per second on a loop (the 3rd parameter)
        //  Try changing the 20 value to something low to slow the speed down, or higher to make it play faster.
        mummy.animations.play('walk', 20, true);
        //  This just scales the sprite up so you can see the animation better
        mummy.scale.setTo(4, 4);
    }
})();
