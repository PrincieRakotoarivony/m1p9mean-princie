function error(message){
    return {meta: {status: 0, message: message}};
}

function success(data, message){
    return {meta: {status: 1, message: message}, data: data};
}

module.exports = {error, success};