class Scene1 extends Phaser.Scene {
    constructor() {
        super("scene1");
    }

    preload() {
        for (let i = 1; i<= 500; i++) {
            // this.load.image('apple' + i, 'assets/sprites/apple.png')
            this.load.image('apple' + i, 'assets/pics/uv-grid.jpg')
        }
    }

    create() {

        this.add.text(100, 100, 'Scene 1', { color: '#00ff00', align: 'left' });

        for (let i = 1; i <= 32; i++)
        {
            let x = Phaser.Math.Between(0, 800);
            let y = Phaser.Math.Between(0, 600);

            this.add.image(x, y, 'apple' + i);
        }

        this.input.once('pointerdown', () => {

            for (let i = 1; i<= 500; i++)
            {
                this.textures.remove('apple' + i)
            }

            this.scene.start('scene2');

        });
    }
}

class Scene2 extends Phaser.Scene {
    constructor() {
        super("scene2");
    }

    create() {

        this.add.text(100, 100, 'Textures Cleared', { color: '#00ff00', align: 'left' });

        this.input.once('pointerdown', () => {

            this.scene.start('scene3');

        });

    }
}

class Scene3 extends Phaser.Scene {
    constructor() {
        super("scene3");
    }

    create() {

        this.add.text(100, 100, 'Click to start', { color: '#00ff00', align: 'left' });

        this.input.once('pointerdown', () => {

            this.scene.start('scene1');

        });

    }
}

var gameConfig = {
    type: Phaser.CANVAS,
    scale: {
        width: 800,
        height: 600
    },
    parent: 'phaser-example',
    antialias: true,
    mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
    scene: [Scene3, Scene1, Scene2]
}

new Phaser.Game(gameConfig);
