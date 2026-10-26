
import {RMap} from "@e280/strata"
import {got, setEntries} from "@e280/stz"

import {Bindings} from "../../input/types.js"
import {Profile, ProfileKey} from "./types.js"
import {Controller} from "../../input/controller.js"

export class Profiles<B extends Bindings = any> {
	readonly default
	#stock = new RMap<ProfileKey, Profile<B>>()
	#custom = new RMap<ProfileKey, Profile<B>>()
	#assignments = new RMap<Controller, ProfileKey>()

	constructor(stock: Record<ProfileKey, Profile<B>>) {
		this.default = got(Object.keys(stock)[0], "profiles requires at least one in stock")
		setEntries(this.#stock, Object.entries(stock))
	}

	/** get profile by key. */
	get(profileKey: ProfileKey) {
		return this.#custom.get(profileKey)
			?? this.#stock.get(profileKey)
			?? got(this.#stock.get(this.default))
	}

	/** learn what profile key a controller is assigned to. */
	query(controller: Controller): ProfileKey {
		for (const [c, profileKey] of this.#assignments) {
			if (c === controller)
				return profileKey
		}
		return this.default
	}

	/** assign a controller to a specific profile. */
	assign(controller: Controller, profileKey: ProfileKey) {
		controller.bindings = this.get(profileKey).bindings
		this.#assignments.set(controller, profileKey)
	}

	*custom() {
		yield* this.#custom
	}

	*stock() {
		yield* this.#stock
	}

	*all() {
		yield* [...this.#custom, ...this.#stock]
	}
}

