const btn = document.getElementById('enter'); 
const left = document.getElementById('left'); 
const inputForm = document.querySelector('.todo-form');
const entryItemList = document.getElementById('entry-items');
const inputField = document.getElementById('control-input');
const userAlert = document.getElementById('user-alert');

let entries = [];
titleCount = entries.filter(item => item.name === text).length;

// need to made the content escaped
// when updating add new hash tags when needed


function textHandler(text){

    let regExpr = /\B(\#[a-zA-Z]+\b)(?!;)/g
    text = text.match(regExpr);
    return text;

}




// titleCounter checks the titles to see if there are any duplicate titles and appends a number to the repeat title

function titleCounter(text){
    let numberArr = [];
    let duplicateCount = 0;
    const endNumRegEx = /\d+$/;

    // if the text is untitled we find all instances of untitled entries,
    // then if there is more thant one entry we update the title to be Untitled 2... 
    // if there are no other untitled entries we just return Untitled
    if(text === ""){
        entries.forEach(entry =>{
            let curTitle = entry.title;
            if(curTitle.slice(0,8) === 'Untitled' && curTitle.length > 8){
                let endingNumber = curTitle.match(endNumRegEx)[0];
                numberArr.push(endingNumber);
                duplicateCount++;
            } else if(curTitle === 'Untitled'){
                numberArr.push(1)
                duplicateCount++
            }
        })
        text = duplicateCount > 0 ? `Untitled ${Math.max(...numberArr) + 1}` : `Untitled`;
        return text
    } else {
        entries.forEach(entry =>{
            let curTitle = entry.title;
            if(text === curTitle.slice(0, text.length) && curTitle.length > text.length ){
                let endingNumber = curTitle.match(endNumRegEx)[0];
                numberArr.push(endingNumber);
                duplicateCount++;                
            } else if(curTitle === text){
                numberArr.push(1)
                duplicateCount++
            }
        })
        text = duplicateCount > 0 ? `${text} ${Math.max(...numberArr) + 1}` : text;
        return text
    }
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
        inputField.value = "";
    })
}

function addEntry(item){

    let itemTitle = item.substring(0, item.indexOf('--'));
    let itemText = item.substring(item.indexOf('--')).replace('--','');





        itemTitle = itemTitle !== "" ? itemTitle = titleCounter(itemTitle) : itemTitle = titleCounter("")     
    if(item !== ''){
        const entry = { 
            id: Date.now(),
            dateAdd: new Date().toDateString(),
            // title: titleCounter('Untitled'),
            title: itemTitle,

            text: itemText,
            tags: textHandler(item),
            completed: false
        };

        entries.push(entry);
        addToLocalStorage(entries);
        inputField.value = "";
    }
}

function renderEntries(entries){

    left.innerHTML = "";
    for(let i = entries.length - 1; i >= 0; i--){
        //seeing if entry is completed
        // const checked = entries[i].completed ? 'checked' : null;

        left.innerHTML += `
    <div class="item" data-key=${entries[i].id} onclick="toggleHeight(this)">
                <div class="title">
                    <h2>${entries[i].title}</h2>
                </div>
                <div class="txt">
                    ${entries[i].text}
                </div>
                <div class="item-footer">
                    <h5>${entries[i].dateAdd} : ${entries[i].tags}</h5>
                    <div class="edit-delete">
                    <span id="edit-btn" onclick="editEntry(this.dataset.key)" data-key=${entries[i].id}>Edit</span> / <span id="delete-btn" onclick="deleteEntry(this.dataset.key)" data-key=${entries[i].id}>Delete</span>
                    </div>
                </div>
            </div>
    `

    }
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
                            
                            <form id="edit-form" data-key=${entry.id}>
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
                
        } else if(identifier == entry.title){
            console.log(`identifier == entry.title: ${identifier == entry.title}`)

                left.innerHTML = `
                <div class="item" data-key=${entry.id}>
                            
                            <form id="edit-form" data-key=${entry.id}>
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
        entries.forEach(item =>{
            if(item.id == editForm.getAttribute('data-key')){
                console.log(`Title : ${item.title} || Title value: ${editTitleInput.value}`)
                console.log(`Text : ${item.text} || Text value: ${editTextInput.value}`)
                editTitleInput.value !== "" ? item.title = editTitleInput.value : item.title = 'Untitled';
                
                item.text = editTextInput.value;
                item.tags = textHandler(editTextInput.value);
            }
        })

        addToLocalStorage(entries);

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







function stylizeText(text){
    // search text and return text with style
}





































// add an eventListener on form, and listen for submit event
inputForm.addEventListener('submit', function(event) {
    // prevent the page from reloading when submitting the form
    event.preventDefault();
    submitHandler();
    //addEntry(inputField.value); // call addTodo function with input box current value
  });







document.addEventListener('click', (event)=>{
    if(event.target.closest('.item')){
        let curItem = document.querySelector(`[data-key='${event.target.closest('.item').dataset.key}']`);
        

    // if(event.target !== this || event.target === this){
        if(curItem.classList[1] !== 'expand-height'){
            curItem.classList.remove('contract-height');
            curItem.classList.add('expand-height');
        } else {
            curItem.classList.remove('expand-height');
            curItem.classList.add('contract-height');
        }

    } 
    
})

