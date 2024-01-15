const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "support@redpepe.club",
    pass: "epywtznjqocuhesh",
  },
});

async function sendEmail(receiver, link) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Password Reset " <yolanda52@ethereal.email>', // sender address
    to: `${receiver}`, // list of receivers
    subject: "Reset your password", // Subject line
    text: `Please click on this one time link to reset your password ${link}`, // plain text body
    html: `Please click on this one time link to reset your password ${link}`, // html body
  });

  return info;
}

module.exports = { sendEmail };
