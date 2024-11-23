// * =========== Global variables i need in App =========== //

var boxModal = document.querySelector(".box-info");
var bookMarkInput = document.querySelector("#bookmarkName");
var siteURLInput = document.querySelector("#bookmarkURL");
var submitButton = document.querySelector("#submitBtn");
var tableContent = document.querySelector("#table-content");
var closeButton = document.querySelector("#closeBtn");

var bookmarkRegex = /^\w{3,}(\s+\w+)*$/;
var siteURLRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;

// * =========== validate Inputs =========== //

function validateInputs(regex, element) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
  }
}

bookMarkInput.addEventListener("input", function () {
  validateInputs(bookmarkRegex, bookMarkInput);
});

siteURLInput.addEventListener("input", function () {
  validateInputs(siteURLRegex, siteURLInput);
});

// * =========== Capitalize Site Name Input =========== //

function capitalizeInput(input) {
  var inputString = input.split("");
  inputString[0] = inputString[0].toUpperCase();
  return inputString.join("");
}

if (localStorage.getItem("allBookMarks")) {
  var allBookMarks = JSON.parse(localStorage.getItem("allBookMarks"));
  dispalyAllBookmarks();
} else {
  var allBookMarks = [];
}

// * =========== Display New Bookmark  =========== //

function dispalyAllBookmarks() {
  var container = "";
  for (i = 0; i < allBookMarks.length; i++) {
    container += `
    <tbody id="table-content">
      <tr>
        <td>${i + 1}</td>
        <td>${allBookMarks[i].name}</td>
        <td>
          <button class="btn btn-visit" data-index="${i}">
            <i class="fa-solid fa-eye"></i>
            Visit
          </button>
        </td>
        <td>
          <button class="btn btn-delete" id="btn-delete" data-index="${i}">
            <i class="fa-solid fa-trash-can"></i>
            Delete
          </button>
        </td>
         <td>
          <button class="btn btn-update" data-index="${i}">
            <i class="fa-solid fa-edit"></i>
            Update
          </button>
        </td>
      </tr>
    </tbody>
  `;
  }

  tableContent.innerHTML = container;
  //* delete && update action from inside display function ==//
  var deleteBtn = document.querySelectorAll(".btn-delete");
  var updateBtn = document.querySelectorAll(".btn-update");

  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", function () {
      deleteBookmark(deleteBtn[i].getAttribute("data-index"));
    });
  }

  for (let i = 0; i < updateBtn.length; i++) {
    updateBtn[i].addEventListener("click", function () {
      updateBookmark(updateBtn[i].getAttribute("data-index"));
    });
  }
}

// * =========== add New Bookmark  =========== //

var currentUpdateIndex = null;

function addNewBookmark() {
  if (
    bookMarkInput.classList.contains("is-valid") &&
    siteURLInput.classList.contains("is-valid")
  ) {
    var bookmark = {
      name: capitalizeInput(bookMarkInput.value),
      siteURL: siteURLInput.value,
    };

    console.log(bookmark);

    if (submitButton.innerText == "Submit") {
      allBookMarks.push(bookmark);
    } else if (submitButton.innerText == "Update") {
      if (currentUpdateIndex !== null) {
        allBookMarks[currentUpdateIndex] = bookmark;
        currentUpdateIndex = null;
        submitButton.innerText = "Submit";
      }
    }

    localStorage.setItem("allBookMarks", JSON.stringify(allBookMarks));
    clearForm();
    dispalyAllBookmarks();

    bookMarkInput.classList.remove("is-valid");
    siteURLInput.classList.remove("is-valid");
  } else {
    boxModal.classList.remove("d-none");
  }
}

submitButton.addEventListener("click", addNewBookmark);

// * =========== Clear Form  =========== //

function clearForm() {
  bookMarkInput.value = "";
  siteURLInput.value = "";
}

// * ===========  Delete Bookmark  =========== //

function deleteBookmark(index) {
  allBookMarks.splice(index, 1);
  localStorage.setItem("allBookMarks", JSON.stringify(allBookMarks));
  dispalyAllBookmarks();
}

// * ===========  Update Bookmark  =========== //

function updateBookmark(index) {
  bookMarkInput.value = allBookMarks[index].name;
  siteURLInput.value = allBookMarks[index].siteURL;
  submitButton.innerText = "Update";

  currentUpdateIndex = index;
  validateInputs(bookmarkRegex, bookMarkInput);
  validateInputs(siteURLRegex, siteURLInput);
}

// * =========== Close Box Modal when click on x button with two methods =========== //
function closeModal() {
  boxModal.classList.add("d-none");
}
closeButton.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});
