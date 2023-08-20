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

export const UPDATE_INSTANCES = async (name:string, instances:any) => {
    try{
        const response = await axios.post(apiurl+'/update/'+name, {
            instances
        })
        return response.data
    }
    catch(err){
        console.log(err)
    }
}