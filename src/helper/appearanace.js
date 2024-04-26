export const appearance = (appearances, key) => {
    // console.log(key);
    const check = appearances?.findIndex((item, index) => item.key == key);


    if(check == -1)
        return ;

    // console.log(appearances[check].value);

    return appearances[check].value;

}