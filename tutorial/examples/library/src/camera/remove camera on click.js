class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload () 
    {
        this.load.image('einstein', 'assets/pics/monika-krawinkel-amberstar-title.png');
    }

    create () 
    {
        this.image = this.add.image(100, 70, 'einstein');

        //  We're going to create 32 cameras in a 8x4 grid, making each 100x150 in size
        this.cameras.main.setSize(100, 150);
        this.cameras.main.name = 'Cam0';
    
        let i = 1;
    
        for (let y = 0; y < 4; y++)
        {
            for (let x = 0; x < 8; x++)
            {
                if (x === 0 && y === 0)
                {
                    continue;
                }
    
                const tx = x * 100;
                const ty = y * 150;
    
                this.cameras.add(tx, ty, 100, 150, false, 'Cam' + i);
    
                i++;
    
            }
        }
    
        this.input.on(Phaser.Input.Events.POINTER_UP, function (pointer) {
    
            const x = Phaser.Math.Snap.Floor(pointer.x, 100);
            const y = Phaser.Math.Snap.Floor(pointer.y, 150);
    
            const total = this.cameras.remove(pointer.camera);
    
            if (total === 0)
            {
                const newCam = this.cameras.add(x, y, 100, 150);
                console.log('Added Camera ID', newCam.id);
            }
            else
            {
                console.log('Removed Camera ID', pointer.camera.id);
            }
    
        }, this);
    }

    update () 
    {
        this.image.rotation += 0.01;
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
