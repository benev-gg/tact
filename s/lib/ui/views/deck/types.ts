
import {loot} from "@e280/sly"
import {Deck, PlayerId} from "../../deck/types.js"
import {Controller} from "../../../input/controller.js"

export const droppyNewPlayer = Symbol("droppyNewPlayer")

export type DraggyController = {controller: Controller}
export type DroppyPort = {playerId: PlayerId | null | typeof droppyNewPlayer}

export type Context = {
	deck: Deck
	dnd: loot.DragAndDrops<DraggyController, DroppyPort>
}

