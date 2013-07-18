/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create);
    function init() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.spritesheet('monster', 'assets/sprites/metalslug_monster39x40.png', 39, 40);
        game.load.start();
    }
    var monster;
    function create() {
        game.stage.backgroundColor = 'rgb(50,10,10)';
        //  Notice the use of 'stage.centerX' - this places the sprite in the middle of the stage without needing to do any extra math
        monster = game.add.sprite(game.stage.centerX, game.stage.centerY, 'monster');
        //  For this animation we pass 'null' for the frames, because we're going to use them all
        //  And we set the frame rate (30) and loop status (true) when we add the animation
        //  If the frame rate and looping is never going to change then it's easier to do it here
        monster.animations.add('walk', null, 30, true);
        //  Then you can just call 'play' on its own with no other values to start things going
        monster.animations.play('walk');
        monster.transform.scale.setTo(2, 2);
    }
})();
