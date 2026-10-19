let cl = console.log;

//spinner
const spinner = document.getElementById("spinner")
const studentContainer = document.getElementById("studentContainer")
const studentForm = document.getElementById("studentForm")

const fnameControl = document.getElementById("fname")
const lnameControl = document.getElementById("lname")
const contactControl = document.getElementById("contact")
const emailControl = document.getElementById("email")

const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn")


let BASE_URL = "https://fetch-api-crud-c0cc4-default-rtdb.asia-southeast1.firebasedatabase.app";

let STUDENT_URL = `${BASE_URL}/student2.json`;

//state 
let state = {
    studentArr : [],
    editId : null
}


//spinner
function handleSpinner(){
    spinner.classList.toggle("d-none")
}

//snacBar
function snackBar(msg, icon){
    Swal.fire({
        title : msg,
        icon : icon,
        timer : 3000
    })
}


//setNumber 

function setNumber() {
    let rows = document.querySelectorAll("#studentContainer tr");

    rows.forEach((row, i) => {
        row.querySelector("td:first-child").innerText = i + 1;
    });
}


//genric function
function makeApiCall(url, methedType, msgBody = null){
    let body = msgBody ? JSON.stringify(msgBody) : null;
    return fetch(url,{
        method : methedType,
        body : body,
        headers :{
            "content-type" : "application/json",
            "authrization" : "JWT TOKEN"
        }
    })
    .then((res)=>{
        if(!res.ok){
            throw new Error()
        }
         return res.json()
    })
    .catch((err)=>{
      snackBar(`something went wrong`, `error`)
    })
    .finally(()=>{
        handleSpinner()
    })
}


//read
function showUi(){
    handleSpinner()
    makeApiCall(STUDENT_URL, "GET")
    .then((data)=>{
        cl(data)

        let arr = Object.entries(data);
        let arr2 = arr.map((ele)=>{
            ele[1].id = ele[0]
            state.studentArr.push(ele[1]);
        })
        TempletingUi(state.studentArr)

    })
    .catch((err)=>{
      snackBar(`something went wrong`, `error`)
    })
}


//templeting 
function TempletingUi(arr){
    let result = ""
    arr.forEach((ele, i)=>{
        result += `<tr id="${ele.id}">
                  <td>${i+ 1}</td>
                  <td>${ele.fname}</td>
                  <td>${ele.lname}</td>
                  <td>${ele.contact}</td>
                  <td>${ele.email}</td>
                  <td>
                    <i onclick="onEdit(this)"
                      class="fa-solid fa-pen-to-square fa-2x text-primary"
                      role="button"
                    ></i>
                  </td>
                  <td>
                    <i onclick="onRemove(this)"
                      class="fa-solid fa-trash fa-2x text-danger"
                      role="button"
                    ></i>
                  </td>
                </tr>`
    })
    studentContainer.innerHTML = result;
}

showUi()


//create 
function onAddStudent(eve){
    eve.preventDefault();
    let newStudentObj = {
       fname : fnameControl.value,
       lname : lnameControl.value,
       contact : contactControl.value,
       email : emailControl.value 

    }
    handleSpinner()
    makeApiCall(STUDENT_URL, "POST", newStudentObj)
    .then((data)=>{
        cl(data);
        newStudentObj.id = data.name;
        state.studentArr.push(newStudentObj);
        let tr = document.createElement("tr")
        tr.id = newStudentObj.id
        tr.innerHTML = `<td>${state.studentArr.length}</td>
                  <td>${newStudentObj.fname}</td>
                  <td>${newStudentObj.lname}</td>
                  <td>${newStudentObj.contact}</td>
                  <td>${newStudentObj.email}</td>
                  <td>
                    <i onclick="onEdit(this)"
                      class="fa-solid fa-pen-to-square fa-2x text-primary"
                      role="button"
                    ></i>
                  </td>
                  <td>
                    <i onclick="onRemove(this)"
                      class="fa-solid fa-trash fa-2x text-danger"
                      role="button"
                    ></i>
                  </td>`
                  studentContainer.append(tr);
                  studentForm.reset();
                  snackBar(`student with id ${newStudentObj.id} created successfully`, `success`)
                  
    })
    .catch((err)=>{
        snackBar(`Something went wrong`, `error`)
    })
}


//edit 
function onEdit(ele){
    let editId = ele.closest("tr").id;
     state.editId = editId;
     let editObj = state.studentArr.find(std => std.id === editId);

     fnameControl.value = editObj.fname;
     lnameControl.value = editObj.lname;
     contactControl.value = editObj.contact;
     emailControl.value = editObj.email;
     
     updateBtn.classList.remove("d-none");
     submitBtn.classList.add("d-none")
     

}

//update
function onUpdateStudent(ele){
    let updateId = state.editId;
    let UPDATE_URL = `${BASE_URL}/student2/${updateId}.json`;
    let UPDATE_OBJ = {
       fname : fnameControl.value,
       lname : lnameControl.value,
       contact : contactControl.value,
       email : emailControl.value,
       id : updateId
    }
    handleSpinner()
    makeApiCall(UPDATE_URL, "PATCH", UPDATE_OBJ)
    .then((data)=>{
        cl(data);
        let getIndex = state.studentArr.findIndex(ele => ele.id === updateId);
        state.studentArr[getIndex] = UPDATE_OBJ;
        let tr = document.getElementById(updateId)
        tr.innerHTML = `<td>${getIndex+1}</td>
                  <td>${UPDATE_OBJ.fname}</td>
                  <td>${UPDATE_OBJ.lname}</td>
                  <td>${UPDATE_OBJ.contact}</td>
                  <td>${UPDATE_OBJ.email}</td>
                  <td>
                    <i onclick="onEdit(this)"
                      class="fa-solid fa-pen-to-square fa-2x text-primary"
                      role="button"
                    ></i>
                  </td>
                  <td>
                    <i onclick="onRemove(this)"
                      class="fa-solid fa-trash fa-2x text-danger"
                      role="button"
                    ></i>
                  </td>`
                  studentForm.reset()
                  state.editId = null
                  updateBtn.classList.add("d-none");
                  submitBtn.classList.remove("d-none");
                  snackBar(`student with id ${updateId} updated successfully`, `success`)
    })
    .catch((err)=>{
        snackBar(`something went wrong`, `error`)
    })
}

//delete
function onRemove(ele){
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    let removeId = ele.closest("tr").id;
    let REMOVE_URL = `${BASE_URL}/student2/${removeId}.json`;
    handleSpinner()
    makeApiCall(REMOVE_URL, "DELETE")
    .then((data)=>{
        let removeIndex = state.studentArr.findIndex(ele => ele.id === removeId);
        state.studentArr.splice(removeIndex, 1)
        ele.closest("tr").remove()
        setNumber()
        snackBar(`student with id ${removeId} deleted successfully`, `success`)
    })
    .catch((err)=>{
        snackBar(`something went wrong`, `error`)
    })
  }
});
}



studentForm.addEventListener("submit", onAddStudent)
updateBtn.addEventListener("click", onUpdateStudent)