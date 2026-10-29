
import {Kv} from "@e280/kv"
import {Hub} from "./hub.js"
import {Bindings} from "../../input/types.js"
import {Controls} from "./controls/controls.js"

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
	controls: Controls<B>
}

export const asDeck = <B extends Bindings>(deck: Deck<B>) => deck

