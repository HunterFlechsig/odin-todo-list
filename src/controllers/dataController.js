import { AppData } from "./dataClasses.js";

export default class DataController {
    static DATA_KEY = "data"

    constructor() {
        this.#hasData() ? this.#loadData() : this.#createAppData();
        console.log("initial data:", this.data);
    }

    storeData = () => {
        localStorage.setItem("data",JSON.stringify(this.data));
        console.log(`Storing data: ${this.data}`)
    }

    #loadData = () => {
        const localData = JSON.parse(localStorage.getItem("data"));
        this.data = AppData.fromJSON(localData);
    }

    #createAppData = () => {
        console.log("creating data");
        
        this.data = new AppData();
        this.storeData();
    }

    #hasData = () => {
       if(localStorage.getItem("data")) {
            return true;
       }
       return false;
    }
}