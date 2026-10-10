---
title: InterviewNotes
slug: interviewnotes
status: En desarrollo
summary: App web para reclutadores, del JD a las preguntas, de las respuestas al informe, en una sola herramienta y con IA que nunca decide por el reclutador.
problem: InterviewNotes nació como un MVP local, con React e IndexedDB en el navegador y un proxy en Node para la IA. Los datos vivían en un solo equipo, no había cuentas ni forma de cobrar, y la IA dependía de una máquina local con Ollama.
solution: El reclutador crea un proceso, genera las preguntas desde el JD, registra a los candidatos y toma notas durante la entrevista. La IA propone un resumen y un borrador de conclusión, que siempre se pueden editar.
stack:
  - React
  - Supabase
  - Cloudflare
  - IA
stackDetail:
  - React + TypeScript
  - Supabase
  - Cloudflare
  - Gemini
  - Workers AI
  - Culqi
cover: ../../assets/projects/interviewnotes-procesos.png
coverAlt: "Portada de InterviewNotes: captura de la app con datos ficticios"
screenshots:
  - image: ../../assets/projects/interviewnotes-procesos.png
    label: Procesos
  - image: ../../assets/projects/interviewnotes-detalle-proceso.png
    label: Detalle de proceso
  - image: ../../assets/projects/interviewnotes-entrevista.png
    label: Entrevista
  - image: ../../assets/projects/interviewnotes-metricas.png
    label: Métricas
diagram: arquitectura-nube
entities:
  - name: processes
    fields: [id, user_id, code, puesto]
  - name: forms
    fields: [id, process_id, questions]
  - name: candidates
    fields: [id, process_id, cv_path]
  - name: interviews
    fields: [id, candidate_id, answers]
  - name: subscriptions
    fields: [id, user_id, plan_id]
  - name: ai_usage
    fields: [id, user_id, skill]
featured: true
order: 1
---

## Contexto

InterviewNotes nació como un MVP local: React con IndexedDB en el navegador y un proxy en Node para la IA. Los datos vivían en un solo equipo, no había cuentas ni forma de cobrar, y la IA dependía de una máquina local con Ollama.

## Objetivo

Convertir la herramienta en un SaaS por suscripción, accesible desde cualquier equipo y desplegado a costo cero o casi cero, con un cupo de IA por usuario.

## Usuarios

Reclutadores suscriptores, que solo ven y editan sus propios datos y la usan a diario desde desktop.

Administradores del producto, que gestionan usuarios, planes, suscripciones y el uso de IA.

## Solución

El reclutador crea un proceso, genera las preguntas desde el JD, registra a los candidatos y toma notas durante la entrevista. La IA propone un resumen y un borrador de conclusión, que siempre se pueden editar.

El producto suma cuentas con correo o Google, suscripción mensual con tarjeta o Yape, panel de administración, tema claro y oscuro, y exportación a PDF, DOCX, XLSX y CSV.

## Arquitectura

Monolito modular: la SPA lee y escribe directo en Supabase, protegida con RLS, sin backend propio para datos. Las Pages Functions existen solo para lo que exige secretos: la IA, los cobros y el webhook de pagos.

## Modelo de datos

Entidades principales del flujo de selección y de la suscripción, en Postgres. Cada tabla tiene RLS para que un usuario no vea los datos de otro.

## Tecnologías

React 18 con TypeScript, Vite y Tailwind en el frontend. Supabase para autenticación, base de datos y archivos. Cloudflare Pages y Pages Functions para hosting y API. Gemini y Workers AI para la IA, Culqi para los pagos, Resend para correos y Vitest para pruebas.

## Decisiones y dificultades

Toda salida de IA es un borrador editable. Un validador revisa que cada respuesta del candidato aparezca en el resumen; si falla, se reintenta con otro modelo.

Se eliminó Ollama y cada tarea de IA tiene un modelo principal y uno de respaldo en la nube. El cupo gratuito de Workers AI se comparte entre usuarios, por eso se fijó un límite mensual por acción.

A la IA solo viajan el puesto, las preguntas, las respuestas y el JD; nunca el teléfono, el correo ni el CV del candidato.

## Resultado

El MVP local funciona. La especificación del SaaS va en la versión 1.19 y el desarrollo avanza por fases.

## Siguientes mejoras

Fases del roadmap: base en Supabase; cuentas y datos en la nube; IA en la nube con cupo; landing, cobro y panel de administración; mejoras de producto; nueva interfaz y despliegue; dashboard del usuario y soporte.
