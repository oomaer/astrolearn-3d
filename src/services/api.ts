import axios from "axios"


const apiurl = 'http://localhost:5006'
export const GET_MODELS = async () => {
    try{
        const response = await axios.get(apiurl+'/get')
        return response.data
    }
    catch(err){
        console.log(err)
    }
}

export const UPDATE_ATTRIBUTES = async (name:string, attributes:any) => {
    try{
        const response = await axios.post(apiurl+'/update/'+name, {
            attributes
        })
        return response.data
    }
    catch(err){
        console.log(err)
    }
}