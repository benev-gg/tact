
import {Hub} from "./hub.js"
import {Bindings} from "../../input/types.js"
import {Controls} from "./controls/controls.js"

export type ProfileKey = string

export type Profile<B extends Bindings = any> = {
	label: string
	bindings: B
	basedOn?: string
}

export type StockProfiles<B extends Bindings> = Record<ProfileKey, Profile<B>>

export type Deck<B extends Bindings = any> = {
	hub: Hub<B>
	maxPorts: number
	controls: Controls<B>
}

export const asDeck = <B extends Bindings>(deck: Deck<B>) => deck
export const asStockProfiles = <B extends Bindings>(stock: StockProfiles<B>) => stock

