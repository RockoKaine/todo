const btn = document.getElementById('enter'); 
const left = document.getElementById('left'); 
const inputField = document.getElementById('control-input');

// let items = [
   
// ];

localStorage.setItem('items','');
// localStorage.setItem('items',JSON.stringify({
//     cat:'mewo',
//     dog:'bark'
// }));
class Item {
    constructor(title, text, tags){
        this.title = title;
        this.text = text;
        this.tags = tags;
    }
    dateAdd = new Date().toLocaleDateString();

    // static so we can use method without instantiation
    static show(arr){
        arr.forEach((i)=>{
    
            left.innerHTML += `
            <div class="item">
                        <div class="title">
                            <h2>${i.title}</h2>
                        </div>
                        <div class="txt">
                            ${i.text}
                        </div>
                        <div class="item-footer">
                            <h5>${i.dateAdd} : ${i.tags}</h5>
                            <div class="edit-delete">
                                Edit / Delete
                            </div>
                        </div>
                    </div>
            `
        })
    
    }

    static addItem(newItem){
        localStorage.items += JSON.stringify(newItem);
        left.innerHTML="";
        // this.show(localStorage.items);
    }

}







let cnt = 0;
btn.addEventListener('click', ()=>{
    cnt++;
    let newItem = new Item(`Title ${cnt}`, inputField.value, `tag${cnt}`);
    Item.addItem(newItem);
    
})