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
        const image = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'gem');

        image.setDataEnabled();

        image.data.set('name', 'Red GemStone');
        image.data.set('value_armor', true);
        image.data.set('armor_head', 50);
        image.data.set('armor_body', 250);
        image.data.set('armor_feet', 15);

        //  Query lets you run a regular expression against the keys,
        //  and get an object back with them all in.
        //  Here we're checking for keys matching 'armor' at the start
        console.log(image.data.query(/^armor/));
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
