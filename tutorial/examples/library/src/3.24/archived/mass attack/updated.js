var MassAttack = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MassAttack (config)
    {
        Phaser.Scene.call(this, config)

        this.gameOptions = {
            maxDiameter: 1,
            ballGrowingSpeed: 0.015,
            balanceFriction: 400
        };

        this.growBall = false;
        this.canPlay = true;
        this.ball = null;
        this.balance = [];
    },

    preload: function ()
    {
        this.load.setPath('src/games/mass attack/');
        this.load.image('ball', 'ball.png');
        this.load.image('balance', 'balance.png');
    },

    create: function ()
    {
        for (var i = 0; i < 2; i++)
        {
            var group = this.add.group();

            group.weight = 0;
            group.saveYPosition = 0;

            var sprite = group.create(this.cache.game.config.width / 2 * i, 240, 'balance');

            sprite.setOrigin(0, 0.5);

            this.balance.push(group);
        }

        this.input.on('pointerdown', this.placeBall, this);
        this.input.on('pointerup', this.dropBall, this);
    },

    placeBall: function (pointer)
    {
        if (!this.growBall && this.canPlay)
        {
            var side = Math.floor(pointer.x / (this.cache.game.config.width / 2));

            this.ball = this.balance[side].create(pointer.x, 30, 'ball');
            this.ball.setScale(0.1);
            this.ball.balance = side;

            this.growBall = true;
        }
    },

    dropBall: function ()
    {
        if (this.growBall)
        {
            this.growBall = false;
            this.canPlay = false;

            var group = this.balance[this.ball.balance];

            var ballDestination = this.cache.game.config.height / 2 + group.saveYPosition - group.children.entries[0].height / 2 - this.ball.height * this.ball.scaleY / 2;

            this.balance[this.ball.balance].weight += (4 / 3) * Math.PI * Math.pow((this.ball.width * this.ball.scaleX / 2), 3);

            this.tweens.add({
                targets: this.ball,
                y: ballDestination,
                duration: 2000,
                ease: 'Bounce',
                onComplete: this.adjustBalances,
                onCompleteScope: this
            });
        }
    },

    adjustBalances: function ()
    {
        var weightDifference = (this.balance[0].weight - this.balance[1].weight) / this.gameOptions.balanceFriction;
        var maxDifference = this.cache.game.config.height / 3;

        if (weightDifference > maxDifference)
        {
            weightDifference = maxDifference;
        }

        if (weightDifference < -maxDifference)
        {
            weightDifference = -maxDifference;
        }

        for (var i = 0; i < 2; i++)
        {
            var difference = -this.balance[i].saveYPosition + weightDifference - (2 * i * weightDifference);

            this.balance[i].saveYPosition += difference;

            this.tweens.add({
                targets: this.balance[i].getChildren(),
                y: '+=' + difference.toString(),
                duration: 2000,
                ease: 'Quad',
                onComplete: function ()
                {
                    this.canPlay = true;
                },
                onCompleteScope: this
            });
        }
    },

    update: function ()
    {
        if (this.growBall && this.ball.scaleX < this.gameOptions.maxDiameter)
        {
            this.ball.setScale(this.ball.scaleX + this.gameOptions.ballGrowingSpeed);
        }
    }

});

var config = {
    type: Phaser.AUTO,
    width: 320,
    height: 480,
    backgroundColor: '#222222',
    parent: 'phaser-example',
    scene: MassAttack
};

var game = new Phaser.Game(config);
