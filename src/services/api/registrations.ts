import { supabase } from '../../lib/supabase';
import type { RegistrationRequest } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbRow = Record<string, any>;

export async function fetchPendingRegistrations(): Promise<RegistrationRequest[]> {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, role, status, created_at')
    .eq('role', 'manager')
    .eq('status', 'pending');

  if (error || !data) return [];

  return data.map((row: DbRow): RegistrationRequest => ({
    id: row.id,
    userId: row.id,
    username: '',
    displayName: row.name ?? '',
    requestedRole: 'manager',
    status: 'pending',
    createdAt: row.created_at ?? '',
  }));
}
