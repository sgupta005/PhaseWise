interface TaskAssignmentEmailProps {
  assigneeName: string;
  assignedByName: string;
  taskTitle: string;
  projectName: string;
  taskUrl: string;
  priority?: string;
  dueDate?: Date | null;
}

export function generateTaskAssignmentEmail({
  assigneeName,
  assignedByName,
  taskTitle,
  projectName,
  taskUrl,
  priority,
  dueDate,
}: TaskAssignmentEmailProps): string {
  const priorityColor = {
    'Low Priority': '#10b981',
    'Medium Priority': '#f59e0b',
    'High Priority': '#ef4444',
    Urgent: '#dc2626',
  }[priority || 'Low Priority'];

  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'No due date set';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Task Assignment</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-align: center;">
                📋 New Task Assigned
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hi <strong>${assigneeName}</strong>,
              </p>
              
              <p style="margin: 0 0 32px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                <strong>${assignedByName}</strong> has assigned you a new task in the project <strong>${projectName}</strong>.
              </p>
              
              <!-- Task Details Card -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 20px; color: #111827; font-size: 20px; font-weight: 600;">
                      ${taskTitle}
                    </h2>
                    
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">
                          <strong>Project:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${projectName}
                        </td>
                      </tr>
                      ${
                        priority
                          ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Priority:</strong>
                        </td>
                        <td style="padding: 8px 0; font-size: 14px;">
                          <span style="display: inline-block; padding: 4px 12px; background-color: ${priorityColor}; color: #ffffff; border-radius: 4px; font-weight: 600; font-size: 12px;">
                            ${priority}
                          </span>
                        </td>
                      </tr>
                      `
                          : ''
                      }
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Due Date:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${formattedDueDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Assigned by:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${assignedByName}
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
                    <a href="${taskUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);">
                      View Task Details
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 32px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                You can view and manage this task by clicking the button above.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                This is an automated notification from PhaseWise.<br>
                If you have any questions, please contact ${assignedByName}.
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
  `.trim();
}
