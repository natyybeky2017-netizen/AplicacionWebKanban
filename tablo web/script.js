

const API_URL = 'http://localhost:3000/tasks';

console.log("O script carregou!");

const todoTasksContainer = document.getElementById('todo-tasks');
const doingTasksContainer = document.getElementById('doing-tasks');
const doneTasksContainer = document.getElementById('done-tasks');
const reviewTasksContainer = document.getElementById('review-tasks');
const searchInput = document.getElementById('kanban-search-input');
const taskModal = document.getElementById('task-form-modal');
const taskForm = document.getElementById('task-form');
const cancelFormBtn = document.getElementById('cancel-form-btn');
const closeBtns = document.querySelectorAll('.close-btn');
const addBtns = document.querySelectorAll('.kanban-column button');
const detailModal = document.getElementById('task-detail-modal');
let editandoId = null;
let tasksLocal = []; 
let detalleIdActual = null;

async function cargarTareas() {
  try {
    const respuesta = await fetch(API_URL);
    tasksLocal = await respuesta.json();
    renderizarTablero(tasksLocal);
  } catch (error) {
    console.error('Error al conectar con la API:', error);
  }
}

function renderizarTablero(listaTareas) {
  // 1. Limpiar dinámicamente TODOS los contenedores de tareas que terminen en '-tasks' (tanto fijos como personalizados)
  const todosLosContenedores = document.querySelectorAll('[id$="-tasks"]');
  todosLosContenedores.forEach(contenedor => {
    contenedor.innerHTML = '';
  });

  let countTodo = 0, countDoing = 0, countDone = 0;

  listaTareas.forEach(task => {
    const priorityClass = task.priority?.toLowerCase() === 'alta' ? 'tag-alta' 
                        : task.priority?.toLowerCase() === 'media' ? 'tag-media' : 'tag-baja';

    const totalComentarios = task.comments ? task.comments.length : 0;

   
    const cardHTML = `
      <article class="task-card" draggable="true" data-id="${task.id}">
        <div class="card-tag-row">
          <span class="task-id">Proyecto</span>
          <span class="priority-tag ${priorityClass}">${task.priority || 'Baja'}</span>
        </div>
        
        <div>
          <h3 class="task-title">${task.title}</h3>
          <p class="task-description">${task.description || ''}</p>
        </div>

        <div class="card-footer-row">
          <button type="button"><span class="material-symbols-outlined">calendar_month</span></button>
          <p class="task-date">${task.dueDate || 'Sin fecha'}</p>
          
          <div class="card-comments-count" style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #666;">
            <span class="material-symbols-outlined" style="font-size: 16px;">chat</span>
            <span>${totalComentarios}</span>
          </div>

          <button type="button" class="edit-btn" onclick="prepararEdicion('${task.id}', event)">
            <span class="material-symbols-outlined">edit</span>
          </button>

          <button type="button" class="delete-btn" onclick="eliminarTarea('${task.id}', event)">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </article>
    `;

    // 2. Buscar dinámicamente el contenedor según el status de la tarea (ej: "todo-tasks", "review-tasks", etc.)
    const contenedorDestino = document.getElementById(`${task.status}-tasks`);
    
    if (contenedorDestino) {
      contenedorDestino.innerHTML += cardHTML;
    } else {
      // Fallback por si el estado no coincide con ninguna columna existente
      if (todoTasksContainer) {
        todoTasksContainer.innerHTML += cardHTML;
      }
    }

    // Contadores para las fijas
    if (task.status === 'todo') countTodo++;
    if (task.status === 'doing') countDoing++;
    if (task.status === 'done') countDone++;
  });

  actualizarContadoresTopo(countTodo, countDoing, countDone);
  activarDragAndDrop();
  activarClicEnTarjetas(); 
}

function actualizarContadoresTopo(todo, doing, done) {
  const statItems = document.querySelectorAll('.quick-stats .stat-item h2');
  if (statItems.length >= 3) {
    statItems[0].textContent = `Por Hacer (${todo})`;
    statItems[1].textContent = `En Proceso (${doing})`;
    statItems[2].textContent = `Finalizado (${done})`;
  }
}

if (taskForm) {
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const taskData = {
      title: document.getElementById('task-title-input').value,
      description: document.getElementById('task-desc-input').value,
      priority: document.getElementById('task-priority-select').value,
      status: document.getElementById('task-status-select').value,
      dueDate: document.getElementById('task-date-input').value
    };

    if (editandoId) {
      await fetch(`${API_URL}/${editandoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskData, comments: [] })
      });
    }

    taskForm.reset();
    taskModal.style.display = 'none';
    editandoId = null;
    cargarTareas();
  });
}

async function eliminarTarea(id, evento) {
  evento.stopPropagation();
  if (confirm('¿Deseas eliminar esta tarea?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    cargarTareas(); 
  }
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const busca = e.target.value.toLowerCase();
    const filtradas = tasksLocal.filter(t => 
      t.title.toLowerCase().includes(busca) || 
      (t.description && t.description.toLowerCase().includes(busca))
    );
    renderizarTablero(filtradas);
  });
}
  
addBtns.forEach(btn => btn.addEventListener('click', () => {
  editandoId = null; 
  taskForm.reset();  
  if (taskModal) taskModal.style.display = 'flex';
}));

if (cancelFormBtn) {
  cancelFormBtn.addEventListener('click', () => {
    if (taskModal) taskModal.style.display = 'none';
  });
}

closeBtns.forEach(btn => btn.addEventListener('click', () => {
  if (taskModal) taskModal.style.display = 'none';
  if (detailModal) detailModal.style.display = 'none';
}));

function activarClicEnTarjetas() {
  document.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('click', () => {
      const task = tasksLocal.find(t => t.id == card.dataset.id);
      if (task && detailModal) {
        detalleIdActual = task.id;

        document.getElementById('detail-task-id').textContent = `ID: ${task.id}`;
        document.getElementById('detail-task-title').textContent = task.title;
        document.getElementById('detail-task-desc').textContent = task.description || 'Sin descripción';
        document.getElementById('detail-task-date').textContent = task.dueDate || 'Sin fecha';

        renderizarComentarios(task.comments || []);
        detailModal.style.display = 'flex';
      }
    });
  });
}

function renderizarComentarios(comentarios) {
  const listaComentarios = document.getElementById('comments-list');
  const contadorComentarios = document.getElementById('comments-count');

  if (!listaComentarios || !contadorComentarios) return;

  contadorComentarios.textContent = comentarios.length;

  if (comentarios.length === 0) {
    listaComentarios.innerHTML = '<p class="no-comments">No hay comentarios aún.</p>';
    return;
  }

  listaComentarios.innerHTML = comentarios.map(c => `
    <div class="comment-item">
      <div class="comment-header">
        <strong>${c.autor || 'Anónimo'}</strong>
        <span class="comment-date">${c.fecha || ''}</span>
      </div>
      <p class="comment-text">${c.texto}</p>
    </div>
  `).join('');
}

function prepararEdicion(id, evento) {
  evento.stopPropagation(); 
  const task = tasksLocal.find(t => t.id == id);
  if (!task) return;

  editandoId = id; 

  document.getElementById('task-title-input').value = task.title || '';
  document.getElementById('task-desc-input').value = task.description || '';
  document.getElementById('task-priority-select').value = task.priority || 'Media';
  document.getElementById('task-status-select').value = task.status || 'todo';
  document.getElementById('task-date-input').value = task.dueDate || '';

  if (taskModal) taskModal.style.display = 'flex';
}

function activarDragAndDrop() {
  // Ya no necesitamos recorrer todas las tarjetas una por una.
  // Delegamos el evento globalmente en el documento:
  
  document.removeEventListener('dragstart', handleGlobalDragStart);
  document.addEventListener('dragstart', handleGlobalDragStart);

  const contenedores = document.querySelectorAll('.task-list, [id$="-tasks"]');
  contenedores.forEach(contenedor => {
    contenedor.removeEventListener('dragover', handleDragOver);
    contenedor.removeEventListener('drop', handleDrop);

    contenedor.addEventListener('dragover', handleDragOver);
    contenedor.addEventListener('drop', handleDrop);
  });
}

function handleGlobalDragStart(event) {
  const tarjeta = event.target.closest('.task-card');
  if (!tarjeta) return;
  
  // Guardamos el ID de la tarjeta que se está moviendo
  event.dataTransfer.setData('text/plain', tarjeta.dataset.id);
}

function handleDragOver(event) {
  event.preventDefault(); // Obligatorio para permitir el drop
}

async function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();

  const idTarea = event.dataTransfer.getData('text/plain');
  if (!idTarea) return;

  const contenedor = event.currentTarget.closest('.task-list, [id$="-tasks"]');
  if (!contenedor) return;

  const nuevoEstado = contenedor.id.replace('-tasks', '');

  try {
    const respuesta = await fetch(`${API_URL}/${idTarea}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nuevoEstado })
    });

    if (respuesta.ok) {
      cargarTareas();
    } else {
      console.error('Error al actualizar el estado en la API.');
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
}

const addCommentForm = document.getElementById('add-comment-form');
if (addCommentForm) {
  addCommentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputComentario = document.getElementById('new-comment-input');
    const textoComentario = inputComentario.value.trim();

    if (!textoComentario || !detalleIdActual) return;

    const task = tasksLocal.find(t => t.id == detalleIdActual);
    if (!task) return;

    const nuevoComentario = {
      autor: 'Renata',
      texto: textoComentario,
      fecha: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    const listaActualizada = task.comments ? [...task.comments, nuevoComentario] : [nuevoComentario];

    try {
      const respuesta = await fetch(`${API_URL}/${detalleIdActual}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: listaActualizada })
      });

      if (respuesta.ok) {
        inputComentario.value = ''; 
        await cargarTareas(); 

        const tareaActualizada = tasksLocal.find(t => t.id == detalleIdActual);
        if (tareaActualizada) {
          renderizarComentarios(tareaActualizada.comments);
        }
      }
    } catch (error) {
      console.error('Error al guardar el comentario:', error);
    }
  });
}
     const addColumnBtn = document.getElementById('add-column-btn');
if (addColumnBtn) {
  addColumnBtn.addEventListener('click', () => {
    const nombreColumna = prompt('Escribe el nombre de la nueva columna (ej: En Revisión, Bloqueado):');
    if (!nombreColumna || !nombreColumna.trim()) return;

    const titulo = nombreColumna.trim();
    // Generar un ID único basado en el nombre (ej: "En Revisión" -> "en-revision")
    const idBase = titulo.toLowerCase()
      .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')
      .replace(/[^a-z0-9]/g, '-');
    if (document.getElementById(`${idBase}-tasks`)) {
      alert('¡Esta columna ya existe!');
      return;
    }
    guardarColumnaPersonalizada(titulo, idBase);
    crearColumnaDOM(titulo, idBase);
  });
}
function crearColumnaDOM(titulo, idBase) {
  const columnasContainer = document.querySelector('.kanban-board');
  if (!columnasContainer) return;

  if (document.getElementById(`${idBase}-tasks`)) return;

  // Estructura limpia usando la misma clase y estructura que tus columnas originales
  const nuevaColumnaHTML = `
    <div class="kanban-column" data-column-id="${idBase}">
      <div class="column-header">
        <h2>${titulo}</h2>
        <div class="column-header-actions" style="display: flex; align-items: center; gap: 8px;">
          <button type="button" class="column-add-btn">
            <span class="material-symbols-outlined">add</span>
          </button>
          <button type="button" class="delete-column-btn" title="Eliminar columna">
            <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
          </button>
        </div>
      </div>
      <div class="task-list" id="${idBase}-tasks"></div>
    </div>
  `;

  columnasContainer.insertAdjacentHTML('beforeend', nuevaColumnaHTML);

  // Añadir al selector del modal
  const selectStatus = document.getElementById('task-status-select');
  if (selectStatus && !selectStatus.querySelector(`option[value="${idBase}"]`)) {
    const nuevaOpcion = document.createElement('option');
    nuevaOpcion.value = idBase;
    nuevaOpcion.textContent = titulo;
    selectStatus.appendChild(nuevaOpcion);
  }

  const columnaCreada = columnasContainer.lastElementChild;
  
  // Botón '+' para abrir el modal
  const btnAnadir = columnaCreada.querySelector('.column-add-btn');
  if (btnAnadir) {
    btnAnadir.addEventListener('click', () => {
      editandoId = null;
      taskForm.reset();
      if (selectStatus) selectStatus.value = idBase;
      if (taskModal) taskModal.style.display = 'flex';
    });
  }

  // Botón papelera para eliminar columna
  const btnEliminarCol = columnaCreada.querySelector('.delete-column-btn');
  if (btnEliminarCol) {
    btnEliminarCol.addEventListener('click', () => {
      if (confirm(`¿Seguro que quieres eliminar la columna "${titulo}"?`)) {
        columnaCreada.remove();
        
        let guardadas = JSON.parse(localStorage.getItem('kanban_custom_columns') || '[]');
        guardadas = guardadas.filter(col => col.id !== idBase);
        localStorage.setItem('kanban_custom_columns', JSON.stringify(guardadas));

        const optionAEliminar = selectStatus?.querySelector(`option[value="${idBase}"]`);
        if (optionAEliminar) optionAEliminar.remove();
        
        cargarTareas(); // Recargar para mover las tareas huérfanas si las hubiera
      }
    });
  }

  // Reactivar el drag and drop global
  activarDragAndDrop();
}
function guardarColumnaPersonalizada(titulo, id) {
  const guardadas = JSON.parse(localStorage.getItem('kanban_custom_columns') || '[]');
  guardadas.push({ titulo, id });
  localStorage.setItem('kanban_custom_columns', JSON.stringify(guardadas));
}
document.addEventListener('DOMContentLoaded', () => {
  // 1. Cargar primero las columnas personalizadas guardadas en localStorage
  const guardadas = JSON.parse(localStorage.getItem('kanban_custom_columns') || '[]');
  guardadas.forEach(col => {
    crearColumnaDOM(col.titulo, col.id);
  });

  cargarTareas();
});