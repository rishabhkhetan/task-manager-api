const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const api_key = `${process.env.MAILGUN_API_KEY}`
const mg = mailgun.client({username: 'api', key: api_key});

const sendWelcomeEmail = (email,name)=>{
mg.messages.create('sandboxcb473e94b3604c06828f1a1586cbbae5.mailgun.org', {
	from: "Excited User <task-manager-app@sandboxcb473e94b3604c06828f1a1586cbbae5.mailgun.org>",
	to: [`${email}`],
	subject: "Welcome To Task-Manager",
	text: `Welcome ${name} to Rishabh Khetan's Task App `,
})
.catch(err => console.log(err)); // logs any error
}

const sendCancellationEmail = (email,name)=>{
    mg.messages.create('sandboxcb473e94b3604c06828f1a1586cbbae5.mailgun.org', {
        from: "Dejected User <task-manager-app@sandboxcb473e94b3604c06828f1a1586cbbae5.mailgun.org>",
        to: [`${email}`],
        subject: "Sorry to see you go",
        text: `${name}, what could we do better to keep you from leaving Rishabh Khetan's Task App ?`,
    })
    .then(msg => console.log(msg)) // logs response data
    .catch(err => console.log(err)); // logs any error 
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}