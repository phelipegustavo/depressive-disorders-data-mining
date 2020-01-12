/**
 * Read file from path
 * 
 * @param {String} path 
 * @return {Promise}
 */
const readFile = (path) => {

    return new Promise((res, rej) => {
        const data = fs.readFileSync(path, "utf8")
        if(data) {
            return res(data)
        }
        return rej(false)
    })
}

module.exports = {
    readFile,
}