class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload () 
    {
        this.load.image('einstein', 'assets/pics/ra-einstein.png');
    }

    create () 
    {
        this.image = this.add.image(200, 150, 'einstein');

        this.cameras.main.setSize(400, 300);
    
        this.cameras.add(400, 0, 400, 300);
        this.cameras.add(0, 300, 400, 300);
        this.cameras.add(400, 300, 400, 300);
    }

    update () 
    {
        this.image.rotation += 0.01;
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
