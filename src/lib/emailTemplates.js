export const newUserEmailTemplate = (result, plainPassword, tenantInfo) => `<html><body style="display: flex; flex-direction: column;"><div style="font-family:  'Open Sans', Verdana, 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, sans-serif; font-size: 0.8rem; ">
    <h2 style="background-color: rgb(173, 216, 230); color: rgb(3, 36, 48); padding: 1rem;">
      Verification link - UntangleBI Analytics Portal
    </h2>
    
    <h3 style="color: rgb(184, 33, 13);">Welcome to UntangleBI Analytics Portal</h3>
    <p>Dear ${result.firstName},</p>
    <p>
      We are excited to welcome you to UntangleBI analytics portal! Your account has been successfully created, and you can now log in and explore our platform reference to your organization data visualizations and analytics solution.
    </p>
    <p>First you need to verify your email in <a href="${process.env.HOST_URL}verify" target="_blank">here</a> by using the verification code as <b>${result?.verificationCode}.</b></p>
    <p>For your initial login, please use the following credentials <a href="${process.env.HOST_URL}login" target="_blank">here</a>:</p>
    <ul>
      <li>Username: <b>${result.email}</b></li>
      <li>Initial Password: <b>${plainPassword}</b></li>
      <li>Organization: <b>${tenantInfo?.name}</b></li>
    </ul>

    <p>We recommend changing your password after your first login for enhanced security. To change your password, simply go to your account settings once logged in.</p>

    <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team at ${process.env.SMTP_USER}</p>

    <p>Thank you for choosing UntangleBI as your data visualization partner. We look forward to helping you get started!</p>

    <p><b>Best regards,</b></p>
    <p><b>Support Team</b></p>
    <p><b>UntangleBI | GatewayICT</b></p>
    <img width="200px"  src="cid:ublogo@image" alt="logo" />
       
  </div></body></html>`


export const userPasswordResetEmailTemplate = (generateCode) => `<html><body style="display: flex; flex-direction: column;"><div style="font-family:  'Open Sans', Verdana, 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, sans-serif; font-size: 0.8rem; ">
            <h2 style="background-color: rgb(173, 216, 230); color: rgb(3, 36, 48); padding: 1rem;">
              Password reset link - UntangleBI Analytics Portal
            </h2>
            
            <h3 style="color: rgb(184, 33, 13);">Welcome to UntangleBI Analytics Portal</h3>
            <p>Dear ${generateCode.firstName},</p>
            <p>
            We received a request to reset the password for your UntangleBI analytics portal account. If you initiated this request, please use the following password reset code to proceed:
            </p>
            <ul>
              <li>Password Reset Code: <b>${generateCode.passwordResetCode}</b></li>
            </ul>
        
            <p>Alternatively, you can reset your password using the link below:</p>
        
            <a href="${process.env.HOST_URL}change-password/${generateCode.passwordResetCode}">${process.env.HOST_URL}change-password/${generateCode.passwordResetCode}</a>
        
            <p>If you did not request a password reset, please disregard this email. Your account remains secure.</p>

            <p>For any assistance, feel free to contact our support team at ${process.env.SMTP_USER}</p>
        
            <p><b>Best regards,</b></p>
            <p><b>Support Team</b></p>
            <p><b>UntangleBI | GatewayICT</b></p>
            <img width="200px"  src="cid:ublogo@image" alt="logo" />
               
          </div></body></html>`



export const createTicketEmailTemplate = (ticket) => `<html><body style="display: flex; flex-direction: column;"><div style="font-family: 'Open Sans', Verdana, 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, sans-serif; font-size: 0.8rem; ">
            <h2 style="background-color: rgb(173, 216, 230); color: rgb(3, 36, 48); padding: 1rem;">
              New Ticket Created : ${ticket.id} - UntangleBI Analytics Portal
            </h2>
            
            <h3 style="color: rgb(184, 33, 13);">Ticket successfully created!</h3>
            <p>Dear ${ticket.user?.firstName},</p>
            <p>Thank you for reaching out to us!</p>
            <p>We want to confirm that your ticket has been successfully raised regarding the issue you reported in our software application. Here are the details of your ticket:</p>
            <ul>
              <li><b>Ticket Number: </b>${ticket.id}</li>
              <li><b>Date Raised: </b>${ticket.createdAt}</li>
              <li><b>Summary: </b>${ticket?.title}</li>
            </ul>
        
            <p>Our support team will review your ticket and get back to you as soon as possible. We appreciate your patience as we work to resolve this matter.</p>
                
            <p>If you have any further questions or need additional assistance, please don’t hesitate to reply to this email.</p>

            <p>For any assistance, feel free to contact our support team at ${process.env.SMTP_USER}</p>
        
            <p><b>Best regards,</b></p>
            <p><b>Support Team</b></p>
            <p><b>UntangleBI | GatewayICT</b></p>
            <img width="200px"  src="cid:ublogo@image" alt="logo" />
               
          </div></body></html>`


export const updateTicketEmailTemplate = (ticket) => `<html><body style="display: flex; flex-direction: column; width: 100%;"><div style="font-family:  'Open Sans', Verdana, 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, sans-serif; font-size: 0.8rem; ">
          <h2 style="background-color: rgb(173, 216, 230); color: rgb(3, 36, 48); padding: 1rem;">
            Ticket Update Notification : ${ticket.id} - UntangleBI Analytics Portal
          </h2>
          
          <h3 style="color: rgb(184, 33, 13);">Ticket successfully updated!</h3>
          <p>Dear ${ticket.user?.firstName},</p>
          <p>We wanted to inform you that your support ticket <b>[${ticket?.id} - ${ticket?.title}]</b> has been updated. Please log in to the system to review the latest information and any actions taken.</p>
          <p>You can access your ticket by visiting: <a href="${process.env.HOST_URL}dashboard/ticket/${ticket?.id}">${process.env.HOST_URL}dashboard/ticket/${ticket?.id}</a></p>
              
          <p>If you have any further questions or need assistance, feel free to reach out.</p>              

          <p>For any assistance, contact our support team at ${process.env.SMTP_USER}</p>
      
          <p><b>Best regards,</b></p>
          <p><b>Support Team</b></p>
          <p><b>UntangleBI | GatewayICT</b></p>
          <img width="200px"  src="cid:ublogo@image" alt="logo" />
             
        </div></body></html>`


export const notificationEmailTemplate = (notification) => `<html><body style="display: flex; flex-direction: column; width: 100%;">
  <div
    style="font-family: 'Open Sans', Verdana, 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, sans-serif; font-size: 0.8rem; ">
    <h2 style="background-color: rgb(173, 216, 230); color: rgb(3, 36, 48); padding: 1rem;">
      Announcement: UntangleBI Analytics Portal
    </h2>

    <h3 style="color: rgb(5, 58, 172);">New Announcement</h3>

    <p>Dear ${notification?.name},</p>

    <p>We wanted to inform you that there is a new announcement for you on the UntangleBI Analytics Portal.</p>

    <p><b>${notification?.title}</b></p>

    <p>${notification?.message}</p>

    <p>If you have any questions or require further information, feel free to reach out to our support team.</p>

    <p>For assistance, contact us at ${process.env.SMTP_USER}.</p>

    <p><b>Best regards,</b></p>
    <p><b>System Administrator</b></p>
    <p><b>UntangleBI | GatewayICT</b></p>
    <img width="200px" src="cid:ublogo@image" alt="logo" />
  </div>
</body>
</html>`