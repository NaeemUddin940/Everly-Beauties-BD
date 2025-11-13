export default function verifyForgotPasswordEmailTemplate(
  username,
  expiry,
  otp,
  companyName,
  supportEmail
) {
  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
  </head>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(18,18,18,0.06);">
            <tr>
              <td style="padding:24px;text-align:left;">
                <h1 style="margin:0 0 8px;font-size:20px;color:#0f172a;">Hi ${username},</h1>
                <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.5;">
                  You requested to reset your password. Use the one-time code below to continue. This code will expire in <strong>${expiry} minutes</strong>.
                </p>

                <table cellpadding="0" cellspacing="0" role="presentation" style="margin:20px 0;">
                  <tr>
                    <td align="center" style="background:#f8fafc;border-radius:12px;padding:18px 24px;">
                      <span style="display:inline-block;font-size:28px;letter-spacing:4px;font-weight:700;color:#0b1220;">
                        ${otp}
                      </span>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 18px;color:#64748b;font-size:14px;line-height:1.4;">
                  If you didn't request a password reset, you can safely ignore this email or contact us at <a href="mailto:${supportEmail}" style="color:#0b6efd;text-decoration:none;">${supportEmail}</a>.
                </p>

                <p style="margin:0;color:#94a3b8;font-size:13px;">Thanks,<br>${companyName} Team</p>
              </td>
            </tr>

            <tr>
              <td style="background:#f8fafc;padding:12px 24px;text-align:center;color:#94a3b8;font-size:12px;">
                This code is valid for ${expiry} minutes. For help, contact <a href="mailto:${supportEmail}" style="color:#0b6efd;text-decoration:none;">${supportEmail}</a>.
              </td>
            </tr>
          </table>

          <p style="color:#94a3b8;font-size:12px;margin-top:14px;">
            If this email reached you by mistake, no action is needed.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>

`;
}
