# Decisiones y desviaciones

Registro de lo que se decidió al construir y que no está literal en el Agents v1.2.

## Decisiones técnicas

| # | Decisión | Motivo |
|---|---|---|
| D-01 | Astro 7 (última estable al instalar) con `astro/zod` y loaders `file`/`glob` | Stack obligatorio; versión verificada al instalar |
| D-02 | LinkedIn dibujado a mano con trazo Lucide; GitHub desde Simple Icons (CC0) | Lucide 1.x ya no incluye iconos de marca y Simple Icons retiró LinkedIn |
| D-03 | `src/data/navigation.json`, `sections.json` y `diagrams.json` con rótulos, encabezados y diagramas (no son colecciones) | RN-08: ningún texto de contenido dentro de componentes; no necesitan validación Zod |
| D-04 | Campos añadidos: `experience.periodLabel`, `education.statusLabel`, `certificates.sortDate`, `posts.dateLabel` | Mostrar periodos y fechas exactamente como en el diseño sin formatear en componentes |
| D-05 | `assessments.description` es opcional | El Agents solo da nombre y grupo |
| D-06 | Conteos exactos (areas 4, method 5, experiencia principal 6, events 0 o 5) se validan en `src/lib/content.ts` | Zod valida entradas, no el tamaño de una colección |
| D-07 | `public/og/og-default.png` se genera con `scripts/make-og.mjs` | Imagen 1200×630 reproducible, sin depender de un editor |
| D-08 | `robots.txt` es un endpoint (`src/pages/robots.txt.ts`) | El `Sitemap:` debe ser una URL absoluta y depende de `PUBLIC_SITE_URL` |
| D-09 | En móvil (< 768 px) los botones del hero van antes de la descripción | CA-01 exige «Ver proyectos» visible sin scroll a 360 px; en escritorio se conserva el orden del diseño |
| D-10 | Sin componentes `Button`, `GlassCard`, `StatCard`, `SolidCard`: se usan las clases `.btn`, `.glass`, `.solid` | Evitar componentes de una línea; mismo resultado visual |
| D-11 | El botón «Eventos» de la navbar y `/eventos` en el sitemap aparecen solo si hay fotos publicadas | DP-09: no mostrar un enlace a una galería vacía |
| D-12 | El enlace `rel="sitemap"` y la analítica quedan condicionados a configuración | Sin token no se carga nada de Cloudflare (sin cookies) |

## En espera (no versionado ni publicado)

| DP | Qué falta | Estado |
|---|---|---|
| DP-04 | Las 7 imágenes de certificados traen firmas de terceros y códigos o QR (RN-01) | Archivos locales en `src/assets/certificates/` (en `.gitignore`); las 7 entradas de curso no están en `certificates.json`. El diálogo (IX-06) está implementado y verificado con ellas en local. Al llegar las versiones recortadas: copiarlas a esa carpeta, añadir las entradas y quitar la línea del `.gitignore` |
| DP-09 | Autorización de las personas en las 5 fotos de Eventos. Las fotos 4 y 5 muestran pantallas y paneles con nombres de empresa y producto legibles (RN-12) | `src/assets/events/` en `.gitignore`; `events.json` vacío; `/eventos` muestra un mensaje y no se indexa |

## Resueltas

| DP | Resolución |
|---|---|
| DP-01 | Descarga de CV retirada en v1.2; no se implementa |
| DP-02 | Se usa `foto-jeiko.webp` del diseño tal cual (400×400 px), por indicación del propietario |
| DP-03 | Se cargan las 2 publicaciones del contenido inicial |
| DP-10 | Las 8 capturas (InterviewNotes y Transcriptor) se revisaron: empresas, personas y correos son ficticios |
| DP-11 | Cargados «Intermedio» y «Licenciado» como indica el Agents v1.2; pendiente solo la confirmación del propietario |
| DP-06 | Las secciones «Pendiente de documentar.» se omiten; Recruitment Analytics Database y Dashboard de recruiting muestran Objetivo y Solución |
| DP-07 | Estados cargados como en el Agents; confirmar antes de publicar |
