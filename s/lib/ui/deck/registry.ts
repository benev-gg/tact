
import {RMap} from "@e280/strata"
import {Content} from "@e280/sly"
import {IdCounter} from "@e280/stz"
import {Profile, ProfileKey} from "./types.js"
import {Handle} from "./assignments.js"
import {Controller} from "../../input/controller.js"
import gameControllerSvg from "../icons/akar/game-controller.svg.js"

type Meta = {
	id: number
	icon: Content
	handle: Handle
	name: string
	tooltip: string
	defaultProfileKey: ProfileKey
}

type RegistryData<B> = {
	id: IdCounter
	metas: RMap<Controller, Meta>
	stock: Record<ProfileKey, Profile<B>>
}

export class ControllerRegistry {
	#id = new IdCounter()
	metas = new RMap<Controller, Meta>()

	get(controller: Controller) {
		return this.metas.get(controller)
	}

	attach(controller: Controller, meta: Omit<Meta, "id">) {
		this.metas.set(controller, {...meta, id: this.#id.next()})
	}

	detach(controller: Controller) {
		this.metas.delete(controller)
	}

	fallback(): Meta {
		return {
			id: 0,
			icon: gameControllerSvg,
			handle: "controller",
			name: "controller",
			tooltip: "",
		}
	}
}

