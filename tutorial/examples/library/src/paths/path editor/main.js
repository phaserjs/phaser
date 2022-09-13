var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#0055aa',
    parent: 'phaser-example',
    scene: Controller
};

var game = new Phaser.Game(config);

window.addEventListener('resize', function (event) {

    game.resize(window.innerWidth, window.innerHeight);

}, false);
