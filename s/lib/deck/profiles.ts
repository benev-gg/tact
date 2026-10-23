
import {Cubby} from "@e280/stz"
import {Bindings} from "../input/types.js"

export type ProfileKey = string
export type ControllerHandle = string

export type Profile = {
	label: string
	bindings: Bindings
}

export class Profiles<B extends Bindings> {
	#bindings
	#stock

	constructor(options: {
			bindings: B
			stock: Record<ProfileKey, Profile>
		}) {
		this.#bindings = options.bindings
		this.#stock = options.stock
	}

	get(key: ProfileKey) {}
	create(key: ProfileKey) {}
}

