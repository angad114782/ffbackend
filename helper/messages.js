//scenario 1<<<<<<<<<<<<<<<<<<<<<<<<----------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.

exports.verify_mobile = (otp, mobile) => {
  let message = `Dear Customer,

    Your otp is ${otp} for verifying your mobile number ${mobile}. Please enter this code on the verification screen. This OTP is valid for the next 10 minutes.

Warm Regards
Floor & Furnishings`;
  return message;
};

exports.enquiry_creation = (name, enquiry_id, categories, enquiryId) => {
  let message = `Dear ${name}, 

    Thank you for your recent visit to F&F. We appreciate you entrusting F&F as your go-to destination for home interior products & services over the past 40 years.

Please click the below link to select a convenient time slot for your ${categories.join(
    ", "
  )} measurements.

*Measurement booking* 
slot Link: https://service.fandf.in/customer-assign-measurer/${enquiryId}

Thank you,
Floor & Furnishings`;

  return message;
};

exports.advance_payment_message = (name, payment_link, amount) => {
  let message = `Hi ${name},

Hope you're doing well!

Thank you for visiting F&F and your interest in our products. To proceed with your product enquiry, we kindly request you to pay the advance amount by using the link below. 

Payment Link: ${payment_link}
Advance Amount – INR ${amount}/-

If you have any questions or need further assistance, please don’t hesitate to reach out to us. We’re here to help!

Thank you for choosing  Floor and Furnishings. We look forward to assisting you further.
Warm regards,

F&F | Floor and Furnishings`;
  return message;
};

exports.measurement_slot_booked = (name, enquiryId, time_details) => {
  let message = `Dear ${name}, 

    We’re happy to let you know that your measurement appointment has been confirmed. Our Customer Service team will be reaching out to you shortly to discuss the details. Rest assured, our expert measurer will be visiting your site as scheduled.

For any questions or assistance, please feel free to save and contact our F&F Customer Service team at +91 8376906736.

Booking details : ${time_details}

If you would like to reschedule your measurement, please click the link below to select a convenient time slot 
https://service.fandf.in/customer-re-assign-measurer/${enquiryId}

Thank you for choosing Floor & Furnishing. We look forward to assisting you!

Warm regards,
Floor & Furnishing`;

  return message;
};

exports.payment_quotation_request = (name) => {
  let message = `Dear ${name}, 

    We’re excited to share that your estimate is ready for your review. We will share it with you shortly.

To confirm your order, a minimum payment of 70% can be made through various payment methods.


If you have any questions or need further assistance, please don’t hesitate to reach out to us. We’re here to help!

Thank you for choosing F&F | Floor and Furnishings. We look forward to working with you.

Warm regards,
F&F | Floor and Furnishings`;
  return message;
};

exports.estimate_create_message = (
  name,
  store_number,
  payment_link,
  amount,
  advance,
  quotationAmount
) => {
  let message = `Dear ${name}, 

We’re excited to share that your estimate is ready for your review. kindly confirms the estimate by paying the advance payment by using the link below to get your order started.

Payment Link: ${payment_link} 
Total Estimate Amount – INR ${quotationAmount}/-
Advance Deposit - INR ${advance}/-
Balance Payment - INR ${amount}/-

If you have any questions or need further assistance, please don’t hesitate to reach out to Store Manager ${store_number}.

Thank you for choosing F&F | Floor and Furnishings. We look forward to assisting you further.

Warm regards,
F&F | Floor and Furnishings`;
  return message;
};

exports.estimate_create_reminder = (
  name,
  payment_link,
  amount,
  advance,
  quotationAmount
) => {
  let message = `Dear ${name}, 
 
Hope you're doing well!

A humble reminder kindly confirms the estimate by paying the advance payment by using the link below to get your order started.

Payment Link: ${payment_link} 
Total Estimate Amount – INR ${quotationAmount}/-
Advance Deposit - INR ${advance}/-
Balance Payment - INR ${amount}/-

If you have any questions or need further assistance, please don’t hesitate to reach out to us. We’re here to help!

Thank you for choosing F&F | Floor and Furnishings. We look forward to assisting you further.

Warm regards,
F&F | Floor and Furnishings
`;
  return message;
};

exports.Qc1_message_without_payment = (name, enquiryId) => {
  let message = `Dear ${name},

    We hope this message finds you well. We wanted to update you that your materials are currently being stitched with care.

For your convenience, you can also check the status of your order here: https://service.fandf.in/customer-status-detail/${enquiryId}

If you have any questions or need assistance, please feel free to reach out. We’re here to help!

Thank you for choosing Floor & Furnishings. We truly appreciate your continued trust in us.

Warm regards,
Floor & Furnishings
`;
  return message;
};

exports.Qc1_message_with_payment = (name, enquiryId, payment_link, amount) => {
  let message = `
Dear ${name},

    We hope this message finds you well. We wanted to update you that your materials are currently being stitched with care.
    
For your convenience, you can also check the status of your order here: https://service.fandf.in/customer-status-detail/${enquiryId}

To ensure a smooth and timely delivery, we kindly request you to settle the outstanding payment at your earliest convenience.

Payment Link: ${payment_link} 
Balance Amount – INR ${amount}/-

If you have any questions or need assistance, please feel free to reach out. We’re here to help!

Thank you for choosing F&F | Floor and Furnishings. We look forward to assisting you further.

Warm regards,
Floor & Furnishings
`;
  return message;
};

exports.Qc3_message_with_payemnt = (name, payment_link, amount) => {
  let message = `Hi ${name},
    
I hope you're doing well!

We’re excited to let you know that your order is ready to dispatch. To ensure a smooth and timely delivery, we kindly request you to settle the outstanding payment at your earliest convenience.

Payment Link: ${payment_link} 
Balance Amount – INR ${amount}/-

If you have any questions or need further assistance, please don’t hesitate to reach out to us. We’re here to help!
Thank you for choosing F&F | Floor and Furnishings. We look forward to assisting you further.

Warm regards,
F&F | Floor and Furnishings`;
  return message;
};

exports.book_installation_time_slot = (
  name,
  order_number,
  enquiryId,
  payment_link
) => {
  let message = `Dear ${name}, 

    We’re delighted to let you know that your order *${order_number}* is now ready for delivery and installation! To ensure everything goes smoothly, please use the link below to select a time slot that works best for you:

*Installation booking slot Link:* https://service.fandf.in/customer-assign-installer/${enquiryId}

If you have any questions or need assistance, please don’t hesitate to reach out to our Customer Care team at +91 8376906736. We’re here to help!

Thank you once again for choosing Floor & Furnishings. We look forward to completing your order to your satisfaction.

Warm regards,
Floor & Furnishings`;
  return message;
};

// exports.installation_slot_booked = (name, enquiryId) => {
// let message =
// `Dear ${name},

//     We’re happy to let you know that your Installation appointment has been confirmed. Our Customer Service team will be reaching out to you shortly to discuss the details. Rest assured, our expert installer will be visiting your site as scheduled.

// If you would like to reschedule your Installation, please click the link below to select a convenient time slot (Reschedule Link).

// For any questions or assistance, please feel free to save and contact our F&F Customer Service team at +91 8376906736.

// Thank you for choosing Floor & Furnishing. We look forward to assisting you!

// Warm regards,
// Floor & Furnishing
// `
//     return message;
// }

exports.installation_done_otp = (name, otp) => {
  let message = `Dear ${name},

    Great news! Your installation is now complete. To wrap things up, please share the OTP with the installer to confirm everything is set.

*${otp}*

If you need any further assistance, we’re just a call away at +91 8376906736.

Thank you for choosing Floor & Furnishings. We hope you enjoy your new setup!
`;
  return message;
};

exports.feedback_message = (name, enquiryId) => {
  let message = `Dear ${name}, 
   
    As we celebrate 40 wonderful years of growth and success, we want to take a moment to express our heartfelt gratitude. Your support and feedback have been integral to our journey, helping us to continuously improve and evolve.

We would greatly appreciate it if you could share your experience with us. Your insights are invaluable as we strive to enhance our services.

*You can share your thoughts by clicking the link below:*
https://service.fandf.in/customer-feedback/${enquiryId}

Thank you for being a part of the Floor & Furnishings family. We look forward to serving you again soon!

Warm regards,
Floor & Furnishings`;
  return message;
};

exports.IC_payment_confirmation = (name, enquiryNumber, customerId, amount) => {
  let message = `Hello Mr. ${name},

We have received a payment with the following details:

Enquiry Number: ${enquiryNumber}  
Customer ID: ${customerId}  
Amount: ₹ ${amount}  


Warm regards,  
Floor & Furnishings`;

  return message;
};

exports.complaint_register_msg = (customerName) => {
  let message = `
Dear ${customerName},

We have successfully registered your complaint in our system. Your concern is important to us, and our team at Floor & Furnishings is now reviewing the details to ensure it is resolved as quickly and efficiently as possible.

A representative will get in touch with you shortly for any further clarification or to provide updates on the progress.

We appreciate your patience and understanding. Should you have any additional information or questions, please feel free to contact us at +91 8376906736 or crmretail@fandf.in. 

Warm regards,
Customer Support Team
Floor & Furnishings`;
  return message;
};

exports.complaint_close_msg = (customerName) => {
  let message = `
Dear ${customerName},

We would like to inform you that your complaint has been successfully resolved and the case has now been closed in our system. We appreciate your patience and understanding throughout the process.

At Floor & Furnishings, customer satisfaction is our top priority, and we remain committed to providing you with the highest level of service. If you have any further questions or require assistance, please do not hesitate to contact us.

Thank you once again for giving us the opportunity to serve you better.

Warm regards,
Customer Service Team
Floor & Furnishings`;
  return message;
};

exports.enquiry_cancellation_msg = (customerName, storeManagerNumber) => {
  let message = `
Dear ${customerName},

We would like to inform you that your recent product enquiry has been closed in our system as per your request.

If you would like to revisit or explore other options at Floor & Furnishings, we’ll be more than happy to assist you. our team is always here to help you make the right choice for your space.

Feel free to reach out to us at (Store Manager - +91 ${storeManagerNumber}). if you have any questions or require further assistance.

Thank you for considering Floor & Furnishings. We hope to connect with you again soon.

Warm regards,
Floor & Furnishings`;
  return message;
};

exports.enquiry_reopen_msg = (customerName, storeManagerNumber) => {
  let message = `
Dear ${customerName},

We’re pleased to inform you that your product enquiry has been reopened in our system, and our team is now reviewing it to assist you further.

Thank you for reconnecting with Floor & Furnishings. One of our representatives will get in touch with you shortly to discuss your requirements and help you move forward with the best options available.

If there’s anything specific you’d like to share or update regarding your enquiry, feel free to reach out to us at (Store Manager- +91 ${storeManagerNumber}).

We look forward to assisting you again!

Warm regards,
Floor & Furnishings`;
  return message;
};

exports.dashboardMessage = (data) => {
  let message = "*Metrics Report*\n\n";
  message += `Live Link: http://tailoringnew.fandf.in/dashboard-summary\n\n`;
  for (let metric in data) {
    if (metric !== "data" && metric !== "status" && metric !== "message") {
      message += `*${metric}*\n`;
      for (let status in data[metric]) {
        if (status !== "overdue") {
          message += `${status}: ${data[metric][status]}\n`;
        }
      }
      message += "\n";
    }
  }
  return message;
};

//style update message---------------------------------

exports.style_update = (data, enquiryId, ic_name, measurer_name) => {
  let message = `Dear ${ic_name},

Please be informed that the following style changes have been made for enquiry ID: ${enquiryId} by ${measurer_name}:`;

  if (data.curtain_style.old || data.curtain_style.new) {
    message += `

1. Curtain Style:
   - Old: ${data.curtain_style.old}
   - New: ${data.curtain_style.new}`;
  }

  if (data.mock_curtain_style.old || data.mock_curtain_style.new) {
    message += `

2. Mock Curtain Style:
   - Old: ${data.mock_curtain_style.old}
   - New: ${data.mock_curtain_style.new}`;
  }

  if (data.sheer_style.old || data.sheer_style.new) {
    message += `

3. Sheer Style:
   - Old: ${data.sheer_style.old}
   - New: ${data.sheer_style.new}`;
  }

  message += `

Thank you.

Best regards,
Your Team`;

  return message;
};
