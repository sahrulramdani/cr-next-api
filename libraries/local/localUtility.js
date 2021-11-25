const fncCheckProcCode = (postProcCode, procCodes) => {
    // postProcCode from req.body.ProcCode
    // procCodes from req.procCodes (from Auth - verifyToken)

    var temp = postProcCode.split(';');
    var cek = false;
    for(var i=0; i<temp.length; i++) {
        if (procCodes.includes(temp[i])) {
            cek = true;
        }
    }

    return cek;
}

export { fncCheckProcCode };