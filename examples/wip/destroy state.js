var BasicGame = {};

BasicGame.Boot = function (game) {
};

BasicGame.Boot.prototype = {

    preload: function () {

        this.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);

    },

    create: function () {

        this.state.start('MainMenu');

    }

};

BasicGame.MainMenu = function (game) {

    this.mummy;
    this.anim;

};

BasicGame.MainMenu.prototype = {

    create: function () {

        this.stage.backgroundColor = 0x2d2d2d;

        this.mummy = this.add.sprite(200, 400, 'mummy');

        this.anim = this.mummy.animations.add('walk');

        this.anim.play(10, false);

        this.mummy.events.onAnimationComplete.add(this.changeIt, this);

    },

    changeIt: function () {

        this.state.start('GameOver');

    }

};

BasicGame.GameOver = function (game) {

    this.dude;

};

BasicGame.GameOver.prototype = {

    create: function () {

        this.stage.backgroundColor = 0xff7744;

        this.dude = this.add.sprite(300, 300, 'mummy');

    }

};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example');

game.state.add('Boot', BasicGame.Boot);
game.state.add('MainMenu', BasicGame.MainMenu);
game.state.add('GameOver', BasicGame.GameOver);

game.state.start('Boot');
