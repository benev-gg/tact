
import {signal} from "@e280/strata"
import {debounce, hex} from "@e280/stz"

export class Visualizer {
	$hex = signal("")

	clear = debounce(250, () => {
		this.$hex.set("")
	})

	update(data: ArrayBuffer) {
		this.$hex(hex(new Uint8Array(data)))
		this.clear()
	}
}

