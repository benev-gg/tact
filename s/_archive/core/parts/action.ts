
import {sub} from "@e280/stz"
import {isDown} from "../../utils/is-down.js"

export class Action {
	on = sub<[Action]>()
	onUp = sub<[Action]>()
	onDown = sub<[Action]>()

	#value = 0
	#previous = 0

	changed = false

	get value() {
		return this.#value
	}

	set value(v: number) {
		this.#previous = this.#value
		this.#value = v

		if (this.changed) {
			this.on.publish(this)
			if (this.up) this.onUp.publish(this)
			else this.onDown.publish(this)
		}
	}

	get previous() { return this.#previous }
	get up() { return !isDown(this.#value) }
	get down() { return isDown(this.#value) }
	get changedUp() { return this.changed && this.up }
	get changedDown() { return this.changed && this.down }
}

