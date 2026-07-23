
import {remap, Vec2, Xy} from "@benev/math"

export function circularClamp(vector: Xy, range: Vec2) {
	const v = Vec2.from(vector)
	const distance = v.distance_(0, 0)
	const modifiedDistance = remap(
		distance,
		range.x, range.y,
		0, 1,
		true,
	)
	return v.normalize().mulBy(modifiedDistance)
}
