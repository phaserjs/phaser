import GameObject from '../gameobjects/GameObject.js';

export type TODO_MIGRATE_Scene = object;
export type TODO_MIGRATE_GameObjectInstance = object;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TODO_MIGRATE_Callback = (...args: any[]) => any;

/**
 * Class() factory produces a plain constructor function, not a TypeScript-visible
 * class. Cast to a minimal constructor type so native `extends` can reference it.
 */
export const TODO_MIGRATE_GameObjectCtor = GameObject as unknown as new (scene: TODO_MIGRATE_Scene, type: string) => TODO_MIGRATE_GameObjectInstance;
