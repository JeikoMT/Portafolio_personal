import { getCollection, getEntry } from 'astro:content';

/** Lanza un error de build legible si la colección no tiene la cantidad exacta exigida por el Agents. */
function assertCount(name: string, actual: number, expected: number) {
  if (actual !== expected) {
    throw new Error(`Colección "${name}": se esperaban ${expected} entradas y hay ${actual}.`);
  }
}

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export async function getProfile() {
  const entry = await getEntry('profile', 'profile');
  if (!entry) throw new Error('Falta src/data/profile.json (clave "profile").');
  return entry.data;
}

export async function getAreas() {
  const items = (await getCollection('areas')).sort(byOrder);
  assertCount('areas', items.length, 4);
  return items.map((i) => i.data);
}

export async function getMethod() {
  const items = (await getCollection('method')).sort((a, b) => a.data.step.localeCompare(b.data.step));
  assertCount('method', items.length, 5);
  return items.map((i) => i.data);
}

export async function getTools() {
  const items = (await getCollection('tools')).sort(byOrder).map((i) => i.data);
  return {
    gestion: items.filter((t) => t.group === 'gestion'),
    fuentes: items.filter((t) => t.group === 'fuentes'),
    dataIa: items.filter((t) => t.group === 'data-ia'),
    iaSeleccion: items.filter((t) => t.group === 'ia-seleccion'),
  };
}

export async function getExperience() {
  const items = (await getCollection('experience')).sort(byOrder).map((i) => i.data);
  const main = items.filter((e) => !e.secondary);
  assertCount('experience (principales)', main.length, 6);
  return { main, secondary: items.filter((e) => e.secondary) };
}

export async function getAssessments() {
  return (await getCollection('assessments')).map((i) => i.data);
}

export async function getEducation() {
  return (await getCollection('education')).sort(byOrder).map((i) => i.data);
}

export async function getLanguages() {
  return (await getCollection('languages')).map((i) => i.data);
}

export async function getCertificates() {
  const all = (await getCollection('certificates')).map((i) => i.data);
  const courses = all
    .flatMap((c) => (c.type === 'curso' ? [c] : []))
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate));
  const constancias = all.flatMap((c) => (c.type === 'constancia' ? [c] : []));
  return { courses, constancias };
}

export async function getPosts() {
  return (await getCollection('posts')).map((i) => i.data).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getEvents() {
  const items = (await getCollection('events')).sort(byOrder);
  if (items.length !== 0) assertCount('events', items.length, 5);
  return items.map((i) => i.data);
}

export async function getProjects() {
  return (await getCollection('projects')).sort(byOrder);
}
