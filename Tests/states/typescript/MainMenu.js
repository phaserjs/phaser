var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../Kiwi Lite/Game.ts" />
/// <reference path="../../../Kiwi Lite/State.ts" />
/// <reference path="FakeGame.ts" />
var MainMenu = (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu(game) {
        _super.call(this, game);
        this.isFalling = false;
        this.hasClicked = false;
    }
    MainMenu.prototype.init = function () {
        this.loader.addImageFile('car', '../../assets/pics/supercars_parsec.png');
        this.loader.addSpriteSheet('monster', '../../assets/sprites/metalslug_monster39x40.png', 39, 40);
        this.loader.load();
    };
    MainMenu.prototype.create = function () {
        this.camera.backgroundColor = 'rgb(85,85,85)';
        this.createSprite(80, 150, 'car');
        this.monster = this.game.createSprite(80, 60, 'monster');
        this.monster.animations.add('walk');
        this.monster.animations.play('walk', 30, true);
        this.monster.velocity.x = 50;
    };
    MainMenu.prototype.update = function () {
        if(this.monster.x >= 710 && this.isFalling == false) {
            this.isFalling = true;
            this.monster.velocity.x = 20;
            this.monster.acceleration.y = 200;
            this.monster.angularAcceleration = 100;
            this.monster.animations.stop('walk');
        }
        if(this.input.mouse.isDown && this.hasClicked == false) {
            this.hasClicked = true;
            this.game.switchState(FakeGame);
        }
    };
    MainMenu.prototype.render = function () {
        this.stage.context.fillStyle = 'rgb(0,0,0)';
        this.stage.context.font = 'bold 48px Arial';
        this.stage.context.textAlign = 'center';
        this.stage.context.fillText('Super Racer', this.stage.centerX, 60);
        this.stage.context.font = 'bold 22px Arial';
        this.stage.context.textAlign = 'center';
        this.stage.context.fillText('Click to "Play"', this.stage.centerX, 370);
    };
    return MainMenu;
})(State);
