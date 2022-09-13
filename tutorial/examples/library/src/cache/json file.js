class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.json('jsonData', 'assets/atlas/megaset-0.json');
    }

    create ()
    {
        console.log(this.cache.json.get('jsonData'));
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
