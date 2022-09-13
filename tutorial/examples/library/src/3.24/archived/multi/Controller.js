class Controller extends Phaser.Scene {

    constructor ()
    {
        super('controller');

        //  Games
        this.invaders;

        //  Keys
        this.left;
        this.right;
    }

    create ()
    {
        //  Get game Scenes
        // this.invaders = this.scene.get('invaders');

        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.scene.launch('invaders', { x: 0, y: 0 });
        this.scene.launch('asteroids', { x: 400, y: 0 });
    }

}
