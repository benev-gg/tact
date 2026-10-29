
import {collect, got, setEntries} from "@e280/stz"

import {Profiles} from "./internal/profiles.js"
import {Bindings} from "../../../input/types.js"
import {makeControlsData} from "./internal/data.js"
import {Assignments} from "./internal/assignments.js"
import {Controller} from "../../../input/controller.js"
import {ControllerMeta, ControlsOptions} from "./types.js"

export class Controls<B extends Bindings = any> {
	#data
	profiles
	assignments
	readonly stock

	constructor(options: ControlsOptions<B>) {
		this.#data = makeControlsData(options)
		this.profiles = new Profiles(this.#data)
		this.assignments = new Assignments(this.#data)
		this.stock = options.stock
	}

	get on() {
		return this.#data.subby.on
	}

	#rebind(controller: Controller) {
		const {preferences, assignments, controllers} = this.#data
		const meta = got(controllers.get(controller))

		const profileKey = assignments.get(controller)
			?? preferences.get(meta.handle)
			?? meta.defaultProfileKey

		controller.bindings = this.profiles.get(profileKey).bindings
		assignments.set(controller, profileKey)
	}

	async load() {
		const {kvs, controllers, preferences, profiles: {customs}} = this.#data

		customs.clear()
		setEntries(customs, await collect(kvs.profiles))

		preferences.clear()
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

