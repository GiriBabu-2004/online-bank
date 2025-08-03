const transporter = require('../config/nodemailer');

exports.submitSupport = async (req, res) => {
  try {
    
    const { email, subject, description } = req.body;
    const files = req.files?.images;

    if (!email || !subject || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Attach images to email
    let attachments = [];

    if (files) {
      const fileArray = Array.isArray(files) ? files : [files];

      attachments = fileArray.map(file => ({
        filename: file.name,
        content: file.data,
        contentType: file.mimetype,
      }));
    }

    const mailOptions = {
      from: `"Support Bot" <${process.env.SMTP_USER}>`,
      to: process.env.SUPPORT_EMAIL,
      subject: `Support Request: ${subject}`,
      html: `
        <h2>New Support Request</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Description:</strong><br/>${description.replace(/\n/g, '<br/>')}</p>
      `,
      attachments,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Support request submitted and email sent.' });
  } catch (error) {
    console.error('🔥 Support submit error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
