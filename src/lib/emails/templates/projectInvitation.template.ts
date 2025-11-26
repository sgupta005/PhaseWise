interface ProjectInvitationEmailProps {
  inviteeName: string;
  inviterName: string;
  projectName: string;
  role: 'faculty' | 'student';
  projectUrl: string;
}

export function generateProjectInvitationEmail({
  inviteeName,
  inviterName,
  projectName,
  role,
  projectUrl,
}: ProjectInvitationEmailProps): string {
  const roleLabel = role === 'faculty' ? 'Faculty Mentor' : 'Team Member';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Invitation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-align: center;">
                🎉 Project Invitation
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hi <strong>${inviteeName}</strong>,
              </p>
              
              <p style="margin: 0 0 32px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                <strong>${inviterName}</strong> has invited you to join a project as a <strong>${roleLabel}</strong>.
              </p>
              
              <!-- Project Details Card -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                <tr>
                  <td style="background-color: #f9fafb; border-radius: 8px; padding: 24px; border: 1px solid #e5e7eb;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Project Name</span>
                          <p style="margin: 4px 0 0; color: #1f2937; font-size: 18px; font-weight: 600;">${projectName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px; border-top: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Your Role</span>
                          <p style="margin: 4px 0 0; color: #10b981; font-size: 16px; font-weight: 600;">${roleLabel}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px; border-top: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Invited By</span>
                          <p style="margin: 4px 0 0; color: #1f2937; font-size: 16px;">${inviterName}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 32px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${projectUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.25);">
                      View Invitation
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 32px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                Log in to accept or decline this invitation.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                This is an automated notification from PhaseWise.<br>
                If you have any questions, please contact ${inviterName}.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Bottom spacing -->
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 20px auto 0;">
          <tr>
            <td style="text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © 2025 PhaseWise. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

