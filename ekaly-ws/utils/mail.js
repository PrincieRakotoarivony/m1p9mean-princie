var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ekaly.livrraison.plat.912@gmail.com',
    pass: 'ekaly.livrraison.plat.912.*'
  }
});


function sendMail(mail){
    return transporter.sendMail(mail);
}

module.exports = {sendMail};