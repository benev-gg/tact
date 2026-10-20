
import {Source} from "../types.js"

export class Sources extends Set<Source> {
	get samples() {
		return [...this].flatMap(source => source.samples)
	}

	dispose() {
		return [...this].forEach(source => source.dispose?.())
	}
}

