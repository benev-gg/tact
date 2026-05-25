
import {derived} from "@e280/strata"
import {Runtime} from "./parts/runtime.js"
import {Controller} from "./controller.js"

export class Port {
	#runtime
	#controllers

	constructor(runtime: Runtime) {
		this.#runtime = runtime
		this.#controllers = derived(
			() => [...this.#runtime.controllers]
				.filter(controller => this.#runtime.portAssignments.get(controller) === this)
		)
	}

	get controllers() {
		return this.#controllers()
	}

	plug(controller: Controller) {
		this.#runtime.portAssignments.set(controller, this)
	}

	unplug(controller: Controller) {
		this.#runtime.portAssignments.delete(controller)
	}

	resolveIntents(now: number) {
		return this.controllers
			.flatMap(controller => controller.resolveIntents(now))
	}
}

