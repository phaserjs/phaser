var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    transparent: true,
    render: {},
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    this.add.text(200, 200, 'Phaser 3.60');
}
