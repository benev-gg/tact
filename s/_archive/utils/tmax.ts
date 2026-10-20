
export function tmax(values: number[]) {
	return values.length > 0
		? Math.max(...values)
		: 0
}

