var config = {
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#0055aa',
    parent: 'phaser-example',
    scene: Controller,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    }
};

var game = new Phaser.Game(config);

window.addEventListener('resize', function (event) {

    game.resize(window.innerWidth, window.innerHeight);

}, false);
