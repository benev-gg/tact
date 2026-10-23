
import {Kv} from "@e280/kv"
import {Hub} from "./hub.js"
import {Profiles} from "./profiles.js"
import {Bindings} from "../input/types.js"

export class Deck<B extends Bindings> {
	constructor(private parts: {
			kv: Kv
			hub: Hub<B>
			profiles: Profiles<B>
		}) {
	}

	get hub() { return this.parts.hub }
	get profiles() { return this.parts.profiles }

	async load() {}
}

