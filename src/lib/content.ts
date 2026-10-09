import { getCollection, getEntry } from 'astro:content';

/** Lanza un error de build legible si la colección no tiene la cantidad exacta exigida por el Agents. */
function assertCount(name: string, actual: number, expected: number) {
  if (actual !== expected) {
    throw new Error(`Colección "${name}": se esperaban ${expected} entradas y hay ${actual}.`);
  }
}

export async function getProfile() {
  const entry = await getEntry('profile', 'profile');
  if (!entry) throw new Error('Falta src/data/profile.json (clave "profile").');
  return entry.data;
}

export async function getAreas() {
  const items = (await getCollection('areas')).sort((a, b) => a.data.order - b.data.order);
  assertCount('areas', items.length, 4);
  return items.map((i) => i.data);
}

export async function getMethod() {
  const items = (await getCollection('method')).sort((a, b) => a.data.step.localeCompare(b.data.step));
  assertCount('method', items.length, 5);
  return items.map((i) => i.data);
}

export async function getEvents() {
  const items = (await getCollection('events')).sort((a, b) => a.data.order - b.data.order);
  assertCount('events', items.length, 5);
  return items.map((i) => i.data);
}
