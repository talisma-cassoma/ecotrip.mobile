import { AppState, Alert } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'

import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ??  (Constants.manifest as any)?.extra;

export const SUPABASE_URL = extra?.SUPABASE_URL;
export const SUPABASE_ANON_KEY = extra?.SUPABASE_ANON_KEY;



if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
   Alert.alert('Missing Supabase URL or Anon Key environment variables')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
})

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})