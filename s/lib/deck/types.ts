
import {Kv} from "@e280/kv"
import {Hub} from "./hub.js"
import {Profiles} from "./profiles.js"
import {Bindings} from "../input/types.js"

export type ProfileKey = string

export type Profile<B extends Bindings> = {
	label: string
	bindings: B
}

export type Deck<B extends Bindings = any> = {
	kv: Kv
	hub: Hub<B>
	bindings: B
	profiles: Profiles<B>
	maxPorts: number
}

export const asDeck = <B extends Bindings>(deck: Deck<B>) => deck

