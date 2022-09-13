var game;
var _this;

var gameOptions = {
    maxDiameter: 1,
    ballGrowingSpeed: 0.015,
    balanceFriction: 400
}

var config = {
    type: Phaser.CANVAS,
    width: 320,
    height: 480
};

window.onload = function(){
    game = new Phaser.Game(config);
    game.scene.add("PlayGame", playGame, true);
}

var playGame = function (){
    _this = this;
};

playGame.prototype = {
    preload: function (){
        var camera = _this.cameras.add(0, 0, game.width, game.height);
        camera.setBackgroundColor("0x222222");
        _this.load.image("ball", "src/games/mass%20attack/ball.png");
        _this.load.image("balance", "src/games/mass%20attack/balance.png");
    },
    create: function (){
        _this.growBall = false;
        _this.canPlay = true;
        _this.balance = [];
        for(var i = 0; i < 2; i++){
            _this.balance[i] = _this.add.group();
            _this.balance[i].weight = 0;
            _this.balance[i].saveYPosition = 0;
            var balanceSprite = _this.add.sprite(config.width / 2 * i, 240, "balance");
            balanceSprite.setOrigin(0, 0.5);
            _this.balance[i].add(balanceSprite);
        }
        _this.input.on("pointerdown", _this.placeBall);
        _this.input.on("pointerup", _this.dropBall);
    },
    placeBall: function(pointer){
        if(!_this.growBall && _this.canPlay){
            var side = Math.floor(pointer.x / (config.width / 2));
            _this.ball = _this.add.sprite(pointer.x, 30, "ball");
            _this.ball.balance = side;
            _this.ball.scaleX = 0.1;
            _this.ball.scaleY = 0.1;
            _this.balance[_this.ball.balance].add(_this.ball);
            _this.growBall = true;
        }
    },
    dropBall: function(){
        if(_this.growBall){
            _this.growBall = false;
            _this.canPlay = false;
            var ballDestination =  config.height / 2 + _this.balance[_this.ball.balance].saveYPosition - _this.balance[_this.ball.balance].children.entries[0].height / 2 - _this.ball.height * _this.ball.scaleY / 2;
            _this.balance[_this.ball.balance].weight += (4 / 3) * Math.PI * Math.pow((_this.ball.width * _this.ball.scaleX / 2), 3);
            var ballTween = _this.tweens.add({
                targets: _this.ball,
                y: ballDestination,
                duration: 2000,
                ease: "Bounce",
                onComplete: _this.adjustBalances
            });
        }
    },
    adjustBalances: function(){
        var weightDifference = (_this.balance[0].weight - _this.balance[1].weight) / gameOptions.balanceFriction;
        var maxDifference = config.height / 3;
        if(weightDifference > maxDifference){
            weightDifference = maxDifference;
        }
        if(weightDifference < -maxDifference){
            weightDifference = -maxDifference;
        }
        for(var i = 0; i < 2; i++){
            var difference = - _this.balance[i].saveYPosition + weightDifference - (2 * i * weightDifference)
            _this.balance[i].saveYPosition += difference;
            var balanceTween = _this.tweens.add({
                targets: _this.balance[i].children.entries,
                y: "+=" + difference.toString(),
                duration: 2000,
                ease: "Quad",
                onComplete: function(){
                    _this.canPlay = true;
                }
            })
        }
    },
    update: function(){
        if(_this.growBall && _this.ball.scaleX < gameOptions.maxDiameter){
            _this.ball.scaleX += gameOptions.ballGrowingSpeed;
            _this.ball.scaleY += gameOptions.ballGrowingSpeed;
        }
    }
}