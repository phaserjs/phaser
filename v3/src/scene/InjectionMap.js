//  These properties get injected into the Scene and map to local systems
//  The key is the local system reference, the value is the property that is added to the Scene
//  These can be modified via the config object

var InjectionMap = {

    game: 'game',

    anims: 'anims',
    cache: 'cache',
    registry: 'registry',
    textures: 'textures',

    add: 'add',
    cameras: 'cameras',
    data: 'data',
    displayList: 'children',
    events: 'events',
    inputManager: 'input',
    load: 'load',
    make: 'make',
    pool: 'pool',
    sceneManager: 'scene',
    time: 'time',
    tweens: 'tweens'

};

module.exports = InjectionMap;
