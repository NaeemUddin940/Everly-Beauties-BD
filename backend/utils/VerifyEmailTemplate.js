export default function verifyEmailTemplate(username, otp) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>OTP Verification</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
              <tr>
                <td style="padding:24px;text-align:center;background:#000000;color:#ffffff;font-size:20px;font-weight:bold;">
                  OTP Verification
                </td>
              </tr>
              <tr>
                <td style="padding:32px;color:#333333;font-size:16px;line-height:1.6;">
                  <p>Hi <strong>${username}</strong>,</p>
                  <p>Your One Time Passcode (OTP) is:</p>
                  <p style="text-align:center;margin:24px 0;">
                    <span style="display:inline-block;background:#000000;color:#ffffff;font-size:22px;font-weight:bold;letter-spacing:4px;padding:14px 28px;border-radius:6px;">
                      ${otp}
                    </span>
                  </p>
                  <p>Please use this code to complete your verification.</p>
                  <p style="color:#666;font-size:14px;">If you did not request this, you can ignore this email.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px;text-align:center;background:#f9fafb;font-size:12px;color:#888;">
                  &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}