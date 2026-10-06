
import {Sample} from "../../../sampling/types.js"

export function forFreshness(last: number | undefined) {
	return (sample: Sample) => (last === undefined || sample.time >= last)
}

