const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  WHATSAPP_TOKEN_KEY,
  SENDGRID_EMAIL,
  SENDGRID_TOKEN,
  FIREBASE_KEY_PATH,
} = process.env;
const axios = require("axios");
const fs = require("fs");
const admin = require("firebase-admin");
const privateKey = fs.readFileSync(FIREBASE_KEY_PATH, "utf-8");

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(privateKey)),
});

exports.send_notification = async (token, title, payload) => {
  try {
    const message = {
      token,
      notification: {
        body: JSON.stringify(payload),
        title,
      },
    };
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

exports.sendMail = async (to, subject, data) => {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(SENDGRID_TOKEN);

  const msg = {
    to: to,
    from: SENDGRID_EMAIL,
    subject: subject,
    html: data,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((err) => {
      err.status = 404;
      console.log(err);
    });
};

exports.sendSms = (message, phone) => {
  const accountSid = TWILIO_ACCOUNT_SID;
  const authToken = TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  client.messages
    .create({
      body: message,
      from: "+17622495101",
      to: phone,
    })
    .then((message) => console.log("message sent"))
    .catch((e) => {
      console.log(e);
    });
};

exports.whatsappMessage = (message, number, forceSend = true) => {
  console.log(`whatsapp Message stopper temprarily`);
  const payload = {
    conversationname: "+91" + number,
    countrycode: "+91",
    message: message,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + WHATSAPP_TOKEN_KEY,
  };
  if (forceSend){
    axios
      .post("https://push.bagachat.com/api/sendtransactionalmsg.bg", payload, {
        headers,
      })
      .then((response) => console.log(`whatsapp Message sent: DONE`))
      .catch((error) => console.error(error));
    }
};

exports.sendReportMessage = (message, number) => {
  const payload = {
    conversationname: "+91" + number,
    countrycode: "+91",
    message: message,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Basic " + WHATSAPP_TOKEN_KEY,
  };
  axios
    .post("https://push.bagachat.com/api/sendtransactionalmsg.bg", payload, {
      headers,
    })
    .then((response) =>
      console.log(`whatsapp Message sent: ${response.status}`),
    )
    .catch((error) => console.error(error));
  // console.log("whatsapp message blocked")
};
