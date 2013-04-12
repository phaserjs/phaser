var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../Kiwi Lite/Game.ts" />
/// <reference path="../../../Kiwi Lite/State.ts" />
var FakeGame = (function (_super) {
    __extends(FakeGame, _super);
    function FakeGame(game) {
        _super.call(this, game);
    }
    FakeGame.prototype.init = function () {
        this.loader.addImageFile('track', '../../assets/games/f1/track.png');
        this.loader.addImageFile('car', '../../assets/games/f1/car1.png');
        this.loader.load();
    };
    FakeGame.prototype.create = function () {
        this.camera.setBounds(0, 0, this.stage.width, this.stage.height);
        this.createSprite(0, 0, 'track');
        this.car = this.game.createSprite(180, 298, 'car');
        this.car.rotation = 180;
        this.car.maxVelocity.setTo(150, 150);
        this.bigCam = this.createCamera(640, 0, 100, 200);
        this.bigCam.follow(this.car, Camera.STYLE_LOCKON);
        this.bigCam.setBounds(0, 0, this.stage.width, this.stage.height);
        this.bigCam.showBorder = true;
        this.bigCam.borderColor = 'rgb(0,0,0)';
        this.bigCam.scale.setTo(2, 2);
    };
    FakeGame.prototype.update = function () {
        if(this.input.keyboard.isDown(Keyboard.LEFT)) {
            this.car.rotation -= 4;
        } else if(this.input.keyboard.isDown(Keyboard.RIGHT)) {
            this.car.rotation += 4;
        }
        if(this.game.input.keyboard.isDown(Keyboard.UP)) {
            this.car.velocity.copyFrom(this.math.velocityFromAngle(this.car.angle, 150));
        } else {
            this.car.velocity.copyFrom(this.math.velocityFromAngle(this.car.angle, 60));
        }
    };
    return FakeGame;
})(State);
