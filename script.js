var addBtn = document.getElementById("addBtn");
var clearBtn = document.getElementById("clearBtn");
var todoNameInput = document.getElementById("todoName");
var todoDate = document.getElementById("inputDate");
var todoListElem = document.querySelector(".todo-list");
toggleAddButton();
// Display existing todos when the page loads
displayTodos();

// Event listener to check input changes
todoNameInput.addEventListener("input", toggleAddButton);
todoDate.addEventListener("input", toggleAddButton);

addBtn.addEventListener("click", function () {
  toggleAddButton();
  var todoNameValue = todoNameInput.value;
  var todoDateValue = todoDate.value;

  // ID para sa localstorage
  var todoId = "task" + Date.now().toString();

  // call natin yung function once na yung inputs are validated
  appendTodo(todoId, todoNameValue, todoDateValue, todoListElem);

  // Save input to local storage
  saveTodoToLocalStorage(todoId, todoNameValue, todoDateValue);
  clearInput(todoNameInput, todoDate);
  toggleAddButton();
});

clearBtn.addEventListener("click", function () {
  clearInput(todoNameInput, todoDate);
  toggleAddButton();
});

// show todo in the task container
function displayTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  // hiniwalay lalng natin yung data
  todos.forEach((todo) => {
    appendTodo(todo.id, todo.name, todo.date, todoListElem);
  });
}

// allows us to save the data to local storage
function saveTodoToLocalStorage(id, name, date) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.push({ id, name, date });

  // using set item, we are able to define a new set of data in the local storage
  localStorage.setItem("todos", JSON.stringify(todos));
}

function appendTodo(todoId, todoName, todoDate, listElem) {
  // Create a new div element for the todo item
  var todoElem = document.createElement("div");
  todoElem.id = todoId;
  todoElem.classList.add("todo-item");

  const editModal = document.getElementById("editModal");
  const modalTodoName = document.getElementById("modalTodoName");
  const modalTodoDate = document.getElementById("modalTodoDate");
  const saveEditBtn = document.getElementById("saveEditBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");

  function openEditModal(item) {
    // Populate modal inputs with current todo data
    modalTodoName.value = item.name;
    modalTodoDate.value = item.date;

    // Show modal
    editModal.style.display = "flex";
  }

  var nameElem = document.createElement("p");
  nameElem.textContent = todoName;
  var dateElem = document.createElement("p");
  dateElem.textContent = todoDate;

  todoElem.appendChild(nameElem);
  todoElem.appendChild(dateElem);
  listElem.appendChild(todoElem);

  // edit button
  var editElem = document.createElement("button");
  editElem.textContent = "Edit";
  editElem.setAttribute("id", "editBtn");

  editElem.addEventListener("click", function () {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const item = todos.find((todo) => todo.id === todoId);

    if (item) {
      openEditModal(item);

      saveEditBtn.onclick = function () {
        // Update the todo item with new values
        item.name = modalTodoName.value;
        item.date = modalTodoDate.value;

        // Save the updated todos array to localStorage
        localStorage.setItem("todos", JSON.stringify(todos));

        // Close the modal and update the UI
        editModal.style.display = "none";
        nameElem.textContent = item.name;
        dateElem.textContent = item.date;
      };
    } else {
      console.log("Todo item not found in localStorage.");
    }
  });

  // Close the modal
  closeModalBtn.addEventListener("click", function () {
    editModal.style.display = "none";
  });

  // close modal by clickinig outside the modal content
  window.addEventListener("click", function (event) {
    if (event.target === editModal) {
      editModal.style.display = "none";
    }
  });
  // Create delete button
  var deleteElem = document.createElement("button");
  deleteElem.textContent = "Delete";

  todoElem.appendChild(editElem);

  deleteElem.addEventListener("click", function () {
    listElem.removeChild(todoElem);

    // Remove from local storage
    removeTodoFromLocalStorage(todoId);
  });

  todoElem.appendChild(deleteElem);
}

function removeTodoFromLocalStorage(todoId) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const updatedTodos = todos.filter((todo) => todo.id !== todoId);
  localStorage.setItem("todos", JSON.stringify(updatedTodos));
}

function clearInput(input1, input2) {
  input1.value = "";
  input2.value = "";
}

// Check if may laman ba yung input
// Change bg color nung add button depending if empty or non empty yung input value
function toggleAddButton() {
  if (todoNameInput.value.trim() === "" || todoDate.value === "") {
    addBtn.style.backgroundColor = "gray";
    addBtn.disabled = true;
  } else {
    addBtn.style.backgroundColor = "green";
    addBtn.disabled = false;
  }
}
