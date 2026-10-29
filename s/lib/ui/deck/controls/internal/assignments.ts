
import {assignProfile} from "./fns.js"
import {ControlsData} from "./setup.js"
import {ProfileKey} from "../../types.js"
import {Controller} from "../../../../input/controller.js"

export class Assignments {
	#data

	constructor(data: ControlsData<any>) {
		this.#data = data
	}

	async assign(controller: Controller, profileKey: ProfileKey) {
		return assignProfile(this.#data, controller, profileKey)
	}

	assignedProfileKeyOf(controller: Controller) {
		const {assignments} = this.#data
		return assignments.get(controller) ?? this.#data.profiles.fallback.key
	}
}

