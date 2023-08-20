

const apiurl = 'http://localhost:5006'
export const GET_MODELS = async () => {
    try{
        const response = await fetch(apiurl+'/get')
        const models = await response.json()
        console.log(models)
        return models
    }
    catch(err){
        console.log(err)
    }
}