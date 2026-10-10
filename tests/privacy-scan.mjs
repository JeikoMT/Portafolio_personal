// Escaneo de datos sensibles sobre dist/ (Agents: Seguridad obligatoria).
// Falla si encuentra DNI, RUC o códigos de certificado, o si /eventos nombra empresas o productos (RN-12).
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = 'dist';
const TEXT_EXT = new Set(['.html', '.xml', '.txt', '.json', '.js', '.css', '.svg', '.webmanifest']);
const FORBIDDEN = [
  { label: 'número de DNI', re: /76011366/ },
  { label: 'la palabra DNI', re: /\bDNI\b/ },
  { label: 'la palabra RUC', re: /\bRUC\b/ },
  { label: 'código de certificado CCVFC', re: /CCVFC/ },
];
const EVENTS_FORBIDDEN = [/growby\.tech/i, /Ecommerce\s*Hub/i];

if (!existsSync(DIST)) {
  console.error('No existe dist/. Ejecuta `npm run build` primero.');
  process.exit(2);
}

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (TEXT_EXT.has(extname(name).toLowerCase())) files.push(full);
  }
})(DIST);

const problems = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const { label, re } of FORBIDDEN) {
    if (re.test(text)) problems.push(`${file}: contiene ${label}`);
  }
}

const eventsPage = ['eventos/index.html', 'eventos.html'].map((p) => join(DIST, p)).find(existsSync);
if (eventsPage) {
  const html = readFileSync(eventsPage, 'utf8');
  for (const re of EVENTS_FORBIDDEN) {
    if (re.test(html)) problems.push(`${eventsPage}: contiene ${re}`);
  }
}

if (problems.length) {
  console.error('privacy-scan: FALLÓ');
  problems.forEach((p) => console.error(' - ' + p));
  process.exit(1);
}
console.log(`privacy-scan: OK (${files.length} archivos de texto revisados)`);
