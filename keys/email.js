const keys = require(".");

function registration(to){
    return {
        to,
        from : keys.EMAIL_ROOT_NAME,
        subject : "Your account is created",
        html : `
            <h1>Congrutulation your Acount has been created</h1>
            <p>Now you can login into out greate service</p>
            <p>We rember that your ${to}</p>
            <hr/>
            <p>You can visit to our shop right now <a href="${keys.MAIN_URL}">click here</a></p>
        `
    }
}

function reset(to,tokenId,userId){
    return {
        to,
        from : keys.EMAIL_ROOT_NAME,
        subject : "Change your password",
        html : `
            <br/>
            <h1>We recive your request and ready to help you</h1>
            <b style="color : red">If you don't send request ignore this email</b>
            <p>You can reset your pass by this link <a href="${keys.MAIN_URL}auth/resetpass?token=${tokenId}&id=${userId}" alt="reset">click here</a></p>
            <p>If something get wrong type this token ${tokenId}</p>
        `
    }
}

module.exports = { registration,reset }