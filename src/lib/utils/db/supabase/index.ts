import {createClient as createServerSupabase} from './server'
import {createClient as createBrowserSupabase} from './client'

export const createClient = createServerSupabase
export const createBrowserClient = createBrowserSupabase
