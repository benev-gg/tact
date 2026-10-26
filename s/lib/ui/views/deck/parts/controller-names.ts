
import {guarantee, IdCounter} from "@e280/stz"
import {Controller} from "../../../../input/controller.js"

export class ControllerNames {
	#id = new IdCounter()
	#map = new Map<Controller, string>()

	get(controller: Controller) {
		return guarantee(this.#map, controller, () => `${this.#id.next() + 1}`)
	}
}

