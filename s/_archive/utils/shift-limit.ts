
/** limit the length of an array by trimming off the beginning until it's within the limit */
export function shiftLimit<X>(limit: number, array: X[]) {
	while (array.length > limit)
		array.shift()

	return array
}

