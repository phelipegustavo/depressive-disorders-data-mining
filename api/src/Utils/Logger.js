const fs = require('fs');
const Log = require('../Models/Log');
 
/**
 * Write log on file and save on database
 * 
 * @param {Object} data 
 * @param {String} type 
 */
const writeLog = (data, type) => {

    let date = new Date()
    const filename = date.toISOString().replace(/T.*/,'')
    
    const hh = date.getHours().toString().padStart(2, '0')
    const mm = date.getMinutes().toString().padStart(2, '0')
    const ss = date.getSeconds().toString().padStart(2, '0')

    const str = `\n\n ${hh}:${mm}:${ss}:: ${type.toUpperCase()}:: ${JSON.stringify(data)}`

    // Write log
    fs.appendFileSync(`logs/${filename}_${type}.log`, str);

    const { message }  = data;
    data.message = undefined;

    // Save log on database
    /*
    Log.create({
        type,
        message,
        data,
    });
    */
}

/**
 * Sucess log
 * 
 * @param  {...any} args 
 */
const success = (...args) => {
    writeLog(...args, 'success');
}

/**
 * Errors log
 * 
 * @param  {...any} args 
 */
const error = (...args) => {
    writeLog(...args, 'error');
}

/**
 * Warning log
 * 
 * @param  {...any} args 
 */
const warning = (...args) => {
    writeLog(...args, 'warning');    
}

const log = {
    success,
    error,
    warning,
}

module.exports = log;