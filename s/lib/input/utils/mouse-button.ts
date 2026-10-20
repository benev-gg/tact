
export function mouseButton(button: number) {
	switch (button) {
		case 0: return "pointer.button.left"
		case 1: return "pointer.button.middle"
		case 2: return "pointer.button.right"
		default: return `pointer.button.${button + 1}`
	}
}

