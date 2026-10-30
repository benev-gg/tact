
import {Intent} from "./types.js"
import {endian} from "../endian.js"
import {sizeHash, sizeId, sizeValue} from "./sizes.js"

export function decodeIntents(buffer: ArrayBuffer) {
	const intents: Intent[] = []
	const dv = new DataView(buffer)
	let cursor = 0

	const hash = dv.getUint32(cursor, endian)
	cursor += sizeHash

	while (cursor < buffer.byteLength) {
		const id = dv.getUint16(cursor, endian)
		cursor += sizeId

		const value = dv.getFloat32(cursor, endian)
		cursor += sizeValue

		intents.push({id, value})
	}

	return {hash, intents}
}

