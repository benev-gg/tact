
import {Xy} from "@benev/math"

export function splitAxis(n: number) {
	return (n >= 0)
		? [n, 0]
		: [0, Math.abs(n)]
}

export function splitVector(vector: Xy) {
	const [right, left] = splitAxis(vector.x)
	const [down, up] = splitAxis(vector.y)
	return {up, down, left, right}
}

