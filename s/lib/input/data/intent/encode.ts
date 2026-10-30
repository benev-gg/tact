
import {Intent} from "./types.js"
import {endian} from "../endian.js"
import {sizeHash, sizeId, sizeIntent, sizeValue} from "./sizes.js"

export function encodeIntents(hash: number, intents: Intent[]) {
	const byteCount = sizeHash + (intents.length * sizeIntent)
	const buffer = new ArrayBuffer(byteCount)
	const dv = new DataView(buffer)
	let cursor = 0

	dv.setUint32(cursor, hash, endian)
	cursor += sizeHash

	for (const intent of intents) {
		dv.setUint16(cursor, intent.id, endian)
		cursor += sizeId

		dv.setFloat32(cursor, intent.value, endian)
		cursor += sizeValue
	}

	return buffer
}

