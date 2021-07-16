import { Emit, EventEmitter } from '../../events';

import { GameInstance } from '../../GameInstance';
import { IGameObject } from '../../gameobjects/IGameObject';
import { Mat2dAppend } from '../../math/mat2d/Mat2dAppend';
import { Mat2dGlobalToLocal } from '../../math/mat2d/Mat2dGlobalToLocal';
import { Vec2 } from '../../math/vec2/Vec2';

export class Mouse extends EventEmitter
{
    primaryDown: boolean = false;
    auxDown: boolean = false;
    secondaryDown: boolean = false;

    blockContextMenu: boolean = true;

    localPoint: Vec2;
    hitPoint: Vec2;

    private target: HTMLElement;
    private resolution: number = 1;

    private mousedownHandler: { (event: MouseEvent): void; (this: Window, ev: MouseEvent): void };
    private mouseupHandler: { (event: MouseEvent): void; (this: Window, ev: MouseEvent): void };
    private mousemoveHandler: { (event: MouseEvent): void; (this: Window, ev: MouseEvent): void };
    private mousewheelHandler: { (event: MouseWheelEvent): void; (this: Window, ev: MouseWheelEvent): void };
    private contextmenuHandler: { (event: MouseEvent): void; (this: Window, ev: MouseEvent): void };
    private blurHandler: { (): void; (this: Window, ev: FocusEvent): void };

    private transPoint: Vec2;

    constructor (target?: HTMLElement)
    {
        super();

        this.mousedownHandler = (event: MouseEvent): void => this.onMouseDown(event);
        this.mouseupHandler = (event: MouseEvent): void => this.onMouseUp(event);
        this.mousemoveHandler = (event: MouseEvent): void => this.onMouseMove(event);
        this.mousewheelHandler = (event: MouseWheelEvent): void => this.onMouseWheel(event);
        this.contextmenuHandler = (event: MouseEvent): void => this.onContextMenuEvent(event);
        this.blurHandler = (): void => this.onBlur();

        this.localPoint = new Vec2();
        this.hitPoint = new Vec2();
        this.transPoint = new Vec2();

        if (!target)
        {
            target = GameInstance.get().renderer.canvas;
        }

        target.addEventListener('mousedown', this.mousedownHandler);
        target.addEventListener('mouseup', this.mouseupHandler);
        target.addEventListener('wheel', this.mousewheelHandler, { passive: false });
        target.addEventListener('contextmenu', this.contextmenuHandler);

        window.addEventListener('mouseup', this.mouseupHandler);
        window.addEventListener('mousemove', this.mousemoveHandler);
        window.addEventListener('blur', this.blurHandler);

        this.target = target;
    }

    private onBlur (): void
    {
    }

    private onMouseDown (event: MouseEvent): void
    {
        this.positionToPoint(event);

        if (event.button === 0) this.primaryDown = true;
        if (event.button === 1) this.auxDown = true;
        if (event.button === 2) this.secondaryDown = true;

        Emit(this, 'pointerdown', this.localPoint.x, this.localPoint.y, event.button, event);
    }

    private onMouseUp (event: MouseEvent): void
    {
        this.positionToPoint(event);

        if (event.button === 0) this.primaryDown = false;
        if (event.button === 1) this.auxDown = false;
        if (event.button === 2) this.secondaryDown = false;

        Emit(this, 'pointerup', this.localPoint.x, this.localPoint.y, event.button, event);
    }

    private onMouseMove (event: MouseEvent): void
    {
        this.positionToPoint(event);

        Emit(this, 'pointermove', this.localPoint.x, this.localPoint.y, event);
    }

    private onMouseWheel (event: MouseWheelEvent): void
    {
        Emit(this, 'wheel', event.deltaX, event.deltaY, event.deltaZ, event);
    }

    private onContextMenuEvent (event: MouseEvent): void
    {
        if (this.blockContextMenu)
        {
            event.preventDefault();
        }

        Emit(this, 'contextmenu', event);
    }

    positionToPoint (event: MouseEvent): Vec2
    {
        return this.localPoint.set(event.offsetX, event.offsetY);
    }

    getInteractiveChildren <T extends IGameObject> (parent: T, results: IGameObject[]): void
    {
        const children = parent.children;

        for (let i = 0; i < children.length; i++)
        {
            const child = children[i];

            if (!child.visible || !child.input.enabled)
            {
                continue;
            }

            results.push(child);

            if (child.input.enabledChildren && child.numChildren)
            {
                this.getInteractiveChildren(child, results);
            }
        }
    }

    checkHitArea <T extends IGameObject> (entity: T, px: number, py: number): boolean
    {
        if (entity.input.hitArea)
        {
            if (entity.input.hitArea.contains(px, py))
            {
                return true;
            }
        }
        else
        {
            return entity.transformExtent.contains(px, py);
        }

        return false;
    }

    hitTest <T extends IGameObject> (...entities: T[]): boolean
    {
        const localX = this.localPoint.x;
        const localY = this.localPoint.y;
        const point = this.transPoint;

        for (let i: number = 0; i < entities.length; i++)
        {
            const entity = entities[i];

            if (!entity.world)
            {
                //  Can't hit test an entity if it hasn't been added to a World yet
                continue;
            }

            const mat = Mat2dAppend(entity.world.camera.worldTransform, entity.worldTransform);

            Mat2dGlobalToLocal(mat, localX, localY, point);

            if (this.checkHitArea(entity, point.x, point.y))
            {
                this.hitPoint.set(point.x, point.y);

                return true;
            }
        }

        return false;
    }

    hitTestChildren <T extends IGameObject> (parent: T, topOnly: boolean = true): IGameObject[]
    {
        const output: IGameObject[] = [];

        if (!parent.visible)
        {
            return output;
        }

        //  Build a list of potential input candidates
        const candidates: IGameObject[] = [];
        const parentInput = parent.input;

        if (parentInput && parentInput.enabled)
        {
            candidates.push(parent);
        }

        if (parentInput.enabledChildren && parent.numChildren)
        {
            this.getInteractiveChildren(parent, candidates);
        }

        for (let i: number = candidates.length - 1; i >= 0; i--)
        {
            const entity = candidates[i];

            if (this.hitTest(entity))
            {
                output.push(entity);

                if (topOnly)
                {
                    break;
                }
            }
        }

        return output;
    }

    shutdown (): void
    {
        const target = this.target;

        target.removeEventListener('mousedown', this.mousedownHandler);
        target.removeEventListener('mouseup', this.mouseupHandler);
        target.removeEventListener('wheel', this.mousewheelHandler);
        target.removeEventListener('contextmenu', this.contextmenuHandler);

        window.removeEventListener('mouseup', this.mouseupHandler);
        window.removeEventListener('mousemove', this.mousemoveHandler);
        window.removeEventListener('blur', this.blurHandler);
    }
}
