const listHabits = document.getElementById("listHabits")
const progressContainer = document.getElementById("progressContainer")
const progressBar = document.getElementById("progressBar")
const progressCount = document.getElementById("progressCount")
const addHabitButton = document.getElementById("addHabitButton")
const addHabitForm = document.getElementById("addHabitForm")
const habitTitleInput = document.getElementById("habitTitleInput")
const habitFrequencyInputs = document.getElementsByName("habitFrequencyInput")
const submitHabitButton = document.getElementById("submitHabitButton")
const cancelHabitButton = document.getElementById("cancelHabitButton")
const filterCurrentDate = document.getElementById("filterCurrentDate")
const editionButton = document.getElementById("editionButton")

const currentDate = new Date()
const currentDateFormatted = currentDate.toLocaleDateString()
const frequencyDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
const storageParsed = localStorage.getItem("habits") ? JSON.parse(localStorage.getItem("habits")) : []

function createHabitElement(habit) {
    const { id, title, frequency } = habit

    const li = document.createElement("li")
    const input = document.createElement("input")
    const p = document.createElement("p")
    const div = document.createElement("div")
    const button = document.createElement("button")

    frequencyDays.forEach((value, index) => {
        const dayContainer = document.createElement("div")
        const dayPoint = document.createElement("div")
        const span = document.createElement("span")

        dayContainer.className = "dayContainer"
        dayPoint.className = "dayPoint"
        span.textContent = value.charAt(0)

        dayContainer.append(dayPoint, span)
        div.append(dayContainer)

        if (frequency.includes(String(index))) {
            dayPoint.classList.add("onDayPoint")
            span.classList.add("onDay")
        }

    })

    li.id = "listItem"
    li.className = "listItem"
    li.dataset.id = id
    input.type = "checkbox"
    p.className = "itemTitle"
    p.textContent = title
    div.className = "frequencyContainer"
    button.id = "editButton"
    button.className = "editButton"
    button.textContent = "img"

    li.append(input, p, div, button)
    return li
}

function renderListHabits(storageParsed) {
    listHabits.replaceChildren()
    storageParsed.forEach((habit) => {
        const habitItem = createHabitElement(habit)
        listHabits.appendChild(habitItem)
        renderHabit(habit)
    })
}
renderListHabits(storageParsed)

function toggleHabitCompletion(habit) {
    const item = storageParsed.find(item => item.id === habit.id)

    if (item.completedDates.includes(currentDateFormatted)) {
        habit.completedDates = habit.completedDates.filter(day => day !== currentDateFormatted)
    } else {
        habit.completedDates.push(currentDateFormatted)
    }
    localStorage.setItem("habits", JSON.stringify(storageParsed))
}

function addHabit(habit) {
    const newHabit = createHabitElement(habit)
    listHabits.appendChild(newHabit)
    addHabitForm.reset()
    addHabitForm.classList.remove("open")
    listHabits.classList.add("open")
}

function renderHabit(habit) {
    const item = listHabits.querySelector(`[data-id="${habit.id}"]`);

    if (habit.completedDates.includes(currentDateFormatted)) {
        item.classList.add("completed")
        item.children[0].checked = true
    } else {
        item.classList.remove("completed")
        item.children[0].checked = false
    }
}
function removeItem(habitId) {
    const element = document.querySelector(`[data-id='${habitId}']`)
    listHabits.removeChild(element)
}
function updateItem(habit) {
    const { id, title, frequency } = habit
    const listItem = document.querySelector(`[data-id='${id}']`)
    const titleInput = listItem.querySelector(".itemTitle")
    const frequencyContainer = listItem.querySelectorAll(".dayContainer")
    titleInput.textContent = title

    frequencyContainer.forEach((item, index) => {
        item.childNodes[0].classList.remove("onDayPoint")
        item.childNodes[1].classList.remove("onDay")
        if (frequency.includes(String(index))) {
            item.childNodes[0].classList.add("onDayPoint")
            item.childNodes[1].classList.add("onDay")
        }
    })
}

function updateProgressBar() {
    const goal = storageParsed.filter((habit) => habit.frequency.includes(currentDate.getDay().toString()))
    const progress = goal.filter((habit) => habit.completedDates.includes(currentDateFormatted))
    const progressRate = goal.length > 0 ? (progress.length / goal.length) * 100 : 0
    progressCount.textContent = progress.length + "  /  " + goal.length
    progressBar.style.width = `${progressRate}%`
}
updateProgressBar()


function filterHabitsByToday(habits, container) {
    const today = new Date().getDay();
    habits.forEach(habit => {
        const element = container.querySelector(`[data-id="${habit.id}"]`);
        const shouldShow = habit.frequency.includes(String(today));
        element.hidden = !shouldShow;
    });
}

addHabitButton.addEventListener("click", () => {
    addHabitForm.classList.add("open")
})

submitHabitButton.addEventListener("click", (event) => {
    event.preventDefault()
    const title = habitTitleInput.value
    const frequency = []
    habitFrequencyInputs.forEach(item => {
        if (item.checked) frequency.push(item.value)
    })

    const habit = {
        id: crypto.randomUUID(),
        title,
        frequency,
        completedDates: []
    }
    storageParsed.push(habit)
    const storageStringfy = JSON.stringify(storageParsed)
    localStorage.setItem("habits", storageStringfy)

    addHabit(habit)
    updateProgressBar()
    if (filterCurrentDate.checked) filterHabitsByToday(storageParsed, listHabits)

})

cancelHabitButton.addEventListener("click", () => {
    addHabitForm.classList.remove("open")
})

listHabits.addEventListener("click", (event) => {
    if (event.target.matches('input[type="checkbox"]')) {
        const item = event.target.closest(".listItem")
        const itemId = item.dataset.id
        const habit = storageParsed.find((habit) => habit.id === itemId)

        toggleHabitCompletion(habit)
        renderHabit(habit, item)
        updateProgressBar()
    }
    if (event.target.matches('button')) {

        const item = event.target.closest(".listItem")
        const itemId = item.dataset.id
        editHabit(itemId)
        console.log("oi");

        // hideModal()
    }
})

filterCurrentDate.addEventListener("click", (event) => {
    filterHabitsByToday(storageParsed, listHabits)
    if (event.target.checked === false) {
        const items = listHabits.querySelectorAll("#listItem")
        items.forEach(item => item.hidden = false)
    }
})



function editHabit(itemId) {
    const habit = storageParsed.find(habit => habit.id === itemId)
    createEditForm(habit)
}

function createEditForm(habit) {
    const outBlack = document.createElement("div")
    const divModal = document.createElement("div")
    const titleInput = document.createElement("input")
    const divContainer = document.createElement("div")
    const divSubmitButton = document.createElement("Button")
    const divCancelButton = document.createElement("Button")
    const divExluirButton = document.createElement("button")

    frequencyDays.forEach((day, key) => {
        const div = document.createElement("div")
        const label = document.createElement("label")
        const checkbox = document.createElement("input")

        label.htmlFor = `${day}`
        label.textContent = frequencyDays[key].charAt(0)
        checkbox.id = `${day}`
        checkbox.type = "checkbox"
        checkbox.value = key
        checkbox.name = "frequency"
        checkbox.checked = habit.frequency.includes(String(key))
        div.append(label, checkbox)
        divContainer.appendChild(div)
    })

    outBlack.className = "outBlack"
    divModal.className = "divModal"
    titleInput.id = "titleInputEdit"
    titleInput.className = "titleInputEdit"
    titleInput.value = habit.title

    divContainer.className = "divContainerEdit"
    divSubmitButton.className = "divSubmitButton"
    divSubmitButton.textContent = "Env"
    divSubmitButton.addEventListener("click", () => submitEditHabit(habit))
    divCancelButton.className = "divCancelButton"
    divCancelButton.textContent = "Can"
    divCancelButton.addEventListener("click", () => hideModal())
    divExluirButton.className = "divExcluirButton"
    divExluirButton.textContent = "Exc"
    divExluirButton.addEventListener("click", () => deleteHabit(habit))

    divModal.append(titleInput, divContainer, divSubmitButton, divCancelButton, divExluirButton)
    outBlack.append(divModal)
    document.body.append(outBlack)
}

function submitEditHabit(habit) {
    const titleInput = document.getElementById("titleInputEdit")
    const divContainerEdit = document.getElementsByClassName("divContainerEdit")[0]
    const inputs = divContainerEdit.querySelectorAll("[name='frequency']")
    const title = titleInput.value
    const frequency = []

    Array.from(inputs).forEach((input, index) => {
        if (input.checked) frequency.push(String(index))
    })

    habit.title = title
    habit.frequency = frequency

    localStorage.setItem("habits", JSON.stringify(storageParsed))
    hideModal()
    updateItem(habit)
}

function hideModal() {
    const outBlack = document.querySelector(".outBlack")
    outBlack.remove()
}

function deleteHabit(habit) {
    const index = storageParsed.findIndex((item) => item.id === habit.id)
    storageParsed.splice(index, 1)
    localStorage.setItem("habits", JSON.stringify(storageParsed))
    removeItem(habit.id)
    hideModal()
};
