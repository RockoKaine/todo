/*

text area accepts html oh no!



I wanna make it so when page loads we get a special boot up image like with terminal and ascii art


Need to make sure the messages get set up


Need a way to "format" the text, <l> will make a line break <b bold text> <! important text(diff color)>


hashtag sorting stopped working
i think the hashtags are not working because they didnt exist, i removed the entry and tags still there
i think i sould render hashtags without the trash one, or maybe with 


for trash/tags if names are too long add ...


need to be able to delete trash and set trash to delete item after 7 days. also need to restore trash item.


wanted to keep text area formatting but need a rich text editor look into it maybe liked quill but feels like a lot... idk though




in note commands:
    <li First thing-- Second -- Third> ** this is a list 
    <b Bold me!> ** this will bee bold
    <e this will be italics>

*/


//pointless not just wanna test something so making a change




const btn = document.getElementById('enter'); 
const left = document.getElementById('left'); 
const itemBox = document.getElementById('item-box');
const right = document.getElementById('right'); 
const hashContainer = document.getElementById('hash-container'); 
const editTextField =  document.getElementById('edit-text');
const editTitleField =  document.getElementById('edit-title');
const trash = document.getElementById('trash');
const inputForm = document.querySelector('.todo-form');
const entryItemList = document.getElementById('entry-items');
const inputField = document.getElementById('control-input');
// const userAlert = document.getElementById('user-alert');

let entries = [];
let deletedEntries = [];


// setting scroll position
window.onload=function () {
    itemBox.scrollTop = itemBox.scrollHeight;
}


// making the enter key submit the form and shift+enter adding new line

document.addEventListener('keypress', e => {
    if (e.code === 'Enter' && !e.shiftKey){
        e.preventDefault();
        btn.click();
        // submitHandler();
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
    //addEntry(inputField.value); // call addTodo function with input box current value
  });




let elasticIndex = elasticlunr(function () {
    this.addField('title');
    this.addField('text');
    this.setRef('id');
});




const helpTxt = `
                    Welcome to my note and todo app. Over the years as I have used the terminal more, and hobbied with coding I have grown fond of running commands by text. So I took that approach with this project. I included a few mouse interactions, but everything can be controlled completely by text.

                    Commands:

                    /help (At anytime return here for a list of commands)

                    /filter #SomeHashTag (Use this to filter through for entries with specific tags)

                    /edit My Title (This command allows you to edit the specified post)

                    /delete My Title (This command allows you to delete the specified post)

                    /home (Home Command will bring you back to the home page of all of your entries)

                    /history (This will enlarge the history are of all your completed list)

                    Creating an entry:

                    All titles must be unique, in the event you reuse a title the apropriate number will be appended. To title you entry type your desired text followed by -- (This is my Title--). Note a title is not required. If you do not specify a title it will be named Untitled.
                    
                    Anything after the -- Will be body text. If you did not give the entry a title anything you type will automatically be body text.

                    Inside of the body text you can use <li > to create a todo list, to create a list item type ** at the end of the previous list item i.e. <li This is one ** Now two ** And three etc. >. One  item list do not need ** <li One item >.
                    
                    If you have created an entry containing a todo list, and not a plain list, when you inspect your entry you will have boxes to check indicating you have completed that item. If all items have been checked the item will be moved to the completed section. Should you find you have prematurely completed your list you can find it in the completed section and unclick the appropriate box. It will be added back to your home area. Alternatively you can type the /uncomplete Your Title. This will uncheck the last task you check and return it to the home area.
`


titleCount = entries.filter(item => item.name === text).length;



function rerenderer(){
    renderEntries()
    renderHashtags()
    renderTrash()
}


function searchRender(query){

    let queryResults = elasticIndex.search(query);

    if(queryResults.length > 0){
        let ogEntries = entries;
        entries = [];

        queryResults.forEach(res =>{
            let resToPush = ogEntries.find(item => item.id == res.doc.id)
            entries.push(resToPush)
        });
    }


    renderEntries(entries);
}

function renderHashtags (entries) {
    let tagsArr = [];

    entries.forEach(item =>{
        if(item.tags != null && !item.completed){
            tagsArr.push(...item.tags)
        } 
            
    })

    // this creates a new array that has no duplicates.
    let tagsSlim = Array.from(new Set(tagsArr));

    tagsSlim.forEach(tag =>{
        hashContainer.innerHTML += `<a href="#" onclick="renderEntries(hashTagFilter('${tag}'))">${tag}</a><br>`;
    })

}

function tagHandler(text){

    let regExpr = /\B(\#[a-zA-Z0-9]+\b)(?!;)/g
    text = text.match(regExpr);

    return text;

}


function hashTagFilter(hashtag){
    let filteredRes = [];
    entries.forEach(entry =>{
      if(entry.tags.includes(hashtag)){
        filteredRes.push(entry)
      }
    })
    return filteredRes
  
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
                    break;

                case '/edit':
                    console.log('edit typed')
                    editEntry(event.target.elements[0].value.slice(6))
                    break;
                case '/rkaine':
                    console.log('edit typed')
                    renderItem(event.target.elements[0].value.slice(6))
                    break;

                case '/help':
                    left.innerText = helpTxt;
                    break;
                case '/filter':
                    renderEntries(hashTagFilter(inputField.value.slice(8)))
                    break;
                case '/search':
                    searchRender(inputField.value.slice(8))
                    break;
                case '/home':
                    renderEntries(entries)
                    break;
                default:
                    console.log("defaulted")
            }

        } else {
            addEntry(inputField.value);
        }
        inputField.value = "";
}

function addEntry(item){

    let itemTitle = item.substring(0, item.indexOf('--')).trim();
    let itemText = item.substring(item.indexOf('--')).replace('--','').trim();
    itemTitle = itemTitle !== "" ? itemTitle = titleCounter(itemTitle) : itemTitle = titleCounter("")     
    
    if(item !== ''){
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
        itemBox.innerHTML += `${itemTitle}, has been successfully created!`
    } else if (item === ''){
        itemBox.innerHTML += `<p>Could not do that try again.</p>`

    }

}



function textMarkup(text){
    // Looking for <li Anything that goes in here  >
    let regExLi = /<li(.*)>/g;
    // Searching the text for the list item
    
    
    // take each item in list array and place them in a ul as li

    

    
    if(text.match(regExLi)){
        let theList = ``;
        let listArr = text.match(regExLi)[0].substring(3,text.match(regExLi)[0].length - 1).split("**");
        listArr.forEach(listItem =>{
            console.log('list item ',listItem)
            theList += `<li>
            
            ${listItem}
            </li> `;
        });
    
        
    
            text = text.replace(regExLi, `<ul>
                                            ${theList}
                                            Add item++ 
                                         </ul>`);
            return text;
        
    }

    else {
        return text;
    }

}


function renderEntries(entries){
    
    trash.innerHTML = "";
    itemBox.innerHTML = "";
    for(let i = 0; i < entries.length; i++){
        //seeing if entry is completed
        // const checked = entries[i].completed ? 'checked' : null;
        if(entries[i].completed === false){

            itemBox.innerHTML += `
        <div class="item" data-key="${entries[i].id}">
                    <div class="title" data-key="${entries[i].id}" onclick="renderItem(this.dataset.key)">
                        <h2>${entries[i].title}</h2>
                    </div>
                    
                    <div class="item-footer">
                        <h5>${entries[i].dateAdd} : ${entries[i].tags ? entries[i].tags.join(' ') : "No Tags"}</h5>
                        <div class="edit-delete">
                        <span id="edit-btn" onclick="editEntry(this.dataset.key)" data-key=${entries[i].id}>Edit</span> / <span id="delete-btn" onclick="deleteEntry(this.dataset.key)" data-key=${entries[i].id}>Delete</span>
                        </div>
                    </div>
                </div>
        `
        }

    }

  
}

function renderTrash(){ 
    entries.forEach(entry =>{
        if(entry.completed === true){
                trash.innerHTML += `${entry.title}<br>`;
        }
    })
}



function renderItem(identifier){

    entries.forEach((entry=>{
        
        if(identifier == entry.id){
            console.log(`identifier == entry.id: ${identifier == entry.id}`)
            console.log(`edit identifier is: ${identifier}`);
            
                itemBox.innerHTML = `

                            <div class="note-container">
                            <h1>${entry.title}</h1>
                            <p>${textMarkup(entry.text)}</p>
                            <div class="note-footer">
                                <h5>${entry.dateAdd} : ${entry.tags}</h5>
                                <div class="edit-delete">
                                <span id="edit-btn" onclick="editEntry(this.dataset.key)" data-key=${entry.id}>Edit</span> / <span id="delete-btn" onclick="deleteEntry(this.dataset.key)" data-key=${entry.id}>Delete</span>
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
    renderTrash()
}

function getFromLocalStorage(){
    const reference = localStorage.getItem('entries');
    const delReference = localStorage.getItem('deletedEntries');
    // if reference exist 
    if(reference){
        // converts back to array
        entries = JSON.parse(reference);
        
        renderEntries(entries)
        renderTrash();
        
    }

    if(delReference){
        deletedEntries = JSON.parse(delReference);
        renderTrash(deletedEntries);
        

    }
}
getFromLocalStorage();


function editEntry(identifier){
    entries.forEach((entry=>{
        
        if(identifier == entry.id){
            console.log(`identifier == entry.id: ${identifier == entry.id}`)
            console.log(`edit identifier is: ${identifier}`);
            itemBox.innerHTML = ""
            inputField.defaultValue = `${entry.title}-- ${entry.text}`;

            //setting the cursor to star at end of text area
            inputField.setSelectionRange(inputField.value.length, inputField.value.length);

                console.log(entry.title)
                
        } else if(identifier == entry.title){
            console.log(`identifier == entry.title: ${identifier == entry.title}`)

                left.innerHTML = `
                            
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
                `;
                console.log(entry.title)
            
        } 
        
    }))

  

}

function deleteEntry(identifier){
console.log(identifier)

entries.forEach(entry =>{
    if(entry.id == identifier){
        entry.completed = true
    }
})
addToLocalStorage("entries", entries);

    
}




entries.forEach(entry =>{
    elasticIndex.addDoc(entry);
})
renderHashtags(entries);