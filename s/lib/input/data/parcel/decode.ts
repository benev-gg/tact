
import {Parcel} from "./types.js"
import {endian} from "../endian.js"
import {sizeHeader, sizeLength, sizePortId} from "./sizes.js"

export function decodeParcel(buffer: ArrayBuffer): Parcel[] {
	const view = new DataView(buffer)
	const parcels: Parcel[] = []
	let cursor = 0

	while (cursor < buffer.byteLength) {
		if (buffer.byteLength - cursor < sizeHeader)
			throw new Error("truncated header")

		const portId = view.getUint32(cursor, endian)
		cursor += sizePortId

		const length = view.getUint32(cursor, endian)
		cursor += sizeLength

		if (length > buffer.byteLength - cursor)
			throw new Error("truncated data")

		const intents = buffer.slice(cursor, cursor + length)
		cursor += length

		parcels.push({portId, intents})
	}

	return parcels
}

