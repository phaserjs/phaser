import Game from './Game';
import StateConfig from '../state/StateConfig';
export interface BannerConfig {
    hidePhaser?: boolean;
    text?: string;
    background?: string[];
}
export interface GameCallbacksConfig {
    preBoot?: (this: Game) => void;
    postBoot?: (this: Game) => void;
}
export interface GameConfig {
    width?: number;
    height?: number;
    resolution?: number;
    type?: number;
    parent?: string | Node;
    canvas?: HTMLCanvasElement;
    canvasStyle?: CSSStyleDeclaration;
    state?: StateConfig;
    seed?: string[];
    title?: string;
    url?: string;
    version?: string;
    banner?: BannerConfig;
    forceSetTimeOut?: boolean;
    transparent?: boolean;
    pixelArt?: boolean;
    callbacks?: GameCallbacksConfig;
}
export default class Config {
    private static defaultBannerColor;
    private static defaultBannerTextColor;
    width: number;
    height: number;
    resolution: number;
    renderType: number;
    parent: string | Node;
    canvas: HTMLCanvasElement;
    canvasStyle: CSSStyleDeclaration;
    stateConfig: StateConfig;
    seed: string[];
    gameTitle: string;
    gameURL: string;
    gameVersion: string;
    hideBanner: boolean;
    hidePhaser: boolean;
    bannerTextColor: string;
    bannerBackgroundColor: string[];
    forceSetTimeOut: boolean;
    transparent: boolean;
    pixelArt: boolean;
    preBoot: (this: Config) => void;
    postBoot: (this: Config) => void;
    constructor(config?: GameConfig);
}
