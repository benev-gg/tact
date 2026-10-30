
import {Kv} from "@e280/kv"
import {Content} from "@e280/sly"

import {Bindings} from "../../../input/types.js"
import {ProfileKey, Presets} from "../types.js"

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
	presets: Presets<B>
}

