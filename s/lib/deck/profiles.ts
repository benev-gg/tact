
import {RMap} from "@e280/strata"
import {got, setEntries} from "@e280/stz"

import {Bindings} from "../input/types.js"
import {Profile, ProfileKey} from "./types.js"
import {Controller} from "../input/controller.js"

export class Profiles<B extends Bindings = any> {
	readonly default
	stock = new RMap<ProfileKey, Profile<B>>()
	custom = new RMap<ProfileKey, Profile<B>>()
	assignments = new RMap<Controller, ProfileKey>()

	constructor(stock: Record<ProfileKey, Profile<B>>) {
		this.default = got(Object.keys(stock)[0])
		setEntries(this.stock, Object.entries(stock))
	}
}

