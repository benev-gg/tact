
import {loot} from "@e280/sly"
import {PortId} from "../../deck/hub.js"
import {Deck} from "../../deck/types.js"
import {Controller} from "../../../input/controller.js"

export const droppyNewPort = Symbol("droppyNewPort")

export type DraggyController = {controller: Controller}
export type DroppyPort = {portId: PortId | null | typeof droppyNewPort}

export type Context = {
	deck: Deck
	dnd: loot.DragAndDrops<DraggyController, DroppyPort>
}

