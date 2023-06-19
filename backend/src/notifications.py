#!/usr/bin/python3
"""Verification email."""
from typing import List
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr, BaseModel
from jinja2 import Environment, select_autoescape, PackageLoader
from src.settings import settings

env = Environment(
    loader=PackageLoader('src.routes', 'templates'),
    autoescape=select_autoescape(['html', 'xml'])
)


class EmailSchema(BaseModel):
    """Email schema."""

    email: List[EmailStr]


class Email:
    """Email model."""

    def __init__(self, user: dict, url: str, email: List[EmailStr]):
        """Initialize email model."""
        self.username = user['username']
        self.sender = 'Elytse <tripleeoliver@gmail.com>'
        self.email = email
        self.url = url

    async def send_mail(self, subject, template):
        """Send a verification email to the specified user."""
        # Define the config
        conf = ConnectionConfig(
            MAIL_USERNAME=settings.EMAIL_USERNAME,
            MAIL_PASSWORD=settings.EMAIL_PASSWORD,
            MAIL_FROM=settings.EMAIL_FROM,
            MAIL_PORT=settings.EMAIL_PORT,
            MAIL_SERVER=settings.EMAIL_HOST,
            MAIL_STARTTLS=False,
            MAIL_SSL_TLS=False,
            USE_CREDENTIALS=True,
            VALIDATE_CERTS=True
        )
        # Generate the HTML template base on the template name
        template = env.get_template(f'{template}.html')

        html = template.render(
            url=self.url,
            username=self.username,
            subject=subject
        )

        # Define the message options
        message = MessageSchema(
            subject=subject,
            recipients=self.email,
            body=html,
            subtype="html"
        )

        # Send the email
        fast_mail = FastMail(conf)
        await fast_mail.send_message(message)

    async def send_verification_code(self):
        """Send the verification code."""
        await self.send_mail(
            'Your verification code (Valid for 10min)',
            'verification'
        )
    
    async def forgotten_password(self):
        """Send forgot password reset code."""
        await self.send_mail(
            "Password Reset Code (Valid for 10min)",
            "reset password"
        )
