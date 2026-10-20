
import {RMap, RSet} from "@e280/strata"
import {Port} from "../port.js"
import {Controller} from "../controller.js"

export class Runtime {
	ports = new RSet<Port>()
	controllers = new RSet<Controller>()
	portAssignments = new RMap<Controller, Port | undefined>()
}

