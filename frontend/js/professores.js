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
                    <td>${professor.nomeprofessor}</td>
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

function addProfessor(codigo, nome, email, sala) {
    let professor = { codigo, nome, email, sala }
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
            document.getElementById("nomeProfessor").value = professor.nomeprofessor;
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
            if (confirm('Tem certeza que deseja excluir este professor?')) {
                fetch('http://localhost:3000/professores/' + professor.codigo, {
                    method: 'DELETE',
                    headers: { "Content-Type": "application/json" },
                })
                    .then(response => response.json())
                    .then(dados => {
                        console.log(dados)
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
    const nomeProfessor = document.getElementById("nomeProfessor").value;
    const email = document.getElementById("email").value;
    const sala = document.getElementById("sala").value;

    if (currentProfessorId !== null) {
        // Atualiza no backend usando PUT
        const codigo = document.getElementById("codigo").value;
        fetch(`http://localhost:3000/professores/${codigo}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo, nome: nomeProfessor, email, sala })
        })
            .then(() => {
                closeModal('professorModal');
                renderProfessores();
            });
    } else {
        // Gera o próximo codigo sequencial ao adicionar (maior codigo + 1)
        fetch('http://localhost:3000/professores')
            .then(response => response.json())
            .then(professores => {
                let codigo = 1;
                if (professores.length > 0) {
                    codigo = Math.max(...professores.map(p => Number(p.codigo))) + 1;
                }
                addProfessor(codigo, nomeProfessor, email, sala);
                closeModal('professorModal');
            });
    }
});

renderProfessores();