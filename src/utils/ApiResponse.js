class ApiResponse {
    constructor(statuscode,data, message = "success"){
        this.statuscode = statuscode < 400
        this.data = data
        this.message = message
        this.success = true
    }
}

export { ApiResponse }