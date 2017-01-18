import Game from '../../boot/Game';
import State from '../../state/State';
/**
* Dirty! Manager
*
* @class
*/
export default class UpdateManager {
    state: State;
    game: Game;
    list: any[];
    running: boolean;
    processed: number;
    constructor(state: any);
    stop(): void;
    start(): void;
    add(transform: any): void;
}
