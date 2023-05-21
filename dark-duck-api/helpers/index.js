const Email = new RegExp(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i); 
const Aphabeticals = new RegExp(/^[a-zA-Z ]*$/);
const Numerics = new RegExp(/^\d+$/);  
const Alphanumeric = new RegExp(/^[A-Za-z\d\s]+$/);


EmailValidation = email => Email.test(email);

AphabeticalsValidation = text => Aphabeticals.test(text);

NumericsValidation = text => Numerics.test(text);

AlphanumeicValidation = text => Alphanumeric.test(text);


capitalizeFirstLetterEachWord = (str) => {
    str = str.split(" ");
    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }
    return str.join(" ");
}

generate6digitCode = () =>{
    return Math.floor(100000 + Math.random() * 900000)
}

module.exports = {
    capitalizeFirstLetterEachWord, 
    EmailValidation,
    AphabeticalsValidation,
    NumericsValidation,
    generate6digitCode,
    AlphanumeicValidation
}