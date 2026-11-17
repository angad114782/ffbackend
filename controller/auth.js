const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const { dataNotFound, dataFound } = require("../helper/functions");
const { measurement_slot_booked, verify_mobile } = require("../helper/messages");
const { User, Enquiry_Schedule, Message, Enquiry, Customer, Schedule, OTP, Outlet, OutletUser, Notification, EnquiryStatus, Vendor, InstallerSchedule, InstallerTasks, App_Version } = require("../model");
const { send_notification, whatsappMessage } = require("../helper/mailer");

const sequelize = require('../utils/database');
const { Op } = require("sequelize");
const crypto = require('crypto');

function generateSecureOTP() {
    const otp = crypto.randomInt(100000, 1000000);
    return otp;
}


exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } })
        dataNotFound(user, 404, "no user found")

        if (user.isblocked) {
            throw new Error("User is blocked");
        }

       const match = await bcryptjs.compare(req.body.password, user.password);
            dataNotFound(match, 400, "Incorrect Password");

        const token = jsonwebtoken.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_JWT_EXPIRY });

        user.accessToken = token
        user.fcmToken = req.body.fcm_token
        user.login_time = new Date()
        user.logout_time = null;
        await user.save();
        await user.reload()

        delete user.dataValues.password
        delete user.dataValues.createdAt
        delete user.dataValues.updatedAt

        res.status(200).json({
            message: "User Logged In Successfully",
            data: user,
            status: true
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

exports.blockUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.body.id } });
        dataNotFound(user, 400, "User not found");

        delete user.dataValues.activity
        delete user.dataValues.password
        delete user.dataValues.createdAt
        delete user.dataValues.updatedAt

        if (req.body.is_block == true) {
            user.isblocked = true
            user.save();

            return res.status(200).json({
                message: "User Blocked",
                data: user,
                status: true
            })
        } else if (req.body.is_block == false) {
            user.isblocked = false
            user.save();

            return res.status(200).json({
                message: "User Unblocked",
                data: user,
                status: true
            })
        }
    } catch (e) {
        next(e)
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { old_password, new_password } = req.body;

        if (new_password.length < 6) throw new Error("Password minimum 6 digits");

        const user = await User.findByPk(req.userId);
        dataNotFound(user, 400, "User Not Authorised");

        const match = await bcryptjs.compare(old_password, user.password);
        dataNotFound(match, 400, "Incorrect Password");

        const isSamePassword = await bcryptjs.compare(new_password, user.password);
        if (isSamePassword) {
            throw new Error("New password cannot be the same as the old password");
        }

        const hashedPassword = await bcryptjs.hash(new_password, 12);

        await user.update({
            password: hashedPassword
        });

        return res.status(200).json({
            message: "Password changed successfully",
            data: new_password,
            status: true
        })

    } catch (e) {
        next(e)
    }
}

exports.logout = async (req, res, next) => {

    try {

        const user = await User.findOne({ where: { id: req.userId } });

        let activityLog = ''
        if (user.activity) {
            activityLog = JSON.parse(user.activity)
        } else {
            activityLog = []
        }

        const currentTime = new Date();

        activityLog.unshift({
            login_time: user.login_time ? user.login_time : null,
            logout_time: currentTime
        });

        if (activityLog.length > 50) {
            activityLog = activityLog.slice(0, 50);
        }


        await user.update({
            logout_time: currentTime,
            activity: JSON.stringify(activityLog)
        });
        // await user.update({logout_time: new Date()})

        res.status(200).json({
            message: "logout successfully",
            data: [],
            status: true
        })


    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }

}

exports.schedule_enquiry_list = async (req, res, next) => {

    try {

        const data = await Enquiry_Schedule.findAll({
            where: { scheduleId: null },
            include: [{
                model: Enquiry,
                include: [{
                    model: Customer
                }]
            }]
        });

        res.status(200).json({
            message: "Schedule enquiry list",
            data: data,
            status: true
        })

    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }

}

exports.assign_schedule_person = async (req, res, next) => {
    try {
        const data = await User.findOne({
            where: { id: req.body.schedulePersonId }
        });

        if (!data) throw new Error('schedule Person not found');

        // const PendingEnquirySchedule = await Enquiry_Schedule.findAll({
        //     where: {
        //         enquiryId: req.body.enquiryId,
        //         status : {
        //             [Op.or] : ["pending" , "cancelled", "slot_booked"]
        //         }
        //     }
        // })
        const enquirySchedule = await Enquiry_Schedule.findOne({
            where: {
                enquiryId: req.body.enquiryId
            }
        })
        if (enquirySchedule) {
            return res.status(400).json({
                message: "Measurer Already Assigned",
                status: false
            })
        }

        // if(PendingEnquirySchedule.length > 0){
        //     for (var i = 0; i < PendingEnquirySchedule.length; i++) {
        //         await PendingEnquirySchedule[i].update({
        //             status : "cancelled"
        //         })
        //     }
        // }

        const check = await Enquiry_Schedule.create({
            ScheduleId: req.body.ScheduleId,
            enquiryId: req.body.enquiryId,
            status: "pending",
            schedulePersonId: req.body.schedulePersonId,
            date: req.body.date,
            measurement_required: req.body.measurement_required,
        });

        // let obj = {
        //     enquiry_id: req.body.enquiryId,
        //     name: data.firstName + ' ' + data.lastName,
        //     date: new Date()
        // };
        const enquiry = await Enquiry.findOne({ where: { id: req.body.enquiryId }, include: [Customer] })
        await enquiry.update({
            status: "measurer-assigned"
        })

        let sch;
        if (req.body.ScheduleId) {
            sch = await Schedule.findOne({ where: { id: req.body.ScheduleId } })
        }

        const time_details = {
            "date": req.body.date,
            "start_time": req.body.ScheduleId ? sch.start_time : "",
            "end_time": req.body.ScheduleId ? sch.end_time : ""
        };

        const time_details_for_message = `Date ${req.body.date} Start ${sch.start_time} to ${sch.end_time}`

        await EnquiryStatus.create({
            remark: "Measurer Assigned",
            status: "completed",
            enquiryId: enquiry.id,
            details: time_details
        });

        const message_data = await Message.findOne({ where: { enquiryId: enquiry.id, message: 'measurement_slot_booked' } })
        if (!message_data) {
            await Message.create({
                message: "measurement_slot_booked",
                enquiryId: enquiry.id
            })
            const customer = await Customer.findOne({ where: { id: enquiry.customerId } })
            const message = measurement_slot_booked(customer.firstName + ' ' + customer.lastName, enquiry.id, time_details_for_message)
            whatsappMessage(message, customer.primary_phone)
        }

        ////start notification functioin-------------------
        const measurer = await User.findOne({ where: { id: req.body.schedulePersonId } });
        const outletUser = await OutletUser.findOne({ where: { salesPersonId: enquiry.salesId } });
        const obj = {
            message: `Measurer assigned for enquiry ${enquiry.enquiryId} on ${check.date}.`,
            enquiryId: enquiry.id
        }

        await send_notification(measurer.fcmToken, 'Measurement assigned', obj);

        const notification = await Notification.findOne({ where: { message: obj.message, enquiryId: enquiry.id } })
        await Notification.create({
            message: obj.message,
            enquiryId: enquiry.id,
            measurerId: measurer.id,
            adminId: outletUser.outletId
        });
        ////end Notification functioin-------------------

        res.status(200).json({
            message: "Person assign Successfully",
            data: [],
            status: true
        })

    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

exports.createVendor = async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ where: { vendor: req.body.vendor } })
        dataFound(vendor, 400, "Vendor Alreay Exist")

        const newVendor = await Vendor.create({
            vendor: req.body.vendor
        })
        res.status(201).json({
            message: "Vendor created Successfully",
            data: newVendor,
            status: true
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}


exports.app_version = async (req, res, next) => {
    try {
        const version = await App_Version.findOne({ where: { app_name: req.body.app_name, type: req.body.type } });

        if (version) {
            const updated_version = await version.update({
                app_name: req.body.app_name,
                app_version: req.body.app_version,
                type: req.body.type
            })

            return res.status(201).json({
                message: "Version updated Successfully",
                data: updated_version,
                status: true
            })
        } else {
            const new_version = await App_Version.create({
                app_name: req.body.app_name,
                app_version: req.body.app_version,
                type: req.body.type
            })

            return res.status(201).json({
                message: "Version created Successfully",
                data: new_version,
                status: true
            })
        }
    } catch (e) {
        next(e)
    }
}

exports.get_version = async (req, res, next) => {
    try {
        const version = await App_Version.findOne({ where: { type: req.params.type }, order: [["id", "DESC"]] });

        return res.status(201).json({
            message: "Version Fetched",
            data: version,
            status: true
        })
    } catch (e) {
        next(e)
    }
}

exports.sendOtp = async (req, res, next) => {
    const { phone } = req.body;

    try {
        const otp = generateSecureOTP();
        const customerotp = await OTP.findOne({ where: { phone: phone } });

        const message = verify_mobile(otp, phone)
        whatsappMessage(message, phone)

        await OTP.create({ phone: phone, otp, otp_verified: false });

        return res.status(200).json({ status: true, message: 'OTP sent successfully', otp });
    } catch (error) {
        next(error)
    }
};

// Verify OTP API
exports.verifyOtp = async (req, res, next) => {
    const { phone, otp } = req.body;

    try {
        const customer = await OTP.findOne({
            where: { phone },
            order: [['id', 'DESC']], // Orders by 'createdAt' in descending order
        });

        if (!customer) {
            return res.status(404).json({ status: false, message: 'Customer not found' });
        }

        if (customer.otp != otp) {
            return res.status(400).json({ status: false, message: 'Invalid OTP' });
        }

        await customer.destroy();

        return res.status(200).json({ status: true, message: 'OTP verified successfully' });
    } catch (error) {
        next(error)
    }
}



