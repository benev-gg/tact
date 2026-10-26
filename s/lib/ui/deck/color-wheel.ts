
export class ColorWheel {
	#count = 0

	get hue() {
		return this.#count++ * 137.508
	}
}

