
import {RMap} from "@e280/strata"
import {got, IdCounter, setEntries} from "@e280/stz"

import {Profile, ProfileKey} from "../../types.js"
import {Bindings} from "../../../../input/types.js"
import {Controller} from "../../../../input/controller.js"
import {ControllerHandle, ControllerMeta, ControlsOptions} from "../types.js"

export type ControlsData<B extends Bindings> = (
	ReturnType<typeof setupControlsData<B>>
)

export function setupControlsData<B extends Bindings>({
		kv,
		stock,
	}: ControlsOptions<B>) {

	const fallbackKey = got(Object.keys(stock)[0], "profiles requires at least one in stock")
	const fallbackProfile = got(stock[fallbackKey])
	const bindings = fallbackProfile.bindings

	const profiles = {
		stocks: new RMap<ProfileKey, Profile<B>>(),
		customs: new RMap<ProfileKey, Profile<B>>(),
		fallback: {key: fallbackKey, profile: fallbackProfile},
	}

	setEntries(profiles.stocks, Object.entries(stock))

	return {
		kv,
		stock,
		bindings,
		idCounter: new IdCounter(),

		profiles,

		controllers: new RMap<Controller, ControllerMeta>(),
		assignments: new RMap<Controller, ProfileKey>(),
		preferences: new RMap<ControllerHandle, ProfileKey>(),

		kvs: {
			profiles: kv.scope<Profile>("profiles"),
			preferences: kv.scope<ProfileKey>("preferences"),
		},
	}
}

