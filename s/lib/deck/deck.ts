
import {Cubby} from "@e280/stz"

import {Hub} from "./hub.js"
import {DeckState} from "./types.js"
import {Bindings} from "../input/types.js"

export class Deck<B extends Bindings> {
	#store
	readonly hub

	constructor(options: {
			hub: Hub<B>
			store: Cubby<DeckState>
		}) {
		this.hub = options.hub
		this.#store = options.store
	}

	async load() {}
}

