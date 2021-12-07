const sum = arrayToSum => {
    return arrayToSum.reduce((summedVal, val)=>summedVal + val, 0)
}

module.exports = {
    sum,
}