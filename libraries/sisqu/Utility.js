// -----  MANIPULATION STRING -------------

// Collection (Set) to String (union with semicolon)
const fncUnionComma = (varArray) => {
    var output = "";
    var arrayLength = varArray.size;
    if (arrayLength > 0) {
        var i = 0;
        for (let item of varArray) {
            if (i === 0) {
              output += item;
            } else {
              output += ';' + item;
            }

            i++;
        }
    }
    
    return output;
};

// String (union semicolon) to Array
function fncParseComma(paramInput) {
    var output = [];
    var temp = [];
    temp = paramInput.split(';');

    if (temp.length > 0) {
        output = temp;
    }

    return output;
}

export { fncUnionComma, fncParseComma };