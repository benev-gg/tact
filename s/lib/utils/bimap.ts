
export class Bimap<K, V> extends Map<K, V> {
	#keys = new Map<V, K>()

	keyOf(value: V) {
		return this.#keys.get(value)
	}
}

