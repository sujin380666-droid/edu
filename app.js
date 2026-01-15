// State Management
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let journals = JSON.parse(localStorage.getItem('journals')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('journal-date').value = new Date().toISOString().split('T')[0];
    renderTodos();
    renderJournals();
});

// Tab Switching Logic
function switchTab(tab) {
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    document.getElementById(`nav-${tab}`).classList.add('active');
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${tab}`).classList.add('active');
}

// To-Do Logic
document.getElementById('todo-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('todo-input');
    const subject = document.querySelector('input[name="subject"]:checked').value;
    if (!input.value.trim()) return;

    todos.unshift({
        id: Date.now(),
        text: input.value,
        subject: subject,
        completed: false
    });

    saveAndRenderTodos();
    input.value = '';
});

function toggleTodo(id) {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRenderTodos();
}

function deleteTodo(id) {
    if (confirm('삭제하시겠습니까?')) {
        todos = todos.filter(t => t.id !== id);
        saveAndRenderTodos();
    }
}

function saveAndRenderTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

function renderTodos() {
    const list = document.getElementById('todo-list');
    if (todos.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:3rem; color:#94a3b8;"><i class="fas fa-tasks" style="font-size:3rem; opacity:0.2;"></i><p>할 일이 없습니다.</p></div>';
        return;
    }
    list.innerHTML = todos.map(t => `
        <div class="todo-item ${t.subject} ${t.completed ? 'completed' : ''}">
            <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTodo(${t.id})" style="width:1.3rem; height:1.3rem; cursor:pointer;">
            <span style="flex:1; font-weight:600; font-size:1.05rem;">${t.text}</span>
            <button onclick="deleteTodo(${t.id})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:1.1rem;"><i class="fas fa-trash-alt"></i></button>
        </div>
    `).join('');
}

// Journal Logic
document.getElementById('save-journal').addEventListener('click', () => {
    const content = document.getElementById('journal-input').value;
    const date = document.getElementById('journal-date').value;
    if (!content.trim()) return;

    journals.unshift({ id: Date.now(), date, content });
    localStorage.setItem('journals', JSON.stringify(journals));
    renderJournals();
    document.getElementById('journal-input').value = '';
    alert('기록이 저장되었습니다.');
});

function deleteJournal(id) {
    if (confirm('이 기록을 삭제하시겠습니까?')) {
        journals = journals.filter(j => j.id !== id);
        localStorage.setItem('journals', JSON.stringify(journals));
        renderJournals();
    }
}

function renderJournals() {
    const list = document.getElementById('journal-list');
    if (journals.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:3rem; color:#94a3b8;"><i class="fas fa-pen-nib" style="font-size:3rem; opacity:0.2;"></i><p>기록이 없습니다.</p></div>';
        return;
    }
    list.innerHTML = journals.map(j => `
        <div class="card" style="margin-bottom:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <span style="color:var(--primary-color); font-weight:800; font-size:1.1rem;">${j.date}</span>
                <button onclick="deleteJournal(${j.id})" style="background:none; border:none; color:#ef4444; cursor:pointer;"><i class="fas fa-trash-alt"></i></button>
            </div>
            <div style="line-height:1.7; white-space:pre-wrap; font-size:1rem; color:var(--text-main);">${j.content}</div>
        </div>
    `).join('');
}

// Global exposure
window.switchTab = switchTab;
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
window.deleteJournal = deleteJournal;
