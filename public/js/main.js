/*
I wanna make it so when page loads we get a special boot up image like with terminal and ascii art


double check help section and update it


*/





const btn = document.getElementById('enter'); 
const left = document.getElementById('left'); 
const itemBox = document.getElementById('item-box');
const itemScrollBox = document.getElementById('item-scroll');
const right = document.getElementById('right'); 
const hashContainer = document.getElementById('hash-container'); 
const editTextField =  document.getElementById('edit-text');
const editTitleField =  document.getElementById('edit-title');
const trash = document.getElementById('trash');
const inputForm = document.querySelector('.todo-form');
const entryItemList = document.getElementById('entry-items');
const inputField = document.getElementById('control-input');

let trashedTitles = document.getElementsByClassName('trashed-title')
let entries = [];
let deletedEntries = [];



document.addEventListener('keypress', e => {
    if (e.code === 'Enter' && !e.shiftKey){
        e.preventDefault();
        btn.click();
    }
})



// This event listener keeps the input focus, unless text is selected.

window.addEventListener('mouseup', ()=>{
    let needFocus = false;
    

    if(document.activeElement === editTextField){
        document.activeElement === editTextField.focus();
    } else if(document.activeElement === editTitleField) {
        document.activeElement === editTitleField.focus();
        
    } else if(window.getSelection().toString().length == 0 && document.activeElement !== editTextField){
            inputField.focus()
        }
})


// add an eventListener on form, and listen for submit event
inputForm.addEventListener('submit', function(event) {
    // prevent the page from reloading when submitting the form
    event.preventDefault();
    submitHandler();
  });




let elasticIndex = elasticlunr(function () {
    this.addField('title');
    this.addField('text');
    this.setRef('id');
});




const helpTxt = `
                    Welcome to my note and todo app. Over the years as I have used the terminal more, and hobbied with coding I have grown fond of running commands by text. So I took that approach with this project. I included a few mouse interactions, but everything can be controlled completely by text.

                    Commands:

                    /delete My Title (This command allows you to delete the specified post)

                    /emptytrash (Any items in the trash will be permanetly deleted)

                    /untrash My Title (This command will remove the specified entry from the trash)

                    /edit My Title (This command allows you to edit the specified entry)

                    /rkaine My Title (This command can be used to open a specific entry)

                    /filter #SomeHashTag (Use this to filter through for entries with specific tags)

                    /search Search query (Search all entries for your search query)
                    
                    /home (Home Command will bring you back to the home page of all of your entries)
                    
                    /help (At anytime return here for a list of commands)
                    
                    Creating an entry:

                    All titles should be unique, in the event you reuse a title the apropriate number will be appended. To title you entry type your desired text followed by -- (This is my Title--). Note a title is not required. If you do not specify a title it will be named Untitled.
                    
                    Anything after the -- Will be body text. If you did not give the entry a title anything you type will automatically be body text.

                    Inside of the body text you can use <li > to create a todo list, to create a list item type ** at the end of the previous list item i.e. <li This is one ** Now two ** And three etc. >. One  item list do not need ** <li One item >.
`


titleCount = entries.filter(item => item.name === text).length;




function searchRender(query){
    entries.forEach(entry =>{
    elasticIndex.addDoc(entry);
})

    let searchEntries = [];
    let queryResults = elasticIndex.search(query);

    if(queryResults.length > 0){

        queryResults.forEach(res =>{
            let resToPush = entries.find(item => item.id == res.doc.id)
            searchEntries.push(resToPush)
        });
    }

    itemBox.innerHTML = ""

    searchEntries.forEach(entry =>{

        if(entry.completed){
            itemBox.innerHTML += `
            <div class="item" data-key="${entry.id}">
                        <div  data-key="${entry.id}" onclick="renderItem(this.dataset.key)">
                            <h2 class="trashed-title">${entry.title}</h2>
                        </div>
                        
                        <div class="item-footer">
                            <h5>${entry.dateAdd} : ${entry.tags ? entry.tags.join(' ') : "No Tags"}</h5>
                            <div class="edit-delete">
                            <span id="edit-btn" onclick="editEntry(this.dataset.key)" data-key=${entry.id}>Edit</span> / <span id="delete-btn" onclick="deleteEntry(this.dataset.key)" data-key=${entry.id}>Delete</span>
                            </div>
                        </div>
                    </div>
            `
    
        }else {
    
            itemBox.innerHTML += `
            <div class="item" data-key="${entry.id}">
                        <div class="title" data-key="${entry.id}" onclick="renderItem(this.dataset.key)">
                            <h2>${entry.title}</h2>
                        </div>
                        
                        <div class="item-footer">
                            <h5>${entry.dateAdd} : ${entry.tags ? entry.tags.join(' ') : "No Tags"}</h5>
                            <div class="edit-delete">
                            <span id="edit-btn" onclick="editEntry(this.dataset.key)" data-key=${entry.id}>Edit</span> / <span id="delete-btn" onclick="deleteEntry(this.dataset.key)" data-key=${entry.id}>Delete</span>
                            </div>
                        </div>
                    </div>
            `
        }

    })

}

function renderHashtags (entries) {
    let tagsArr = [];

    entries.forEach(item =>{
        if(item.tags != null && !item.completed){
            tagsArr.push(...item.tags)
            
        } 
            console.log('tags array '+tagsArr)
    })

    // this creates a new array that has no duplicates.
    let tagsSlim = Array.from(new Set(tagsArr));

    tagsSlim.forEach(tag =>{
        console.log('the tag hoe '+tag)
        hashContainer.innerHTML += `<a href="#" class="hashtag-right" onclick="hashTagFilter('${tag}')">${tag}</a><br>`;
    })

}

function tagHandler(text){

    let regExpr = /\B(\#[a-zA-Z0-9]+\b)(?!;)/g
    text = text.match(regExpr);

    return text;

}

// need to make if statement to controll if clicked or title used
function hashTagFilter(hashtag){
    let filteredRes = [];
    entries.forEach(entry =>{
      if(entry.tags != null && entry.tags.includes(hashtag)){
        filteredRes.push(entry)
      } 
    })
   
    itemBox.innerHTML= '';
    filteredRes.forEach(entry =>{

        if(entry.completed){
            inputField.value = '';

            itemBox.innerHTML += `
            <div class="item" data-key="${entry.id}">
                        <div  data-key="${entry.id}" onclick="renderItem(this.dataset.key)">
                            <h2 class="trashed-title">${entry.title}</h2>
                        </div>
                        
                        <div class="item-footer">
                            <h5>${entry.dateAdd} : ${entry.tags ? entry.tags.join(' ') : "No Tags"}</h5>
                            <div class="edit-delete">
                            <span id="edit-btn" onclick="editEntry(this.dataset.key)" data-key=${entry.id}>Edit</span> / <span id="delete-btn" onclick="deleteEntry(this.dataset.key)" data-key=${entry.id}>Delete</span>
                            </div>
                        </div>
                    </div>
            `

        }else {
            inputField.value = '';

            itemBox.innerHTML += `
            <div class="item" data-key="${entry.id}">
                        <div class="title" data-key="${entry.id}" onclick="renderItem(this.dataset.key)">
                            <h2>${entry.title}</h2>
                        </div>
                        
                        <div class="item-footer">
                            <h5>${entry.dateAdd} : ${entry.tags ? entry.tags.join(' ') : "No Tags"}</h5>
                            <div class="edit-delete">
                            <span id="edit-btn" onclick="editEntry(this.dataset.key)" data-key=${entry.id}>Edit</span> / <span id="delete-btn" onclick="deleteEntry(this.dataset.key)" data-key=${entry.id}>Delete</span>
                            </div>
                        </div>
                    </div>
            `
        }


    })
  
  }


  // no html allowed 

  function sanitizer(text){
      if(text.match(/<(.*)>/g)){
         text = text.replace( /(<([^>]+)>)/ig, '')
        }
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

        if(inputField.value[0] == '/'){
            switch(inputField.value.match(regExpr)[0]){

                case '/delete':
                    deleteEntry(event.target.elements[0].value.slice(8))
                    inputField.value = "";

                    break;
                    case '/emptytrash':
                    emptryTrash()
                    inputField.value = "";

                    break;
                case '/untrash':
                    untrashEntry(event.target.elements[0].value.slice(9))
                    inputField.value = "";

                    break;

                case '/edit':
                    editEntry(event.target.elements[0].value.slice(6).trim())
                    
                    break;
                case '/rkaine':
                    renderItem(event.target.elements[0].value.slice(8).trim())
            inputField.value = "";

                    break;

                case '/help':
                    left.innerText = helpTxt;
            inputField.value = "";

                    break;
                case '/filter':
                   hashTagFilter(inputField.value.slice(8))
            inputField.value = "";

                    break;
                case '/search':
                    searchRender(inputField.value.slice(8))
            inputField.value = "";

                    break;
                case '/home':
                    location.reload();
                    renderEntries(entries)
            inputField.value = "";

                    break;
                default:
                    console.log("defaulted")
            }

        } else {
            addEntry(inputField.value);
        }

    
}

function addEntry(item){

    let itemTitle = item.substring(0, item.indexOf('--')).trim();
    let itemText = item.substring(item.indexOf('--')).replace('--','').trim();
    
    if(item !== ''){
        
        entries = entries.filter(entry => entry.isEditing != true);
        itemTitle = itemTitle !== "" ? itemTitle = titleCounter(itemTitle) : itemTitle = titleCounter("")     

        const entry = { 
            id: Date.now(),
            dateAdd: new Date().toDateString(),
            title: itemTitle,
            text: itemText,
            tags: tagHandler(item),
            completed: false
        };

        entries.push(entry);
        addToLocalStorage("entries",entries);
            hashContainer.innerHTML = "";
        renderHashtags(entries);
        inputField.value = "";
    } else if (item === ''){
        itemBox.innerHTML += `<p>Could not do that try again.</p>`

    }

}



function textMarkup(text){
    // Looking for (li Anything that goes in here  )
    let regExLi =   /\(li([^()]+)\)/g;
    let regExBold = /\(b([^()]+)\)/g;
    let regExItalics = /\(i([^()]+)\)/g;
    let regExImportant = /\(!([^()]+)\)/g;
 
        text = text.replaceAll(regExItalics, src => `<em>${src.replaceAll(/\(i|\)/g,'')}</em>`)
        text = text.replaceAll(regExImportant, src => `<span class="note-important">${src.replaceAll(/\(!|\)/g,'')}</span>`)
        text = text.replaceAll(regExBold, src => `<strong>${src.replaceAll(/\(b|\)/g,'')}</strong>`)

    if(text.match(regExLi)){
        let theList = ``;
        
        let listArr = text.match(regExLi)[0].substring(3,text.match(regExLi)[0].length - 1).split("**");
        listArr.forEach(listItem =>{
            console.log('list item ',listItem)
            theList += `<li>${listItem}</li> `;
        });
    
        
            
            text = text.replace(regExLi, `<ul>${theList}</ul>`);

            
            return text ;
        
    } else {

        return text.replaceAll(regExBold, src => `<strong>${src.replaceAll(/\(b|\)/g,'')}</strong>`).replaceAll(regExItalics, src => `<em>${src.replaceAll(/\(b|\)/g,'')}</em>`);
    }
    

}


function renderEntries(entries){
    
    trash.innerHTML = "";
    itemBox.innerHTML = "";
    inputField.style.removeProperty('height')
        entries.forEach(entry =>{

        //seeing if entry is completed
        if(entry.completed === false){

            itemBox.innerHTML += `
        <div class="item" data-key="${entry.id}">
                    <div class="title" data-key="${entry.id}" onclick="renderItem(this.dataset.key)">
                        <h2>${entry.title}</h2>
                    </div>
                    
                    <div class="item-footer">
                        <h5>${entry.dateAdd} : ${entry.tags ? entry.tags.join(' ') : "No Tags"}</h5>
                        <div class="edit-delete">
                        <span id="edit-btn" onclick="editEntry(this.dataset.key)" data-key=${entry.id}>Edit</span> / <span id="delete-btn" onclick="deleteEntry(this.dataset.key)" data-key=${entry.id}>Delete</span>
                        </div>
                    </div>
                </div>
        `
        } else {
            // need to make it a function with event litener
            // using the title tag to show "alt text"
            trash.innerHTML += `<div class="trashed-div"><a href='#' title="${entry.title}" class="trash-links" data-key=${entry.id} onclick='renderItem(this.dataset.key)'>${entry.title.length > 17 ? entry.title.slice(0,17)+'...': entry.title}</a></div>`;
            // trash.innerHTML += `<a href='#' class="trash-links" data-key=${entry.id} onclick='renderItem(this.dataset.key)'>${entry.title}</a><br>`;
        }

    })
    

  
}





function renderItem(identifier){
inputField.value = "";
inputField.style.removeProperty('height');
    entries.forEach((entry=>{
        
        if(identifier == entry.id){
            console.log(`identifier == entry.id: ${identifier == entry.id}`)
            console.log(`edit identifier is: ${identifier}`);
            let noteTxt = textMarkup(entry.text);
                itemBox.innerHTML = `

                            <div class="note-container">
                            <h1>${entry.title}</h1>
                            <div class='note-text'>${noteTxt}</div>
                            <div class="note-footer">
                                <h5>${entry.dateAdd} : ${entry.tags}</h5>
                                <div class="edit-delete">
                                ${entry.completed ? `<span id="edit-btn" onclick="untrashEntry(this.dataset.key)" data-key=${entry.id}>Untrash</span>` : `<span id="edit-btn" onclick="editEntry(this.dataset.key)" data-key=${entry.id}>Edit</span>`}  /  <span id="delete-btn" onclick="deleteEntry(this.dataset.key)" data-key=${entry.id}>Delete</span>
                                </div>
                            </div>
                       
                `;
                console.log(entry.title);
                
        } else if(identifier === entry.title){
            
            itemBox.innerHTML = `

                            <div class="note-container">
                            <h1>${entry.title}</h1>
                            <p>${entry.text}</p>
                            <div class="note-footer">
                                <h5>${entry.dateAdd} : ${entry.tags}</h5>
                                <div class="edit-delete">
                                <span id="edit-btn" onclick="editEntry(this.dataset.key)" data-key=${entry.id}>Edit</span> / <span id="delete-btn" onclick="deleteEntry(this.dataset.key)" data-key=${entry.id}>Delete</span>
                                </div>
                            </div>
                       
                `;

        }
        
    }))
    
}


function addToLocalStorage(storageName, theEntries){
    //convert the array to a string
    
    // storageName === "entries" ? localStorage.setItem('entries', JSON.stringify(entries)) : localStorage.setItem('deletedEntries', JSON.stringify(entries));

    if(storageName === 'entries'){
        localStorage.setItem('entries', JSON.stringify(theEntries)) 
    } else if(storageName === 'deletedEntries'){
        localStorage.setItem('deletedEntries', JSON.stringify(theEntries))
    }
    
    // localStorage.setItem(storageName, JSON.stringify(entries));

    // render to screen
    renderEntries(entries)
}

function getFromLocalStorage(){
    const reference = localStorage.getItem('entries');
    const delReference = localStorage.getItem('deletedEntries');
    // if reference exist 
    if(reference){
        // converts back to array
        entries = JSON.parse(reference);
        
        renderEntries(entries)
        
    }

    if(delReference){
        deletedEntries = JSON.parse(delReference);
        renderTrash(deletedEntries);
        

    }
}
getFromLocalStorage();


function editEntry(identifier){

    // set it so when you pick a for edit editing true then once it has been updated remove it.

    entries.forEach((entry=>{
        
        if(identifier == entry.id){
            entry.isEditing = true;

            itemBox.innerHTML = ""
            inputField.value = `${entry.title}-- ${entry.text}`;
            if(entry.text.length > 150){
                inputField.style.height = "600px"
            }

            //setting the cursor to star at end of text area
            inputField.setSelectionRange(inputField.value.length, inputField.value.length);

                console.log(entry.title)
                
        } else if(identifier === entry.title){
            entry.isEditing = true;

            itemBox.innerHTML = ""
            inputField.value = "";

            inputField.value = `${entry.title}-- ${entry.text}`;

            //setting the cursor to star at end of text area
            inputField.setSelectionRange(inputField.value.length, inputField.value.length);

                console.log(entry.title)
            
        } 
        
    }))

  

}

function deleteEntry(identifier){
console.log(identifier)

entries.forEach(entry =>{

    if(entry.id == identifier){
        if(!entry.completed){
            entry.completed = true;
            entry.trashedDate =  Date.now();
        } else {
            entries = entries.filter(item => item.id != identifier)
        }
    } else if(entry.title == identifier){
        if(!entry.completed){
            entry.completed = true;
            entry.trashedDate =  Date.now();
        } else {
            entries = entries.filter(item => item.title != identifier)
        }
    }
    
 
    })
addToLocalStorage("entries", entries);

    
}


function removeOldTrash(){
    // removing items from trassh if 7 dyas or older
    let keepEntries = [];

    entries.forEach(item =>{
        if(!item.trashedDate || Date.now() - item.trashedDate < 604800000){
            keepEntries.push(item);
        }
    })
        entries = keepEntries;        
        addToLocalStorage("entries", entries);
    

}

function emptryTrash(){
    entries = entries.filter(entry => entry.completed != true)
    addToLocalStorage("entries", entries);
}

function untrashEntry (identifier){

    entries.forEach(entry => {
        if(entry.id == identifier){

                entry.completed = false;
                delete entry.trashedDate;
                
            } else if(entry.title == identifier){
                
                entry.completed = false;
                delete entry.trashedDate;
        
    } 
    })
    addToLocalStorage("entries", entries);
  
}


renderHashtags(entries);

window.onload = removeOldTrash();
