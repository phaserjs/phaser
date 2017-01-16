import Loader from './systems/loader';
/**
* A Base State Class.
*
* @class Phaser.State
* @constructor
*/
export default class State {
    game: any;
    settings: any;
    sys: any;
    children: any;
    load: Loader;
    constructor(config: any);
    preUpdate(): void;
    update(): void;
    postUpdate(): void;
    render(): void;
}
