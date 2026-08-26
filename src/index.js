import "./styles.css";
import ShowProject from "./components/project.js";
import { AppData, Project } from "./classes.js";
import { GetUserName } from "./components/modals.js";

const StorageController = (() => {  
    const storeData = () => {
        localStorage.setItem("data",JSON.stringify(data));
        console.log(`Storing data: ${data}`)
    }

    const getData = () => {
        if(!isData) return new Error("No Data");

        const localData = localStorage.getItem("data");
        return AppData.fromJSON(JSON.parse(localData));
    }

    const isData = () => localStorage.getItem("data") ? true : false;

    return {storeData, getData, isData};

})();

function clearAndSet(element, fragment) {
    element.replaceChildren();
    element.appendChild(fragment);
}

const ScreenController = (() => {
    const modal = document.getElementById("dialog");

    if(!StorageController.isData()) {
        clearAndSet(modal, GetUserName());
        modal.showModal();
    }
    
})();


// const ContentController = (() => {
//     const data = new UserData();
//     const content = document.querySelector('.content')
//     console.log(data.projects)
//     content.appendChild(ShowProject(data.projects[0]));
// })();


// 