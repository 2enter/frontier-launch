/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Cargoes = "cargoes",
	News = "news",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export enum CargoesTypeOptions {
	"water" = "water",
	"spring" = "spring",
	"stair" = "stair",
	"star" = "star",
	"cake" = "cake",
	"diamond" = "diamond",
}

export enum CargoesStatusOptions {
	"shipping" = "shipping",
	"shipped" = "shipped",
	"launched" = "launched",
}
export type CargoesRecord = {
	draw_duration: number
	paint: string
	status: CargoesStatusOptions
	texture?: string
	type: CargoesTypeOptions
}

export type NewsRecord = {
	hype: number
	title?: string
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type CargoesResponse<Texpand = unknown> = Required<CargoesRecord> & BaseSystemFields<Texpand>
export type NewsResponse<Texpand = unknown> = Required<NewsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	cargoes: CargoesRecord
	news: NewsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	cargoes: CargoesResponse
	news: NewsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'cargoes'): RecordService<CargoesResponse>
	collection(idOrName: 'news'): RecordService<NewsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
