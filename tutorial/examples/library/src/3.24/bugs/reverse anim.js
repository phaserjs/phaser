console.clear();

class Button {
  constructor(scene, x, y, text, type) {
    this.type = type;
    this.button = scene.add.sprite(x, y, 'button');
    switch(type) {
      case 'pulse':
        this.button.play("button-idle");
        this.button.setInteractive();
        this.button.on('pointerdown', this.pulse.bind(this));
        break;
      case 'selectable':
        this.button.play("button-idle");
        this.button.setInteractive();
        this.button.on('pointerdown', this.toggleHighlight.bind(this));
        break;
      default:
        this.button.play("button-inactive");
        // do nothing
        break;
    }
    this.text = scene.add.text(x, y, text);
    this.text.x = this.text.x - (this.text.displayWidth / 2);
    this.text.y = this.text.y - (this.text.displayHeight / 2);
  }
  pulse(){
    console.log('pulse');
    this.button.anims.play("button-pulse");
  }
  toggleHighlight(){
    if (this.active === true) {
      try{
        this.button.anims.playReverse("button-select");
      }
      catch(ex){
        console.log('suppresing error from me not knowing how to link to 3.12 beta');
      }
      this.active = false;
    }
    else {
      this.button.anims.play("button-select");
      this.active = true;
    }
  }
}

class Test extends Phaser.Scene {
  constructor() {
    super({ key: 'Test' });
  }

  preload() {
    this.load.spritesheet('button', 'https://res.cloudinary.com/ducpf6etd/image/upload/v1535675770/button/button.png', { frameWidth: 300, frameHeight: 50, startFrame: 0, endFrame: 8 });
  }

  create() {
    this.anims.create({ key: 'button-inactive', frames: this.anims.generateFrameNumbers('button', { start: 0, end: 0 }), frameRate: 20, repeat: 0, yoyo: false });
    this.anims.create({ key: 'button-activate', frames: this.anims.generateFrameNumbers('button', { start: 0, end: 3 }), frameRate: 20, repeat: 0, yoyo: false });
    this.anims.create({ key: 'button-idle', frames: this.anims.generateFrameNumbers('button', { start: 3, end: 3 }), frameRate: 20, repeat: 0, yoyo: false });
    this.anims.create({ key: 'button-pulse', frames: this.anims.generateFrameNumbers('button', { start: 3, end: 8 }), frameRate: 20, repeat: 0, yoyo: true });
    this.anims.create({ key: 'button-select', frames: this.anims.generateFrameNumbers('button', { start: 3, end: 8 }), frameRate: 20, repeat: 0, yoyo: false });

    this.inactiveButton =   new Button(this, 200, 50, 'click to pulse', 'pulse');
    this.selectableButton = new Button(this, 200, 125, 'click to toggle highlight', 'selectable');
    this.idlebutton =       new Button(this, 200, 200, 'inactive button', '');
  }
}

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [Test],
}

var game = new Phaser.Game(config);