# 🌍 Travel-App: Fullstack Integration Platform

**Travel-Compass** es una plataforma de ingeniería diseñada para la consolidación de servicios meteorológicos y financieros en tiempo real. 
Este proyecto demuestra la implementación de una arquitectura desacoplada y segura, utilizando los estándares más recientes de la industria.

🚀 **Estado del Proyecto:** Desplegado y Operativo en entorno VPS.

## 🛠️ Stack Tecnológico

* **Frontend:** Angular 19 (Signals, RxJS, i18n para internacionalización).
* **Backend:** Laravel 10 (API RESTful, Sanctum para autenticación).
* **Base de Datos:** MySQL (Diseño relacional optimizado).
* **Infraestructura:** Despliegue en VPS (Linux/Ubuntu) con gestión de certificados SSL y servidor web configurado manualmente.

## ✨ Características Principales

* **Consumo de APIs Externas:** Integración robusta con servicios de terceros (OpenWeather y servicios financieros).
* **API Masking & Security:** Implementación de una capa de proxy en el backend para proteger llaves privadas y ocultar endpoints sensibles de la vista del cliente.
* **Arquitectura Desacoplada:** Separación total de responsabilidades entre cliente y servidor, facilitando la escalabilidad y el mantenimiento.
* **Optimización de Rendimiento:** Sistema de manejo de estados y carga asíncrona para garantizar tiempos de respuesta inferiores a 2 segundos.

## 🧪 Calidad y Pruebas (QA)

Como parte del compromiso con la estabilidad del software, el proyecto incluye:
* **Pruebas Unitarias:** Cobertura de lógica crítica en el frontend utilizando Jasmine y Karma.
* **Validación de Datos:** Capa de validación estricta de esquemas JSON en la comunicación API.

## 🚀 Despliegue

El proyecto no utiliza servicios de automatización simples; ha sido desplegado manualmente en un entorno de servidor real:
1.  Configuración de entorno Linux.
2.  Gestión de dependencias de servidor (PHP, Node.js, Composer).
3.  Configuración de Seguridad (Certificados SSL y Firewall).

---
## 👤 Autor
**Silvia Riquett**
* Tecnóloga en Análisis y Desarrollo de Software (SENA).
* Enfoque en Ciberseguridad e Ingeniería de Software.
* [LinkedIn]((https://www.linkedin.com/in/patricia-riquett/)) | [Portafolio]((https://patricia-portafolio.netlify.app/))
