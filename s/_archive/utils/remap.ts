
export function remap<K, V>(entries: [K, V][], fn?: (map: Map<K, V>) => void) {
	const map = new Map(entries)
	fn?.(map)
	return [...map.entries()]
}

