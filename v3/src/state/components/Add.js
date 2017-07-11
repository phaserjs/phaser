var State = require('../State');

/**
* Adds a new State into the GlobalStateManager. You must give each State a unique key by which you'll identify it.
* The State can be either a Phaser.State object (or an object that extends it), a plain JavaScript object or a function.
* If a function is given a new state object will be created by calling it.
*
* @method Phaser.GlobalStateManager#add
* @param {string} key - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
* @param {Phaser.State|object|function} state  - The state you want to switch to.
* @param {boolean} [autoStart=false]  - If true the State will be started immediately after adding it.
*/
var Add = function (key, stateConfig, autoStart)
{
    if (autoStart === undefined) { autoStart = false; }

    //  if not booted, then put state into a holding pattern
    if (!this.game.isBooted)
    {
        this._pending.push({
            index: this._pending.length,
            key: key,
            state: stateConfig,
            autoStart: autoStart
        });

        // console.log('GlobalStateManager not yet booted, adding to list', this._pending.length);

        return;
    }

    // var ok = key;
    key = this.getKey(key, stateConfig);

    // console.group('GlobalStateManager.add');
    // console.log('add key:', ok);
    // console.log('config key:', key);
    // console.log('config:', stateConfig);
    // console.log('autoStart:', autoStart);
    // console.groupEnd();

    var newState;

    if (stateConfig instanceof State)
    {
        // console.log('GlobalStateManager.add from instance:', key);

        newState = this.createStateFromInstance(key, stateConfig);
    }
    else if (typeof stateConfig === 'object')
    {
        // console.log('GlobalStateManager.add from object:', key);

        stateConfig.key = key;

        newState = this.createStateFromObject(key, stateConfig);
    }
    else if (typeof stateConfig === 'function')
    {
        // console.log('GlobalStateManager.add from function:', key);

        newState = this.createStateFromFunction(key, stateConfig);
    }

    //  Replace key in case the state changed it
    key = newState.sys.settings.key;

    // console.log('replaced key', key);

    this.keys[key] = newState;

    this.states.push(newState);

    if (autoStart || newState.sys.settings.active)
    {
        if (this.game.isBooted)
        {
            this.start(key);
        }
        else
        {
            this._start.push(key);
        }
    }

    return newState;
};

module.exports = Add;
