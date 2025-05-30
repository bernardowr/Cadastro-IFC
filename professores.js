let currentProfessorId = null;

//carrega os Professores como linhas da tabela
function renderProfessores() {
    const tbody = document.querySelector('#professoresTable tbody');
    tbody.innerHTML = '';

    fetch('http://localhost:3000/professores')
        .then(response => response.json())
        .then(professores => {
            professores.forEach((professor, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${professor.nomeProfessor}</td>
                    <td>${professor.email}</td>
                    <td>${professor.sala}</td>
                    <td>
                        <button onclick="editProfessor(${index})">Editar</button>
                        <button onclick="deleteProfessor(${index})">Excluir</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });
}

function addProfessor(codigo, nomeProfessor, email, sala) {
    let professor = { codigo, nomeProfessor, email, sala }
    console.log(professor);
    fetch('http://localhost:3000/professores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(professor)
    })
        .then(response => response.json())
        .then(dados => {
            console.log(dados);
        })
    renderProfessores();
}

function editProfessor(index) {
    fetch('http://localhost:3000/professores')
        .then(response => response.json())
        .then(professores => {
            const professor = professores[index];
            document.getElementById("codigo").value = professor.codigo;
            document.getElementById("nomeProfessor").value = professor.nomeProfessor;
            document.getElementById("email").value = professor.email;
            document.getElementById("sala").value = professor.sala;
            currentProfessorId = professor.codigo; // Use o código como identificador
            openModal("professorModal");
        });
}

function deleteProfessor(index) {
    fetch('http://localhost:3000/professores')
        .then(response => response.json())
        .then(professores => {
            const professor = professores[index];
            if (confirm(`Tem certeza que deseja excluir este professor?`)) {
                fetch(`http://localhost:3000/professores/${professor.codigo}`, {
                    method: 'DELETE'
                })
                    .then(() => {
                        renderProfessores();
                    });
            }
        });
}

// Altera a propriedade display para block, exibindo a modal que estava none
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Altera a propriedade display para none, ocultando a modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Listener para o botão addProfessor, vai chamar a openModal()
const btAddProfessor = document.getElementById('addProfessor');
btAddProfessor.addEventListener('click', function () {
    currentProfessorId = null;
    document.getElementById('professorForm').reset();
    openModal('professorModal');
});

// Listener para fechar modais
document.querySelectorAll('.close').forEach(function (closeBtn) {
    closeBtn.addEventListener('click', function () {
        closeModal(this.closest('.modal').id);
    });
});

const professorForm = document.getElementById('professorForm');
professorForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let codigo = document.getElementById("codigo").value;
    const nomeProfessor = document.getElementById("nomeProfessor").value;
    const email = document.getElementById("email").value;
    const sala = document.getElementById("sala").value;

    if (currentProfessorId !== null) {
        // Atualiza no backend usando PUT
        fetch(`http://localhost:3000/professores/${codigo}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo, nomeProfessor, email, sala })
        })
            .then(() => {
                closeModal('professorModal');
                renderProfessores();
            });
    } else {
        // Gera o próximo código sequencial ao adicionar
        fetch('http://localhost:3000/professores')
            .then(response => response.json())
            .then(professores => {
                if (!codigo) {
                    if (professores.length > 0) {
                        const maxCodigo = Math.max(...professores.map(p => Number(p.codigo)));
                        codigo = maxCodigo + 1;
                    } else {
                        codigo = 1;
                    }
                }
                addProfessor(codigo, nomeProfessor, email, sala);
                closeModal('professorModal');
            });
    }
});

renderProfessores();