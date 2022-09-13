var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create,
    }
};

var game = new Phaser.Game(config);

function create() 
{
    var graphics = this.add.graphics();

    graphics.lineStyle(1, 0xffffff, 1);
    graphics.lineBetween(400, 0, 400, 600);

    this.add.text(400, 200, 'His ugliness was the stuff of legend.', { color: '#00ff00' });

    //  To right-align a _single_ line of text, use the origin:
    this.add.text(400, 400, 'His ugliness was the stuff of legend.', { color: '#00ff00' }).setOrigin(1, 0);
}
