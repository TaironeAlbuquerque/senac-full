const taskInput = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-task');
const tasksList = document.getElementById('tasks');

const apiURL = 'http://localhost:5000/api/tasks';

// Adicionar nova tarefa
addTaskButton.addEventListener('click', async () => {
  const description = taskInput.value;
  if (!description) return;
  const response = await fetch(apiURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description })
  });
  const task = await response.json();
  renderTask(task);
  taskInput.value = '';
});

// Renderizar uma tarefa
function renderTask(task) {
  const li = document.createElement('li');
  li.textContent = task.description;
  li.classList.toggle('completed', task.completed);
  li.addEventListener('click', async () => {
    task.completed = !task.completed;
    await fetch(`${apiURL}/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: task.completed })
    });
    li.classList.toggle('completed', task.completed);
  });
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Remover';
  deleteButton.addEventListener('click', async () => {
    await fetch(`${apiURL}/${task._id}`, { method: 'DELETE' });
    tasksList.removeChild(li);
  });
  li.appendChild(deleteButton);
  tasksList.appendChild(li);
}

// Carregar tarefas existentes
async function loadTasks() {
  const response = await fetch(apiURL);
  const tasks = await response.json();
  tasks.forEach(renderTask);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(() => console.log('Service Worker registrado'))
    .catch(err => console.error('Erro ao registrar Service Worker', err));
}

loadTasks();
