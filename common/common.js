const sum = arrayToSum => {
    return arrayToSum.reduce((summedVal, val)=>summedVal + val, 0)
}

/**
 * Calculates the gaussian sum of the 2 numbers.
 * eg; sum of values consequtive numbers from start to end
 * @param {Number} end 
 * @param {Number} start (default 1)
 * @returns the sum of a sequence of numbers with this range
 */
const gauss = (end, start = 1) => ( (end - start) / 2 ) * (start + end) 

module.exports = {
    sum,
    gauss
}