
import {got, hex} from "@e280/stz"
import {Profile, ProfileKey} from "../../types.js"
import {assignProfile} from "./fns.js"
import {Bindings} from "../../../../input/types.js"
import {ControlsData} from "./setup.js"
import {isCompatible} from "../../../../input/investigate/is-compatible.js"

export class Profiles<B extends Bindings> {
	#data

	constructor(data: ControlsData<B>) {
		this.#data = data
	}

	#ensureBindingsAreCompatible(b: B) {
		if (!isCompatible(b, this.#data.bindings))
			throw new Error("incompatible bindings")
	}

	get(profileKey?: ProfileKey) {
		const {stocks, customs, fallback} = this.#data.profiles

		if (profileKey === undefined)
			return fallback.profile

		return customs.get(profileKey)
			?? stocks.get(profileKey)
			?? got(stocks.get(fallback.key))
	}

	async create(profile: Profile<B>) {
		const {kvs} = this.#data
		this.#ensureBindingsAreCompatible(profile.bindings)
		const profileKey = hex.random(16)
		await kvs.profiles.set(profileKey, profile)
		return profileKey
	}

	clone(basedOn: ProfileKey) {
		const {label, bindings} = this.get(basedOn)
		return this.create({basedOn, bindings, label: `${label} copy`})
	}

	async delete(profileKey: ProfileKey) {
		const {kvs, assignments, profiles: {customs, fallback}} = this.#data
		customs.delete(profileKey)
		await kvs.profiles.delete(profileKey)
		for (const [controller, controllerKey] of assignments) {
			if (controllerKey === profileKey)
				await assignProfile(this.#data, controller, fallback.key)
		}
	}

	async update(profileKey: ProfileKey, changes: Partial<{
			bindings: B
			label: string
		}>) {

		const {kvs, assignments, profiles: {customs}} = this.#data

		if (changes.bindings)
			this.#ensureBindingsAreCompatible(changes.bindings)

		const staleProfile = this.get(profileKey)
		const freshProfile = {...structuredClone(staleProfile), ...changes}

		customs.set(profileKey, freshProfile)

		for (const [controller, controllerKey] of assignments) {
			if (controllerKey === profileKey)
				controller.bindings = freshProfile.bindings
		}

		await kvs.profiles.set(profileKey, freshProfile)
	}
}

