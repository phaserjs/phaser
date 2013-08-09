/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/ui/Button.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update);

    function preload() {
        game.load.image('beast', 'assets/pics/shadow_of_the_beast2_other_world.png');
        game.load.atlas('button', 'assets/buttons/button_texture_atlas.png', 'assets/buttons/button_texture_atlas.json');
    }

    image:
    Phaser.Sprite;
    button:
    Phaser.UI.Button;

    function create() {
        //  This is just an image that we'll toggle the display of when you click the button
        this.image = game.add.sprite(game.stage.centerX, 0, 'beast');
        this.image.transform.origin.setTo(0.5, 0);

        //  This button is created from a texture atlas.
        //  Instead of frame IDs (like with a sprite sheet) we can tell it to use frame names instead.
        //  In this case our atlast frame names were called 'over', 'out' and 'down', but they could be anything you want.
        //  The function "clickedIt" will be called when the button is clicked or touched
        this.button = game.add.button(game.stage.centerX, 400, 'button', clickedIt, this, 'over', 'out', 'down');

        //  Makes the button origin set to the middle
        this.button.transform.origin.setTo(0.5, 0.5);
    }

    function update() {
        //  Rotate the button each frame, the button states will still work and respond.
        this.button.rotation += 1;
    }

    function clickedIt() {
        if (this.image.visible == true) {
            this.image.visible = false;
        } else {
            this.image.visible = true;
        }
    }
})();
