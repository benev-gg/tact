
import {ControlsData} from "./data.js"
import {Profile, ProfileKey} from "../../types.js"
import {assignProfile, getProfile} from "./fns.js"
import {Bindings} from "../../../../input/types.js"
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

	get presets() {
		return [...this.#data.profiles.presets]
	}

	get customs() {
		return [...this.#data.profiles.customs]
	}

	isPreset(profileKey: string) {
		return this.#data.profiles.presets.has(profileKey)
	}

	get(profileKey?: ProfileKey) {
		return getProfile(this.#data, profileKey)
	}

	async create(key: ProfileKey, profile: Profile<B>) {
		const {kvs, profiles} = this.#data
		this.#ensureBindingsAreCompatible(profile.bindings)
		profiles.customs.set(key, profile)
		await kvs.profiles.set(key, profile)
		this.#data.subby.publish()
	}

	async clone(key: ProfileKey, basedOn: ProfileKey) {
		const {label, bindings} = this.get(basedOn)
		await this.create(key, {basedOn, bindings, label: `${label} copy`})
	}

	async delete(profileKey: ProfileKey) {
		const {kvs, assignments, profiles: {customs, fallback}} = this.#data
		customs.delete(profileKey)
		await kvs.profiles.delete(profileKey)
		for (const [controller, controllerKey] of assignments)
			if (controllerKey === profileKey)
				await assignProfile(this.#data, controller, fallback.key)
		this.#data.subby.publish()
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
		this.#data.subby.publish()
	}
}

