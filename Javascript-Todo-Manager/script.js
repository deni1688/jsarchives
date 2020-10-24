//currently working on organizing all the functions into model, view, controller objects

function app() {
  var addTodo = getId("add");
  var edit = getId("edit");
  var appClicks = getId("appInner");
  var saveContent = getId("save");
  var infoBtn = getId("infoBtn");
  var clearLS = getId("clearLS");
  var info = getId("info");
  var hideBtn = getId("exitInfo");

  listen(appClicks, "click", deleteTask);
  listen(addTodo, "click", addNew);
  listen(edit, "click", editTodo);
  listen(saveContent, "click", saveToLocal);
  listen(appClicks, "drop", dragDrop.drop);
  listen(appClicks, "dragover", dragDrop.allowDrop);
  listen(appClicks, "dragstart", dragDrop.drag);
  listen(appClicks, "click", statusChange);
  listen(appClicks, "dblclick", clearForEdit);
  listen(infoBtn, "click", toggleInfo);
  listen(clearLS, "click", clearStorage);
  listen(hideBtn, "click", hideInfo);

  function clearForEdit(e) {
    if (e.target.nodeName === "H2" || "P") {
      var targetH2 = e.target;
      targetH2.innerText = "";
    }
  }

  function toggleInfo() { 
    if (info.className === "hide") {  
      info.className = "show"; 
    } else {  
      info.className = "hide";
    }
  }

  function hideInfo() {
    info.className = "hide";
  }

  function clearStorage() {
    localStorage.clear();
    location.reload(true);
  }

  function saveToLocal() {
    var contentObj = {
      appContent: getId("appInner").innerHTML
    };
    var toStorage = localStorage.setItem("saveTodoApp", JSON.stringify(contentObj.appContent));
    return toStorage;
  }

  function statusChange(e) {
    var elClicked = e.target;
    if (elClicked.getAttribute("class") === "statusLabel todos") {
      var elemParent = elClicked.parentNode.parentNode;
      var storedHTML = getId(elemParent.id).outerHTML;
      elemParent.parentNode.removeChild(elemParent);
      var colOne = getId("todos");
      colOne.innerHTML += storedHTML;
    } else if (e.target.getAttribute("class") === "statusLabel inProgress") {
      var elemParent = elClicked.parentNode.parentNode;
      var storedHTML = getId(elemParent.id).outerHTML;
      elemParent.parentNode.removeChild(elemParent);
      var colTwo = getId("progress");
      colTwo.innerHTML += storedHTML;
      updateIds();
    } else if (e.target.getAttribute("class") === "statusLabel inReview") {
      var elemParent = elClicked.parentNode.parentNode;
      var storedHTML = getId(elemParent.id).outerHTML;
      elemParent.parentNode.removeChild(elemParent);
      var colThree = getId("review");
      colThree.innerHTML += storedHTML;
      updateIds();
    } else if (e.target.getAttribute("class") === "statusLabel completed") {
      var elemParent = elClicked.parentNode.parentNode;
      var storedHTML = getId(elemParent.id).outerHTML;
      elemParent.parentNode.removeChild(elemParent);
      var colFour = getId("complete");
      colFour.innerHTML += storedHTML;
      updateIds();
    }
  }

  function addNew() {
    var currentTodos = getId("todos");
    var allTodosLength = findClass(".task").length;
    var template = "<div id='" + allTodosLength + "' class='task' draggable='true'>";
    template += "<div><h2 contenteditable='true'>Double click to edit Title</h2><p contenteditable='true'>Double click to edit your Todo description.</p></div>";
    template += "<i class='delete fa fa-trash'></i>";
    template += "<div class='status'><span class='statusLabel todos'>Todos</span>";
    template += "<span class='statusLabel inProgress'>Doing</span>";
    template += " <span class='statusLabel inReview'>Review</span>";
    template += " <span class='statusLabel completed'>Done</span></div></div>";
    currentTodos.innerHTML += template;
  }

  function updateIds() {
    var countTodos = findClass(".task");
    for (var count = 0; count < countTodos.length; count++) {
      countTodos[count].id = count;
    }
  }

  function editTodo() {
    var deleteBtn = findClass(".delete");
    for (var n = 0; n < deleteBtn.length; n++) {
      if (deleteBtn[n].style.display === "inline-block") {
        edit.innerHTML = "<i class='fa fa-pencil-square-o' aria-hidden='true'></i> Edit";
        deleteBtn[n].style.display = "none";
      } else {
        edit.innerHTML = "Done";
        deleteBtn[n].style.display = "inline-block";
      }
    }
  }

  function checkLength() {
    var deleteBtn = findClass(".delete");
    if (deleteBtn.length !== 0) {
      edit.innerHTML = "Done";
    } else {
      edit.innerHTML = "<i class='fa fa-pencil-square-o' aria-hidden='true'></i> Edit";
    }
  }

  function deleteTask(e) {
    if (e.target.classList.contains("delete")) {
      e.target.parentNode.parentNode.removeChild(e.target.parentNode);
      updateIds();
      checkLength();
    }
  }

  function reloadSaved() {
    var savedContent = JSON.parse(localStorage.getItem("saveTodoApp"));
    var appContainer = getId("appInner");
    if (savedContent !== null) {
      appContainer.innerHTML = savedContent;
    }
  }
  reloadSaved();
} //end of app

//helper functions
function getId(input) {
  var inputId = document.getElementById(input);
  return inputId;
}

function getClass(input, pos) {
  var inputClassName = document.getElementsByClassName(input)[pos];
  return inputClassName;
}

function findClass(input) {
  var queryClassName = document.querySelectorAll(input);
  return queryClassName;
}

function listen(elem, ev, func) {
  elem.addEventListener(ev, func);
}

//drag and drop Obejct
var dragDrop = {
  allowDrop: function(e) {
    if (e.target.getAttribute("class") == "dataCol") {
      e.preventDefault();
    }
  },
  drag: function(e) {
    if (e.target.hasAttribute("draggable")) {
      e.dataTransfer.setData("text", e.target.id);
    }
  },
  drop: function(e) {
    if (e.target.getAttribute("class") == "dataCol") {
      e.preventDefault();
      var data = e.dataTransfer.getData("text");
      e.target.appendChild(document.getElementById(data));
    }
  }
}

app();