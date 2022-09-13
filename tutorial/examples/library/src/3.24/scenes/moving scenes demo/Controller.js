class Controller extends Phaser.Scene {

    constructor ()
    {
        super('Controller');

        this.active;
        this.currentScene;

        this.button1;
        this.button2;
        this.button3;
        this.button4;
        this.button5;
        this.button6;

        this.text1;
        this.text2;

        this.toggle1;
        this.toggle2;

        this.showTip = false;

        this.dpad;
        this.padUp = new Phaser.Geom.Rectangle(23, 0, 32, 26);
        this.padDown = new Phaser.Geom.Rectangle(23, 53, 32, 26);
        this.padLeft = new Phaser.Geom.Rectangle(0, 26, 23, 27);
        this.padRight = new Phaser.Geom.Rectangle(55, 26, 23, 27);

        this.bg;
    }

    preload ()
    {
        this.load.image('bg', 'assets/tests/scenes/bg.jpg');
        this.load.atlas('space', 'assets/tests/scenes/space.png', 'assets/tests/scenes/space.json');
        this.load.atlas('ui', 'assets/tests/scenes/ui.png', 'assets/tests/scenes/ui.json');
        this.load.bitmapFont('digital', 'assets/tests/scenes/digital.png', 'assets/tests/scenes/digital.xml');
    }

    create ()
    {
        this.textures.addSpriteSheetFromAtlas('mine', { atlas: 'space', frame: 'mine', frameWidth: 64 });
        this.textures.addSpriteSheetFromAtlas('asteroid', { atlas: 'space', frame: 'asteroid', frameWidth: 96 });

        this.anims.create({ key: 'asteroid', frames: this.anims.generateFrameNumbers('asteroid', { start: 0, end: 25 }), frameRate: 14, repeat: -1 });
        this.anims.create({ key: 'mine', frames: this.anims.generateFrameNumbers('mine', { start: 0, end: 15 }), frameRate: 20, repeat: -1 });

        this.bg = this.add.tileSprite(0, 135, 1024, 465, 'bg').setOrigin(0);

        this.add.image(0, 0, 'ui', 'panel').setOrigin(0);

        //  Buttons
        this.createButton(1, 'SceneA', 'nebula', 36, 26);
        this.createButton(2, 'SceneB', 'sun', 157, 26);
        this.createButton(3, 'SceneC', 'asteroids', 278, 26);
        this.createButton(4, 'SceneD', 'planet', 36, 76);
        this.createButton(5, 'SceneE', 'ship', 157, 76);
        this.createButton(6, 'SceneF', 'mines', 278, 76);

        //  Button 1 is active first
        this.button1.setFrame('button-down');
        this.button1.setData('active', true);

        this.active = this.button1;

        //  Button Labels
        this.add.image(0, 0, 'ui', 'scene-labels').setOrigin(0);

        //  Toggles
        this.toggle1 = this.createVisibleToggle(902, 35);
        this.toggle2 = this.createActiveToggle(902, 75);

        //  LCD
        this.text1 = this.add.bitmapText(520, 42, 'digital', 'nebula', 32).setOrigin(0.5, 0).setAlpha(0.8);
        this.text2 = this.add.bitmapText(520, 74, 'digital', 'index 1 / 6', 22).setOrigin(0.5, 0).setAlpha(0.8);

        //  D-Pad
        this.createDPad();

        this.scene.launch('SceneA');
        this.scene.launch('SceneB');
        this.scene.launch('SceneC');
        this.scene.launch('SceneD');
        this.scene.launch('SceneE');
        this.scene.launch('SceneF');

        this.currentScene = this.scene.get('SceneA');
    }

    createVisibleToggle (x, y)
    {
        let toggle = this.add.image(x, y, 'ui', 'toggle-on').setOrigin(0);

        toggle.setInteractive();

        toggle.setData('on', true);

        toggle.on('pointerup', function () {

            if (toggle.getData('on'))
            {
                toggle.setFrame('toggle-off');
                toggle.setData('on', false);
                this.scene.setVisible(false, this.currentScene);
            }
            else
            {
                toggle.setFrame('toggle-on');
                toggle.setData('on', true);
                this.scene.setVisible(true, this.currentScene);
            }

        }, this);

        return toggle;
    }

    createActiveToggle (x, y)
    {
        let toggle = this.add.image(x, y, 'ui', 'toggle-on').setOrigin(0);

        toggle.setInteractive();

        toggle.setData('on', true);

        toggle.on('pointerup', function () {

            if (toggle.getData('on'))
            {
                toggle.setFrame('toggle-off');
                toggle.setData('on', false);
                this.scene.setActive(false, this.currentScene);

            }
            else
            {
                toggle.setFrame('toggle-on');
                toggle.setData('on', true);
                this.scene.setActive(true, this.currentScene);
            }

        }, this);

        return toggle;
    }

    createButton (id, scene, name, x, y)
    {
        let btn = this.add.image(x, y, 'ui', 'button-out').setOrigin(0);

        btn.setInteractive();

        btn.setData('id', id);
        btn.setData('scene', scene);
        btn.setData('name', name);
        btn.setData('active', false);

        btn.on('pointerover', function () {

            if (!this.getData('active'))
            {
                this.setFrame('button-over');
            }

        });

        btn.on('pointerout', function () {

            if (this.getData('active'))
            {
                this.setFrame('button-down');
            }
            else
            {
                this.setFrame('button-out');
            }

        });

        btn.on('pointerup', function () {

            if (!btn.getData('active'))
            {
                this.setActiveScene(btn);
            }

        }, this);

        this['button' + id] = btn;
    }

    createDPad ()
    {
        this.dpad = this.add.image(670, 26, 'ui', 'nav-out').setOrigin(0);

        this.dpad.setInteractive();

        this.dpad.on('pointermove', function (pointer, px, py) {

            this.showTip = true;

            if (this.padUp.contains(px, py))
            {
                this.dpad.setFrame('nav-up');
                this.updateToolTip('bring to top');
            }
            else if (this.padDown.contains(px, py))
            {
                this.dpad.setFrame('nav-down');
                this.updateToolTip('send to back');
            }
            else if (this.padLeft.contains(px, py))
            {
                this.dpad.setFrame('nav-left');
                this.updateToolTip('move down');
            }
            else if (this.padRight.contains(px, py))
            {
                this.dpad.setFrame('nav-right');
                this.updateToolTip('move up');
            }
            else
            {
                this.dpad.setFrame('nav-out');
                this.showTip = false;
            }

        }, this);

        this.dpad.on('pointerout', function () {

            this.dpad.setFrame('nav-out');
            this.showTip = false;

        }, this);

        this.dpad.on('pointerup', function (pointer, px, py) {

            if (this.padUp.contains(px, py))
            {
                this.scene.bringToTop(this.currentScene);
                this.showTip = false;
            }
            else if (this.padDown.contains(px, py))
            {
                this.scene.moveAbove('Controller', this.currentScene);
                this.showTip = false;
            }
            else if (this.padLeft.contains(px, py))
            {
                let idx = this.scene.getIndex(this.currentScene);                

                if (idx > 1)
                {
                    this.scene.moveDown(this.currentScene);
                }

                this.showTip = false;
            }
            else if (this.padRight.contains(px, py))
            {
                this.scene.moveUp(this.currentScene);
                this.showTip = false;
            }

        }, this);
    }

    setActiveScene (btn)
    {
        //  De-activate the old one
        this.active.setData('active', false);
        this.active.setFrame('button-out');

        btn.setData('active', true);
        btn.setFrame('button-down');

        this.active = btn;
        this.currentScene = this.scene.get(btn.getData('scene'));

        if (this.scene.isVisible(this.currentScene))
        {
            this.toggle1.setFrame('toggle-on');
            this.toggle1.setData('on', true);
        }
        else
        {
            this.toggle1.setFrame('toggle-off');
            this.toggle1.setData('on', false);
        }

        if (this.scene.isActive(this.currentScene))
        {
            this.toggle2.setFrame('toggle-on');
            this.toggle2.setData('on', true);
        }
        else
        {
            this.toggle2.setFrame('toggle-off');
            this.toggle2.setData('on', false);
        }

        this.text1.setText(btn.getData('name'));
    }

    updateToolTip (tip)
    {
        if (!tip)
        {
            let idx = this.scene.getIndex(this.currentScene);

            tip = 'index ' + idx + ' / 6';
        }

        this.text2.setText(tip);
    }

    update (time, delta)
    {
        this.bg.tilePositionX += 0.02 * delta;
        this.bg.tilePositionY += 0.005 * delta;

        if (!this.showTip)
        {
            this.updateToolTip();
        }
    }

}
