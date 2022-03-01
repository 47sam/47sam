const saveBtn = document.getElementById("save-btn") ;
const inputEl = document.getElementById("input-el");
const ulEl = document.getElementById("ul-el");
const undoBtn = document.getElementById("undo-btn");
const localBookmarks = JSON.parse(localStorage.getItem("urls")) ;
const tabBtn = document.getElementById("tab-btn");
const imgArray = document.getElementsByTagName('img');
let recentDeleted = [];
let bookmarks = [] ;

if(localBookmarks) {
    bookmarks = localBookmarks;
    showItems(bookmarks);
}


function showItems(arr) {
    let listItem = "";
    for(let i=0;i<arr.length;i++) {
        listItem+= `
            <li>
                <a target='blank' href='${arr[i]}'>
                    ${arr[i]}
                </a>
                <img src="/outline_delete_white_24dp.png" alt="-" id="img${i}">
            </li>
        `
    }
    ulEl.innerHTML = listItem ;
    for(let i=0;i<imgArray.length;i++) {
        imgArray[i].addEventListener("click",function() {
            let idx = this.id.substring(3);
            //console.log(idx);
            recentDeleted.push([bookmarks.splice(idx,1),idx]);
            localStorage.setItem("urls", JSON.stringify(bookmarks));
            showItems(bookmarks);
        });
    }
}
function store(url) {
    let toAddUrl = true;
    for(let i=0;i<bookmarks.length;i++) {
        if(bookmarks[i] === url) {  
            toAddUrl = false;
            alert("The link already Exists");
            break;
        }
    }
    if(toAddUrl && url) {
        bookmarks.push(url);
        localStorage.setItem("urls", JSON.stringify(bookmarks));
        showItems(bookmarks);
    }
}
tabBtn.addEventListener("click", function(){
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
        store(tabs[0].url);
    })
})
saveBtn.addEventListener("click", function() {
    if(inputEl.value != "") {
     store(inputEl.value);
     inputEl.value = ""; 
    }
    else {
        alert("Empty link");
    }
 }) 
undoBtn.addEventListener("click",function() {
    if(recentDeleted.length > 0) {
        let last = recentDeleted.pop();
        bookmarks.splice(last[1],0,last[0]);
    }
    localStorage.setItem("urls", JSON.stringify(bookmarks));
    showItems(bookmarks);
})

// bookmarks = [];
// localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
// showItems(bookmarks);
