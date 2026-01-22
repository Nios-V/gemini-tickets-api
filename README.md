# 🎫 AI Ticket Analyzer API

Este proyecto es una **API backend construida con NestJS** cuyo objetivo principal es **practicar la integración de Inteligencia Artificial en un sistema real**, simulando un flujo de tickets de soporte analizados automáticamente por una AI.

El foco del proyecto **no es productivo**, sino **educativo y experimental**.

---

## 🎯 Propósito del proyecto

- Aprender a integrar una **AI (Google Gemini)** en un backend real
- Diseñar un flujo donde la AI **analiza, clasifica y prioriza información**
- Practicar buenas decisiones para:
  - evitar alucinaciones
  - validar respuestas de la AI
  - manejar errores y baja confianza
- Entender cómo **usar AI como apoyo**, no como autoridad final

---

## 🤖 ¿Qué hace la AI?

Cuando se crea un ticket:

- Analiza el contenido
- Intenta determinar:
  - categoría
  - prioridad
  - resumen
  - tono emocional
  - respuesta sugerida
- Entrega un **confidence score**
- Si la confianza es baja, el ticket queda sin clasificación automática

La AI **sugiere**, el sistema **decide**.

---

## 🧱 Tecnologías usadas

- **Node.js**
- **NestJS**
- **PostgreSQL**
- **TypeORM / Sequelize**
- **Google Gemini API**

---

## ⚠️ Nota importante

Este proyecto **no busca ser un sistema de soporte completo**,  
sino un **laboratorio de aprendizaje** para experimentar con AI en backend.

---

## 🚀 Ejecución

```bash
npm install
npm run start:dev
