export type Tone = 'idea' | 'proto' | 'dev' | 'done';

export const statusTone: Record<string, Tone> = {
  Idea: 'idea',
  Prototipo: 'proto',
  'En desarrollo': 'dev',
  Terminado: 'done',
};

/** El nivel se comunica siempre con palabras (RN-02); el tono solo refuerza. */
export function levelTone(level: string): Tone {
  if (level === 'Uso práctico' || level === 'Experiencia profesional') return 'dev';
  if (level === 'En aprendizaje') return 'proto';
  return 'idea';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Separa el cuerpo Markdown en secciones `##`; descarta las vacías y las «Pendiente de documentar.». */
export function parseSections(body = ''): { id: string; title: string; paragraphs: string[] }[] {
  return body
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const [title, ...rest] = chunk.split('\n');
      const paragraphs = rest
        .join('\n')
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      return { id: slugify(title), title: title.trim(), paragraphs };
    })
    .filter((s) => s.paragraphs.length > 0 && !/^pendiente de documentar\.?$/i.test(s.paragraphs.join(' ')));
}
