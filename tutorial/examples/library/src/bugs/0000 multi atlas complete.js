class Scene extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.path = 'assets/atlas/';

        this.load.multiatlas('megaset', 'tp3-multi-atlas.json');

        // this.load.image('megaset', 'assets/sprites/beer.png');

        this.load.on('filecomplete-multiatlas-megaset', () => {

            console.log('multi atlas loaded');

        });
    }

    create ()
    {
        //  This frame is in the 1st atlas file (set0/data0)
        this.add.image(0, 0, 'megaset', 'snake').setOrigin(0);

        //  This frame is in the 2nd atlas file (set1/data1)
        this.add.image(0, 100, 'megaset', 'nanoha-taiken-pink').setOrigin(0);

        //  This frame is in the 3rd atlas file (set2/data2)
        // this.add.image(0, 0, 'megaset', 'hello').setOrigin(0); // trimmed
        this.add.image(300, 130, 'megaset', 'bunny').setOrigin(0); // un-trimmed

        //  This frame is in the 4th atlas file (set3/data3)
        this.add.image(64, 300, 'megaset', 'contra3').setOrigin(0);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Scene
}

new Phaser.Game(config);
