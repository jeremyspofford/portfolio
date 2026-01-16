const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({ region: "us-east-1" });

const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || FROM_EMAIL;

exports.handler = async (event) => {
  console.log("contact-form invoked", JSON.stringify(event));

  // CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: "",
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({
          error: "Name, email, and message are required",
        }),
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "Invalid email address" }),
      };
    }

    // Sanitize inputs
    const sanitizedName = escapeHtml(name.slice(0, 100));
    const sanitizedEmail = email.slice(0, 254);
    const sanitizedSubject = escapeHtml((subject || "").slice(0, 200));
    const sanitizedMessage = escapeHtml(message.slice(0, 5000));

    const params = {
      Source: FROM_EMAIL,
      Destination: {
        ToAddresses: [TO_EMAIL],
      },
      ReplyToAddresses: [sanitizedEmail],
      Message: {
        Subject: {
          Data: sanitizedSubject || `Portfolio Contact: ${sanitizedName}`,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: `
New contact form submission:

Name: ${sanitizedName}
Email: ${sanitizedEmail}
Subject: ${sanitizedSubject || "N/A"}

Message:
${sanitizedMessage}

---
Sent from jeremyspofford.dev contact form
            `.trim(),
            Charset: "UTF-8",
          },
          Html: {
            Data: `
<!DOCTYPE html>
<html>
<head><style>body{font-family:sans-serif;line-height:1.6;max-width:600px;}</style></head>
<body>
  <h2>New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${sanitizedName}</p>
  <p><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
  <p><strong>Subject:</strong> ${sanitizedSubject || "N/A"}</p>
  <hr/>
  <h3>Message:</h3>
  <p>${sanitizedMessage.replace(/\n/g, "<br/>")}</p>
  <hr/>
  <p style="color:#666;font-size:12px;">Sent from jeremyspofford.dev contact form</p>
</body>
</html>
            `.trim(),
            Charset: "UTF-8",
          },
        },
      },
    };

    await sesClient.send(new SendEmailCommand(params));

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: true,
        message: "Message sent successfully",
      }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        error: "Failed to send message. Please try again later.",
      }),
    };
  }
};

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
