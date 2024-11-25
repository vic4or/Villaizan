import baseApi from "./mainAxios.api";

export const getRecompensaPuntos = async () => {
    try {
        const data = await baseApi.get('recompensa_puntos/listarTodosProducto').then(({data}) => data)
        return data;
    } catch (error) {
        console.log('Error al buscar data:', error)
        return null;
    }
}