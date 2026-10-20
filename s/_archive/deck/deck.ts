
import {Cubby, debounce, guarantee} from "@e280/stz"
import {Port} from "./port.js"
import {Device} from "../core/types.js"
import {Runtime} from "./parts/runtime.js"
import {Controller} from "./controller.js"
import {Profiles} from "./parts/profiles.js"
import {Settings} from "./parts/settings.js"
import {DeckState, Profile, ProfileKey} from "./types.js"

export class Deck<StockProfileKey extends ProfileKey = ProfileKey> {
	profiles
	settings
	#runtime = new Runtime()

	constructor(options: {
			store: Cubby<DeckState>
			stockProfiles: Record<StockProfileKey, Profile>
		}) {
		this.settings = new Settings(options.store)
		this.profiles = new Profiles(options.stockProfiles, this.settings.customProfiles)
	}

	async load() {
		await this.settings.load()
		for (const controller of this.#runtime.controllers.keys())
			this.#applyControllerProfile(controller)
	}

	#save = debounce(100, () => this.settings.save())

	get ports() {
		return [...this.#runtime.ports]
	}

	get controllers() {
		return [...this.#runtime.controllers]
	}

	get unassignedControllers() {
		return [...this.#runtime.controllers]
			.filter(controller => !this.#runtime.portAssignments.get(controller))
	}

	createPort() {
		const port = new Port(this.#runtime)
		this.#runtime.ports.add(port)
		return port
	}

	deletePort(port: Port) {
		for (const controller of port.controllers)
			port.unplug(controller)
		this.#runtime.ports.delete(port)
	}

	createController<D extends Device = Device>(
			handle: string,
			stockProfileKey: StockProfileKey,
			device: D,
		) {
		const profileKey = guarantee(this.settings.profileAssignments, handle, () => stockProfileKey)
		const profile = this.profiles.get(profileKey)
		const controller = new Controller(handle, profile.bindings, device)
		this.#runtime.controllers.add(controller)
		return controller
	}

	deleteController(controller: Controller) {
		this.#runtime.controllers.delete(controller)
		this.#runtime.portAssignments.delete(controller)
	}

	async assignControllerProfile(controller: Controller, profileKey: StockProfileKey | ProfileKey) {
		this.settings.profileAssignments.set(controller.handle, profileKey)
		this.#applyControllerProfile(controller)
		await this.#save()
	}

	queryController(controller: Controller) {
		const port = this.#runtime.portAssignments.get(controller)
		const profileKey = this.settings.profileAssignments.get(controller.handle)
		const profile = this.profiles.get(profileKey)
		return {controller, port, profileKey, profile}
	}

	#applyControllerProfile(controller: Controller) {
		const profileKey = this.settings.profileAssignments.get(controller.handle)
		controller.bindings = this.profiles.get(profileKey).bindings
	}
}

