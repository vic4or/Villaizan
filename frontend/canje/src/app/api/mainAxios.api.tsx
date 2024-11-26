import axios from "axios";

const baseApi = axios.create({

    //Descomentar URL a usar y comentar URL que ya no vas a usar

    //URL PARA PRUEBAS LOCALES
    //baseURL: `http://localhost:3000/`
    //URL PARA EL HOSTEADO EN EL V
    //baseURL: `http://inf226-982-6f.inf.pucp.edu.pe/api/`
    //URL HTTPS
    baseURL: `https://apicanje.heladosvillaizan.tech/`
})

export default baseApi;
