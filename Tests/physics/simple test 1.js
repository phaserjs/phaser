/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);
    function init() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('atari', 'assets/sprites/atari130xe.png');
        game.load.image('ball', 'assets/sprites/shinyball.png');
        game.load.start();
    }
    var atari;
    var ball;
    function create() {
        //  Add some gravity to the world, otherwise nothing will actually happen
        game.physics.gravity.setTo(0, 10);
        //atari = game.add.physicsSprite(220/2, 450, 'atari');
        atari = game.add.physicsSprite(320, 450, 'atari');
        //  We'll make the atari sprite a static body, so it won't be influenced by gravity or other forces
        atari.body.type = Phaser.Types.BODY_STATIC;
        ball = game.add.physicsSprite(330, 0, 'ball', null, 0);
    }
    function render() {
        Phaser.DebugUtils.renderPhysicsBody(atari.body);
        Phaser.DebugUtils.renderPhysicsBody(ball.body);
    }
})();
