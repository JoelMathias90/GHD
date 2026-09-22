const btn_criar = document.getElementById("criar-habito")
const form_habito = document.getElementById("form-habito")
const adicionar_habito = document.getElementById("adicionar-habito")

btn_criar.addEventListener("click", () => {
    form_habito.classList.remove("escondido")
    const nome_habito = document.getElementById("nome-habito")
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

    criarHabito(obj_habito)
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
