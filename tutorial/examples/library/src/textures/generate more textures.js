var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var pixelWidth = 6;
    var pixelHeight = 6;

    var chick = [
        '...55.......',
        '.....5......',
        '...7888887..',
        '..788888887.',
        '..888088808.',
        '..888886666.',
        '..8888644444',
        '..8888645555',
        '888888644444',
        '88788776555.',
        '78788788876.',
        '56655677776.',
        '456777777654',
        '.4........4.'
    ];

    this.textures.generate('chick', { data: chick, pixelWidth: pixelWidth });

    var burd = [
      '..E.............',
      '.DEEEEEEDDD.....',
      '..EEEEEEDDD.....',
      '..EE00EE77778666',
      '..EEEEEE77777666',
      '..EEEE7777777666',
      '..EEEE7655567666',
      'EEEEEE7777757666',
      'EEEEEEDD555.7666',
      '..DEEEEEDDD.....',
      '..EEEEEEDDD.....',
      '.7EEEEEEDDD.6...',
      '.77EEEEEDDD66...',
      '..77......66....'
    ];

    this.textures.generate('burd', { data: burd, pixelWidth: pixelWidth });

    var alien = [
      '....44........',
      '....44........',
      '......5.......',
      '......5.......',
      '....ABBBBA....',
      '...ABBBBBBA...',
      '..ABB8228BBA..',
      '..BB882288BB..',
      '.ABB885588BBA.',
      'BBBB885588BBBB',
      'BBBB788887BBBB',
      '.ABBB7777BBBA.',
      '.ABBBBBBBBBBA.',
      '.AABBBBBBBBAA.',
      '.AAAAAAAAAAAA.',
      '.5AAAAAAAAAA5.'
    ];
    
    this.textures.generate('alien', { data: alien, pixelWidth: pixelWidth });

    var ufo = [
      '....DDDDDDDD....',
      '...DDEEDDDDDD...',
      '..DDDEEDDDDDDD..',
      '..DDDDDDDDDDDD..',
      '..DDDD5555DDDD..',
      '..DDD555555DDD..',
      '..DDD555555DDD..',
      '..DDD555555DDD..',
      '..334244333333..',
      '.33344443333333.',
      '3333444433333333',
      '....5...5..5....',
      '...5....5...5...',
      '.66....66....66.',
      '.66....66....66.'
    ];

    this.textures.generate('ufo', { data: ufo, pixelWidth: pixelWidth });

    var star = [
      '.....828.....',
      '....72227....',
      '....82228....',
      '...7222227...',
      '2222222222222',
      '8222222222228',
      '.72222222227.',
      '..787777787..',
      '..877777778..',
      '.78778887787.',
      '.27887.78872.',
      '.787.....787.'
    ];
    
    this.textures.generate('star', { data: star, pixelWidth: pixelWidth });

    var ship = [
      '.....DEEEEEED...',
      '.....EEEEEFFE...',
      '.....EEEDDFFE...',
      '334..EEDDDDEE...',
      '3333.EEDDDDEE...',
      '33333EEDDDDEE...',
      '.FF2222222222F..',
      '.F222222222222F.',
      '.22222222222222F',
      '4443322222222222',
      '44433FFFFFFFFFFF',
      '.111FFFFFFFFFFF.',
      '.11FFFFFFFFFFF..',
      '.1FFFFFFFFFF1...',
      '...3333.........',
      '...333..........'
    ];

    this.textures.generate('ship', { data: ship, pixelWidth: pixelWidth });

    var cat = [
      '....443...443.',
      '...4433..4433.',
      '..44333.48333.',
      '88888888244444',
      '44444444433333',
      '44444444433333',
      '44044404433333',
      '44488844433333',
      '44400044433333',
      '44F202F4433333',
      '44202024433333',
      '44F222F4433333',
      '44444444433333',
      '4433...4433.33',
      '4433...4433.33'
    ];
    
    this.textures.generate('cat', { data: cat, pixelWidth: pixelWidth });

    var joypad = [
      '........65....5.',
      '.......5..5..5..',
      '.......5...55...',
      '.......5........',
      '.51FFFFFFFFFF15.',
      '51FFFFFFFFEEFF15',
      '1FF55FFFFFEEFFF1',
      'FF5555FFFFFFF33F',
      'FF0000FFAAFFF33F',
      'FF1001FFAAFFFFFF',
      'FFF11FFFFFF88FFF',
      '2FFFFF2222F88FF2',
      '1222221111222221',
      '11FFF111111FFF11',
      '.1FFF1....1FFF1.',
      '..111......111..'
    ];

    this.textures.generate('joypad', { data: joypad, pixelWidth: pixelWidth });

    var joystick = [
      '..............',
      '....533335....',
      '....348333....',
      '....344333....',
      '....333533....',
      '....533335....',
      '......55......',
      '......33......',
      '......33......',
      '......55......',
      '....551155....',
      '.343556655343.',
      '61111111111116',
      '50000000000005',
      '50000000000005',
      '55555555555555',
      '.555......555.'
    ];

    this.textures.generate('joystick', { data: joystick, pixelWidth: pixelWidth });

    this.add.image(150, 200, 'chick').setOrigin(0, 1);
    this.add.image(350, 200, 'burd').setOrigin(0, 1);
    this.add.image(550, 200, 'alien').setOrigin(0, 1);

    this.add.image(150, 350, 'ufo').setOrigin(0, 1);
    this.add.image(350, 350, 'star').setOrigin(0, 1);
    this.add.image(550, 350, 'ship').setOrigin(0, 1);

    this.add.image(150, 500, 'cat').setOrigin(0, 1);
    this.add.image(350, 500, 'joystick').setOrigin(0, 1);
    this.add.image(550, 500, 'joypad').setOrigin(0, 1);


}
