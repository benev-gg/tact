
import {dataViewFrom} from "@e280/stz"
import {Intent} from "./types.js"
import {endian} from "../endian.js"
import {sizeHash, sizeId, sizeValue} from "./sizes.js"

export function decodeIntents(buffer: Uint8Array) {
	const intents: Intent[] = []
	const dv = dataViewFrom(buffer)
	let cursor = 0

	const minihash = dv.getUint32(cursor, endian)
	cursor += sizeHash

	while (cursor < buffer.byteLength) {
		const id = dv.getUint16(cursor, endian)
		cursor += sizeId

		const value = dv.getFloat32(cursor, endian)
		cursor += sizeValue

		intents.push({id, value})
	}

	return {minihash, intents}
}

