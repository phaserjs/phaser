//  Needless to say, RICK AND MORTY is a trademark of Cartoon Network, Inc.,

class Controller extends Phaser.Scene {

    constructor ()
    {
        super('Controller');
    }

    preload ()
    {
        this.load.image('bg', 'assets/pics/purple-dots.png');
    }

    create ()
    {
        this.add.image(400, 300, 'bg');

        //  This will bring the Logo Scene to the top of the Scene List
        this.scene.bringToTop('Logo');
    }

}

class Rick extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'Rick', active: true });
    }

    preload ()
    {
        this.load.image('rick', 'assets/pics/guard-rick.png');
    }

    create ()
    {
        this.add.image(750, 600, 'rick').setOrigin(1);
    }
}

class Morty extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'Morty', active: true });
    }

    preload ()
    {
        this.load.image('morty', 'assets/pics/morty.png');
    }

    create ()
    {
        this.add.image(250, 300, 'morty');
    }
}

class Logo extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'Logo', active: true });
    }

    preload ()
    {
        this.load.image('logo', 'assets/pics/rick-and-morty-logo.png');
    }

    create ()
    {
        this.add.image(400, 450, 'logo');
    }
}

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Controller, Logo, Morty, Rick ]
};

let game = new Phaser.Game(config);
