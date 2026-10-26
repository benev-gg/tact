
import {loot} from "@e280/sly"
import {Deck} from "../../deck/types.js"
import {PortId} from "../../deck/hub.js"
import {Controller} from "../../../input/controller.js"
import {ControllerNames} from "./parts/controller-names.js"

export type DraggyController = {controller: Controller}
export type DroppyPort = {portId: PortId | null}

export type Context = {
	deck: Deck
	controllerNames: ControllerNames
	dnd: loot.DragAndDrops<DraggyController, DroppyPort>
}

