import os
from app.core.config import logger
MAIL_FROM = os.environ.get("MAIL_FROM", "onboarding@resend.dev")

async def send_reset_password_email(email: str, token: str):
    """
    Sends a password reset email using Resend API.
    """
    try:
        import resend
        resend.api_key = os.environ.get("RESEND_API_KEY")
    except ImportError:
        logger.warning(f"Resend module not found. Falling back to mock for {email}")
        resend = None

    # The frontend URL for password reset
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000').rstrip('/')
    reset_link = f"{frontend_url}/reset-password?token={token}"
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #333333; text-align: center;">Reset Your Password</h2>
        <p style="color: #555555; font-size: 16px; line-height: 1.5;">
            You requested to reset your password for your <strong>Disability Pride Connect</strong> account. Click the button below to set a new password:
        </p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{reset_link}" style="background-color: #000000; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #777777; font-size: 14px; line-height: 1.5;">
            If the button doesn't work, you can copy and paste this link into your browser:
            <br>
            <a href="{reset_link}" style="color: #007bff;">{reset_link}</a>
        </p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
        <p style="color: #999999; font-size: 12px; text-align: center;">
            If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.
        </p>
    </div>
    """

    try:
        if not resend or not os.environ.get("RESEND_API_KEY") or "your_api_key_here" in os.environ.get("RESEND_API_KEY"):
            logger.warning(f"RESEND_API_KEY not set or resend module missing. Logging email token for {email}: {token}")
            print(f"\n[MOCK EMAIL] To: {email}\n[MOCK EMAIL] Link: {reset_link}\n")
            return
            
        params = {
            "from": MAIL_FROM,
            "to": [email],
            "subject": "Reset your password - Disability Pride Connect",
            "html": html_content,
        }

        response = resend.Emails.send(params)
        logger.info(f"Email sent successfully to {email}. ID: {response.get('id')}")
        return response
    except Exception as e:
        logger.error(f"Failed to send email to {email}: {str(e)}")
        # Don't raise error to avoid exposing email issues to end users
        # But log it for troubleshooting
