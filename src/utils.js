const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

module.exports = { delay };