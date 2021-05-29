
let inputField
let submitButton
let backButton
let descText
let dhTable
let serverUrl = "http://127.0.0.1:5000/"
let loader

var currentState = 0
var states = ["START","AXIS","PARAMETERS","TABLE","RESULT"]

window.onload = function initialLoad(){
    inputField = document.getElementById("inputField")
    submitButton = document.getElementById("submitButton")
    backButton = document.getElementById("backButton")
    descText = document.getElementById("heading")
    dhTable = document.getElementById("dhTable")
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.foo-button'));
    loader = document.getElementById("loadingDiv")
    currentState = 0
    loadState()
}
function loadState(){
    switch(currentState){
        case 0:
            inputField.style.visibility = "hidden";
            backButton.style.visibility = "hidden";
            descText.innerHTML = "Welcome.. Press Start to Solve the Kinematics Problem"
            submitButton.innerHTML = "Start"
            break
        case 1:
            inputField.style.visibility = "visible";
            backButton.style.visibility = "visible";
            descText.innerHTML = "Enter the no of axis"
            submitButton.innerHTML = "Next";
            inputField.type="number"
            inputField.innerHTML=""
            break
        case 2:
            descText.innerHTML = "Enter dynamic parameters in string format.<br> Pressing enter will add it.<br>Pressing Next will proceed to next screen."
            inputField.type = "text"
            inputField.value = ""
            inputField.addEventListener("keydown", function (e) {
                addParameter(e)
            })
            inputField.style.visibility = "visible";
            submitButton.innerHTML = "Next"
            break;
        case 3:
            inputField.style.visibility = "hidden";
            fetchAxis(createTable)
            descText.innerHTML = "Enter DH Matrix Paramters. Enter either numbers or parameters specified."
            submitButton.innerHTML = "Validate & Submit"
            break;
        case 4:
            submitButton.style.visibility = "hidden";
            backButton.style.visibility = "hidden";
            dhTable.style.visibility = "hidden";
            descText.innerHTML = "RESULT !"
            processData()
            dhTable.remove()
    }
}

function submitFn(){
    switch(currentState){
        case 0:
            currentState+=1;
            break
        case 1:
            if(inputField.value == ""|| parseInt(inputField.value)<=0){
                alert("Error! Enter Valid Value")
                return
            }
            postAxisValue(parseInt(inputField.value))
            console.log(inputField.value)
            // TODO log in backend.
            currentState+=1;
            break;
        case 2:
            currentState+=1
            // TODO update.
            break;
        case 3:
            data = getTableData()
            console.log(data)
            if(data!=false){
                validateAndStoreData(data,function(result){
                    if(result=="true"){
                        currentState+=1
                        loadState()
                        console.log("Data Success")
                    }
                    else
                        alert("Error! Invalid Data")
                })
            }
            else{
                alert("Error! Invalid Data");
            }
            return
        }
    loadState()
}

function addParameter(event){
    let parameter = inputField.value
    if(event.keyCode === 13){
        if(parameter =="" || !isNaN(parameter[0])){
            alert("Error! Invalid Input")
            inputField.value="";
            return;
        }
        addSymbol(inputField.value)
        inputField.value="";
    }
}
function getInputValue(){
    // Selecting the input element and get its value 
    var inputVal = document.getElementById("axisNo").value;
    console.log(inputVal)
    // Show parameters String & hide current.
    changeToParametersField()

}
function changeToParametersField(){
    var submitButton = document.getElementById("submitButton")
    var inputVal = document.getElementById("axisNo")
    inputVal.value=""
    var desc = document.getElementById("desc")
    inputVal.type = "text"
    desc.innerHTML = "Enter Paramters in CSV type"
}
function postAxisValue(axis){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", serverUrl+"axisValue", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        value:axis
    }))
}
function createTable(axis){
    for(i=0;i<axis;i+=1){
        let row = dhTable.insertRow(i+1)
        let cell = row.insertCell(0);
        cell.innerHTML = i+1
        for(j=1;j<=4;j+=1){
            let cell = row.insertCell(j);
            cell.innerHTML = '<input type="text">'
        }
    }
    dhTable.style.visibility = "visible";
}
function fetchAxis(callback){
    fetch(serverUrl+'axisValue').
    then(response => response.json()).
    then(data => callback(data['value']))
}
function getTableData(){
    var rowLength = dhTable.rows.length
    data={}
    for(i=1;i<rowLength;i+=1){
        rowData={}
        let cols = dhTable.rows.item(i).cells;
        colLength = cols.length
        for(var j=1;j<colLength;j+=1){
            var value = cols.item(j).children[0].value
            console.log(value)
            if(value=="")
                return false;
            rowData[j] = value
        }
        data[i]=rowData
    }
    return JSON.stringify(data)
}
function validateAndStoreData(data,callback){
    fetch(serverUrl+"validateAndStoreData", {
        method: "POST", 
        body: data
      }).then(response => response.json())
      .then(data => {
          callback(data['result'])
      })
}

function processData(){
    loader.style.visibility = "visible";
    let divsToHide = document.getElementsByClassName("hiddenLoad")
    for(let i = 0; i < divsToHide.length; i++){
        divsToHide[i].style.visibility = "visible";
    }
    fetch(serverUrl + 'process')
  .then(response => response.json())
  .then(data => {
    loader.style.visibility = "hidden";
    for(let i = 0; i < divsToHide.length; i++){
        divsToHide[i].style.visibility = "hidden";
    }
      generateResultTable(data['result'])});
}

function addSymbol(data){
    let x = {}
    x['symbol']=data
    x = JSON.stringify(x)
    console.log(JSON.stringify(x))
    fetch(serverUrl+"addSymbol", {
        method: "POST", 
        body: x
    }).then(res => {
        console.log("Request complete! response:", res);
      });
}

function generateResultTable(result){
    console.log(result)
    resultTable = document.getElementById("resultTable")
    for(i=0;i<4;i+=1){
        let row = resultTable.insertRow(i)
        for(j=0;j<4;j+=1){
            let cell = row.insertCell(j);
            cell.innerHTML = result[i][j]
            console.log(result[i][j])
        }
    }
    resultTable.style.visibility = "visible";
    
}

function backFn(){
    console.log("state"+currentState)
    switch(currentState){
        case 1:
            currentState-=1
            break;
        case 2:
            currentState-=1
            break;
        case 3:
            currentState-=1
            dhTable.style.visibility = "hidden";
            inputField.removeEventListener("keydown",function(){})
            deleteTableRows()
            break;
    }
    loadState()
}
function deleteTableRows(){
    let rc = dhTable.rows.length
    while(rc>1){
        dhTable.deleteRow(1);
        rc-=1;
    }
}