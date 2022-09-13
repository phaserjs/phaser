var WorldMap = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function WorldMap ()
    {
        Phaser.Scene.call(this, { key: 'world' });

        this.bg;
        this.player;
        this.cursors;

        this.currentlyOver = false;
    },

    create: function ()
    {
        this.bg = this.add.tileSprite(0, 0, 800, 600, 'bg').setOrigin(0).setScrollFactor(0);

        //  Some planets to fly into
        var planet1 = this.physics.add.image(100, 100, 'space', 'blue-planet').setScale(0.15).setSize(360, 360).setOffset(400, 400);
        var planet2 = this.physics.add.image(600, 0, 'space', 'brown-planet').setScale(0.2).setSize(360, 360).setOffset(400, 500);
        var planet3 = this.physics.add.image(300, 700, 'space', 'gas-giant').setScale(0.2).setSize(360, 360).setOffset(450, 500);
        var planet4 = this.physics.add.image(1200, 500, 'space', 'purple-planet').setScale(0.3).setSize(360, 360).setOffset(400, 400);

        this.player = this.physics.add.image(400, 300, 'ship');

        this.player.setDamping(true);
        this.player.setDrag(0.99);
        this.player.setAngularDrag(400);

        this.physics.add.overlap(this.player, [ planet1, planet2, planet3, planet4 ], this.playerHitPlanet, null, this);

        this.cameras.main.startFollow(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.add.text(10, 10, 'Cursors to move. Fly into the planets.', { font: '16px Courier', fill: '#00ff00' }).setScrollFactor(0);
    },

    playerHitPlanet: function (player, planet)
    {
        if (this.currentlyOver !== planet)
        {
            this.currentlyOver = planet;

            this.registry.set('planet', planet.frame.name);

            this.scene.switch('subgame');
        }
    },

    update: function ()
    {
        var cursors = this.cursors;
        var sprite = this.player;

        if (cursors.up.isDown)
        {
            this.physics.velocityFromRotation(sprite.rotation, 600, sprite.body.acceleration);
        }
        else
        {
            sprite.setAcceleration(0);
        }

        if (cursors.left.isDown)
        {
            sprite.setAngularVelocity(-300);
        }
        else if (cursors.right.isDown)
        {
            sprite.setAngularVelocity(300);
        }
        else
        {
            sprite.setAngularVelocity(0);
        }

        this.bg.tilePositionX += sprite.body.deltaX() * 0.5;
        this.bg.tilePositionY += sprite.body.deltaY() * 0.5;
    }

});
