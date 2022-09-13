var Flood = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Flood ()
    {
        Phaser.Scene.call(this, { key: 'flood' });

        this.allowClick = true;

        this.arrow;
        this.cursor;
        this.cursorTween;
        this.monsterTween;

        this.icon1 = { shadow: null, monster: null };
        this.icon2 = { shadow: null, monster: null };
        this.icon3 = { shadow: null, monster: null };
        this.icon4 = { shadow: null, monster: null };
        this.icon5 = { shadow: null, monster: null };
        this.icon6 = { shadow: null, monster: null };

        this.gridBG;

        this.instructions;
        this.text1;
        this.text2;
        this.text3;

        this.currentColor = '';

        this.emitters = {};

        this.grid = [];
        this.matched = [];

        this.moves = 25;

        this.frames = [ 'blue', 'green', 'grey', 'purple', 'red', 'yellow' ];
    },

    preload: function ()
    {
        this.load.bitmapFont('atari', 'assets/fonts/bitmap/atari-smooth.png', 'assets/fonts/bitmap/atari-smooth.xml');
        this.load.atlas('flood', 'assets/games/flood/blobs.png', 'assets/games/flood/blobs.json');
    },

    create: function ()
    {
        this.add.image(400, 300, 'flood', 'background');
        this.gridBG = this.add.image(400, 600 + 300, 'flood', 'grid');

        this.createIcon(this.icon1, 'grey', 16, 156);
        this.createIcon(this.icon2, 'red', 16, 312);
        this.createIcon(this.icon3, 'green', 16, 458);
        this.createIcon(this.icon4, 'yellow', 688, 156);
        this.createIcon(this.icon5, 'blue', 688, 312);
        this.createIcon(this.icon6, 'purple', 688, 458);

        this.cursor = this.add.image(16, 156, 'flood', 'cursor-over').setOrigin(0).setVisible(false);

        //  The game is played in a 14x14 grid with 6 different colors

        this.grid = [];

        for (var x = 0; x < 14; x++)
        {
            this.grid[x] = [];

            for (var y = 0; y < 14; y++)
            {
                var sx = 166 + (x * 36);
                var sy = 66 + (y * 36);
                var color = Phaser.Math.Between(0, 5);

                var block = this.add.image(sx, -600 + sy, 'flood', this.frames[color]);

                block.setData('oldColor', color);
                block.setData('color', color);
                block.setData('x', sx);
                block.setData('y', sy);

                this.grid[x][y] = block;
            }
        }

        //  Do a few floods just to make it a little easier starting off
        this.helpFlood();

        for (var i = 0; i < this.matched.length; i++)
        {
            var block = this.matched[i];

            block.setFrame(this.frames[block.getData('color')]);
        }

        this.currentColor = this.grid[0][0].getData('color');

        this.particles = this.add.particles('flood');

        for (var i = 0; i < this.frames.length; i++)
        {
            this.createEmitter(this.frames[i]);
        }

        this.createArrow();

        this.text1 = this.add.bitmapText(684, 30, 'atari', 'Moves', 20).setAlpha(0);
        this.text2 = this.add.bitmapText(694, 60, 'atari', '00', 40).setAlpha(0);
        this.text3 = this.add.bitmapText(180, 200, 'atari', 'So close!\n\nClick to\ntry again', 48).setAlpha(0);

        this.instructions = this.add.image(400, 300, 'flood', 'instructions').setAlpha(0);

        this.revealGrid();
    },

    helpFlood: function ()
    {
        for (var i = 0; i < 8; i++)
        {
            var x = Phaser.Math.Between(0, 13);
            var y = Phaser.Math.Between(0, 13);

            var oldColor = this.grid[x][y].getData('color');
            var newColor = oldColor + 1;

            if (newColor === 6)
            {
                newColor = 0;
            }

            this.floodFill(oldColor, newColor, x, y)
        }
    },

    createArrow: function ()
    {
        this.arrow = this.add.image(109 - 24, 48, 'flood', 'arrow-white').setOrigin(0).setAlpha(0);

        this.tweens.add({

            targets: this.arrow,
            x: '+=24',
            ease: 'Sine.easeInOut',
            duration: 900,
            yoyo: true,
            repeat: -1

        });
    },

    createIcon: function (icon, color, x, y)
    {
        var sx = (x < 400) ? -200 : 1000;

        icon.monster = this.add.image(sx, y, 'flood', 'icon-' + color).setOrigin(0);

        var shadow = this.add.image(sx, y, 'flood', 'shadow');

        shadow.setData('color', this.frames.indexOf(color));

        shadow.setData('x', x);

        shadow.setData('monster', icon.monster);

        shadow.setOrigin(0);

        shadow.setInteractive();

        icon.shadow = shadow;
    },

    revealGrid: function ()
    {
        this.tweens.add({
            targets: this.gridBG,
            y: 300,
            ease: 'Power3'
        });

        var i = 800;

        for (var y = 13; y >= 0; y--)
        {
            for (var x = 0; x < 14; x++)
            {
                var block = this.grid[x][y];

                this.tweens.add({

                    targets: block,

                    y: block.getData('y'),

                    ease: 'Power3',
                    duration: 800,
                    delay: i

                });

                i += 20;
            }
        }

        i -= 1000;

        //  Icons
        this.tweens.add({
            targets: [ this.icon1.shadow, this.icon1.monster ],
            x: this.icon1.shadow.getData('x'),
            ease: 'Power3',
            delay: i
        });

        this.tweens.add({
            targets: [ this.icon4.shadow, this.icon4.monster ],
            x: this.icon4.shadow.getData('x'),
            ease: 'Power3',
            delay: i
        });

        i += 200;

        this.tweens.add({
            targets: [ this.icon2.shadow, this.icon2.monster ],
            x: this.icon2.shadow.getData('x'),
            ease: 'Power3',
            delay: i
        });

        this.tweens.add({
            targets: [ this.icon5.shadow, this.icon5.monster ],
            x: this.icon5.shadow.getData('x'),
            ease: 'Power3',
            delay: i
        });

        i += 200;

        this.tweens.add({
            targets: [ this.icon3.shadow, this.icon3.monster ],
            x: this.icon3.shadow.getData('x'),
            ease: 'Power3',
            delay: i
        });

        this.tweens.add({
            targets: [ this.icon6.shadow, this.icon6.monster ],
            x: this.icon6.shadow.getData('x'),
            ease: 'Power3',
            delay: i
        });

        //  Text

        this.tweens.add({
            targets: [ this.text1, this.text2 ],
            alpha: 1,
            ease: 'Power3',
            delay: i
        });

        i += 500;

        var movesTween = this.tweens.addCounter({
            from: 0,
            to: 25,
            ease: 'Power1',
            onUpdate: function (tween, targets, text)
            {
                text.setText(Phaser.Utils.String.Pad(tween.getValue().toFixed(), 2, '0', 1));
            },
            onUpdateParams: [ this.text2 ],
            delay: i
        });

        i += 500;

        this.tweens.add({
            targets: [ this.instructions, this.arrow ],
            alpha: 1,
            ease: 'Power3',
            delay: i
        });

        this.time.delayedCall(i, this.startInputEvents, [], this);
    },

    startInputEvents: function ()
    {
        this.input.on('gameobjectover', this.onIconOver, this);
        this.input.on('gameobjectout', this.onIconOut, this);
        this.input.on('gameobjectdown', this.onIconDown, this);

        //  Cheat mode :)

        this.input.keyboard.on('keydown-M', function () {

            this.moves++;
            this.text2.setText(Phaser.Utils.String.Pad(this.moves, 2, '0', 1));

        }, this);

        this.input.keyboard.on('keydown-X', function () {

            this.moves--;
            this.text2.setText(Phaser.Utils.String.Pad(this.moves, 2, '0', 1));

        }, this);
    },

    stopInputEvents: function ()
    {
        this.input.off('gameobjectover', this.onIconOver);
        this.input.off('gameobjectout', this.onIconOut);
        this.input.off('gameobjectdown', this.onIconDown);
    },

    onIconOver: function (pointer, gameObject)
    {
        var icon = gameObject;

        var newColor = icon.getData('color');

        //  Valid color?
        if (newColor !== this.currentColor)
        {
            this.cursor.setFrame('cursor-over');
        }
        else
        {
            this.cursor.setFrame('cursor-invalid');
        }

        this.cursor.setPosition(icon.x + 48, icon.y + 48);

        if (this.cursorTween)
        {
            this.cursorTween.stop();
        }

        this.cursor.setAlpha(1);
        this.cursor.setVisible(true);

        //  Change arrow color
        this.arrow.setFrame('arrow-' + this.frames[newColor]);

        //  Jiggle the monster :)
        var monster = icon.getData('monster');

        this.children.bringToTop(monster);

        this.monsterTween = this.tweens.add({
            targets: monster,
            y: '-=24',
            yoyo: true,
            repeat: -1,
            duration: 300,
            ease: 'Power2'
        });
    },

    onIconOut: function (pointer, gameObject)
    {
        // console.log(this.monsterTween.targets[0].y);

        this.monsterTween.stop(0);
		
		gameObject.getData('monster').setY(gameObject.y);

        // console.log(this.monsterTween.targets[0].y);

        this.cursorTween = this.tweens.add({
            targets: this.cursor,
            alpha: 0,
            duration: 300
        });

        this.arrow.setFrame('arrow-white');
    },

    onIconDown: function (pointer, gameObject)
    {
        if (!this.allowClick)
        {
            return;
        }

        var icon = gameObject;

        var newColor = icon.getData('color');

        //  Valid color?
        if (newColor === this.currentColor)
        {
            return;
        }

        var oldColor = this.grid[0][0].getData('color');

        // console.log('starting flood from', oldColor, this.frames[oldColor], 'to', newColor, this.frames[newColor]);

        if (oldColor !== newColor)
        {
            this.currentColor = newColor;

            this.matched = [];

            if (this.monsterTween)
            {
                this.monsterTween.stop(0);
            }

            this.cursor.setVisible(false);
            this.instructions.setVisible(false);

            this.moves--;

            this.text2.setText(Phaser.Utils.String.Pad(this.moves, 2, '0', 1));

            this.floodFill(oldColor, newColor, 0, 0);

            if (this.matched.length > 0)
            {
                this.startFlow();
            }
        }
    },

    createEmitter: function (color)
    {
        this.emitters[color] = this.particles.createEmitter({
            frame: color,
            lifespan: 1000,
            speed: { min: 300, max: 400 },
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 0 },
            rotate: { start: 0, end: 360, ease: 'Power2' },
            blendMode: 'ADD',
            on: false
        });
    },

    startFlow: function ()
    {
        this.matched.sort(function (a, b) {

            var aDistance = Phaser.Math.Distance.Between(a.x, a.y, 166, 66);
            var bDistance = Phaser.Math.Distance.Between(b.x, b.y, 166, 66);

            return aDistance - bDistance;

        });

        //  Swap the sprites

        var t = 0;
        var inc = (this.matched.length > 98) ? 6 : 12;

        this.allowClick = false;

        for (var i = 0; i < this.matched.length; i++)
        {
            var block = this.matched[i];

            var blockColor = this.frames[block.getData('color')];
            var oldBlockColor = this.frames[block.getData('oldColor')];

            var emitter = this.emitters[oldBlockColor];

            this.time.delayedCall(t, function (block, blockColor) {

                block.setFrame(blockColor);

                emitter.explode(6, block.x, block.y);
                
            }, [ block, blockColor, emitter ]);

            t += inc;
        }

        this.time.delayedCall(t, function () {

            this.allowClick = true;

            if (this.checkWon())
            {
                this.gameWon();
            }
            else if (this.moves === 0)
            {
                this.gameLost();
            }

        }, [], this);
    },

    checkWon: function ()
    {
        var topLeft = this.grid[0][0].getData('color');

        for (var x = 0; x < 14; x++)
        {
            for (var y = 0; y < 14; y++)
            {
                if (this.grid[x][y].getData('color') !== topLeft)
                {
                    return false;
                }
            }
        }

        return true;
    },

    clearGrid: function ()
    {
        //  Hide everything :)

        this.tweens.add({
            targets: [
                this.icon1.monster, this.icon1.shadow,
                this.icon2.monster, this.icon2.shadow,
                this.icon3.monster, this.icon3.shadow,
                this.icon4.monster, this.icon4.shadow,
                this.icon5.monster, this.icon5.shadow,
                this.icon6.monster, this.icon6.shadow,
                this.arrow,
                this.cursor
            ],
            alpha: 0,
            duration: 500,
            delay: 500
        });

        var i = 500;

        for (var y = 13; y >= 0; y--)
        {
            for (var x = 0; x < 14; x++)
            {
                var block = this.grid[x][y];

                this.tweens.add({

                    targets: block,

                    scaleX: 0,
                    scaleY: 0,

                    ease: 'Power3',
                    duration: 800,
                    delay: i

                });

                i += 10;
            }
        }

        return i;
    },

    gameLost: function ()
    {
        this.stopInputEvents();

        this.text1.setText("Lost!");
        this.text2.setText(':(');

        var i = this.clearGrid();

        this.text3.setAlpha(0);
        this.text3.setVisible(true);

        this.tweens.add({
            targets: this.text3,
            alpha: 1,
            duration: 1000,
            delay: i
        });

        this.input.once('pointerdown', this.resetGame, this);
    },

    resetGame: function ()
    {
        this.text1.setText("Moves");
        this.text2.setText("00");
        this.text3.setVisible(false);

        //  Show everything :)

        this.arrow.setFrame('arrow-white');

        this.tweens.add({
            targets: [
                this.icon1.monster, this.icon1.shadow,
                this.icon2.monster, this.icon2.shadow,
                this.icon3.monster, this.icon3.shadow,
                this.icon4.monster, this.icon4.shadow,
                this.icon5.monster, this.icon5.shadow,
                this.icon6.monster, this.icon6.shadow,
                this.arrow,
                this.cursor
            ],
            alpha: 1,
            duration: 500,
            delay: 500
        });

        var i = 500;

        for (var y = 13; y >= 0; y--)
        {
            for (var x = 0; x < 14; x++)
            {
                var block = this.grid[x][y];

                //  Set a new color
                var color = Phaser.Math.Between(0, 5);

                block.setFrame(this.frames[color]);

                block.setData('oldColor', color);
                block.setData('color', color);

                this.tweens.add({

                    targets: block,

                    scaleX: 1,
                    scaleY: 1,

                    ease: 'Power3',
                    duration: 800,
                    delay: i

                });

                i += 10;
            }
        }

        //  Do a few floods just to make it a little easier starting off
        this.helpFlood();

        for (var i = 0; i < this.matched.length; i++)
        {
            var block = this.matched[i];

            block.setFrame(this.frames[block.getData('color')]);
        }

        this.currentColor = this.grid[0][0].getData('color');

        var movesTween = this.tweens.addCounter({
            from: 0,
            to: 25,
            ease: 'Power1',
            onUpdate: function (tween, targets, text)
            {
                text.setText(Phaser.Utils.String.Pad(tween.getValue().toFixed(), 2, '0', 1));
            },
            onUpdateParams: [ this.text2 ],
            delay: i
        });

        this.moves = 25;

        this.time.delayedCall(i, this.startInputEvents, [], this);
    },

    gameWon: function ()
    {
        this.stopInputEvents();

        this.text1.setText("Won!!");
        this.text2.setText(':)');

        var i = this.clearGrid();

        //  Put the winning monster in the middle

        var monster = this.add.image(400, 300, 'flood', 'icon-' + this.frames[this.currentColor]);

        monster.setScale(0);

        this.tweens.add({
            targets: monster,
            scaleX: 4,
            scaleY: 4,
            angle: 360 * 4,
            duration: 1000,
            delay: i
        });

        this.time.delayedCall(2000, this.boom, [], this);
    },

    boom: function ()
    {
        var color = Phaser.Math.RND.pick(this.frames);

        this.emitters[color].explode(8, Phaser.Math.Between(128, 672), Phaser.Math.Between(28, 572))

        color = Phaser.Math.RND.pick(this.frames);

        this.emitters[color].explode(8, Phaser.Math.Between(128, 672), Phaser.Math.Between(28, 572))

        this.time.delayedCall(100, this.boom, [], this);
    },

    floodFill: function (oldColor, newColor, x, y)
    {
        if (oldColor === newColor || this.grid[x][y].getData('color') !== oldColor)
        {
            return;
        }

        this.grid[x][y].setData('oldColor', oldColor);
        this.grid[x][y].setData('color', newColor);

        if (this.matched.indexOf(this.grid[x][y]) === -1)
        {
            this.matched.push(this.grid[x][y]);
        }

        if (x > 0)
        {
            this.floodFill(oldColor, newColor, x - 1, y);
        }

        if (x < 13)
        {
            this.floodFill(oldColor, newColor, x + 1, y);
        }

        if (y > 0)
        {
            this.floodFill(oldColor, newColor, x, y - 1);
        }

        if (y < 13)
        {
            this.floodFill(oldColor, newColor, x, y + 1);
        }
    }

});

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    pixelArt: true,
    parent: 'phaser-example',
    scene: [ Flood ]
};

var game = new Phaser.Game(config);
