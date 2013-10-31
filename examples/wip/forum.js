var mainMenu = {

    preload: function () {

        // game.load.image('bg', 'assets/bg.png');
        // game.load.image('mainstart', 'assets/mainstart.png');
        game.load.image('bg', 'assets/pics/louie-inga.png');
        game.load.image('mainstart', 'assets/pics/contra2.png');

    },

    create: function () {

        game.add.sprite(0, 0, 'bg');

        var mainstart = game.add.sprite(0, 0, 'mainstart');
        mainstart.name = "mainstart";
        mainstart.inputEnabled = true;
        mainstart.events.onInputDown.add(this.listener, this);

    },

    listener: function () 
    {
        game.state.start('levelMenu', true, true);
    }    

}

var levelSelect = {

    preload: function () {
    },

    create: function () {

        game.add.sprite(0, 0, 'bg');

    }

}

var game = new Phaser.Game(640, 480);

game.state.add('menu', mainMenu, true);
game.state.add('levelMenu', levelSelect);

