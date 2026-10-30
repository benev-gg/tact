
import {Parcel} from "./types.js"
import {endian} from "../endian.js"
import {sizeHeader, sizeLength, sizePlayerId} from "./sizes.js"

export function decodeParcels(buffer: ArrayBuffer): Parcel[] {
	const view = new DataView(buffer)
	const parcels: Parcel[] = []
	let cursor = 0

	while (cursor < buffer.byteLength) {
		if (buffer.byteLength - cursor < sizeHeader)
			throw new Error("truncated header")

		const playerId = view.getUint32(cursor, endian)
		cursor += sizePlayerId

		const length = view.getUint32(cursor, endian)
		cursor += sizeLength

		if (length > buffer.byteLength - cursor)
			throw new Error("truncated data")

		const intents = buffer.slice(cursor, cursor + length)
		cursor += length

		parcels.push({playerId: playerId, intents})
	}

	return parcels
}

