const LoginOTPEmail = ({ email, otp }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Login OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: rgb(34, 148, 219);
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
      background-color: #ffffff;
      color: rgb(58, 129, 234);
      padding: 20px;
      text-align: center;
    }
    .email-header h1 {
      color: rgb(58, 129, 234);
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
    .otp-code {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      font-size: 24px;
      font-weight: bold;
      background-color: rgb(58, 129, 234);
      color: #fff;
      border-radius: 6px;
      letter-spacing: 2px;
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
      <h1>Login Verification</h1>
    </div>
    <div class="email-body">
      <h1>Hello ${email},</h1>
      <p>You have initiated a login to Gateway Education.</p>
      <p>Please verify your identity using the OTP code below:</p>
      <div class="otp-code">${otp}</div>
      <p>This OTP is valid for 5 minutes. If you didn’t try to log in, please ignore this email.</p>
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} Gateway-Education by Anjali Shrestha. All rights reserved.</p>
      <p>[Your Address or Contact Information]</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = LoginOTPEmail;
