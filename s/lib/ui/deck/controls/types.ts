
import {Kv} from "@e280/kv"
import {Content} from "@e280/sly"

import {Profile, ProfileKey} from "../types.js"
import {Bindings} from "../../../input/types.js"

export type ControllerHandle = string

export type ControllerMeta = {
	id: number
	icon: Content
	handle: ControllerHandle
	name: string
	tooltip: string
	defaultProfileKey: ProfileKey
}

export type ControlsOptions<B extends Bindings> = {
	kv: Kv
	stock: Record<ProfileKey, Profile<B>>
}

