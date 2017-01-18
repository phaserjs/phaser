import Game from '../boot/Game';
import State from './State';
interface StateConfig {
    key?: string;
    preload?: (this: State, game: Game) => void;
    create?: (this: State) => void;
}
export default StateConfig;
