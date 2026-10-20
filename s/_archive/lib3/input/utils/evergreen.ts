
export function evergreen<V>(value: V, fn: () => V | null | undefined) {
	let cached = value
	return () => {
		const next = fn()
		if (next !== undefined && next !== null) cached = next
		return cached
	}
}

