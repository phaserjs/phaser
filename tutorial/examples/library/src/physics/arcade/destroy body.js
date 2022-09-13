var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 200 }
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
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    var block = this.physics.add.image(400, 100, 'block');

    block.setVelocity(100, 200);
    block.setBounce(0.9);
    block.setCollideWorldBounds(true);

    block.setInteractive();

    var text = this.add.text(10, 10, 'Clicks: 5', { font: '16px Courier', fill: '#00ff00' });

    var i = 5;

    this.input.on('pointerdown', function ClickNuke () {
    
        i--;

        text.setText('Clicks: ' + i);

        if (i === 0)
        {
            block.destroy();

            this.input.off('pointerdown', ClickNuke);
        }
        else
        {
            block.setVelocity(Phaser.Math.Between(-300, 300), -600);
        }
    
    }, this);
}
