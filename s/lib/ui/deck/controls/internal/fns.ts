
import {given, got} from "@e280/stz"
import {ControlsData} from "./setup.js"
import {ProfileKey} from "../../types.js"
import {Bindings} from "../../../../input/types.js"
import {Controller} from "../../../../input/controller.js"

export function getProfile<B extends Bindings>(
		data: ControlsData<B>,
		profileKey?: ProfileKey,
	) {

	const {stocks, customs, fallback} = data.profiles

	if (profileKey === undefined)
		return fallback.profile

	return customs.get(profileKey)
		?? stocks.get(profileKey)
		?? got(stocks.get(fallback.key))
}

export async function assignProfile<B extends Bindings>(
		data: ControlsData<B>,
		controller: Controller,
		profileKey: ProfileKey,
	) {

	const {kvs, controllers, assignments} = data
	controller.bindings = getProfile(data, profileKey).bindings
	assignments.set(controller, profileKey)

	await given(controllers.get(controller)?.handle, async handle => {
		data.preferences.set(handle, profileKey)
		await kvs.preferences.set(handle, profileKey)
	})
}

