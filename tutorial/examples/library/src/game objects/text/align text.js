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
    graphics.lineBetween(200, 0, 200, 600);

    //  Align only works with multi-lined text.

    this.add.text(200, 100, 'Case shrugged.\nThe girl to his right giggled and nudged him.', { color: '#00ff00', align: 'left' });
    this.add.text(200, 200, 'Case shrugged.\nThe girl to his right giggled and nudged him.', { color: '#00ff00', align: 'right' });
    this.add.text(200, 300, 'Case shrugged.\nThe girl to his right giggled and nudged him.', { color: '#00ff00', align: 'center' });
}
