const habitos = [
    {
        id: crypto.randomUUID(),
        titulo: "Reunião colaborativa",
        frequencia: ["segunda"],
        concluido: false
    }
]

const form_habito = document.getElementById("form-habito")

function renderizarHabitos() {
    const lista_habitos = document.getElementById("lista-habitos")
    const mensagem_vazio = document.getElementById("mensagem-vazio")

    lista_habitos.replaceChildren()

    if (habitos.length > 0) {
        mensagem_vazio.classList.add("escondido")
        lista_habitos.classList.remove("escondido")
    }

    function criarComponenteHabito(habito) {
        const { id, titulo, frequencia, concluido } = habito

        const item_habito = document.createElement("li")
        item_habito.id = id
        item_habito.className = "item-habito"

        const checkbox_concluido = document.createElement("input")
        checkbox_concluido.type = "checkbox"
        checkbox_concluido.id = "checkbox-concluido"
        item_habito.appendChild(checkbox_concluido)
        checkbox_concluido.addEventListener("click", marcarHabito)

        const texto_titulo = document.createElement("p")
        texto_titulo.id = "texto-titulo"
        texto_titulo.textContent = titulo
        item_habito.appendChild(texto_titulo)

        const lista_frequencia = document.createElement("ul")
        lista_frequencia.className = "frequencia-detalhe"

        function criarDetalheFrenquencia(dia) {
            const item_frequencia = document.createElement("li");
            const first_caracter = dia.charAt(0).toUpperCase();
            item_frequencia.textContent = first_caracter;
            lista_frequencia.appendChild(item_frequencia)
        }

        frequencia.forEach(dia => {
            criarDetalheFrenquencia(dia)
        });

        item_habito.appendChild(lista_frequencia)

        return item_habito
    }



    habitos.forEach(habito => {
        const item_habito = criarComponenteHabito(habito)
        lista_habitos.appendChild(item_habito)
        estilizarHabitoConcluido(habito.id, habito.concluido)
    })
}

renderizarHabitos()

const btn_criar = document.getElementById("criar-habito")
btn_criar.addEventListener("click", () => {
    const nome_habito = document.getElementById("nome-habito")
    form_habito.classList.remove("escondido")
    nome_habito.focus()
})

const adicionar_habito = document.getElementById("adicionar-habito")

adicionar_habito.addEventListener("click", (event) => {
    event.preventDefault()
    const data = new FormData(form_habito)

    const titulo = data.get("nome-habito")
    const frequencia = data.getAll("dia-semana")

    const validacao = validarCampos(titulo, frequencia)

    if (!validacao.valido) {
        const modal = document.getElementById("modal")
        const texto_modal = document.getElementById("texto-modal")
        texto_modal.textContent = validacao.msg

        modal.classList.add("visible")
        return
    }

    const habito = {
        id: crypto.randomUUID(),
        titulo,
        frequencia,
        concluido: false
    }

    habitos.push(habito)

    renderizarHabitos()
    form_habito.reset()
    form_habito.classList.add("escondido")
})

function validarCampos(nome, dia) {
    if (nome === "") {
        return { valido: false, msg: "Digite um nome para o hábito!" }
    } else if (dia.length === 0) {
        return { valido: false, msg: "Selecione uma frequência!" }
    } else {
        return { valido: true, msg: "Criado com sucesso!" }
    }
}

const cancelar_habito = document.getElementById("cancelar-habito")
cancelar_habito.addEventListener("click", (e) => {
    form_habito.classList.add("escondido")
})


function marcarHabito(event) {
    const item = event.target.parentNode
    const habito = habitos.find(({ id }) => id === item.id)
    habito.concluido = !habito.concluido

    estilizarHabitoConcluido(habito.id, habito.concluido)
}

function estilizarHabitoConcluido(itemId, concluido) {
    const item = document.getElementById(itemId)
        
    if (concluido) {
        item.classList.add("checkbox-concluido")
        item.children[0].checked = true
    } else {
        item.classList.remove("checkbox-concluido")
    }
    
}