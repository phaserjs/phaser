var config = {
    type: Phaser.CANVAS,
    width: 160,
    height: 144,
    zoom: 4,
    pixelArt: true,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {

    // this.game.canvas.style.width = (this.game.config.width * this.game.config.zoom).toString() + 'px';
    // this.game.canvas.style.height = (this.game.config.height * this.game.config.zoom).toString() + 'px';

    this.load.image('title', 'assets/tests/zoom/title.png');
    this.load.image('ball', 'assets/sprites/pangball.png');

}

function create() {

    this.add.image(0, 0, 'title').setOrigin(0);

    var ball = this.add.image(60, 60, 'ball').setInteractive();

    ball.on('pointerdown', function () {

        ball.x += 10;

    });

}
