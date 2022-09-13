class Example extends Phaser.Scene
{
    constructor ()
    {
        super('example');
   }

    preload ()
    {
        this.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
        this.load.spritesheet('coin', 'assets/sprites/coin.png', { frameWidth: 32, frameHeight: 32 });
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/tile-collision-test.json');
        this.load.image('player', 'assets/sprites/phaser-dude.png');
        this.load.image('mask', 'assets/sprites/mask1.png');
    }

    create ()
    {
        const map = this.make.tilemap({ key: 'map' });

        const groundTiles = map.addTilesetImage('ground_1x1');
        const coinTiles = map.addTilesetImage('coin');

        const backgroundLayer = map.createLayer('Background Layer', groundTiles, 0, 0);
        const groundLayer = map.createLayer('Ground Layer', groundTiles, 0, 0);
        const coinLayer = map.createLayer('Coin Layer').setVisible(false);

        //  Our fake RenderTexture mask goes here, above the layers, but below the coins / player
        //  Important: We only want it to be the size of the canvas, _not_ the map!
        this.rt = this.add.renderTexture(0, 0, this.scale.width, this.scale.height);

        //  Make sure it doesn't scroll with the camera
        this.rt.setScrollFactor(0, 0);

        const coins = [];

        coinLayer.forEachTile(tile => {

            if (tile.index === 26)
            {
                const coin = this.physics.add.image(tile.pixelX + 16, tile.pixelY + 16, 'coin');
                coin.body.allowGravity = false;
                coins.push(coin);
            }

        });

        groundLayer.setCollisionBetween(1, 25);

        this.player = this.physics.add.sprite(80, 70, 'player').setBounce(0.1);

        this.physics.add.collider(this.player, groundLayer);
        this.physics.add.overlap(this.player, coins, (p, c) => {
            c.visible = false;
        });

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update ()
    {
        this.player.body.setVelocityX(0);

        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-200);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(200);
        }

        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor())
        {
            this.player.body.setVelocityY(-300);
        }

        //  Draw the spotlight on the player
        const cam = this.cameras.main;

        //  Clear the RenderTexture
        this.rt.clear();

        //  Fill it in black
        this.rt.fill(0x000000);

        //  Erase the 'mask' texture from it based on the player position
        //  We - 107, because the mask image is 213px wide, so this puts it on the middle of the player
        //  We then minus the scrollX/Y values, because the RenderTexture is pinned to the screen and doesn't scroll
        this.rt.erase('mask', (this.player.x - 107) - cam.scrollX, (this.player.y - 107) - cam.scrollY);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 576,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 300 } }
    },
    scene: Example
};

const game = new Phaser.Game(config);
