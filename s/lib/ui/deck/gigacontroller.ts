
import {Kv} from "@e280/kv"
import {RMap} from "@e280/strata"
import {Content} from "@e280/sly"
import {collect, given, got, hex, IdCounter, setEntries} from "@e280/stz"

import {Handle} from "./assignments.js"
import {Bindings} from "../../input/types.js"
import {Profile, ProfileKey} from "./types.js"
import {Controller} from "../../input/controller.js"
import {isCompatible} from "../../input/investigate/is-compatible.js"

export type ControllerMeta = {
	id: number
	icon: Content
	handle: Handle
	name: string
	tooltip: string
	defaultProfileKey: ProfileKey
}

export type CommanderOptions<B extends Bindings> = {
	kv: Kv
	stock: Record<ProfileKey, Profile<B>>
}

export type CommanderData<B extends Bindings> = ReturnType<typeof setupCommandData<B>>

export function setupCommandData<B extends Bindings>({
		kv,
		stock,
	}: CommanderOptions<B>) {

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
		profiles,
		assignments: new RMap<Controller, ProfileKey>(),
		preferences: new RMap<Handle, ProfileKey>(),
		idCounter: new IdCounter(),
		controllers: new RMap<Controller, ControllerMeta>(),
		kvs: {
			profiles: kv.scope<Profile>("profiles"),
			preferences: kv.scope<ProfileKey>("preferences"),
		},
	}
}

export class Profiles<B extends Bindings> {
	#data

	constructor(data: CommanderData<B>) {
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
		const {kvs, assignments, profiles: {customs}} = this.#data
		customs.delete(profileKey)
		await kvs.profiles.delete(profileKey)
		for (const [controller, controllerKey] of assignments) {
			if (controllerKey === profileKey)
				this.assign(controller, profileKey)
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

	async assign(controller: Controller, profileKey: ProfileKey) {
		const {kvs, controllers, assignments} = this.#data
		controller.bindings = this.get(profileKey).bindings
		assignments.set(controller, profileKey)

		await given(controllers.get(controller)?.handle, async handle => {
			kvs.preferences.set(handle, profileKey)
			await kvs.preferences.set(handle, profileKey)
		})
	}

	assignedKey(controller: Controller) {
		const {assignments} = this.#data
		return assignments.get(controller)
	}
}

export class ControllerCommander<B extends Bindings> {
	#data
	profiles

	constructor(options: CommanderOptions<B>) {
		this.#data = setupCommandData(options)
		this.profiles = new Profiles(this.#data)
	}

	async load() {
		const {kvs, controllers, preferences, assignments, profiles: {customs}} = this.#data

		setEntries(customs, await collect(kvs.profiles))
		setEntries(preferences, await collect(kvs.preferences))

		for (const [controller, meta] of controllers) {
			controller.bindings = this.profiles.get(
				assignments.get(controller) ?? preferences.get(meta.handle)
			)
		}
	}

	get controllers() {
		return [...this.#data.controllers.keys()]
	}

	get fallbackProfileKey() {
		return this.#data.profiles.fallback.key
	}

	meta(controller: Controller) {
		return this.#data.controllers.get(controller)
	}

	attach(controller: Controller, meta: Omit<ControllerMeta, "id">) {
		const id = this.#data.idCounter.next()
		this.#data.controllers.set(controller, {...meta, id})
	}

	detach(controller: Controller) {
		this.#data.controllers.delete(controller)
	}
}

