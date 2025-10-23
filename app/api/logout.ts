'use server';

import { Session } from '@/classes/Session.class';

export async function logout(): Promise<string> {
    return await Session.destroySession()
}