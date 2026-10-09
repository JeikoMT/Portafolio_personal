# Portafolio — Jeiko Mendiguri

Sitio estático con Astro (`output: 'static'`), contenido en colecciones validadas con Zod y despliegue en Cloudflare Pages.
La especificación vigente está en [docs/agents-v1.2.md](docs/agents-v1.2.md); las decisiones y desviaciones, en [docs/DECISIONES.md](docs/DECISIONES.md).

## Comandos

| Comando | Acción |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run check` | `astro check` (tipos y esquemas) |
| `npm run build` | Genera `dist/` |
| `npm run preview` | Sirve `dist/` |
| `npm run test:e2e` | Playwright + axe (desde F1) |
| `npm run test:privacy` | Escaneo de datos sensibles sobre `dist/` (desde F4) |

## Variables de entorno

Copia `.env.example` a `.env`. Ninguna es secreta, pero no se versiona `.env`.

- `PUBLIC_SITE_URL`: URL pública (canonical, sitemap, Open Graph).
- `PUBLIC_CF_ANALYTICS_TOKEN`: token de Cloudflare Web Analytics; sin token no se carga el snippet.

## Contenido

Todo el texto vive en `src/data/*.json`, `src/content/projects/*.md` y `src/content/posts/posts.json`.
Los esquemas están en `src/content.config.ts`; un campo faltante o inválido hace fallar el build indicando archivo y campo.

## Despliegue (Cloudflare Pages)

Rama `main`, comando `npm run build`, salida `dist`, Node 22 o superior.
