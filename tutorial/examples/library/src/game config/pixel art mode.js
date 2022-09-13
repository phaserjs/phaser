class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.iter = 0;
    }

    preload ()
    {
        this.load.image('toy', 'assets/pics/shocktroopers-toy.png');
        this.load.bitmapFont('atari', 'assets/fonts/bitmap/atari-classic.png', 'assets/fonts/bitmap/atari-classic.xml');
        this.load.spritesheet('veg', 'assets/sprites/fruitnveg32wh37.png', { frameWidth: 32, frameHeight: 37 });
        this.load.image('mushroom', 'assets/sprites/mine.png');
        this.load.tilemapTiledJSON('map1', 'assets/tilemaps/maps/super-mario.json');
        this.load.image('tiles1', 'assets/tilemaps/tiles/super-mario.png');
    }

    create ()
    {
        this.tilesprite = this.add.tileSprite(400, 300, 800, 600, 'mushroom');

        const map1 = this.make.tilemap({ key: 'map1' });
        const tileset1 = map1.addTilesetImage('SuperMarioBros-World1-1', 'tiles1');
        const layer1 = map1.createLayer('World1', tileset1, 0, 64).setScale(2);

        this.add.image(0, 600, 'toy').setOrigin(0, 1).setScale(2);

        this.add.text(400, 8, 'Phaser 3 pixelArt: true', { font: '16px Courier', fill: '#00ff00' }).setOrigin(0.5, 0).setScale(3);

        const particles = this.add.particles('veg');

        particles.createEmitter({
            frame: 0,
            x: 400,
            y: 300,
            speed: 100,
            frequency: 300,
            lifespan: 4000
        }).setScale(4);

        this.add.bitmapText(400, 128, 'atari', 'PHASER').setOrigin(0.5).setScale(2);
    }

    update ()
    {
        this.tilesprite.tileScaleX = Math.max(2, Math.sin(this.iter) * 8);
        this.tilesprite.tileScaleY = Math.max(2, Math.sin(this.iter) * 8);

        this.iter += 0.01;
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
