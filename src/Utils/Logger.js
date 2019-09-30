const fs = require('fs');
 
const writeLog = (data, prepend, type) => {

    let date = new Date()
    const filename = date.toISOString().replace(/T.*/,'')
    
    const hh = date.getHours().toString().padStart(2, '0')
    const mm = date.getMinutes().toString().padStart(2, '0')
    const ss = date.getSeconds().toString().padStart(2, '0')

    data = `\n\n ${hh}:${mm}:${ss}:: ${prepend} ${JSON.stringify(data)}`;

    fs.appendFileSync(`logs/${filename}_${type}.log`, data);
}

const success = (...args) => {
    writeLog(...args, 'SUCCESS::', 'success');
}
const error = (...args) => {
    writeLog(...args, 'ERROR::', 'error');
}
const warning = (...args) => {
    writeLog(...args, 'WARNING::', 'warning');    
}

const log = {
    success,
    error,
    warning,
}

module.exports = log;