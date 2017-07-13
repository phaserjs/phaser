//  These properties get injected into the State and map to local systems
//  The key is the local system reference, the value is the property that is added to the State
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
    stateManager: 'state',
    time: 'time',
    tweens: 'tweens'

};

module.exports = InjectionMap;
