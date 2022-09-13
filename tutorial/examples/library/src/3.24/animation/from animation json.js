var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.animation('gemData', 'assets/animations/gems.json');

    this.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');
}

function create ()
{
    this.add.text(400, 32, 'Animations from Animation JSON file', { color: '#00ff00' }).setOrigin(0.5, 0);

    this.add.sprite(400, 200, 'gems').play('diamond');
    this.add.sprite(400, 300, 'gems').play('prism');
    this.add.sprite(400, 400, 'gems').play('ruby');
    this.add.sprite(400, 500, 'gems').play('square');
}
