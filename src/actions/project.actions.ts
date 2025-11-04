'use server';

import { getUserProjects as getUserProjectsDb } from '@/db/project.db';
import { IProject } from '@/types/project.types';

export async function getUserProjectsAction(): Promise<IProject[]> {
  return await getUserProjectsDb();
}
