
import {Intent} from "../types.js"
import {littleEndian, size} from "./consts.js"

/** encode intents into compact binary format (good for networking) */
export function encodeIntents(intents: Intent[]) {
	const length = intents.length * size
	const buffer = new ArrayBuffer(length)
	const view = new DataView(buffer)

	for (let i = 0; i < intents.length; i++) {
		const [index, value] = intents[i]
		const offset = i * size
		view.setUint16(offset, index, littleEndian)
		view.setFloat32(offset + 2, value, littleEndian)
	}

	return new Uint8Array(buffer)
}

