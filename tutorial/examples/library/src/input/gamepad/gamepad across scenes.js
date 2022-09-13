class MainScene extends Phaser.Scene {

    constructor ()
    {
        super('MainScene');

        this.pad = null;
        this.sprite = null;
    }

    preload ()
    {
        this.load.image('sky', 'assets/skies/lightblue.png');
        this.load.image('elephant', 'assets/sprites/elephant.png');
        this.load.image('truck1', 'assets/sprites/alienbusters.png');
        this.load.image('truck2', 'assets/sprites/astorm-truck.png');
    }

    create ()
    {
        this.add.image(0, 0, 'sky').setOrigin(0);

        var text = this.add.text(10, 10, 'Press any button on a connected Gamepad', { font: '16px Courier', fill: '#ffffff' });

        if (this.input.gamepad.total === 0)
        {
            this.input.gamepad.once('connected', pad => {

                this.pad = pad;
                this.sprite = this.add.image(400, 300, 'elephant');

                text.setText('Main Scene. Press Button 0 to change Scene');

                pad.on('down', (index, value, button) => {

                    if (index === 0)
                    {
                        console.log('M to A');
                        this.scene.start('SceneA');
                    }

                });

            });
        }
        else
        {
            this.pad = this.input.gamepad.pad1;

            this.sprite = this.add.image(400, 300, 'elephant');

            text.setText('Main Scene. Press Button 0 to change Scene');

            this.pad.on('down', (index, value, button) => {

                if (index === 0)
                {
                    console.log('M to A');
                    this.scene.start('SceneA');
                }

            });

        }
    }

    update ()
    {
        const pad = this.pad;

        if (!pad)
        {
            return;
        }

        const sprite = this.sprite;

        if (pad.left)
        {
            sprite.x -= 4;
            sprite.flipX = false;
        }
        else if (pad.right)
        {
            sprite.x += 4;
            sprite.flipX = true;
        }

        if (pad.up)
        {
            sprite.y -= 4;
        }
        else if (pad.down)
        {
            sprite.y += 4;
        }
    }
}

class SceneA extends Phaser.Scene {

    constructor ()
    {
        super('SceneA');

        this.pad = null;
        this.sprite = null;
    }

    create ()
    {
        this.add.image(0, 0, 'sky').setOrigin(0);
        this.add.text(10, 10, 'Scene A. Press Button 0 to change Scene.', { font: '16px Courier', fill: '#ffffff' });

        this.pad = this.input.gamepad.pad1;

        this.sprite = this.add.image(400, 300, 'truck1');

        this.pad.on('down', (index, value, button) => {

            if (index === 0)
            {
                console.log('A to B');
                this.scene.start('SceneB');
            }

        });
    }

    update ()
    {
        const pad = this.pad;

        if (!pad)
        {
            return;
        }

        const sprite = this.sprite;

        if (pad.left)
        {
            sprite.x -= 4;
            sprite.flipX = true;
        }
        else if (pad.right)
        {
            sprite.x += 4;
            sprite.flipX = false;
        }

        if (pad.up)
        {
            sprite.y -= 4;
        }
        else if (pad.down)
        {
            sprite.y += 4;
        }
    }
}

class SceneB extends Phaser.Scene {

    constructor ()
    {
        super('SceneB');

        this.pad = null;
        this.sprite = null;
    }

    create ()
    {
        this.add.image(0, 0, 'sky').setOrigin(0);
        this.add.text(10, 10, 'Scene B. Press Button 0 to change Scene.', { font: '16px Courier', fill: '#ffffff' });

        this.pad = this.input.gamepad.pad1;

        this.sprite = this.add.image(400, 300, 'truck2');

        this.pad.on('down', (index, value, button) => {

            if (index === 0)
            {
                console.log('B to M');
                this.scene.start('MainScene');
            }

        });
    }

    update ()
    {
        const pad = this.pad;

        if (!pad)
        {
            return;
        }

        const sprite = this.sprite;

        if (pad.left)
        {
            sprite.x -= 4;
            sprite.flipX = true;
        }
        else if (pad.right)
        {
            sprite.x += 4;
            sprite.flipX = false;
        }

        if (pad.up)
        {
            sprite.y -= 4;
        }
        else if (pad.down)
        {
            sprite.y += 4;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    input: {
        gamepad: true
    },
    scene: [ MainScene, SceneA, SceneB ]
};

const game = new Phaser.Game(config);
