// #module

import HueRotatePostFX from './assets/pipelines/HueRotatePostFX.js';

export default class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.setPath('assets/normal-maps/');

        this.load.image('gem1');
        this.load.image('gem2');
        this.load.image('gem3');
        this.load.image('gem4');
        this.load.image('gem5');
        this.load.image('gem6');
        this.load.image('gem7');
        this.load.image('gem8');
        this.load.image('gem9');

        this.load.image('stones', [ 'stones.png', 'stones_n.png' ]);
    }

    create ()
    {
        this.cameras.main.removeBounds();

        const land = this.add.tileSprite(400, 300, 800, 600, 'stones');

        land.setPipeline('Light2D');
        land.setScrollFactor(0, 0);
        land.tileScaleX = 0.5;
        land.tileScaleY = 0.5;

        this.land = land;

        this.lights.enable();
        this.lights.setAmbientColor(0x666666);

        const spotlight = this.lights.addLight(400, 300, 128).setIntensity(3);

        this.input.on('pointermove', pointer => {

            spotlight.x = pointer.worldX;
            spotlight.y = pointer.worldY;

        });

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {

            if (deltaY < 0)
            {
                this.cameras.main.zoom += 0.1;
            }
            else if (deltaY > 0)
            {
                this.cameras.main.zoom -= 0.1;
            }

            let w = 800 * (1 / this.cameras.main.zoom);
            let h = 600 * (1 / this.cameras.main.zoom);

            land.setSize(w, h);
            land.dirty = true;

        });

        this.text = this.add.text(10, 10, '').setDepth(1).setScrollFactor(0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();

        const lightsLayer = this.add.layer();
        const gemsLayer = this.add.layer();

        const circ = new Phaser.Geom.Circle(400, 300, 400);

        const rings = [
            {
                radius: 300,
                points: 10,
                color: 0xff22ff,
                frame: 'gem2'
            },
            {
                radius: 500,
                points: 15,
                color: 0x61cd6b,
                frame: 'gem3'
            },
            {
                radius: 700,
                points: 20,
                color: 0xc7860f,
                frame: 'gem4'
            },
            {
                radius: 900,
                points: 25,
                color: 0xeae90a,
                frame: 'gem5'
            },
            {
                radius: 1100,
                points: 30,
                color: 0xd61837,
                frame: 'gem7'
            },
            {
                radius: 1300,
                points: 35,
                color: 0x42b3ee,
                frame: 'gem1'
            },
            {
                radius: 1500,
                points: 40,
                color: 0x9a5baa,
                frame: 'gem6'
            },
            {
                radius: 1700,
                points: 45,
                color: 0x65a0b3,
                frame: 'gem8'
            },
            {
                radius: 1900,
                points: 50,
                color: 0x0771d2,
                frame: 'gem9'
            }
        ];

        for (let i = 0; i < rings.length; i++)
        {
            let ring = rings[i];

            circ.setTo(400, 300, ring.radius);

            let points = Phaser.Geom.Circle.GetPoints(circ, ring.points);

            points.forEach(point => {

                lightsLayer.add(this.add.pointlight(point.x, point.y, ring.color, 128, 0.25, 0.1));

                gemsLayer.add(this.add.image(point.x, point.y, ring.frame));

            });
        }

        this.tweens.add({ targets: lightsLayer.list, radius: 96, yoyo: true, duration: 1500, repeat: -1, ease: 'Sine.inOut' });

        gemsLayer.setPostPipeline(HueRotatePostFX);
    }

    update ()
    {
        this.text.setText([
            'Cursors to move',
            'Point Lights: 270'
        ]);

        var speed = 6;

        if (this.cursors.left.isDown)
        {
            this.cameras.main.scrollX -= speed;
            this.land.tilePositionX -= speed * 2;
        }
        else if (this.cursors.right.isDown)
        {
            this.cameras.main.scrollX += speed;
            this.land.tilePositionX += speed * 2;
        }

        if (this.cursors.up.isDown)
        {
            this.cameras.main.scrollY -= speed;
            this.land.tilePositionY -= speed * 2;
        }
        else if (this.cursors.down.isDown)
        {
            this.cameras.main.scrollY += speed;
            this.land.tilePositionY += speed * 2;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: Example,
    pipeline: { HueRotatePostFX }
};

const game = new Phaser.Game(config);
