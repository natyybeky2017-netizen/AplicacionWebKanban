# Tablo 📋

Tablo es una aplicación web de gestión de tareas basada en la metodología **Kanban**. El proyecto permite organizar las tareas de un proyecto de forma visual, clasificándolas según su estado.

## 🎯 Objetivo del proyecto

El objetivo de Tablo es facilitar la organización y seguimiento de tareas mediante un tablero Kanban sencillo, intuitivo y responsive.

El usuario puede crear, editar, organizar y consultar sus tareas desde una interfaz visual.

## 🛠️ Tecnologías utilizadas

* **HTML5** — estructura de la aplicación.
* **CSS3** — diseño, estilos y adaptación responsive.
* **JavaScript** — lógica e interacción de la aplicación.
* **JSON Server** — simulación de una API REST para almacenar las tareas.
* **Fetch API** — comunicación entre la aplicación y el servidor.
* **Git / GitHub** — control de versiones.
* **Visual Studio Code** — entorno de desarrollo.

## 📌 Funcionalidades

### Tablero Kanban

El tablero está dividido en tres columnas principales:

* 📝 **Por Hacer**
* 🔄 **En Proceso**
* ✅ **Finalizado**

Las tareas se muestran según su estado.

### Gestión de tareas

Cada tarea puede contener:

* Título
* Descripción
* Prioridad
* Fecha límite
* Comentarios
* Estado

El usuario puede crear nuevas tareas y consultar o modificar sus datos.

### Drag & Drop

Las tareas pueden desplazarse entre las diferentes columnas mediante **Drag & Drop**, permitiendo cambiar visualmente su estado.

### Búsqueda

El tablero incluye un campo de búsqueda que permite filtrar las tareas por título o etiqueta.

### Estadísticas rápidas

En la parte superior del tablero se muestra el número de tareas existentes en cada estado:

* Por Hacer
* En Proceso
* Finalizado

### Comentarios

Cada tarea puede tener comentarios asociados, permitiendo añadir información adicional.

### Diseño responsive

La interfaz está adaptada a diferentes tamaños de pantalla, incluyendo dispositivos móviles.

## 🌐 API y JSON Server

El proyecto utiliza **JSON Server** para simular una API REST.

Las tareas se almacenan en el archivo:

```text
db.json
```

La API se ejecuta localmente en:

```text
http://localhost:3000
```

El endpoint principal de las tareas es:

```text
http://localhost:3000/tasks
```


## ▶️ Cómo ejecutar el proyecto

### 1. Abrir la carpeta del proyecto

Abrir una terminal dentro de la carpeta donde se encuentra `db.json`.

### 2. Iniciar JSON Server

Ejecutar:

```bash
pnpm dlx json-server db.json
```

El servidor estará disponible en:

```text
http://localhost:3000
```

### 3. Abrir la aplicación

Abrir el archivo:

```text
index.html
```

en el navegador.


## 👩‍💻 Proyecto

**Tablo — Aplicación Web Kanban**

Proyecto desarrollado como parte de la formación en desarrollo web.

El proyecto pone en práctica conceptos de:

* HTML
* CSS
* JavaScript
* DOM
* Eventos
* Drag & Drop
* Fetch API
* API REST
* JSON Server
* Git y GitHub
* Diseño responsive
