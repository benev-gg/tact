
import {guarantee, is, need} from "@e280/stz"

export class Identifier<Item> {
	#nextId = 0
	#ids = new Map<Item, number>()
	#items = new Map<number, Item>()

	id(item: Item) {
		const id = guarantee(this.#ids, item, () => {
			const freshId = this.#nextId++
			this.#items.set(freshId, item)
			return freshId
		})
		return id
	}

	need(id: number) {
		return need(this.#items, id)
	}

	delete(item: Item) {
		const id = this.#ids.get(item)
		if (is.happy(id)) {
			this.#ids.delete(item)
			this.#items.delete(id)
		}
	}
}

