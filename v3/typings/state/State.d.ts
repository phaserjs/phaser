import Systems from './Systems';
import Loader from './systems/Loader';
/**
* A Base State Class.
*
* @class Phaser.State
* @constructor
*/
export default class State {
    game: any;
    settings: any;
    sys: Systems;
    children: any;
    load: Loader;
    constructor(config: any);
    preUpdate(): void;
    update(): void;
    postUpdate(): void;
    render(): void;
}
