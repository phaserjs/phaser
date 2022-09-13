class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('gem', 'assets/sprites/gem.png');
    }

    create ()
    {
        var gem = this.add.image(300, 300, 'gem');

        //  Store some data about this Gem:
        gem.setDataEnabled();

        gem.data.set('name', 'Red Gem Stone');
        gem.data.set('level', 2);
        gem.data.set('gold', 150);
        gem.data.set('owner', 'Link');

        //  Display it
        const text = this.add.text(350, 250, '', { font: '16px Courier', fill: '#00ff00' });
        text.setText([
            'Name: ' + gem.data.get('name'),
            'Level: ' + gem.data.get('level'),
            'Value: ' + gem.data.get('gold') + ' gold',
            'Owner: ' + gem.data.get('owner')
        ]);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
