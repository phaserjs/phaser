class InputPanel extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'InputPanel', active: false });

        this.chars = [
            [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],
            [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ],
            [ 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>' ]
        ];

        this.cursor = new Phaser.Math.Vector2();

        this.text;
        this.block;

        this.name = '';
        this.charLimit = 3;
    }

    create ()
    {
        let text = this.add.bitmapText(130, 50, 'arcade', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-');

        text.setLetterSpacing(20);
        text.setInteractive();

        this.add.image(text.x + 430, text.y + 148, 'rub');
        this.add.image(text.x + 482, text.y + 148, 'end');

        this.block = this.add.image(text.x - 10, text.y - 2, 'block').setOrigin(0);

        this.text = text;

        this.input.keyboard.on('keyup_LEFT', this.moveLeft, this);
        this.input.keyboard.on('keyup_RIGHT', this.moveRight, this);
        this.input.keyboard.on('keyup_UP', this.moveUp, this);
        this.input.keyboard.on('keyup_DOWN', this.moveDown, this);
        this.input.keyboard.on('keyup_ENTER', this.pressKey, this);
        this.input.keyboard.on('keyup_SPACE', this.pressKey, this);
        this.input.keyboard.on('keyup', this.anyKey, this);

        text.on('pointermove', this.moveBlock, this);
        text.on('pointerup', this.pressKey, this);

        this.tweens.add({
            targets: this.block,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            duration: 350
        });
    }

    moveBlock (pointer, x, y)
    {
        let cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
        let cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
        let char = this.chars[cy][cx];

        this.cursor.set(cx, cy);

        this.block.x = this.text.x - 10 + (cx * 52);
        this.block.y = this.text.y - 2 + (cy * 64);
    }

    moveLeft ()
    {
        if (this.cursor.x > 0)
        {
            this.cursor.x--;
            this.block.x -= 52;
        }
        else
        {
            this.cursor.x = 9;
            this.block.x += 52 * 9;
        }
    }

    moveRight ()
    {
        if (this.cursor.x < 9)
        {
            this.cursor.x++;
            this.block.x += 52;
        }
        else
        {
            this.cursor.x = 0;
            this.block.x -= 52 * 9;
        }
    }

    moveUp ()
    {
        if (this.cursor.y > 0)
        {
            this.cursor.y--;
            this.block.y -= 64;
        }
        else
        {
            this.cursor.y = 2;
            this.block.y += 64 * 2;
        }
    }

    moveDown ()
    {
        if (this.cursor.y < 2)
        {
            this.cursor.y++;
            this.block.y += 64;
        }
        else
        {
            this.cursor.y = 0;
            this.block.y -= 64 * 2;
        }
    }

    anyKey (event)
    {
        //  Only allow A-Z . and -

        let code = event.keyCode;

        if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD)
        {
            this.cursor.set(6, 2);
            this.pressKey();
        }
        else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS)
        {
            this.cursor.set(7, 2);
            this.pressKey();
        }
        else if (code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE || code === Phaser.Input.Keyboard.KeyCodes.DELETE)
        {
            this.cursor.set(8, 2);
            this.pressKey();
        }
        else if (code >= Phaser.Input.Keyboard.KeyCodes.A && code <= Phaser.Input.Keyboard.KeyCodes.Z)
        {
            code -= 65;

            let y = Math.floor(code / 10);
            let x = code - (y * 10);

            this.cursor.set(x, y);
            this.pressKey();
        }
    }

    pressKey ()
    {
        let x = this.cursor.x;
        let y = this.cursor.y;
        let nameLength = this.name.length;

        this.block.x = this.text.x - 10 + (x * 52);
        this.block.y = this.text.y - 2 + (y * 64);

        if (x === 9 && y === 2 && nameLength > 0)
        {
            //  Submit
            this.events.emit('submitName', this.name);
        }
        else if (x === 8 && y === 2 && nameLength > 0)
        {
            //  Rub
            this.name = this.name.substr(0, nameLength - 1);

            this.events.emit('updateName', this.name);
        }
        else if (this.name.length < this.charLimit)
        {
            //  Add
            this.name = this.name.concat(this.chars[y][x]);

            this.events.emit('updateName', this.name);
        }
    }
}

class Starfield extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'Starfield', active: true });

        this.stars;

        this.distance = 300;
        this.speed = 250;

        this.max = 500;
        this.xx = [];
        this.yy = [];
        this.zz = [];
    }

    preload ()
    {
        this.load.image('star', 'assets/demoscene/star4.png');
    }

    create ()
    {
        //  Do this, otherwise this Scene will steal all keyboard input
        this.input.keyboard.enabled = false;

        this.stars = this.add.blitter(0, 0, 'star');

        for (let i = 0; i < this.max; i++)
        {
            this.xx[i] = Math.floor(Math.random() * 800) - 400;
            this.yy[i] = Math.floor(Math.random() * 600) - 300;
            this.zz[i] = Math.floor(Math.random() * 1700) - 100;

            let perspective = this.distance / (this.distance - this.zz[i]);
            let x = 400 + this.xx[i] * perspective;
            let y = 300 + this.yy[i] * perspective;

            this.stars.create(x, y);
        }
    }

    update (time, delta)
    {
        for (let i = 0; i < this.max; i++)
        {
            let perspective = this.distance / (this.distance - this.zz[i]);
            let x = 400 + this.xx[i] * perspective;
            let y = 300 + this.yy[i] * perspective;

            this.zz[i] += this.speed * (delta / 1000);

            if (this.zz[i] > 300)
            {
                this.zz[i] -= 600;
            }

            let bob = this.stars.children.list[i];

            bob.x = x;
            bob.y = y;
        }
    }

}

class Highscore extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'Highscore', active: true });

        this.playerText;
    }

    preload ()
    {
        this.load.image('block', 'assets/input/block.png');
        this.load.image('rub', 'assets/input/rub.png');
        this.load.image('end', 'assets/input/end.png');

        this.load.bitmapFont('arcade', 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml');
    }

    create ()
    {
        this.add.bitmapText(100, 260, 'arcade', 'RANK  SCORE   NAME').setTint(0xff00ff);
        this.add.bitmapText(100, 310, 'arcade', '1ST   50000').setTint(0xff0000);

        this.playerText = this.add.bitmapText(580, 310, 'arcade', '').setTint(0xff0000);

        //  Do this, otherwise this Scene will steal all keyboard input
        this.input.keyboard.enabled = false;

        this.scene.launch('InputPanel');

        let panel = this.scene.get('InputPanel');

        //  Listen to events from the Input Panel scene
        panel.events.on('updateName', this.updateName, this);
        panel.events.on('submitName', this.submitName, this);
    }

    submitName ()
    {
        this.scene.stop('InputPanel');

        this.add.bitmapText(100, 360, 'arcade', '2ND   40000    ANT').setTint(0xff8200);
        this.add.bitmapText(100, 410, 'arcade', '3RD   30000    .-.').setTint(0xffff00);
        this.add.bitmapText(100, 460, 'arcade', '4TH   20000    BOB').setTint(0x00ff00);
        this.add.bitmapText(100, 510, 'arcade', '5TH   10000    ZIK').setTint(0x00bfff);
    }

    updateName (name)
    {
        this.playerText.setText(name);
    }

}

let config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [ Starfield, Highscore, InputPanel ]
};

let game = new Phaser.Game(config);
