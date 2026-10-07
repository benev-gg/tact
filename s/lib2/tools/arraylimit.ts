
export function arraylimit<X>(array: X[], limit: number) {
	if (limit <= 0) return []
	return (array.length > limit)
		? array.slice(-limit)
		: array
}

