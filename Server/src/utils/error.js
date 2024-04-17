class ApiError extends Error{
    constructor(
        message="oh!something went wrong",
        StatusCode = "",
        stack = "",
        error = []
    ){
        super(message)
        this.message = message
        this.error = error
        this.StatusCode = StatusCode
        this.success = false
        this.data = null

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}