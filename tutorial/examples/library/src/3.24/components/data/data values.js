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

    gem.setData('name', 'Red Gem Stone');
    gem.setData('level', 2);
    gem.setData('owner', 'Link');

    //  Whenever a data value is updated we call this function:
    gem.on('setdata', function (gameObject, key, value) {

        text.setText([
            'Name: ' + gem.getData('name'),
            'Level: ' + gem.getData('level'),
            'Value: ' + gem.getData('gold') + ' gold',
            'Owner: ' + gem.getData('owner')
        ]);

    });

    //  Set the value, this will emit the `setdata` event.
    gem.setData('gold', 50);

    //  Change the 'value' property when the mouse is clicked
    this.input.on('pointerdown', function () {

        gem.data.values.gold += 50;

        if (gem.data.values.gold % 200 === 0)
        {
            gem.data.values.level++;
        }

    });
}
