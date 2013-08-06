/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/ui/Button.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        game.load.image('beast', 'assets/pics/shadow_of_the_beast2_karamoon.png');
        game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
        game.load.start();

    }

    image: Phaser.Sprite;
    button: Phaser.UI.Button;

    function create() {

        //  This is just an image that we'll toggle the display of when you click the button
        this.image = game.add.sprite(game.stage.centerX, 0, 'beast');
        this.image.transform.origin.setTo(0.5, 0);

        //  This button is created from a sprite sheet.
        //  Frame 0 = the 'down' state
        //  Frame 1 = the 'out' state
        //  Frame 2 = the 'over' state
        //  The function "clickedIt" will be called when the button is clicked or touched
        this.button = game.add.button(game.stage.centerX, 400, 'button', clickedIt, this, 2, 1, 0);

        //  Just makes the button origin set to the middle, we only do this to center the button on-screen, no other reason
        this.button.transform.origin.setTo(0.5, 0.5);

    }

    function clickedIt() {

        if (this.image.visible == true)
        {
            this.image.visible = false;
        }
        else
        {
            this.image.visible = true;
        }

    }

})();
