import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Formato esperado: YYYY-MM');
const levels = ['Experiencia profesional', 'Uso práctico', 'Intermedio', 'Fundamentos', 'En aprendizaje'] as const;

const profile = defineCollection({
  loader: file('src/data/profile.json'),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      greeting: z.string().min(1),
      headline: z.string().min(1),
      gradientWord: z.string().min(1),
      navSubtitle: z.string().min(1),
      tagline: z.string().min(1),
      description: z.string().min(1),
      about: z.array(z.string().min(1)).min(1),
      evolution: z.array(z.string().min(1)).length(5),
      // RN-05: cifras fijas 4+ / 6 / 5
      stats: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })).length(3),
      sectors: z.array(z.string().min(1)).length(5),
      photo: image(),
      photoAlt: z.string().min(1),
      contact: z.object({
        email: z.email(),
        phoneDisplay: z.string().min(1),
        phoneE164: z.string().regex(/^\+\d{8,15}$/),
        whatsappUrl: z.url(),
        linkedinUrl: z.url(),
        location: z.string().min(1),
      }),
    }),
});

const areas = defineCollection({
  loader: file('src/data/areas.json'),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    icon: z.string().min(1),
    order: z.number().int(),
  }),
});

const tools = defineCollection({
  loader: file('src/data/tools.json'),
  schema: z
    .object({
      name: z.string().min(1),
      group: z.enum(['gestion', 'fuentes', 'data-ia', 'ia-seleccion']),
      subgroup: z.enum(['redes', 'hunting', 'bolsas', 'bases']).optional(),
      logo: z.string().optional(),
      description: z.string().max(120).optional(),
      level: z.enum(levels).optional(),
      order: z.number().int(),
    })
    .superRefine((t, ctx) => {
      if ((t.group === 'data-ia' || t.group === 'ia-seleccion') && !t.level) {
        ctx.addIssue({ code: 'custom', path: ['level'], message: `level es obligatorio en el grupo ${t.group} (RN-02)` });
      }
      if (t.group === 'ia-seleccion' && !t.description) {
        ctx.addIssue({ code: 'custom', path: ['description'], message: 'description es obligatoria en ia-seleccion' });
      }
      if (t.group === 'fuentes' && !t.subgroup) {
        ctx.addIssue({ code: 'custom', path: ['subgroup'], message: 'subgroup es obligatorio en fuentes' });
      }
    }),
});

const experience = defineCollection({
  loader: file('src/data/experience.json'),
  schema: z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    start: yearMonth,
    end: yearMonth.optional(),
    current: z.boolean(),
    periodLabel: z.string().min(1),
    sector: z.string().min(1),
    highlights: z.array(z.string().min(1)).min(1),
    secondary: z.boolean(),
    order: z.number().int(),
  }),
});

const method = defineCollection({
  loader: file('src/data/method.json'),
  schema: z.object({
    step: z.string().regex(/^0[1-5]$/),
    title: z.string().min(1),
    description: z.string().min(1),
  }),
});

const assessments = defineCollection({
  loader: file('src/data/assessments.json'),
  schema: z.object({
    group: z.enum(['Entrevista', 'Proyectivas', 'Psicométricas', 'Evaluación grupal', 'Incorporación']),
    name: z.string().min(1),
    description: z.string().optional(),
  }),
});

const education = defineCollection({
  loader: file('src/data/education.json'),
  schema: z.object({
    institution: z.string().min(1),
    program: z.string().min(1),
    period: z.string().min(1),
    status: z.enum(['En curso', 'Licenciado', 'Completado']),
    statusLabel: z.string().min(1),
    order: z.number().int(),
  }),
});

const languages = defineCollection({
  loader: file('src/data/languages.json'),
  schema: z.object({ name: z.string().min(1), level: z.string().min(1) }),
});

const certificates = defineCollection({
  loader: file('src/data/certificates.json'),
  schema: ({ image }) =>
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('curso'),
        title: z.string().min(1),
        issuer: z.string().min(1),
        date: z.string().min(1),
        sortDate: yearMonth,
        hours: z.number().int().positive(),
        category: z.enum(['Data', 'RR. HH. y legal', 'Psicología', 'Inclusión']),
        image: image(),
        imageAlt: z.string().min(1),
        orientation: z.enum(['horizontal', 'vertical']),
      }),
      // RN-06: las constancias son solo texto; `image` y `orientation` no existen aquí.
      z
        .looseObject({
          type: z.literal('constancia'),
          company: z.string().min(1),
          role: z.string().min(1),
          period: z.string().min(1),
        })
        .refine((c) => !('image' in c) && !('orientation' in c), {
          message: 'Una constancia no admite image ni orientation (RN-06)',
        }),
    ]),
});

const events = defineCollection({
  loader: file('src/data/events.json'),
  schema: ({ image }) =>
    z.object({
      image: image(),
      alt: z.string().min(1),
      focus: z.string().regex(/^\d{1,3}% \d{1,3}%$/),
      order: z.number().int(),
    }),
});

const posts = defineCollection({
  loader: file('src/content/posts/posts.json'),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      summary: z.string().min(1).max(160),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dateLabel: z.string().min(1),
      url: z.url().refine((u) => new URL(u).hostname.endsWith('linkedin.com'), 'La URL debe ser de linkedin.com'),
      cover: image(),
      coverAlt: z.string().min(1),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      status: z.enum(['Idea', 'Prototipo', 'En desarrollo', 'Terminado']),
      summary: z.string().min(1),
      problem: z.string().min(1),
      solution: z.string().min(1),
      stack: z.array(z.string().min(1)).min(1),
      stackDetail: z.array(z.string().min(1)).optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      coverNote: z.string().optional(),
      screenshots: z.array(z.object({ image: image(), label: z.string().min(1) })).optional(),
      diagram: z.enum(['arquitectura-nube', 'arquitectura-local']).optional(),
      entities: z.array(z.object({ name: z.string().min(1), fields: z.array(z.string().min(1)).min(1) })).optional(),
      repoUrl: z.url().optional(),
      demoUrl: z.url().optional(),
      featured: z.boolean().default(false),
      order: z.number().int(),
    }),
});

export const collections = {
  profile,
  areas,
  tools,
  experience,
  method,
  assessments,
  education,
  languages,
  certificates,
  events,
  posts,
  projects,
};
