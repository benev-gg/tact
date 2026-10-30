
import {RMap} from "@e280/strata"
import {got, IdCounter, setEntries, subby} from "@e280/stz"

import {Profile, ProfileKey} from "../../types.js"
import {Bindings} from "../../../../input/types.js"
import {Controller} from "../../../../input/controller.js"
import {hashBindings} from "../../../../input/investigate/hash-bindings.js"
import {ControllerHandle, ControllerMeta, ControlsOptions} from "../types.js"

export type ControlsData<B extends Bindings> = (
	ReturnType<typeof makeControlsData<B>>
)

export function makeControlsData<B extends Bindings>(options: ControlsOptions<B>) {
	const {presets} = options
	const fallbackKey = got(Object.keys(presets)[0], "missing presets")
	const fallbackProfile = got(presets[fallbackKey])
	const bindings = fallbackProfile.bindings

	const kv = options.kv.scope(
		hashBindings(bindings).toString()
	)

	const profiles = {
		presets: new RMap<ProfileKey, Profile<B>>(),
		customs: new RMap<ProfileKey, Profile<B>>(),
		fallback: {key: fallbackKey, profile: fallbackProfile},
	}

	setEntries(profiles.presets, Object.entries(presets))

	return {
		subby: subby(),

		kv,
		presets,
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

