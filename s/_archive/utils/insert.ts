
export function insert<K, V>(map: Map<K, V>, entries: [K, V][]) {
	for (const [key, value] of entries)
		map.set(key, value)
}

