
import {deep} from "@e280/stz"
import {Sample} from "../sampling/types.js"
import {IntentResolver} from "./utils/intent-resolver.js"
import {ActionResolver} from "./utils/action-resolver.js"
import {investigateBindings} from "./utils/investigate.js"
import {Actions, Bindings, Rebindings, Intent} from "./types.js"

export class Resolver<B extends Bindings> {
	#bindings
	#hash
	#actionlist
	#expressionlist

	#intentResolver = new IntentResolver()
	#actionResolver = new ActionResolver()

	readonly actions

	constructor(bindings: B) {
		const investigation = investigateBindings(bindings)
		this.#bindings = deep.freeze(bindings) as any as Rebindings<B>
		this.#hash = investigation.hash
		this.actions = investigation.actions
		this.#actionlist = investigation.actionlist
		this.#expressionlist = investigation.expressionlist
	}

	get bindings() {
		return this.#bindings
	}

	set bindings(bindings: Rebindings<B>) {
		const investigation = investigateBindings(bindings)

		if (investigation.hash !== this.#hash)
			throw new Error("newly set bindings are not compatible, hash mismatch")

		this.#bindings = deep.freeze(bindings)
		this.#expressionlist = investigation.expressionlist
	}

	resolveIntent(samples: Sample[], now = performance.now()): Intent {
		return this.#intentResolver.resolve(
			this.#hash,
			this.#expressionlist,
			samples,
			now,
		)
	}

	resolveActions(intent: Intent): Actions<B> {
		this.#actionResolver.resolve(
			this.#hash,
			this.#actionlist,
			intent,
		)
		return this.actions
	}
}

