
    GameState = function (game) {
        this.game = game;
    };

    GameState.prototype = Object.create(Phaser.State.prototype);
    GameState.prototype.constructor = GameState;

    GameState.prototype.preload = function preload() {
        this.game.load.image('bunny', 'assets/sprites/bunny.png');
        this.game.load.image('carrot', 'assets/sprites/carrot.png');
        this.game.load.image('melon', 'assets/sprites/melon.png');
    }

    GameState.prototype.create = function () {
        this.game.world.setBounds(0, 0, 1600, 600);

        this.bunny = this.game.add.sprite(200, 200, 'bunny');
        this.bunny.scale.setTo(0.2, 0.2);

        var melon = this.game.add.sprite(0, 0, 'melon');
        this.melonGroup = this.game.add.group(null, 'melonGroup');
        this.melonGroup.add(melon);
        melon.x = this.bunny.x;
        melon.y = this.bunny.y - 40;

        this.carrot = this.game.add.sprite(0, 0, 'carrot');

        this.game.camera.follow(this.bunny);
    }

    GameState.prototype.update = function () {
        this.bunny.body.velocity.x = 0;
        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.bunny.body.velocity.x = 500;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.bunny.body.velocity.x = -500;
        }

        var melon = this.melonGroup.getFirstExists(true);
        melon.x = this.bunny.x;
        melon.y = this.bunny.y - 40;

        this.carrot.x = this.bunny.x;
        this.carrot.y = this.bunny.y - 20;

    };

    (function () {
        var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example');
        game.state.add('state', GameState, true);
    })();
