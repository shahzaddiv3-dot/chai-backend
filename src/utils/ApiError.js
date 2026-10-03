class ApiError extends Error{
    constructor (
statusCode,
message= "Somthing went wrong",
error = [],
statck = "",

    ){
        super(message)
        this.statusCode= statusCode
        this.data = null
        this.message = message
        this.succes = false;
        this.error = error

if (statck){
    this.stack=statck

}
else{
    Error.captureStackTrace(this,this.constructor)
}
    }
    
}
export {ApiError}