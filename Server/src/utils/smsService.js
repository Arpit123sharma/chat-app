import nodemailer from "nodemailer"

const otp = ()=>{
    let num = "";
    for(let i=0;i<4;i++)
    {
       num += String(Math.floor(Math.random()*9 +1));
    }
    return num;
}


const transporter = nodemailer.createTransport({
    service:"gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

const sendOtp = async(email)=>{
    const key = otp();
    try {
       const messageId = await transporter.sendMail({
          from:process.env.GMAIL_USER,
          to:[email] ,
          subject: "email for otp verfication of chat-app", // Subject line
          text: "this is your otp !! don't share with anyone !!", // plain text body
          html: `<h1>${key}</h1>`, // html body
       }) 
       if (!messageId) {
          console.log("oops! something went wrong happend while sending email");
       }
       console.log("email send successfully !!");
       return key;
    } catch (error) {
        console.error("error in sending the otp through gmail :: ",error);
    }
   
}

export {sendOtp}


