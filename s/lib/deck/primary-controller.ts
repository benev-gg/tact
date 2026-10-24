
import {Hub} from "./hub.js"
import {Profiles} from "./profiles.js"
import {Bindings} from "../input/types.js"
import {Controller} from "../input/controller.js"

export function primaryController<B extends Bindings>(
		hub: Hub<B>,
		profiles: Profiles<B>,
		controller: Controller<B>,
	) {

	profiles.assignments.set(controller, profiles.default)

	const port = hub.createPort()
	hub.add(controller)
	hub.plug(port, controller)

	return controller
}

