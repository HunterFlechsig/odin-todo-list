import { AppData } from "./dataClasses.js";

export default class Data {
    static DATA_KEY = "data"

    constructor() {
        this.#hasData() ? this.#loadData() : this.#createAppData();
    }

    storeData = () => {
        localStorage.setItem("data",JSON.stringify(this.data));
    }

    #loadData = () => {
        const localData = JSON.parse(localStorage.getItem("data"));
        this.data = AppData.fromJSON(localData);
    }

    #createAppData = () => {        
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

const appData = new Data();
const data = appData.data;
const storage = appData;

export { data, storage }
