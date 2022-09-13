class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload () 
    {
        this.load.image('ship', 'assets/sprites/fmship.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/super-mario.json');
        this.load.image('tiles1', 'assets/tilemaps/tiles/super-mario.png');
    }

    create () 
    {
        this.cameras.main.setBounds(0, 0, 3392, 100);
        this.physics.world.setBounds(0, 0, 3392, 240);
    
        var map = this.make.tilemap({ key: 'map' });
        var tileset = map.addTilesetImage('SuperMarioBros-World1-1', 'tiles1');
        var layer = map.createLayer('World1', tileset, 0, 0);
    
        this.cursors = this.input.keyboard.createCursorKeys();
    
        this.ship = this.physics.add.image(400, 100, 'ship').setAngle(90).setCollideWorldBounds(true);
        // this.ship = this.add.image(400, 100, 'ship').setAngle(90);
    
        this.cameras.main.startFollow(this.ship, true, 0.08, 0.08);
    
        this.cameras.main.setZoom(4);
    }

    update () 
    {
        this.ship.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            this.ship.setAngle(-90).setVelocityX(-200);
        }
        else if (this.cursors.right.isDown)
        {
            this.ship.setAngle(90).setVelocityX(200);
        }
    
        if (this.cursors.up.isDown)
        {
            this.ship.setVelocityY(-200);
        }
        else if (this.cursors.down.isDown)
        {
            this.ship.setVelocityY(200);
        }
    }

    updateDirect ()
    {
        if (this.cursors.left.isDown && this.ship.x > 0)
        {
            this.ship.setAngle(-90);
            this.ship.x -= 2.5;
        }
        else if (this.cursors.right.isDown && this.ship.x < 3392)
        {
            this.ship.setAngle(90);
            this.ship.x += 2.5;
        }

        if (this.cursors.up.isDown && this.ship.y > 0)
        {
            this.ship.y -= 2.5;
        }
        else if (this.cursors.down.isDown && this.ship.y < 240)
        {
            this.ship.y += 2.5;
        }
    }

}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
    },
    scene: [ Example ]
};

const game = new Phaser.Game(config);
