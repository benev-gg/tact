
import {RMap} from "@e280/strata"
import {got, hex, setEntries, subby} from "@e280/stz"

import {Bindings} from "../../input/types.js"
import {Controller} from "../../input/controller.js"
import {Profile, ProfileKey, ProfilesData} from "./types.js"
import {isCompatible} from "../../input/investigate/is-compatible.js"

export class Profiles<B extends Bindings = any> {
	readonly defaultKey
	readonly default

	#onSave = subby<[ProfilesData]>()
	readonly onSave = this.#onSave.on

	stock = new RMap<ProfileKey, Profile<B>>()
	custom = new RMap<ProfileKey, Profile<B>>()
	assignments = new RMap<Controller, ProfileKey>()

	constructor(stock: Record<ProfileKey, Profile<B>>) {
		this.defaultKey = got(Object.keys(stock)[0], "profiles requires at least one in stock")
		this.default = got(stock[this.defaultKey])
		setEntries(this.stock, Object.entries(stock))
	}

	#ensureCompatible(bindings: B) {
		if (!isCompatible(bindings, this.default.bindings))
			throw new Error("incompatible bindings")
	}

	/** get profile by key. */
	get(profileKey?: ProfileKey) {
		if (profileKey === undefined)
			return this.default

		return this.custom.get(profileKey)
			?? this.stock.get(profileKey)
			?? got(this.stock.get(this.defaultKey))
	}

	/** learn what profile key a controller is assigned to. */
	query(controller: Controller): ProfileKey {
		for (const [c, profileKey] of this.assignments) {
			if (c === controller)
				return profileKey
		}
		return this.defaultKey
	}

	/** assign a controller to a specific profile. */
	assign(controller: Controller, profileKey: ProfileKey) {
		controller.bindings = this.get(profileKey).bindings
		this.assignments.set(controller, profileKey)
	}

	create(profile: Profile<B>) {
		this.#ensureCompatible(profile.bindings)
		const profileKey = hex.random(16)
		this.custom.set(profileKey, structuredClone(profile))
		this.#save()
		return profileKey
	}

	clone(basedOn: ProfileKey) {
		const {label, bindings} = this.get(basedOn)
		return this.create({basedOn, bindings, label: `${label} copy`})
	}

	delete(profileKey: ProfileKey) {
		this.custom.delete(profileKey)
		this.#save()
		for (const [controller, controllerKey] of this.assignments) {
			if (controllerKey === profileKey)
				this.assign(controller, profileKey)
		}
	}

	/** updating the bindings of a profile key. */
	update(profileKey: ProfileKey, changes: Partial<{
			bindings: B
			label: string
		}>) {

		if (changes.bindings)
			this.#ensureCompatible(changes.bindings)

		const staleProfile = this.get(profileKey)
		const freshProfile = {...structuredClone(staleProfile), ...changes}

		this.custom.set(profileKey, freshProfile)

		for (const [controller, controllerKey] of this.assignments) {
			if (controllerKey === profileKey)
				controller.bindings = freshProfile.bindings
		}

		this.#save()
	}

	#save() {
		this.#onSave.publish({custom: [...this.custom]})
	}

	load(data: ProfilesData) {
		for (const [,profile] of data.custom)
			this.#ensureCompatible(profile.bindings)

		this.custom.clear()
		setEntries(this.custom, data.custom)
	}
}

