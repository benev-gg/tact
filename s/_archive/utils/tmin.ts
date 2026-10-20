
export function tmin(values: number[]) {
	return values.length > 0
		? Math.min(...values)
		: 0
}

