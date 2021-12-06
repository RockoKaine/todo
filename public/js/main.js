let items = [
    {
        title:"Hello World",
        text:"Why not a good ol' hello world to get things rolling!",
        tags:'cats'
    },
    {
        title:"Hello Fart",
        text:"sgsfgsfgsfdg",
        tags:"red"
    },
    {
        title:"Hello Gut",
        text:"fogfdg not a good ol' hello world to get things rolling!",
        tags:'cats'
    }
];
class Item {
    constructor(title, text, tags){
        this.title = title;
        this.text = text;
        this.tags = tags;
    }

}

const btn = document.getElementById('enter'); 
const left = document.getElementById('left'); 

btn.addEventListener('click', ()=>{
    left.innerHTML += `
    <div class="item">
                <div class="title">
                    <h2>mog</h2>
                </div>
                <div class="txt">
                    ${document.getElementById('control-input').value}
                </div>
                <div class="item-footer">
                    <h5>12.12.2021</h5>
                    <div class="edit-delete">
                        Edit / Delete
                    </div>
                </div>
            </div>
    
    `
})