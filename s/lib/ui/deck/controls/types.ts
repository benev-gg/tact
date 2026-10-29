
import {Kv} from "@e280/kv"
import {Content} from "@e280/sly"

import {Handle} from "../assignments.js"
import {Profile, ProfileKey} from "../types.js"
import {Bindings} from "../../../input/types.js"

export type ControllerMeta = {
	id: number
	icon: Content
	handle: Handle
	name: string
	tooltip: string
	defaultProfileKey: ProfileKey
}

export type ControlsOptions<B extends Bindings> = {
	kv: Kv
	stock: Record<ProfileKey, Profile<B>>
}

