
/** stable reference to a gamepad, has a getter to get the latest gamepad snapshot */
export class Pad {
	constructor(private get: () => Gamepad) {}

	get gamepad() {
		return this.get()
	}
}

