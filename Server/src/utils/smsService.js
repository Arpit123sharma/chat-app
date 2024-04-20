import nodemailer from "nodemailer"

const otp = ()=>{
    let num = "";
    for(let i=0;i<4;i++)
    {
       num += String(Math.floor(Math.random()*9 +1));
    }
    return num;
}


export class smsService{
   key
   transporter
   constructor(){
       this.transporter = nodemailer.createTransport({
         service:"gmail",
         host: "smtp.gmail.com",
         port: 587,
         secure: false, // Use `true` for port 465, `false` for all other ports
         auth: {
           user: process.env.GMAIL_USER,
           pass: process.env.GMAIL_APP_PASSWORD,
         },
       });
       
       this.key = otp();
   }
   
   async sendOtp(email){
      //const key = otp();
      try {
         const messageId = await this.transporter.sendMail({
            from:process.env.GMAIL_USER,
            to:[email] ,
            subject: "email for otp verfication of chat-app", // Subject line
            text: "this is your otp !! don't share with anyone !!", // plain text body
            html: `<h1>${this.key}</h1>`, // html body
         }) 
         if (!messageId) {
            console.log("oops! something went wrong happend while sending email");
         }
         console.log("email send successfully !!");
         return this.key;
      } catch (error) {
          console.error("error in sending the otp through gmail :: ",error);
      }
     
   }
   
   async verifyOtp(userOtp){
      return (userOtp === this.key)
   }
}


const emailService = new smsService();


export {emailService}


