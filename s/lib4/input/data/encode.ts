
import {Intent} from "../types.js"
import {endian, sizeHash, sizeId, sizeIntention, sizeValue} from "./params.js"

export function encodeData(hash: number, intents: Intent[]) {
	const byteCount = sizeHash + (intents.length * sizeIntention)
	const buffer = new ArrayBuffer(byteCount)
	const dv = new DataView(buffer)
	let cursor = 0

	dv.setUint32(cursor, hash, endian)
	cursor += sizeHash

	for (const intention of intents) {
		dv.setUint16(cursor, intention.id, endian)
		cursor += sizeId

		dv.setFloat32(cursor, intention.value, endian)
		cursor += sizeValue
	}

	return buffer
}

