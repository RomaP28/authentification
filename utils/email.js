const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        // super(props);
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.form = `Roman Posokhov <${process.env.EMAIL_FROM}>`
    }

    newTransport() {
        // if (process.env.NODE_ENV === 'production'){
        //     // Sendgrid transporter
        //     return nodemailer.createTransport({
        //         // service: 'SendGrid',
        //         host: process.env.SENDGRID_HOST,
        //         port: process.env.SENDGRID_PORT,
        //         auth: {
        //             user: process.env.SENDGRID_USERNAME,
        //             pass: process.env.SENDGRID_PASSWORD
        //         }
        //     })
        // }
        //1) Create a transporter
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
            // For GMAIL Activate in gmail "less secure app" option
        });
    }

    //Send the actual email
    async send(template, subject) {
        //1) Render HTML based on pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // 2) Define email options
        const mailOptions = {
            from: this.form,
            to:  this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        }
        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome(){
        await this.send('welcome','Welcome to the my APP!')
    }

    async sendPasswordReset(){
        await this.send('passwordReset','Your password reset link valid for 10 minutes')
    }
}

