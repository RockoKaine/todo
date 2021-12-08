const btn = document.getElementById('enter'); 
const left = document.getElementById('left'); 
const inputForm = document.querySelector('.todo-form');
const entryItemList = document.getElementById('entry-items');
const inputField = document.getElementById('control-input');
let entries = [];





function myAlert(){
    alert('hi')
}
// functions

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

        // const itemWrapper = document.createElement('div');

        // itemWrapper.setAttribute('class', 'item');
        // itemWrapper.setAttribute('data-key', item.id);
        
        // if(item.completed === true){
        //     itemWrapper.classList.add('checked');
        // }

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
                        Edit / <span id="delete-btn" onclick="deleteEntry()" data-key=${item.id}>Delete</span>
                    </div>
                </div>
            </div>
    `

    //   left.append(itemWrapper);
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


function deleteEntry(){
console.log(event.target.attributes[2].value)
let id = event.target.attributes[2].value;
    entries = entries.filter((item)=>{
        // types are dif, so not using !==
        return item.id != id;
    });
    addToLocalStorage(entries);
}

// add an eventListener on form, and listen for submit event
inputForm.addEventListener('submit', function(event) {
    // prevent the page from reloading when submitting the form
    event.preventDefault();
    addEntry(inputField.value); // call addTodo function with input box current value
  });

































// class Item {
//     constructor(title, text, tags){
//         this.title = title;
//         this.text = text;
//         this.tags = tags;
//     }
//     dateAdd = new Date().toLocaleDateString();

//     // static so we can use method without instantiation
//     static show(arr){
        
//         arr.forEach((i)=>{
    
            // left.innerHTML += `
            // <div class="item">
            //             <div class="title">
            //                 <h2>${i.title}</h2>
            //             </div>
            //             <div class="txt">
            //                 ${i.text}
            //             </div>
            //             <div class="item-footer">
            //                 <h5>${i.dateAdd} : ${i.tags}</h5>
            //                 <div class="edit-delete">
            //                     Edit / Delete
            //                 </div>
            //             </div>
            //         </div>
            // `
//         })
    
//     }

//     static addItem(newItem){
//         localStorage.items +=  newItem;
//         itemArr = localStorage.getItem('items')
//         left.innerText = itemArr;
//         return itemArr;
//         // left.innerHTML="";
//         // this.show(JSON.parse(localStorage.getItem("items")));
//     }

// }







// let cnt = 0;
// btn.addEventListener('click', ()=>{
//     cnt++;
//     let newItem = new Item(`Title ${cnt}`, inputField.value, `tag${cnt}`);
//     Item.addItem(JSON.stringify(newItem));
    
    
// })