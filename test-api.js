const axios = require('axios');
const fs = require('fs');

async function testApi() {
    try {
        const res1 = await axios.get('http://localhost:6696/api/v1/sales/last-enquiry', {
            headers: { caller: 'AX' }
        });

        if (res1.data && res1.data.data && res1.data.data.id) {
            const id = res1.data.data.id;
            const res2 = await axios.get(`http://localhost:6696/api/v1/sales/enquiry-detail/${id}`, {
                headers: { caller: 'AX' }
            });
            console.log("Success");
        }
    } catch (err) {
        if (err.response && err.response.data) {
            const msg = "MESSAGE: " + err.response.data.message + "\nSTACK:\n" + err.response.data.stack;
            fs.writeFileSync("error_trace.txt", msg);
        } else {
            fs.writeFileSync("error_trace.txt", "ERROR: " + err.message);
        }
    }
}

testApi();
