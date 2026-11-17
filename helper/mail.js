exports.mail_formet = (complaint, enquiry_data, images) => {
    
    const imageElements = images.map((data, index) => (
        `<img key=${index} src="${data}" alt="Image" width="250" height="250" style="border-radius: 5px; margin: 5px; border: 1px solid gray;">`
    )).join('');

    return `
        <body>
            <div style="border-radius: 5px; border: 1px solid #a58144; overflow: hidden;">
                <div style="width: 100%; margin: auto; background-color: #a58144; color: white; text-align: center; padding-top: 10px; padding-bottom: 10px;">
                    <h1 style="font-family: serif; margin: 0;">F & F</h1>
                    <span style="font-family: sans-serif; font-size: 10px;">FLOOR & FURNISHINGS</span>
                </div>
                <div style="width: 80%; margin: auto; font-family: sans-serif;color: black;">
                    <h3>Customer Complaint Details:-</h3>
                    <div style="overflow-x: auto;">
                        <p><strong>Enquiry Id:</strong> ${enquiry_data.enquiry.enquiryId}</p>
                        <p><strong>Customer Name:</strong> ${enquiry_data.enquiry.customer.firstName} ${enquiry_data.enquiry.customer.lastName}</p>
                        <p><strong>Customer Phone:</strong> ${enquiry_data.enquiry.customer.primary_phone}</p>
                        <p><strong>Sales Person Name:</strong> ${enquiry_data.enquiry.user.firstName} ${enquiry_data.enquiry.user.lastName}</p>
                        <p><strong>Complaint issue Date:</strong> ${(enquiry_data.createdAt).toISOString().split('T')[0]}</p>
                        <p><strong>Category:</strong> ${complaint.material.name}</p>
                        <p><strong>Complaint Type:</strong> ${complaint.type}</p>
                        <p><strong>Description:</strong> ${complaint.description}</p>
                    </div>
                    <div style="margin-top: 20px; text-align: justify;">
                        <p><strong>Remark:</strong> ${enquiry_data.remark}</p>
                    </div>
                    <div id="imageContainer" style="padding: 10px 0px;">${imageElements}</div>
                </div>
            </div>
        </body>
    `;
};

exports.bill_submission = () =>{
    return`
        <body>
            <div style="border-radius: 5px; border: 1px solid #a58144; overflow: hidden;">
                <div style="width: 100%; margin: auto; background-color: #a58144; color: white; text-align: center; padding-top: 10px; padding-bottom: 10px;">
                    <h1 style="font-family: serif; margin: 0;">F & F</h1>
                    <span style="font-family: sans-serif; font-size: 10px;">FLOOR & FURNISHINGS</span>
                </div>
                <div style="width: 80%; margin: auto; font-family: sans-serif;color: black;">
                    <h3>Upload image:- </h3><p>http://google.com</p>
                </div>
            </div>
        </body>
    `;
}