const btn_criar = document.getElementById("criar-habito")
const form_habito = document.getElementById("form-habito")
const adicionar_habito = document.getElementById("adicionar-habito")
const nome_habito = document.getElementById("nome-habito")

btn_criar.addEventListener("click", () => {
    form_habito.classList.remove("escondido")
    nome_habito.focus()
})

const obj_habito = {
    nome: "",
    dia: []
}

adicionar_habito.addEventListener("click", (event) => {
    event.preventDefault()
    const data = new FormData(form_habito)

    obj_habito.nome = data.get("nome-habito")
    obj_habito.dia = data.getAll("dia-semana")

    const aprovacao = validarCampos(obj_habito.nome, obj_habito.dia)
    
    if (!aprovacao.valido) {
        const modal = document.getElementById("modal")
        const texto_modal = document.getElementById("texto-modal")
        texto_modal.textContent = aprovacao.msg

        modal.classList.add("visible")
        return
    }

    criarHabito(obj_habito)
    form_habito.reset()
    form_habito.classList.add("escondido")
})

function criarHabito(data) {
    const { nome, dia } = data

    const lista_habitos = document.getElementById("lista-habitos")
    lista_habitos.classList.remove("escondido")

    const mensagem_vazio = document.getElementById("mensagem-vazio")
    mensagem_vazio.classList.add("escondido")

    const item = document.createElement("li")
    item.className = "item-habito"

    const h = document.createElement("h1")
    h.textContent = nome

    const ul = document.createElement("ul")
    ul.className = "frequencia-detalhe"

    for (i = 0; i < dia.length; i++) {
        const li = document.createElement("li")
        const span = document.createElement("span")

        const first_caracter = dia[i].charAt(0).toUpperCase()
        span.textContent = first_caracter

        li.appendChild(span)
        ul.appendChild(li)
    }

    item.appendChild(h)
    item.appendChild(ul)
    lista_habitos.appendChild(item)
}

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