# SES Configuration for Contact Form
# Note: SES domain/email verification must be done manually in AWS Console
# or the email address must be verified before the contact form will work.

# Output reminder for SES setup
output "ses_setup_instructions" {
  description = "Instructions for setting up SES for contact form"
  value = var.contact_email_from != "" ? join("\n", [
    "SES Setup Required:",
    "1. Go to AWS SES Console in us-east-1",
    "2. Verify the sender email: ${var.contact_email_from}",
    "   OR verify the domain: ${element(split("@", var.contact_email_from), 1)}",
    "3. If in SES Sandbox mode, also verify recipient: ${var.contact_email_to}",
    "   OR request production access for sending to any email",
    "4. Test the contact form after verification is complete"
  ]) : "Contact form not configured (contact_email_from is empty)"
}
