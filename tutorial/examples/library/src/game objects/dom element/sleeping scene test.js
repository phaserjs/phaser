class SceneA extends Phaser.Scene
{
    constructor ()
    {
        super('a');
    }

    preload ()
    {
        this.load.image('einstein', 'assets/pics/ra-einstein.png');
    }

    create ()
    {
        const div = document.createElement('div');

        div.style = 'background-color: lime; width: 220px; height: 100px; font: 48px Arial; font-weight: bold';
        div.innerText = 'Scene A';
    
        let e = this.add.dom(400, 200, div);
    
        this.add.image(400, 300, 'einstein');

        var i = 0;

        this.input.on('pointerdown', () => {

            if (i === 0)
            {
                e.destroy();
                i++;
            }
            else if (i === 1)
            {
                this.scene.sleep();
            }

        });
    }
}

class SceneB extends Phaser.Scene
{
    constructor ()
    {
        super('b');
    }

    create ()
    {
        const div = document.createElement('div');

        div.style = 'background-color: lime; width: 220px; height: 100px; font: 48px Arial; font-weight: bold';
        div.innerText = 'Scene B';
    
        this.add.dom(400, 400, div);
    
        this.add.image(400, 300, 'einstein').setScale(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('a');

        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    dom: {
        createContainer: true
    },
    scene: [ SceneA, SceneB ]
};

const game = new Phaser.Game(config);
