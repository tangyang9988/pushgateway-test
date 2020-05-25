let formatDate = (dateStr: string) => {
    let dateStrArr = dateStr.split('T');//去掉T

    dateStrArr[1] = dateStrArr[1].substring(0, 8);//去掉Z
    let resDate = dateStrArr[0] + " " + dateStrArr[1]

    return resDate
};

export {
    formatDate,
};
