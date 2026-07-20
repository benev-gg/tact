
import {RMap} from "@e280/strata"
import {Cubby, inserts} from "@e280/stz"
import {shiftLimit} from "../../utils/shift-limit.js"
import {ControllerHandle, DeckState, Profile, ProfileKey} from "../types.js"

const limit = 256

export class Settings {
	profileAssignments = new RMap<ControllerHandle, ProfileKey>()
	customProfiles = new RMap<ProfileKey, Profile>()

	constructor(private store: Cubby<DeckState>) {}

	async save() {
		await this.store.set({
			customProfiles: shiftLimit(limit, [...this.customProfiles]),
			profileAssignments: shiftLimit(limit, [...this.profileAssignments]),
		})
	}

	async load() {
		const state = await this.store.get()
		this.customProfiles.clear()
		this.profileAssignments.clear()
		inserts(this.customProfiles, state?.customProfiles ?? [])
		inserts(this.profileAssignments, state?.profileAssignments ?? [])
	}
}

