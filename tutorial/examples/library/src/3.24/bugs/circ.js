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
    this.load.image('gem', 'assets/sprites/gem.png');
}

function create ()
{
    var text = this.add.text(350, 270, '', { font: '16px Courier', fill: '#00ff00' });

    var gem = this.add.image(300, 300, 'gem');

    //  Store some data about this Gem:
    gem.setData('info', { name: 'Red Gem Stone', level: 2, gold: 50 });

    //  Change the 'value' property when the mouse is clicked
    this.input.on('pointerdown', function () {

        gem.data.values.info.gold += 50;

        if (gem.data.values.info.gold % 200 === 0)
        {
            gem.data.values.info.level++;
        }

        var i = gem.getData('info');

        text.setText([
            'Name: ' + i.name,
            'Level: ' + i.level,
            'Value: ' + i.gold + ' gold'
        ]);

    });
}
