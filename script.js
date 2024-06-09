function onConvert(){
    let input = document.getElementById("e1").value;
    let payload = JSON.parse(input);
    let newPayload = getConvertedPayload(payload);
    document.getElementById("e2").value = JSON.stringify(newPayload, null, "    ");
}

function getConvertedPayload(payload){
    let newPayload = {
        commonData: {
            userId: payload.commonData.ur,
            deviceId: payload.commonData.de,
            shortDeviceId: payload.commonData.sd,
            deviceName: payload.commonData.dn,
            clientId: payload.commonData.cd,
            clientType: payload.commonData.ct,
            phoneNumber: payload.commonData.ph,
            initialBindingTime: getDateFormat(payload.commonData.ib)
        },
        bindingData: getBindingDataArray(payload.bindingData)
    };
    return newPayload;
}

function getBindingDataArray(arr){
    const newArr = [];
    for(let i=0;i<arr.length;i++){
        console.log(`index : ${i} -> `,arr[i]);
        newArr.push(getBindingData(arr[i]));
    }
    return newArr;
}

function getBindingData(payload){
    const newPayload = {};
    ({
        ca: newPayload.clientAppVersion,
        ch: newPayload.challenge,
        po: newPayload.polling,
        os: newPayload.osVersion,
        sb: newPayload.smsBindingTime,
        ob: newPayload.otpBindingTime,
        cr: newPayload.gmtCreate,
        up: newPayload.gmtModified,
        ov: newPayload.otpVerified,
        in: newPayload.isIntervene,
        es: newPayload.enableStatus,
        pd: newPayload.pspDeviceId,
        ps: newPayload.pspId,
        pc: newPayload.pspCustId,
        oa: newPayload.otpAutoread
    } = payload);
    newPayload.gmtCreate = getDateFormat(newPayload.gmtCreate);
    newPayload.gmtModified = getDateFormat(newPayload.gmtModified);
    newPayload.smsBindingTime = getDateFormat(newPayload.smsBindingTime);
    newPayload.otpBindingTime = getDateFormat(newPayload.otpBindingTime);
    newPayload.simNum = getSimNum(payload);
    return newPayload;
}

function getSimNum(payload){
    console.log("IC-> ",payload.ic, " SI-> ",payload.su);
    let iccidInfoList = payload.ic;
    if(iccidInfoList){
        var iccidArr = [];
        for(let i=0;i<iccidInfoList.length;i++){
            iccidArr.push(getIccidInfo(iccidInfoList[i]));
        }
    }
    let subInfoList = payload.su;
    if(subInfoList){
        var subidArr = [];
        for(let i=0;i<subInfoList.length;i++){
            subidArr.push(getSubInfo(subInfoList[i]));
        }
    }
    return JSON.stringify({subscriptionSims: subidArr, 
        iccidSims: iccidArr});
}

function getIccidInfo(payload){
    const res = {};
    ({id: res.iccid,
        mt: res.mappingTime
    }=payload);
    res.mappingTime = getDateFormat(res.mappingTime);
    return res;
}

function getSubInfo(payload){
    console.log("SUBID: ",payload);
    const res = {};
    ({sd: res.subscriptionId,
        mt: res.mappingTime
    }=payload);
    res.mappingTime = getDateFormat(res.mappingTime);
    return res;
}

function getDateFormat(dateArr){
    if(!dateArr) return '';
    for(let i=0;i<=5;i++){
        if(dateArr[i]>=0 && dateArr[i]<=9){
            dateArr[i] = `0${dateArr[i]}`;
        }
    }
    return `${dateArr[0]}-${dateArr[1]}-${dateArr[2]} ${dateArr[3]}:${dateArr[4]}:${dateArr[5]}.${dateArr[6]}`
}

document.getElementById('convert-btn').addEventListener('click',onConvert);