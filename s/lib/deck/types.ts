
import {Bindings} from "../input/types.js"

export type ProfileKey = string
export type ControllerHandle = string

export type Profile = {
	label: string
	bindings: Bindings
}

export type DeckState = {
	customProfiles: [key: ProfileKey, profile: Profile][]
	profileAssignments: [handle: ControllerHandle, key: ProfileKey][]
}

