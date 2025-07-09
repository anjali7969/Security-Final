const ResetPasswordEmail = ({ email, resetLink }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color:rgb(34, 148, 219);
      margin: 0;
      padding: 0;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .email-header {
    background-color: #ffffff; /* White background */
    color:rgb(58, 129, 234); /* Blue text */
    padding: 20px;
    text-align: center;
  }
  .email-header h1 {
    color: rgb(58, 129, 234); /* Ensures the text is blue */
  }
    .email-header img {
      max-width: 150px;
    }
    .email-body {
      padding: 20px;
    }
    .email-body h1 {
      font-size: 24px;
      margin-bottom: 10px;
      color: rgb(58, 129, 234);
    }
    .email-body p {
      font-size: 16px;
      line-height: 1.6;
    }
    .email-body a {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      text-decoration: none;
      background-color:rgb(58, 129, 234);
      color:  #f4f4f9;
      border-radius: 4px;
    }
    .email-footer {
      background-color: #f4f4f9;
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <img src="https://drive.google.com/uc?id=1nJRsJW2aKyVtCd2U4xjzXTarY0iShhno" alt="GateWay-Education">
      <h1>Password Reset Request</h1>
    </div>
    <div class="email-body">
      <h1>Reset Your Password</h1>
      <p>Hi, ${email},</p>
      <p>We received a request to reset your password. You can reset your password by clicking the button below:</p>
      <a href="${resetLink}" target="_blank">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email or contact us if you have concerns.</p>
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} Gateway-Education by Anjali Shrestha. All rights reserved.</p>
      <p>[Your Address or Contact Information]</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = ResetPasswordEmail;
// Path: templets/WelcomeEmail.js
// Compare this snippet from models/user.js: