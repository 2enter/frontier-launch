/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Supplies = "supplies",
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

export enum SuppliesTypeOptions {
	"E0" = "0",
	"E1" = "1",
	"E2" = "2",
	"E3" = "3",
	"E4" = "4",
	"E5" = "5",
}

export enum SuppliesStatusOptions {
	"shipping" = "shipping",
	"shipped" = "shipped",
	"launched" = "launched",
}
export type SuppliesRecord = {
	draw_duration: number
	paint: string
	status: SuppliesStatusOptions
	supply?: string
	type: SuppliesTypeOptions
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type SuppliesResponse<Texpand = unknown> = Required<SuppliesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	supplies: SuppliesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	supplies: SuppliesResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'supplies'): RecordService<SuppliesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
