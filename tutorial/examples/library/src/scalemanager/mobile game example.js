//  This Scene has no aspect ratio lock, it will scale to fit the browser window, but will zoom to match the Game
class BackgroundScene extends Phaser.Scene
{
    gameScene;
    layer;

    constructor ()
    {
        super('BackgroundScene');
    }

    preload ()
    {
        this.load.image('guide', 'assets/tests/640x960-guide.png');
        this.load.image('bg', 'assets/skies/bigsky.png');
        this.load.atlas('clouds', 'assets/atlas/clouds.png', 'assets/atlas/clouds.json');
        this.load.image('sky', 'src/games/firstgame/assets/sky.png');
        this.load.image('ground', 'src/games/firstgame/assets/platform.png');
        this.load.image('star', 'src/games/firstgame/assets/star.png');
        this.load.image('bomb', 'src/games/firstgame/assets/bomb.png');
        this.load.spritesheet('dude', 'src/games/firstgame/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create ()
    {
        const width = this.scale.gameSize.width;
        const height = this.scale.gameSize.height;

        const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);

        //  If you'd rather use a layer to container all Game Objects, use the following (and see updateCamera)

        // const bg = this.add.image(0, 0, 'bg');
        // this.layer = this.add.container();
        // this.layer.add(bg);

        //  Create some clouds to show we can animate objects in this Scene as well as the Game Scene
        this.time.addEvent({ delay: 3000, callback: this.spawnCloud, callbackScope: this, repeat: 12 });

        this.scene.launch('GameScene');

        this.gameScene = this.scene.get('GameScene');
    }

    updateCamera ()
    {
        const width = this.scale.gameSize.width;
        const height = this.scale.gameSize.height;

        const camera = this.cameras.main;

        //  There is 240px of extra padding below the game area in the background graphic
        //  so we account for it in the y offset (scaled by the game zoom factor)

        const zoom = this.gameScene.getZoom();
        const offset = 120 * zoom;

        //  We can either zoom and re-center the camera:

        camera.setZoom(zoom);
        camera.centerOn(1400 / 2, (1200 / 2) + 120);

        //  Or, if you want to put all of the Game Objects in this Scene into a layer,
        //  you can position and scale that:

        // this.layer.x = width / 2;
        // this.layer.y = (height / 2) + offset;
        // this.layer.setScale(zoom);
    }

    spawnCloud (cloud)
    {
        const cloudType = Phaser.Math.Between(1, 3);

        const x = 1400;
        const y = Phaser.Math.Between(0, this.scale.height / 1.25);

        if (!cloud)
        {
            cloud = this.add.image(x, y, 'clouds', 'cloud' + cloudType);
        }
        else
        {
            cloud.setPosition(x, y);
        }

        this.tweens.add({
            targets: cloud,
            x: -400,
            duration: Phaser.Math.Between(20000, 60000),
            ease: 'linear',
            onComplete: () => this.spawnCloud(cloud)
        });
    }
}

//  This Scene is aspect ratio locked at 640 x 960 (and scaled and centered accordingly)
class GameScene extends Phaser.Scene
{
    GAME_WIDTH = 640;
    GAME_HEIGHT = 960;

    backgroundScene;
    parent;
    sizer;
    player;
    stars;
    bombs;
    platforms;
    cursors;
    score = 0;
    gameOver = false;
    scoreText;

    constructor ()
    {
        super('GameScene');
    }

    create ()
    {
        const width = this.scale.gameSize.width;
        const height = this.scale.gameSize.height;

        this.parent = new Phaser.Structs.Size(width, height);
        this.sizer = new Phaser.Structs.Size(this.GAME_WIDTH, this.GAME_HEIGHT, Phaser.Structs.Size.FIT, this.parent);

        this.parent.setSize(width, height);
        this.sizer.setSize(width, height);

        this.backgroundScene = this.scene.get('BackgroundScene');

        this.updateCamera();

        this.scale.on('resize', this.resize, this);

        const guide = this.add.image(0, 0, 'guide').setOrigin(0, 0).setDepth(1).setVisible(false);
        
        this.add.text(this.GAME_WIDTH / 2, this.GAME_HEIGHT - 16, 'Press X to toggle mobile guide', { fontSize: '16px', fill: '#ffffff' }).setDepth(1).setOrigin(0.5);

        this.input.keyboard.on('keydown-X', () => {
            guide.visible = !guide.visible;
        });

        //  -----------------------------------
        //  -----------------------------------
        //  -----------------------------------
        //  Normal game stuff from here on down
        //  -----------------------------------
        //  -----------------------------------
        //  -----------------------------------

        this.physics.world.setBounds(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.platforms.create(320, 944, 'ground').setDisplaySize(640, 32).refreshBody();

        //  Now let's create some ledges
        this.platforms.create(750, 220, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(320, 520, 'ground').setScale(0.3, 1).refreshBody();;
        this.platforms.create(50, 650, 'ground');
        this.platforms.create(600, 780, 'ground');

        // The player and its settings
        this.player = this.physics.add.sprite(100, 800, 'dude');

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 50 }
        });

        this.stars.children.iterate(function (child) {

            //  Give each star a slightly different bounce
            child.setBounce(1, Phaser.Math.FloatBetween(0.4, 0.8));
            child.setCollideWorldBounds(true);
            child.setVelocity(Phaser.Math.Between(-200, 200), 20);
            child.setDragX(4);

        });

        this.bombs = this.physics.add.group();

        //  The score
        this.scoreText = this.add.text(32, 8, 'score: 0', { fontSize: '32px', fill: '#000' });

        //  Collide the player and the stars with the platforms
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    //  ------------------------
    //  ------------------------
    //  ------------------------
    //  Resize related functions
    //  ------------------------
    //  ------------------------
    //  ------------------------

    resize (gameSize)
    {
        const width = gameSize.width;
        const height = gameSize.height;

        this.parent.setSize(width, height);
        this.sizer.setSize(width, height);

        this.updateCamera();
    }

    updateCamera ()
    {
        const camera = this.cameras.main;

        const x = Math.ceil((this.parent.width - this.sizer.width) * 0.5);
        const y = 0;
        const scaleX = this.sizer.width / this.GAME_WIDTH;
        const scaleY = this.sizer.height / this.GAME_HEIGHT;

        camera.setViewport(x, y, this.sizer.width, this.sizer.height);
        camera.setZoom(Math.max(scaleX, scaleY));
        camera.centerOn(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2);

        this.backgroundScene.updateCamera();
    }

    getZoom ()
    {
        return this.cameras.main.zoom;
    }

    //  ------------------------
    //  ------------------------
    //  ------------------------
    //  Game related functions
    //  ------------------------
    //  ------------------------
    //  ------------------------

    update ()
    {
        if (this.gameOver)
        {
            return;
        }

        const cursors = this.cursors;
        const player = this.player;

        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }
    }

    collectStar (player, star)
    {
        star.disableBody(true, true);

        //  Add and update the score
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.stars.countActive(true) === 0)
        {
            //  A new batch of stars to collect
            this.stars.children.iterate(function (child)
            {
                child.enableBody(true, child.x, 0, true, true);
            });

            const halfX = this.GAME_WIDTH / 2;
            const x = (this.player.x < halfX) ? Phaser.Math.Between(halfX, this.GAME_WIDTH) : Phaser.Math.Between(0, halfX);

            const bomb = this.bombs.create(x, 16, 'bomb');

            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    hitBomb (player, bomb)
    {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        this.gameOver = true;
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-example',
        width: 640,
        height: 960,
        min: {
            width: 320,
            height: 480
        },
        max: {
            width: 1400,
            height: 1200
        }
    },
    scene: [ BackgroundScene, GameScene ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
