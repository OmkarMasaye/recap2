const express = require('express');
const axios = require('axios');
const cors=require('cors')
const app = express();
const PORT = 5000;
app.use(express.json()); 
app.use(cors());

const RECAPTCHA_SECRET_KEY = '6Ld2KCIqAAAAAErUFywvT75F0feMJSF1OUuL5xmf';


let users=[];
app.post('/send', async (req, res) => {
    const { name } = req.body;
    const recaptchaResponse = req.body['g-recaptcha-response'];

    if (!recaptchaResponse) {
        return res.send('Please complete the reCAPTCHA');
    }

    try {
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;

        const response = await fetch(verificationURL, {
            method: 'POST',
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
            try {
                const newUser = { id: users.length + 1, name };
                users.push(newUser);
                console.log(users);
                res.send(`Hello, ${name}! Your form was successfully submitted and data saved.`);
            } catch (saveError) {
                console.error('Error saving data:', saveError);
                res.status(500).send('An error occurred while saving your data.');
            }
        } else {
            res.send('reCAPTCHA verification failed. Please try again.');
        }
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        res.send('An error occurred while verifying reCAPTCHA.');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
