document.addEventListener('DOMContentLoaded', function() {
    // Funções para Professores
    function renderProfessores() {
        const tbody = document.querySelector('#professoresTable tbody');
        tbody.innerHTML = '';

        fetch('http://localhost:3000/professores')
        .then(response => response.json())
        .then(professores => {
            // Faça algo com os dados recebidos
            console.log(professores);

            professores.forEach((professor, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${professor.codigo}</td>
                    <td>${professor.nomeProfessor}</td>
                    <td>${professor.emailProfessor}</td>
                    <td>
                        <button onclick="editProfessor(${index})">Editar</button>
                        <button onclick="deleteProfessor(${index})">Excluir</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });
    }
    renderProfessores();
});