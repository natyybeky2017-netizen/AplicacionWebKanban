/* ===================================================
   1. DADOS INICIAIS (Estado da Aplicação)
==================================================== */
// Lista de tarefas simulando dados iniciais
let tasks = [
    {
        id: "KF-101",
        title: "Diseñar wireframes para la nueva funcionalidad de búsqueda avanzada",
        description: "Optimizar el flujo móvil para mejorar la experiencia del usuario en dispositivos de pantalla pequeña.",
        priority: "Alta",
        status: "todo",
        dueDate: "2026-09-15",
        commentsCount: 5
    },
    {
        id: "KF-102",
        title: "Integrar autenticación OAuth 2.0 y JWT",
        description: "Permitir iniciar sesión con Google y GitHub.",
        priority: "Alta",
        status: "doing",
        dueDate: "2026-09-20",
        commentsCount: 2
    },
    {
        id: "KF-103",
        title: "Auditoría de seguridad y dependencias npm",
        description: "Solucionar vulnerabilidades del sistema.",
        priority: "Media",
        status: "done",
        dueDate: "2026-09-05",
        commentsCount: 1
    }
];

/* ===================================================
   2. SELEÇÃO DOS ELEMENTOS DO DOM
==================================================== */
// Containers das colunas
const todoTasksContainer = document.getElementById('todo-tasks');
const doingTasksContainer = document.getElementById('doing-tasks');
const doneTasksContainer = document.getElementById('done-tasks');

// Campo de Busca
const searchInput = document.getElementById('kanban-search-input');

// Modais e Botões
const taskModal = document.getElementById('task-form-modal');
const taskForm = document.getElementById('task-form');
const cancelFormBtn = document.getElementById('cancel-form-btn');
const closeBtns = document.querySelectorAll('.close-btn');
const addBtns = document.querySelectorAll('.column-header button');

/* ===================================================
   3. FUNÇÕES DE RENDERIZAÇÃO E INTERFACE
==================================================== */

// Função para criar o HTML de um único Card de Tarefa
function createCardHTML(task) {
    const priorityClass = task.priority.toLowerCase() === 'alta' ? 'tag-alta' 
                        : task.priority.toLowerCase() === 'media' ? 'tag-media' : 'tag-baja';

    return `
        <article class="task-card" draggable="true" data-id="${task.id}">
            <div class="card-tag-row">
                <span class="task-id">Proyecto</span>
                <span class="priority-tag ${priorityClass}">${task.priority}</span>
            </div>
            <h3 class="task-title">${task.title}</h3>
            <p class="task-description">${task.description}</p>
            <div class="card-footer-row">
                <div style="display:flex; align-items:center; gap:4px;">
                    <span class="material-symbols-outlined" style="font-size:16px;">calendar_month</span>
                    <span class="task-date">${task.dueDate || 'Sin fecha'}</span>
                </div>
                <div style="display:flex; align-items:center; gap:4px;">
                    <span class="material-symbols-outlined" style="font-size:16px;">chat_bubble</span>
                    <span class="comment-count">${task.commentsCount || 0}</span>
                </div>
            </div>
        </article>
    `;
}

// Função principal para desenhar todas as tarefas nas colunas
function renderBoard(filteredTasks = tasks) {
    // Limpar conteúdos anteriores das colunas
    todoTasksContainer.innerHTML = '';
    doingTasksContainer.innerHTML = '';
    doneTasksContainer.innerHTML = '';

    // Contadores para o topo
    let todoCount = 0;
    let doingCount = 0;
    let doneCount = 0;

    // Distribuir tarefas por status
    filteredTasks.forEach(task => {
        const cardHTML = createCardHTML(task);

        if (task.status === 'todo') {
            todoTasksContainer.innerHTML += cardHTML;
            todoCount++;
        } else if (task.status === 'doing') {
            doingTasksContainer.innerHTML += cardHTML;
            doingCount++;
        } else if (task.status === 'done') {
            doneTasksContainer.innerHTML += cardHTML;
            doneCount++;
        }
    });

    // Atualizar números no resumo do topo
    updateTopCounters(todoCount, doingCount, doneCount);
}

// Atualizar o texto das estatísticas rápidas no topo
function updateTopCounters(todo, doing, done) {
    const statItems = document.querySelectorAll('.quick-stats .stat-item h2');
    if (statItems.length >= 3) {
        statItems[0].textContent = `Por Hacer ${todo}`;
        statItems[1].textContent = `En Proceso ${doing}`;
        statItems[2].textContent = `Finalizado ${done}`;
    }
}

/* ===================================================
   4. EVENTOS E INTERAÇÕES
==================================================== */

// Evento de busca em tempo real
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    const filtered = tasks.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query)
    );

    renderBoard(filtered);
});

// Abrir o Modal de Criar Tarefa ao clicar nos botões "+" das colunas
addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        taskModal.style.display = 'flex';
    });
});

// Fechar Modal (botão X e botão Cancelar)
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        taskModal.style.display = 'none';
    });
});

cancelFormBtn.addEventListener('click', () => {
    taskModal.style.display = 'none';
});

// Envio do Formulário de Nova Tarefa
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTitle = document.getElementById('task-title-input').value;
    const newDesc = document.getElementById('task-desc-input').value;
    const newPriority = document.getElementById('task-priority-select').value;
    const newStatus = document.getElementById('task-status-select').value;
    const newDate = document.getElementById('task-date-input').value;

    const newTask = {
        id: `KF-${100 + tasks.length + 1}`,
        title: newTitle,
        description: newDesc,
        priority: newPriority,
        status: newStatus,
        dueDate: newDate,
        commentsCount: 0
    };

    tasks.push(newTask);
    renderBoard();

    // Resetar formulário e fechar modal
    taskForm.reset();
    taskModal.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
    renderBoard();
});