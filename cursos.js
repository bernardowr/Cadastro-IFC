let currentCursoId = null;

// Carrega os cursos como linhas da tabela
function renderCursos() {
    const tbody = document.querySelector('#cursosTable tbody');
    tbody.innerHTML = '';
    fetch('http://localhost:3000/cursos')
        .then(response => response.json())
        .then(cursos => {
            cursos.forEach((curso, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
        <td>${curso.nome}</td>
        <td>${curso.sigla}</td>
        <td>${curso.descricao}</td>
        <td>${curso.coordenador}</td>
        <td>
            <button onclick="editCurso(${index})">Editar</button>
            <button onclick="deleteCurso(${index})">Excluir</button>
        </td>
    `;
                tbody.appendChild(row);
            });
        });
}

// Adiciona um novo curso via POST
function addCurso(id, nome, sigla, descricao, coordenador) {
    let curso = { id, nome, sigla, descricao, coordenador };
    console.log(curso);
    fetch('http://localhost:3000/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(curso)
    })
        .then(response => response.json())
        .then(dados => {
            console.log(dados);
        })
    renderCursos();
}

// Edita um curso (preenche o formulário com os dados do backend)
function editCurso(index) {
    fetch('http://localhost:3000/cursos')
        .then(response => response.json())
        .then(cursos => {
            const curso = cursos[index];
            document.getElementById("id").value = curso.id;
            document.getElementById("nome").value = curso.nome;
            document.getElementById("sigla").value = curso.sigla;
            document.getElementById("descricao").value = curso.descricao;
            document.getElementById("coordenador").value = curso.coordenador;
            currentCursoId = curso.id;
            openModal("cursoModal");
        });
}

// Exclui um curso via índice
function deleteCurso(index) {
    fetch('http://localhost:3000/cursos')
        .then(response => response.json())
        .then(cursos => {
            const curso = cursos[index];
            if (confirm(`Tem certeza que deseja excluir o curso ${curso.nome}?`)) {
                fetch(`http://localhost:3000/cursos/${curso.id}`, {
                    method: 'DELETE'
                })
                    .then(() => {
                        renderCursos();
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

// Listener para o botão addCurso, vai chamar a openModal()
const btAddCurso = document.getElementById('addCurso');
btAddCurso.addEventListener('click', function () {
    currentCursoId = null;
    document.getElementById('cursoForm').reset();
    openModal('cursoModal');
});

// Listener para fechar modais
document.querySelectorAll('.close').forEach(function (closeBtn) {
    closeBtn.addEventListener('click', function () {
        closeModal(this.closest('.modal').id);
    });
});

// Formulário de curso
const cursoForm = document.getElementById('cursoForm');
cursoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    const sigla = document.getElementById("sigla").value;
    const descricao = document.getElementById("descricao").value;
    const coordenador = document.getElementById("coordenador").value;

    if (currentCursoId !== null) {
        // Atualiza no backend usando PUT
        fetch(`http://localhost:3000/cursos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, nome, sigla, descricao, coordenador })
        })
            .then(() => {
                closeModal('cursoModal');
                renderCursos();
            });
    } else {
        // Gera o próximo id sequencial ao adicionar
        fetch('http://localhost:3000/cursos')
            .then(response => response.json())
            .then(cursos => {
                if (!id) {
                    if (cursos.length > 0) {
                        const maxId = Math.max(...cursos.map(c => Number(c.id)));
                        id = maxId + 1;
                    } else {
                        id = 1;
                    }
                }
                addCurso(id, nome, sigla, descricao, coordenador);
                closeModal('cursoModal');
            });
    }
});

renderCursos();