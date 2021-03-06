import { Extent2DComponent } from "./Extent2DComponent";
import { GameObjectWorld } from "../../GameObjectWorld";
import { LocalMatrix2DComponent } from "./LocalMatrix2DComponent";
import { Transform2DComponent } from "./Transform2DComponent";
import { WorldMatrix2DComponent } from "./WorldMatrix2DComponent";
import { addComponent } from "bitecs";
export function AddTransform2DComponent(id, x = 0, y = 0, originX = 0, originY = 0) {
  addComponent(GameObjectWorld, Transform2DComponent, id);
  addComponent(GameObjectWorld, Extent2DComponent, id);
  addComponent(GameObjectWorld, LocalMatrix2DComponent, id);
  addComponent(GameObjectWorld, WorldMatrix2DComponent, id);
  Transform2DComponent.x[id] = x;
  Transform2DComponent.y[id] = y;
  Transform2DComponent.scaleX[id] = 1;
  Transform2DComponent.scaleY[id] = 1;
  Transform2DComponent.originX[id] = originX;
  Transform2DComponent.originY[id] = originY;
  LocalMatrix2DComponent.a[id] = 1;
  LocalMatrix2DComponent.d[id] = 1;
  LocalMatrix2DComponent.tx[id] = x;
  LocalMatrix2DComponent.ty[id] = y;
  WorldMatrix2DComponent.a[id] = 1;
  WorldMatrix2DComponent.d[id] = 1;
  WorldMatrix2DComponent.tx[id] = x;
  WorldMatrix2DComponent.ty[id] = y;
}
