
import {Kv} from "@e280/kv"
import {RMap} from "@e280/strata"
import {Content} from "@e280/sly"
import {collect, given, setEntries} from "@e280/stz"

import {ProfileKey} from "./types.js"
import {Bimap} from "../../utils/bimap.js"
import {Controller} from "../../input/controller.js"

export type Handle = string

export class Assignments {
	#kvPrefs
	#prefs = new RMap<Handle, ProfileKey>()
	#assigned = new RMap<Controller, ProfileKey>()

	constructor(kv: Kv, metas: Metas) {
		this.#metas = metas
		this.#kvPrefs = kv.scope<ProfileKey>("prefs")
	}

	async load() {
		setEntries(this.#prefs, await collect(this.#kvPrefs.entries()))

		for (const [handle, profile] of this.#prefs)
			given(this.#handles.get(handle), controller => {
				this.#assigned.set(controller, profile)
			})
	}

	get(controller: Controller) {
		return this.#assigned.get(controller)
	}

	async assign(controller: Controller, profile: ProfileKey) {
		this.#assigned.set(controller, profile)

		await given(this.#handles.keyOf(controller), async handle => {
			this.#prefs.set(handle, profile)
			await this.#kvPrefs.set(handle, profile)
		})
	}
}

// export class Handles extends Bimap<Handle, Controller> {}
//
// type Meta = {
// 	icon: Content
// 	handle: Handle
// 	name: string
// 	tooltip: string
// 	hue: number
// }
//
// export class Metas {
// 	#map = new WeakMap<Controller, Meta>()
//
// 	set(controller: Controller, meta: Meta) {
// 		this.#map.set(controller, meta)
// 	}
//
// 	get(controller: Controller) {
// 		return this.#map.get(controller)
// 	}
// }
//
// export class Controllers {
// 	assignments
// 	metas
//
// 	constructor(kv: Kv) {
// 		this.metas = new Metas()
// 		this.assignments = new Assignments(kv, this.handles)
// 	}
//
// 	attach(controller: Controller, meta: Meta) {
//
// 	}
// }
//

