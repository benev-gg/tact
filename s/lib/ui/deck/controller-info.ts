
import {Content} from "@e280/sly"
import {Controller} from "../../input/controller.js"

export type Info = {
	icon: Content
	name: string
	tooltip: string
	hue: number
}

export class ControllerInfo {
	#map = new WeakMap<Controller, Info>()

	#fallback: Info = {
		icon: null,
		name: "controller",
		tooltip: "controller",
		hue: 0,
	}

	set(controller: Controller, info: Info) {
		this.#map.set(controller, info)
	}

	get(controller: Controller) {
		return this.#map.get(controller) ?? this.#fallback
	}
}

