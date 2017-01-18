import State from './State';
import Game from '../boot/Game';
import Renderer from '../renderer/Renderer';
import StateConfig from './StateConfig';
export default class StateManager {
    private _pending;
    private _start;
    private active;
    keys: any;
    game: Game;
    states: State[];
    /**
    * The State Manager is responsible for loading, setting up and switching game states.
    *
    * @class Phaser.StateManager
    * @constructor
    * @param {Phaser.Game} game - A reference to the currently running game.
    */
    constructor(game: Game, stateConfig: StateConfig | StateConfig[]);
    /**
    * The Boot handler is called by Phaser.Game when it first starts up.
    * The renderer is available by now.
    *
    * @method Phaser.StateManager#boot
    * @private
    */
    boot(): void;
    getKey(key: any, stateConfig: any): any;
    /**
    * Adds a new State into the StateManager. You must give each State a unique key by which you'll identify it.
    * The State can be either a Phaser.State object (or an object that extends it), a plain JavaScript object or a function.
    * If a function is given a new state object will be created by calling it.
    *
    * @method Phaser.StateManager#add
    * @param {string} key - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
    * @param {Phaser.State|object|function} state  - The state you want to switch to.
    * @param {boolean} [autoStart=false]  - If true the State will be started immediately after adding it.
    */
    add(key: string, stateConfig: State | StateConfig | (() => any), autoStart?: boolean): any;
    createStateFromInstance(key: any, newState: any): any;
    createStateFromObject(key: any, stateConfig: any): any;
    createStateFromFunction(key: any, state: any): any;
    setupCallbacks(newState: any, stateConfig?: any): any;
    createStateFrameBuffer(newState: any): void;
    getState(key: any): any;
    getStateIndex(state: any): number;
    getActiveStateIndex(state: any): number;
    isActive(key: any): boolean;
    start(key: any): void;
    loadComplete(event: any): void;
    startCreate(state: any): void;
    pause(key: any): void;
    sortStates(stateA: any, stateB: any): 0 | 1 | -1;
    step(timestamp: number): void;
    renderChildren(renderer: Renderer, state: State, interpolationPercentage: number): void;
}
