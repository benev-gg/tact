
import {RMap} from "@e280/strata"
import {inserts, need} from "@e280/stz"
import {Profile, ProfileKey} from "../types.js"

export class Profiles {
	stock

	constructor(stock: Record<ProfileKey, Profile>, public custom: RMap<ProfileKey, Profile>) {
		this.stock = new RMap<ProfileKey, Profile>()
		inserts(this.stock, Object.entries(stock))

		if (this.stock.size === 0)
			throw new Error("must be at least one stock profile")
	}

	get all() {
		return [...this.stock, ...this.custom]
	}

	normalizeKey(key?: ProfileKey) {
		return key && (this.stock.has(key) || this.custom.has(key))
			? key
			: this.defaultId
	}

	get defaultId() {
		return [...this.stock.keys()][0]
	}

	get(key?: ProfileKey) {
		return this.need(this.normalizeKey(key))
	}

	need(key: ProfileKey) {
		return this.stock.get(key) ?? need(this.custom, key)
	}
}

