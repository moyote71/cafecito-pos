# ☕ Cafecito Feliz POS

Sistema de Punto de Venta (POS) desarrollado para cafeterías y pequeños negocios de alimentos y bebidas. El sistema permite gestionar productos, clientes, ventas, inventario, apertura y cierre de caja, reportes administrativos e historial de ventas mediante una arquitectura cliente-servidor moderna.

---

# 📋 Información General

## Nombre del Proyecto

**Cafecito Feliz POS**

## Descripción

Cafecito Feliz POS es una solución tecnológica diseñada para optimizar las operaciones diarias de una cafetería mediante la automatización de ventas, control de inventario, gestión de clientes y administración de caja.

El sistema permite que administradores y cajeros trabajen de manera segura mediante autenticación basada en roles, garantizando un control adecuado de las operaciones y la información del negocio.

## Objetivo

Automatizar el proceso de ventas y administración de una cafetería, reduciendo errores manuales y facilitando el seguimiento de inventario, clientes y movimientos de caja.

## Problemas que Resuelve

* Control automático de inventario.
* Prevención de ventas con stock insuficiente.
* Registro e historial de clientes recurrentes.
* Aplicación automática de descuentos.
* Control de apertura y cierre de caja.
* Generación de reportes de ventas.
* Administración centralizada del negocio.

---

# 🚀 Funcionalidades Implementadas

## Autenticación

* Inicio de sesión mediante JWT.
* Refresh Token.
* Logout seguro.
* Protección de rutas privadas.

## Gestión de Usuarios

### Administrador

* Gestión completa de productos.
* Gestión de clientes.
* Consulta de ventas.
* Dashboard administrativo.
* Reportes.
* Apertura y cierre de caja.

### Cajero

* Realizar ventas.
* Registrar clientes.
* Consultar clientes.
* Apertura y cierre de caja.
* Historial de ventas.
* Impresión de tickets.

## Productos

* Crear productos.
* Editar productos.
* Eliminar productos.
* Búsqueda de productos.
* Paginación.
* Control de stock.

## Clientes

* Registro de clientes.
* Búsqueda de clientes.
* Historial de compras.
* Descuentos automáticos para clientes recurrentes.

## Ventas

* Registro de ventas.
* Cálculo automático de totales.
* Aplicación automática de descuentos.
* Validación de stock.
* Historial de ventas.
* Impresión de tickets.

## Caja

* Apertura de caja.
* Consulta de sesión activa.
* Cierre de caja.
* Reportes de caja.

## Reportes

* Dashboard general.
* Reporte diario.
* Reporte por sesión de caja.
* Top clientes.

---

# 🏗️ Arquitectura del Sistema

El proyecto utiliza una arquitectura Cliente-Servidor desacoplada:

### Frontend

* React
* Vite
* React Router DOM
* Axios
* JWT Decode

### Backend

* Node.js
* Express
* MongoDB Atlas
* Mongoose
* JWT
* Bcrypt
* Cookie Parser
* CORS

### Patrón Utilizado

Modelo Vista Controlador (MVC)

* Models → Definición de entidades.
* Controllers → Lógica de negocio.
* Routes → Exposición de endpoints.
* Services → Reglas de negocio desacopladas.
* Middlewares → Seguridad y validaciones.

---

# 📁 Estructura del Proyecto

## Backend

```text
backend/
├── db/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── app.js
├── index.js
├── .env
└── package.json
```

## Frontend

```text
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── global/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   └── styles/
├── App.jsx
├── main.jsx
├── .env
├── .env.local
└── package.json
```

---

# 🗄️ Base de Datos

## Motor

MongoDB Atlas

## Colecciones principales

### Users

* name
* email
* password
* role

### Products

* name
* price
* stock

### Customers

* name
* phoneOrEmail
* purchasesCount

### Sales

* customerId
* items
* subtotal
* discountPercent
* discountAmount
* total
* paymentMethod

### CashSessions

* userId
* openingAmount
* closingAmount
* status
* openedAt
* closedAt

---

# 📖 Historias de Usuario

| Prioridad | Historia                                                                                                |
| --------- | ------------------------------------------------------------------------------------------------------- |
| 1         | Como vendedor quiero ver la lista de productos y el stock para poder realizar una venta correcta.       |
| 2         | Como vendedor quiero buscar productos para hacer una venta rápida con lo que el cliente solicita.       |
| 3         | Como administrador quiero crear productos para mantener actualizado el catálogo.                        |
| 4         | Como administrador quiero editar productos para mantener un orden en el catálogo.                       |
| 5         | Como sistema quiero calcular automáticamente el total de una venta para evitar errores en el cobro.     |
| 6         | Como sistema quiero validar el stock antes de una venta para evitar ventas de productos no disponibles. |
| 7         | Como vendedor quiero registrar clientes para mantener historial de compras.                             |
| 8         | Como vendedor quiero buscar clientes para consultar historial de compras y descuentos.                  |
| 9         | Como vendedor quiero aplicar descuentos automáticos a clientes recurrentes.                             |
| 10        | Como cajero quiero abrir y cerrar caja para controlar las operaciones diarias.                          |

---

# 📊 Story Points

| Historia         | Puntos |
| ---------------- | ------ |
| Ver productos    | 2      |
| Buscar productos | 3      |
| Crear productos  | 5      |
| Editar productos | 5      |
| Calcular venta   | 3      |
| Validar stock    | 5      |
| Buscar clientes  | 2      |

---

# 🏃 Sprint 3 - Flujo de Trabajo

## Tablero Inicial

### To Do

* Ver productos
* Buscar productos
* Crear productos
* Editar productos
* Validar stock

### In Progress

* Desarrollo activo de historias.

### In Review

* Historias pendientes de revisión.

### Done

* Historias completadas y fusionadas a main.

## Estrategia Git

### Ramas

```text
main

feature/ver-productos
feature/buscar-productos
feature/crear-producto
feature/editar-producto
feature/validar-stock
```

---

# ✅ Definition of Done

Una historia se considera terminada cuando:

* Cumple los requisitos funcionales.
* Frontend y backend funcionan correctamente.
* Las validaciones funcionan.
* No rompe otras funcionalidades.
* Fue probada localmente.
* El Pull Request fue revisado.
* El código funciona correctamente en main.

---

# 🔌 API Principal

## Auth

```http
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

## Products

```http
GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

## Customers

```http
GET /api/customers
POST /api/customers
GET /api/customers/:id
DELETE /api/customers/:id
```

## Sales

```http
GET /api/sales
POST /api/sales
GET /api/sales/:id
```

## Cash Sessions

```http
POST /api/cash-sessions/open
POST /api/cash-sessions/close
GET /api/cash-sessions/me
GET /api/cash-sessions/report
```

## Reports

```http
GET /api/reports/dashboard
GET /api/reports/daily
GET /api/reports/top-customers
GET /api/reports/cash/:sessionId
```

---

# 📜 Reglas de Negocio

1. No se permite vender productos sin stock.
2. El stock se descuenta automáticamente al realizar una venta.
3. El total de la venta se calcula automáticamente.
4. Los descuentos se aplican automáticamente a clientes recurrentes.
5. Los clientes mantienen historial de compras.
6. Solo usuarios autorizados pueden acceder a funcionalidades administrativas.
7. Toda venta queda registrada para fines de auditoría y reportes.

---

# 🧪 Testing

Se implementaron pruebas para validar funcionalidades críticas del sistema.

## Caso de Prueba 1

### Crear Producto

Validaciones:

* Campos obligatorios.
* Precio válido.
* Respuesta HTTP 201.

## Caso de Prueba 2

### Validar Stock Insuficiente

Validaciones:

* Rechazar venta.
* Respuesta HTTP 400.
* Stock permanece sin cambios.

---

# ⚙️ Variables de Entorno

## Backend

```env
PORT=
NODE_ENV=
DB_CONNECTION_STRING=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
```

## Frontend

```env
VITE_API_URL=http://localhost:3001/api
```

---

# 🛠️ Instalación

## Backend

```bash
npm install
npm run seed
npm run dev
```

## Frontend

```bash
npm install
npm run dev
```

---

# 🚀 Deploy

## Backend

Render

## Frontend

Vercel

## Base de Datos

MongoDB Atlas

---

# 📚 Metodología de Trabajo

El proyecto fue desarrollado utilizando prácticas basadas en Scrum:

* Product Backlog.
* Historias de Usuario.
* Story Points.
* Sprint Planning.
* Pull Requests.
* Git Flow.
* Definition of Done.

---

# 💭 Reflexión Final

Durante el desarrollo de Cafecito Feliz POS se fortalecieron conocimientos relacionados con APIs REST, autenticación JWT, MongoDB, control de versiones con Git y metodologia scrum, ya que aprendi a como trabajar en equipo y fortalecer mi conocimiento a el codigo y creacion de codigo.

Uno de los principales retos fue la validación de respuestas HTTP, el manejo de casos límite y la integración entre frontend y backend, tanto el caso de como poder solucionar o implementar una solucion para los usuarios de una cafeteria, para los cajeros, vendedores y administradores, siendo asi que tengan un control de su negocio y sus ventas. El proyecto permitió comprender mejor el flujo de trabajo utilizado en entornos reales de desarrollo, reforzando habilidades en diseño de APIs, control de inventario, control de acceso por roles y organización de proyectos mediante procesos agil.

Y con todo esto, el proyecto incrementó la confianza para trabajar con contratos de APIs, Git, Pull Requests, bases de datos y despliegue de aplicaciones web completas.
