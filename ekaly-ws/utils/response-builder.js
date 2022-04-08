function error(err){
    const resp =  {meta: {status: 0, message: err.message}};
    if(err.errors){
        const errors = {};
        Object.keys(err.errors)
        .forEach((key) => {
            errors[key] = err.errors[key].message;
        })
        resp.meta.errors = errors;
    }
    return resp;
}

function success(data, message){
    return {meta: {status: 1, message: message}, data: data};
}

module.exports = {error, success};