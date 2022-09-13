var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: {
                y: 0.3
            },
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('platform', 'assets/sprites/platform.png');
}

function create ()
{
    var text = this.add.text(100, 0, 'Phaser 3', { font: '32px Arial', fill: '#00ff00' });
    var text2 = this.add.text(100, -100, 'Phaser 3', { font: '32px Arial', fill: '#ffff00' });

    var matterText = this.matter.add.gameObject(text, { shape: { type: 'polygon', sides: 8, radius: 64 } }).setFrictionAir(0.001).setBounce(0.9);
    var matterText2 = this.matter.add.gameObject(text2).setFrictionAir(0.001).setBounce(0.9);

    this.matter.add.image(350, 450, 'platform', null, { isStatic: true }).setScale(2, 0.5).setAngle(10);
}
