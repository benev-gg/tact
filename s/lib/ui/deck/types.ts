
import {Hub} from "./hub.js"
import {Bindings} from "../../input/types.js"
import {Controls} from "./controls/controls.js"

export type PlayerId = number

export type ProfileKey = string

export type Profile<B extends Bindings = any> = {
	label: string
	bindings: B
	basedOn?: string
}

export type Presets<B extends Bindings> = Record<ProfileKey, Profile<B>>

export type Deck<B extends Bindings = any> = {
	hub: Hub<B>
	maxPlayers: number
	controls: Controls<B>
}

export const asDeck = <B extends Bindings>(deck: Deck<B>) => deck
export const asPresets = <B extends Bindings>(presets: Presets<B>) => presets

