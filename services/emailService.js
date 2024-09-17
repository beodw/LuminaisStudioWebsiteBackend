const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const nodemailer = require("nodemailer");
require("dotenv").config();

// AWS S3 setup (using AWS SDK v3)
// AWS Lambda will automatically use the role credentials
const s3Client = new S3Client({
  region: process.env.REGION,
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to get HTML template from S3 bucket
const getHtmlTemplate = async () => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: "email-template.html", // Adjust path if needed
  };

  try {
    const command = new GetObjectCommand(params);
    const { Body } = await s3Client.send(command);

    // Read the body of the S3 response (stream) and return as a string
    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () =>
          resolve(Buffer.concat(chunks).toString("utf-8"))
        );
      });

    const htmlTemplate = await streamToString(Body);
    return htmlTemplate;
  } catch (error) {
    console.error("Error fetching HTML from S3:", error);
    throw new Error("Failed to fetch HTML template: " + error.message);
  }
};

// Function to send email with the fetched template
const sendEmail = async (to, amount, currency, source) => {
  try {
    const htmlTemplate = await getHtmlTemplate();

    // Replace placeholders in the HTML template
    const html = htmlTemplate
      .replace("{{amount}}", amount)
      .replace("{{currency}}", currency)
      .replace("{{source}}", source);

    // Create email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "Payment Confirmation",
      html, // Use the modified HTML template
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
};

module.exports = { sendEmail };
