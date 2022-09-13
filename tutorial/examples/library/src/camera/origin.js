class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.iter = 0;

    }

    preload () 
    {
        this.load.image('einstein', 'assets/pics/ra-einstein.png');
    }

    create () 
    {
        const image = this.add.image(200, 150, 'einstein');

        this.cameras.main.setSize(400, 300);
    
        this.camera0 = this.cameras.main;
        this.camera1 = this.cameras.add(400, 0, 400, 300);
        this.camera2 = this.cameras.add(0, 300, 400, 300);
        this.camera3 = this.cameras.add(400, 300, 400, 300);
    }

    update () 
    {
        this.camera0.zoom = 0.5 + Math.abs(Math.sin(this.iter));
        this.camera0.scrollX = Math.sin(this.iter) * 400;
            
        this.camera1.rotation = this.iter;
    
        this.camera2.scrollX = Math.cos(this.iter) * 100;
        this.camera2.scrollY = Math.sin(this.iter) * 100;
        this.camera2.zoom = 0.5 + Math.abs(Math.sin(this.iter));
        this.camera2.rotation = -this.iter;
    
        this.camera3.zoom = 0.5 + Math.abs(Math.sin(this.iter));
        this.iter += 0.01;
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: [ Example ],
    width: 800,
    height: 600
};

const game = new Phaser.Game(config);
