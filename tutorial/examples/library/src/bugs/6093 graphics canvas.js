var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create () {
    var graphics = this.add.graphics();
    graphics.lineStyle(4, 0xff00ff);
    graphics.strokeCircle(0, 0, 60);
    var container = this.add.container(400, 300, [ graphics ]);
}
