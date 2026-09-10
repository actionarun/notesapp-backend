// Uses Brevo's HTTP API (not SMTP), because Render blocks outbound SMTP
// ports. Brevo lets you send to ANY recipient once your sender email is
// verified (no domain DNS setup required).
const sendEmail = async ({ to, subject, html }) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Notes App", email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Brevo API error: ${errText}`);
  }
};

module.exports = sendEmail;