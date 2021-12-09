const btn = document.getElementById('enter'); 
const left = document.getElementById('left'); 
const inputForm = document.querySelector('.todo-form');
const entryItemList = document.getElementById('entry-items');
const inputField = document.getElementById('control-input');
const userAlert = document.getElementById('user-alert');
let entries = [];







// function updateEntry(){
//     const editForm = document.getElementById('edit-form');
//     // addEntry(inputField.value);

//     editForm.addEventListener('submit', ()=>{
//         event.preventDefault();
//         console.log('edit submitted')
//     });
// }





// functions

//

function detectCommands(){
    
    
}

function submitHandler(){
    // searching for /commands
    let regExpr = /\B(\/[a-zA-Z]+\b)(?!;)/g

    inputForm.addEventListener('submit', ()=>{
        event.preventDefault();

        if(inputField.value[0] == '/'){
            switch(inputField.value.match(regExpr)[0]){

                case '/delete':
                    deleteEntry(event.target.elements[0].value.slice(8))
                    break;

                case '/edit':
                    console.log('edit typed')
                    editEntry(event.target.elements[0].value.slice(6))
                    break;

                case '/help':
                    console.log(`What do you need`)
                    break;
                default:
                    console.log("defaulted")
            }

        } else {
            addEntry(inputField.value);
        }

    })
}

function addEntry(item){
    

    let regExpr = /\B(\#[a-zA-Z]+\b)(?!;)/g
    let itemTitle = item.substring(0, item.indexOf('--'));
    let itemText = item.substring(item.indexOf('--') + 2);
    let tags = item.match(regExpr);

    if(item !== ''){
        const entry = { 
            id: Date.now(),
            dateAdd: new Date().toDateString(),
            title: itemTitle,
            text: itemText,
            tags: tags,
            completed: false
        };

        entries.push(entry);
        addToLocalStorage(entries);
        inputField.value = "";
    }
}

function renderEntries(entries){

    left.innerHTML = "";
    entries.forEach((item)=>{
        //seeing if entry is completed
        const checked = item.completed ? 'checked' : null;

        left.innerHTML += `
    <div class="item" data-key=${item.id}>
                <div class="title">
                    <h2>${item.title}</h2>
                </div>
                <div class="txt">
                    ${item.text}
                </div>
                <div class="item-footer">
                    <h5>${item.dateAdd} : ${item.tags}</h5>
                    <div class="edit-delete">
                    <span id="edit-btn" onclick="editEntry(this.dataset.key)" data-key=${item.id}>Edit</span> / <span id="delete-btn" onclick="deleteEntry(this.dataset.key)" data-key=${item.id}>Delete</span>
                    </div>
                </div>
            </div>
    `
    });
}


function addToLocalStorage(entries){
    //convert the array to a string                     
    localStorage.setItem('entries', JSON.stringify(entries));

    // render to screen
    renderEntries(entries)
}

function getFromLocalStorage(){
    const reference = localStorage.getItem('entries');
    // if reference exist 
    if(reference){
        // converts back to array
        entries = JSON.parse(reference);
        renderEntries(entries)
    }
}
getFromLocalStorage();














function editEntry(identifier){

    

    entries.forEach((entry=>{



        
        if(identifier == entry.id){
            console.log(`identifier == entry.id: ${identifier == entry.id}`)
            console.log(`edit identifier is: ${identifier}`);
            
                left.innerHTML = `
                <div class="item" data-key=${entry.id}>
                            
                            <form id="edit-form">
                            <input type="text" id="edit-title" value="${entry.title}" autofocus>
                            <textarea style="resize:none;" name="" id="" cols="30" rows="10">${entry.text}</textarea>
                        <button type="submit" id="enter">Enter</button>
                      </form>
                            <div class="item-footer">
                                <h5>${entry.dateAdd} : ${entry.tags}</h5>
                                <div class="edit-delete">
                                <span id="delete-btn" onclick="deleteEntry(this.dataset.key)" data-key=${entry.id}>Delete</span>
                                </div>
                            </div>
                        </div>
                `;
                console.log(entry.title)
                
        } else if(identifier == entry.title){
            console.log(`identifier == entry.title: ${identifier == entry.title}`)

                left.innerHTML = `
                <div class="item" data-key=${entry.id}>
                            
                            <form id="edit-form">
                            <input type="text" id="edit-title" value="${entry.title}" autofocus>
                            <textarea style="resize:none;" name="" id="edit-text" cols="30" rows="10">${entry.text}</textarea>
                        <button type="submit" id="enter">Enter</button>
                      </form>
                            <div class="item-footer">
                                <h5>${entry.dateAdd} : ${entry.tags}</h5>
                                <div class="edit-delete">
                                <span id="delete-btn" onclick="deleteEntry(this.dataset.key)" data-key=${entry.id}>Delete</span>
                                </div>
                            </div>
                        </div>
                `;
                console.log(entry.title)
            
        } 
        
    }))

    const editForm = document.getElementById('edit-form');
    const editTitleInput = document.getElementById('edit-title');
    const editTextInput = document.getElementById('edit-text');
    
    editForm.addEventListener('submit', ()=>{
        event.preventDefault();
        console.log('edit submitted')
        entry.title = editTitleInput.value;

        // need to also remove old item and replace it
        // addEntry(`${editTitleInput.value}-- Bug`);
    });

}





function deleteEntry(identifier){


entries.forEach((entry=>{
    if(identifier == entry.id){
        console.log(`delete identifier is: ${identifier}`);
        entries = entries.filter((item)=>{
            userAlert.innerText = `Deleted ${item.title}`
                    // types are dif, so not using !==
                    return item.id != identifier;
                });
    } else if(identifier == entry.title){
        entries = entries.filter((item)=>{
            userAlert.innerText = `Deleted ${item.title}`
                    return item.title != identifier;
                });
    } else {
        userAlert.innerText = 'Could not delete that!'
    }
}))
    addToLocalStorage(entries);
}












































// add an eventListener on form, and listen for submit event
inputForm.addEventListener('submit', function(event) {
    // prevent the page from reloading when submitting the form
    event.preventDefault();
    submitHandler();
    //addEntry(inputField.value); // call addTodo function with input box current value
  });









