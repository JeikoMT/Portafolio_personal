# Decisiones y desviaciones

Registro de lo que se decidió al construir y que no está literal en el Agents v1.2.

## Decisiones técnicas

| # | Decisión | Motivo |
|---|---|---|
| D-01 | Astro 7 (última estable al instalar) con `astro/zod` y loaders `file`/`glob` | Stack obligatorio; versión verificada al instalar |
| D-02 | LinkedIn dibujado a mano con trazo Lucide; GitHub desde Simple Icons (CC0) | Lucide 1.x ya no incluye iconos de marca y Simple Icons retiró LinkedIn |
| D-03 | `src/data/navigation.json` con rótulos de navbar y footer (no es colección) | RN-08: ningún texto dentro de componentes; no hace falta validación Zod |
| D-04 | Campos añadidos: `experience.periodLabel`, `education.statusLabel`, `certificates.sortDate`, `posts.dateLabel` | Mostrar los periodos y fechas exactamente como en el diseño sin formatear en componentes |
| D-05 | `assessments.description` es opcional | El Agents solo da nombre y grupo |
| D-06 | Conteos exactos (areas 4, method 5, events 5) se validan en `src/lib/content.ts` | Zod valida entradas, no el tamaño de una colección |
| D-07 | `public/og/og-default.png` se genera en F4 | Aún no hay imagen base; hasta entonces el `og:image` apunta a una ruta que se creará |

## En espera (no versionado ni publicado)

| DP | Qué falta | Estado |
|---|---|---|
| DP-04 | Las 7 imágenes de certificados traen firmas de terceros y códigos/QR (RN-01) | Archivos locales en `src/assets/certificates/` (en `.gitignore`); las 7 entradas de curso no están en `certificates.json` hasta tener versiones recortadas |
| DP-09 | Autorización de las personas en las 5 fotos de Eventos; la foto 4 y la 5 muestran pantallas con nombres de empresa y producto (RN-12) | `src/assets/events/` en `.gitignore`; `events.json` vacío |
| DP-10 | Confirmar que las 8 capturas de proyectos usan datos ficticios | `src/assets/projects/` en `.gitignore` |
| DP-02 | `foto-jeiko.webp` mide 400×400 px (el Agents pide ≥ 1200 px) | Se usa provisionalmente; pedir otra antes de publicar |
| DP-11 | Confirmar «Intermedio» (Excel, SQL Server, Power BI, Python) y «Licenciado» | Cargados tal como el Agents; confirmar antes de publicar |
| DP-07 | Confirmar estados de proyectos | Antes de F3 |
