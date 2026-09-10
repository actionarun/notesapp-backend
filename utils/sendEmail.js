// Uses Resend's HTTP API instead of SMTP, because Render blocks outbound
// SMTP ports (587/465) on its network — HTTP (443) works fine.
const sendEmail = async ({ to, subject, html }) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Notes App <onboarding@resend.dev>", // Resend's shared test sender
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Resend API error: ${errText}`);
  }
};

module.exports = sendEmail;