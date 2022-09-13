class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload () 
    {
        this.load.image('grid', 'assets/pics/uv-grid-4096-ian-maclachlan.png');
    }

    create () 
    {
        this.add.image(0, 0, 'grid').setOrigin(0);

        this.cursors = this.input.keyboard.createCursorKeys();
    
        const controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            acceleration: 0.02,
            drag: 0.0005,
            maxSpeed: 1.0
        };
    
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    
        const cam = this.cameras.main;
    
        cam.setBounds(0, 0, 4096, 4096);
        cam.setZoom(2);
    
        this.input.on('pointerdown', pointer => {
    
            let p = cam.getWorldPoint(pointer.x, pointer.y);
    
            console.log(p);
    
        });
    }

    update (time, delta) 
    {
        this.controls.update(delta);
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
