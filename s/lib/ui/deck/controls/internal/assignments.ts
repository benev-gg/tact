
import {given} from "@e280/stz"
import {ProfileKey} from "../../types.js"
import {getProfile} from "./fns.js"
import {ControlsData} from "./setup.js"
import {Controller} from "../../../../input/controller.js"

export class Assignments {
	#data

	constructor(data: ControlsData<any>) {
		this.#data = data
	}

	async assign(controller: Controller, profileKey: ProfileKey) {
		const {kvs, controllers, assignments} = this.#data
		controller.bindings = getProfile(this.#data, profileKey).bindings
		assignments.set(controller, profileKey)

		await given(controllers.get(controller)?.handle, async handle => {
			kvs.preferences.set(handle, profileKey)
			await kvs.preferences.set(handle, profileKey)
		})
	}

	assignedProfileKeyOf(controller: Controller) {
		const {assignments} = this.#data
		return assignments.get(controller)
	}
}

