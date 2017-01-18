import * as Component from '../components';
import Game from '../boot/Game';
import State from '../state/State';
/**
* This is the base Game Object class that you can use when creating your own extended Game Objects.
* It hides away the 'private' stuff and exposes only the useful getters, setters and properties.
*
* @class
*/
export default class GameObject {
    state: State;
    game: Game;
    name: string;
    type: number;
    parent: GameObject;
    texture: any;
    frame: any;
    transform: Component.Transform;
    data: Component.Data;
    color: Component.Color;
    scaleMode: any;
    skipRender: boolean;
    visible: boolean;
    children: any;
    exists: any;
    render: any;
    constructor(state: State, x: number, y: number, texture: any, frame: any, parent?: GameObject);
    preUpdate(): void;
    update(): void;
    postUpdate(): void;
    destroy(): void;
    x: number;
    y: number;
    scale: number;
    scaleX: number;
    scaleY: number;
    anchor: number;
    anchorX: number;
    anchorY: number;
    pivotX: number;
    pivotY: number;
    angle: number;
    rotation: number;
    alpha: number;
    blendMode: any;
}
