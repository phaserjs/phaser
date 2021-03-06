import { ComponentType, ISchema } from 'bitecs';

import { Color } from '../components/color/Color';
import { IBaseCamera } from '../camera/IBaseCamera';
import { IColorComponent } from '../components/color/IColorComponent';
import { IGameObject } from '../gameobjects/IGameObject';
import { IRenderPass } from '../renderer/webgl1/renderpass/IRenderPass';
import { IScene } from '../scenes/IScene';
import { SceneManager } from '../scenes';

export interface IBaseWorld extends IGameObject, IColorComponent
{
    tag: ComponentType<ISchema>;

    scene: IScene;
    sceneManager: SceneManager;

    camera: IBaseCamera;

    forceRefresh: boolean;

    is3D: boolean;

    runRender: boolean;

    color: Color;

    renderList: Uint32Array;
    listLength: number;

    checkWorldEntity (id: number): boolean;
    getRenderList (): IGameObject[];

    beforeUpdate (delta: number, time: number): void;
    update (delta: number, time: number): void;
    afterUpdate (delta: number, time: number): void;

    preRender (gameFrame: number): boolean;
    renderGL <T extends IRenderPass> (renderPass: T): void;
    postRenderGL <T extends IRenderPass> (renderPass: T): void;

    shutdown (): void;
    destroy (reparentChildren?: IGameObject): void;
}
