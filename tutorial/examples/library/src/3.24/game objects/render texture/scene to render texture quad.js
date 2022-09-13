var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'gameScene', active: true });

        this.player = null;
        this.cursors = null;
        this.score = 0;
        this.scoreText = null;
    },

    preload: function ()
    {
        this.load.image('sky', 'src/games/firstgame/assets/sky.png');
        this.load.image('ground', 'src/games/firstgame/assets/platform.png');
        this.load.image('star', 'src/games/firstgame/assets/star.png');
        this.load.image('bomb', 'src/games/firstgame/assets/bomb.png');
        this.load.spritesheet('dude', 'src/games/firstgame/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    },

    create: function ()
    {
        this.add.image(400, 300, 'sky');

        var platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        var player = this.physics.add.sprite(100, 450, 'dude');

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

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

        this.cursors = this.input.keyboard.createCursorKeys();

        var stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);

        this.physics.add.overlap(player, stars, this.collectStar, null, this);

        this.player = player;

        //  Start the RT Scene
        this.scene.launch('renderScene');
    },

    update: function ()
    {
        var cursors = this.cursors;
        var player = this.player;

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
    },

    collectStar: function (player, star)
    {
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

});

var RenderScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function RenderScene ()
    {
        Phaser.Scene.call(this, { key: 'renderScene', active: false });

        this.rt;

        this.quad = {
            topLeftX: -300, topLeftY: -300,
            topRightX: 300, topRightY: -300,
            bottomLeftX: -300, bottomLeftY: 300,
            bottomRightX: 300, bottomRightY: 300
        };

        this.mesh;
    },

    create: function ()
    {
        //  Hide the Game Scene so it doesn't render (as we don't need it rendering twice)
        this.scene.setVisible(false, 'gameScene');

        this.rt = this.make.renderTexture({ x: 0, y: 0, width: 800, height: 600 }, false);

        this.rt.saveTexture('game');

        var quad = this.quad;

        this.mesh = this.make.mesh({
            key: 'game',
            x: 400,
            y: 300,
            vertices: [
                quad.topLeftX, quad.topLeftY,
                quad.bottomLeftX, quad.bottomLeftY,
                quad.bottomRightX, quad.bottomRightY,
                quad.topLeftX, quad.topLeftY,
                quad.bottomRightX, quad.bottomRightY,
                quad.topRightX, quad.topRightY
            ],
            uv: [ 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0 ]
        });

        this.tweenQuad();
    },

    update: function (time, delta)
    {
        var gameScene = this.scene.get('gameScene');

        this.rt.clear();

        this.rt.draw(gameScene.children, 0, 0);

        var quad = this.quad;
        var mesh = this.mesh;

        var verts = mesh.vertices;

        verts[0] = quad.topLeftX;
        verts[1] = quad.topLeftY;
        verts[6] = quad.topLeftX;
        verts[7] = quad.topLeftY;

        verts[10] = quad.topRightX;
        verts[11] = quad.topRightY;

        verts[2] = quad.bottomLeftX;
        verts[3] = quad.bottomLeftY;

        verts[4] = quad.bottomRightX;
        verts[5] = quad.bottomRightY;
        verts[8] = quad.bottomRightX;
        verts[9] = quad.bottomRightY;
    },

    tweenQuad: function ()
    {
        //  Randomise the coords a little

        var tlX = -260 + Phaser.Math.Between(-130, 130);
        var tlY = -260 + Phaser.Math.Between(-130, 130);

        var trX = 260 + Phaser.Math.Between(-130, 130);
        var trY = -260 + Phaser.Math.Between(-130, 130);

        var blX = -260 + Phaser.Math.Between(-130, 130);
        var blY = 260 + Phaser.Math.Between(-130, 130);

        var brX = 260 + Phaser.Math.Between(-130, 130);
        var brY = 260 + Phaser.Math.Between(-130, 130);

        var quad = this.quad;
        var mesh = this.mesh;

        this.tweens.add({

            targets: quad,
            duration: 1500,

            topLeftX: tlX,
            topLeftY: tlY,

            topRightX: trX,
            topRightY: trY,

            bottomLeftX: blX,
            bottomLeftY: blY,

            bottomRightX: brX,
            bottomRightY: brY,

            ease: 'Sine.easeInOut',

            onComplete: this.tweenQuad,
            onCompleteScope: this

        });
    }

});

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [ GameScene, RenderScene ]
};

var game = new Phaser.Game(config);
