var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 1200,
    height: 600,
    backgroundColor: '#2d2d88',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/pics/purple-dots.png');
    this.load.image('nayuki', 'assets/pics/nayuki.png');
}

function create ()
{
    var bob = this.make.image({ key: 'nayuki' }, false).setOrigin(0, 0);

    // var rt = this.add.renderTexture(400, 300, 800, 600).setOrigin(0.5, 0.5);
    var rt = this.add.renderTexture(0, 0, 800, 600);

    // rt.draw('bg', 0, 0);

    // rt.drawFrame('nayuki');

    rt.draw(bob, 0, 0);

    // this.add.image(0, 0, 'nayuki').setOrigin(0, 0);

    // var b = this.add.image(0, 0, 'bg').setOrigin(0, 0).setAlpha(1);

    // this.input.on('pointerdown', () => {

    //     b.visible = !b.visible;

    // });


}
