import { GameObjectWorld } from '../GameObjectWorld';
import { RenderDataComponent } from './RenderDataComponent';
import { addComponent } from 'bitecs';

export function AddRenderDataComponent (id: number): void
{
    addComponent(GameObjectWorld, RenderDataComponent, id);
}
