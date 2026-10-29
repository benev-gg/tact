
import {Kv} from "@e280/kv"
import {Hub} from "./hub.js"
import {Profiles} from "./profiles.js"
import {Bindings} from "../../input/types.js"
import {ControllerRegistry} from "./registry.js"

export type ProfileKey = string

export type Profile<B extends Bindings = any> = {
	label: string
	bindings: B
	basedOn?: string
}

export type ProfilesData = {
	custom: [ProfileKey, Profile][],
}

export type Deck<B extends Bindings = any> = {
	kv: Kv
	hub: Hub<B>
	bindings: B
	maxPorts: number
	profiles: Profiles<B>
	registry: ControllerRegistry
}

export const asDeck = <B extends Bindings>(deck: Deck<B>) => deck

