// we use const if we dont have to reassign the variable
// we use let if we have to reassign the variable 

const saveBtn = document.getElementById("save-btn") ;//DOM manipulation to modify save button and add eventListeners
const inputEl = document.getElementById("input-el");// input form to get the link inside input form
const ulEl = document.getElementById("ul-el");//to modify the unordered list and add items in the list with image and anchor tags(a link tag)
const undoBtn = document.getElementById("undo-btn");// to undo the deleted link 
const localBookmarks = JSON.parse(localStorage.getItem("urls")) ;//to get the array stored in localstorage in the form of string and parse it to array with the help of JSON.parse
const tabBtn = document.getElementById("tab-btn");// to save the current tab
const imgArray = document.getElementsByTagName('img');// to get the array of  all the img tags to delete the current link on clicking on the tab
let recentDeleted = [];// to store the recent deleted link and its index to later undo the link on its original index
let bookmarks = [] ;// to store the urls which are inputed using save button and save tab button

if(localBookmarks) {//if the localstorage contains previously stored urls we show that on the screen
    bookmarks = localBookmarks;
    showItems(bookmarks);
}


function showItems(arr) {// function to modify the ul tag and add all the urls available in the bookmarks array inside the ul tag as list items and delete images;

    let listItem = "";
    for(let i=0;i<arr.length;i++) {// we use `` (known as back ticks or template strings) to add the li tag with a tag and img tag  
        listItem+= `
            <li>
                <a target='blank' href='${arr[i]}'>
                    ${arr[i]}
                </a>
                <img src="white_1x/outline_delete_white_24dp.png" alt="-" id="img${i}">
            </li>
        `
        //keeping the id of all the images as img with index of current urls position in the bookmarks array to later delete it using the delete button
    }
    ulEl.innerHTML = listItem ;
    for(let i=0;i<imgArray.length;i++) {
        imgArray[i].addEventListener("click",function() {// to add the eventlistener on all the delete imgs
            let idx = this.id.substring(3);// taking the index of the url in bookmarks array with the help of id since we stored the index inside the id 
            //console.log(idx);
            recentDeleted.push([bookmarks.splice(idx,1),idx]);// array.splice(idx, 1) deletes 1 element from array at idx position;
            localStorage.setItem("urls", JSON.stringify(bookmarks));//store the modified bookmarks array in localstorage
            showItems(bookmarks);//show the modified bookmars array in ul tag in the document
        });
    }
}
function store(url) {//function to store url inside the bookmarks array after checking that if doesn't repeat itself
    let toAddUrl = true;
    for(let i=0;i<bookmarks.length;i++) {
        if(bookmarks[i] === url) {  // if the url already exists in bookmarsk array we dont add it again
            toAddUrl = false;
            alert("The link already Exists");
            break;
        }
    }
    if(toAddUrl && url) {
        bookmarks.push(url);//we push the url in bookmarks array
        localStorage.setItem("urls", JSON.stringify(bookmarks));// store the modified array in local storage
        showItems(bookmarks);// show the modified array
    }
}
tabBtn.addEventListener("click", function(){// function to access the url in current tab of current window and then store the url using store function
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {// query to get the currentWindow current tab url
        store(tabs[0].url);
    })
})
saveBtn.addEventListener("click", function() {// to store the user input url in form input and store it in bookmarks array if it is not empty
    if(inputEl.value != "") {
     store(inputEl.value);
     inputEl.value = ""; 
    }
    else {
        alert("Empty link");
    }
 }) 
undoBtn.addEventListener("click",function() {// function to add undo the deleted urls back
    if(recentDeleted.length > 0) {// if recentDeleted array contains any urls then we must have deleted some urls
        let last = recentDeleted.pop();//we take the latest deleted url
        bookmarks.splice(last[1],0,last[0]);// array.splice(index, 0, value) adds the value  at index position in array
    }
    localStorage.setItem("urls", JSON.stringify(bookmarks));// we store the modified array in localstorage
    showItems(bookmarks);// we run the showItems function fo modified array
})
