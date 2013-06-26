(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);
    function init() {
        game.load.image('atari', 'assets/sprites/atari130xe.png');
        game.load.image('ball', 'assets/sprites/shinyball.png');
        game.load.start();
    }
    var atari;
    var ball;
    function create() {
        game.physics.gravity.setTo(0, 5);
        atari = game.add.physicsSprite(300, 450, 'atari', null, Phaser.Types.BODY_STATIC);
        ball = game.add.physicsSprite(300 - 20, 0, 'ball');
    }
    function render() {
        Phaser.DebugUtils.renderPhysicsBodyInfo(atari.body, 32, 32);
        Phaser.DebugUtils.renderPhysicsBodyInfo(ball.body, 320, 32);
        Phaser.DebugUtils.renderPhysicsBody(atari.body);
        Phaser.DebugUtils.renderPhysicsBody(ball.body);
    }
})();
