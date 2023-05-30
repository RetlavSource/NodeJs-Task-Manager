const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sgMail returns a promise, but no need to wait. Sometime later, the user will get the email eventually
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mrbitwise@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    }).then(() => {
        console.log(`Welcome Email sent from \'${name}\' to \'${email}\'!`);
    }).catch((error) => {
        console.error(error);
    });
};

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mrbitwise@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    }).then(() => {
        console.log(`Cancellation Email sent from \'${name}\' to \'${email}\'!`);
    }).catch((error) => {
        console.error(error);
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
};