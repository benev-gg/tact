
import {collect, got, setEntries} from "@e280/stz"

import {Profiles} from "./internal/profiles.js"
import {Bindings} from "../../../input/types.js"
import {setupControlsData} from "./internal/setup.js"
import {Assignments} from "./internal/assignments.js"
import {Controller} from "../../../input/controller.js"
import {ControllerMeta, ControlsOptions} from "./types.js"

export class Controls<B extends Bindings> {
	#data
	profiles
	assignments

	constructor(options: ControlsOptions<B>) {
		this.#data = setupControlsData(options)
		this.profiles = new Profiles(this.#data)
		this.assignments = new Assignments(this.#data)
	}

	#rebind(controller: Controller) {
		const {preferences, assignments, controllers} = this.#data
		const meta = got(controllers.get(controller))
		controller.bindings = this.profiles.get(
			assignments.get(controller) ?? preferences.get(meta.handle)
		)
	}

	async load() {
		const {kvs, controllers, preferences, profiles: {customs}} = this.#data

		setEntries(customs, await collect(kvs.profiles))
		setEntries(preferences, await collect(kvs.preferences))

		for (const controller of controllers.keys())
			this.#rebind(controller)
	}

	get controllers() {
		return [...this.#data.controllers.keys()]
	}

	get fallbackProfileKey() {
		return this.#data.profiles.fallback.key
	}

	meta(controller: Controller) {
		return this.#data.controllers.get(controller)
	}

	attach(controller: Controller, meta: Omit<ControllerMeta, "id">) {
		const id = this.#data.idCounter.next()
		this.#data.controllers.set(controller, {...meta, id})
		this.#rebind(controller)
	}

	detach(controller: Controller) {
		this.#data.controllers.delete(controller)
		this.#data.assignments.delete(controller)
	}
}

