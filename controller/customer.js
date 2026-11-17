const { dataNotFound, dataFound, encrypt, decrypt } = require("../helper/functions");
const { send_notification, whatsappMessage } = require("../helper/mailer");
const { complaint_message, measurement_slot_booked, feedback_message, complaint_register_msg, book_installation_time_slot } = require("../helper/messages");
const { Enquiry, Identification, Customer, Order, Complaint, ComplaintTask, User, EnquiryStatus, OutletUser, Enquiry_Schedule, SelectedMaterial, Room, Material, OutletAddress, Feedback, Notification, Address, InstallerTasks, Schedule, Message } = require("../model");
const EnquirySchedule = require("../model/enquiry-schedule")
const { Op } = require("sequelize");
const axios = require("axios")
const { UploadFile, removefile } = require("../helper/multer");


exports.setschedule = async (req, res, next) => {
    try {
        const userschedule = await EnquirySchedule.create({
            start_time: req.body.Stime,
            end_time: req.body.Etime,
            date: req.body.date,
            enquiryId: req.body.enquiryId,
        });
        res.status(201).json({
            message: 'schedule created successfully',
            data: userschedule,
            status: true
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}


exports.getMyEnquiry = async (req, res, next) => {
    try {
        const customerId = req.params.id
        var parts = customerId.split('&&');
        const data = decrypt(parts[0], parts[1])
        const customer = await Customer.findOne({
            where: { id: data },
            include: {
                model: Enquiry, include: {
                    model: User, attributes: { exclude: ['password', 'accessToken', 'image'] },
                }
            }
        })
        dataNotFound(customer, 400, "Customer Not Exists")

        for (let i = 0; i < customer.enquiries.length; i++) {
            const element = customer.enquiries[i];
            const outlet_user = await OutletUser.findOne({ where: { salesPersonId: element.salesId } })
            if (outlet_user) {
                const outlet = await User.findOne({ where: { id: outlet_user.outletId }, attributes: { exclude: ['password', 'accessToken', 'image'] } })
                element.dataValues.outlet = outlet
            }
            const products = [];
            const room = await Room.findAll({
                where: { enquiryId: element.id },
                include: [{ model: SelectedMaterial, include: Material }],
            });
            for (const j of room) {
                for (const k of j.selectedmaterials) {
                    if (!products.includes(k.material.name)) {
                        products.push(k.material.name);
                    }
                }
            }
            element.dataValues.products = products;
        }

        return res.status(200).json({
            message: "enquires featched seccessfully",
            status: true,
            data: customer
        })

    } catch (error) {
        next(error)
    }
}

exports.getMyRoom = async (req, res, next) => {
    try {

        const rooms = await Room.findAll({ where: { enquiryId: req.query.enquiryId }, include: { model: SelectedMaterial, include: Material } })

        return res.status(200).json({
            message: "Room fetched",
            data: rooms,
            status: true
        })
    } catch (error) {
        next(error)
    }
}

exports.getComplaintCategoryWise = async (req, res, next) => {
    try {
        let arr = []
        const materialIds = JSON.parse(req.query.materialId);

        for (let i = 0; i < materialIds.length; i++) {

            const data = await Material.findOne({ where: { id: materialIds[i] }, include: Complaint })
            arr.push(data)
        }

        return res.status(200).json({
            message: "Room fetched",
            data: arr,
            status: true
        })
    } catch (error) {
        next(error)
    }
}

// exports.addComplaintImages = async (req, res, next) => {
//     try {
//         const { file, body } = await UploadFile(req, "complaint");
        
//         const complaint = await ComplaintTask.findByPk(req.params.id)
//         dataNotFound(complaint, "Complaint not found", 400);
        
//         const img = complaint.images ? complaint.images : [];
        
//         const new_images = [];
//         for (var i = 0; i < file.length; i++) {
//             new_images.push(file[i].path) 
//         }
        
//         await complaint.update({images: [...img, ...new_images]})
//         return res.status(200).json({
//             message: "Images add Successfully",
//             data: new_images,
//             status: true
//         })

//     } catch (e) {
//         next(e) 
//     }
// }

// exports.deleteComplaintImages = async (req, res, next) =>{
//     try {
//         const complaint = await ComplaintTask.findByPk(req.params.id)
//         dataNotFound(complaint, "Complaint not found", 400);
        
//         const img = complaint.images ? complaint.images : [];
        
//         if(img.includes(req.body.img_url)){
            
//             await removefile(req.body.img_url)
            
//             if(img.length == 1) {
//                 await complaint.update({images: []});
//             } else {
//                 const changedArray = img.filter((value) => value === req.body.img_url);
              
//                 await complaint.update({images: changedArray});
//             }
            
//             return res.status(200).json({
//                 message: "Images delete Successfully",
//                 data: complaint.images,
//                 status: true
//             })
//         }else{
//             return res.status(400).json({
//                 message: "Images not found",
//                 status: false
//             })
//         }
//     } catch (e) {
//         next(e)
//     }
// }


// exports.makeAComplaint = async (req, res, next) => {
//     try {

//         for (let i = 0; i < req.body.complaint_details.length; i++) {
//             const element = req.body.complaint_details[i];
//             const complaint = await Complaint.findOne({ where: { id: element.complaintId } })
//             dataNotFound(complaint, 400, 'Complaint Not Exists')
//         }

//         const enquirySchedule = await ComplaintTask.findOne({
//             where: {
//                 enquiryId: req.body.enquiryId
//             },
//             order: [["id", "DESC"]]
//         })
//         if ((enquirySchedule && (enquirySchedule.status == "active" || enquirySchedule.status == "pending"))) {
//             return res.status(400).json({
//                 message: "Your previous complaint is already in proccess",
//                 status: false
//             })
//         }

//         const check = await ComplaintTask.create({
//             scheduleId: req.body.scheduleId,
//             enquiryId: req.body.enquiryId,
//             status: "pending",
//             date: req.body.date,
//             remark: JSON.stringify([req.body.remark]),
//             complaint_info: JSON.stringify(req.body.complaint_details)
//         });


//         const enquiry = await Enquiry.findOne({ where: { id: req.body.enquiryId }, include: [Customer] })
//         let obj = {
//             enquiry_id: req.body.enquiryId,
//             date: new Date()
//         };

//         await EnquiryStatus.create({
//             remark: "complaint raised",
//             status: "completed",
//             enquiryId: enquiry.id
//         })

//         const message_data = await Message.findOne({ where: { enquiryId: enquiry.id, message: "complaint_register_msg" } })
//         if (!message_data) {
//             const customer = await Customer.findOne({ where: { id: enquiry.customerId } })

//             await Message.create({
//                 message: "complaint_register_msg",
//                 enquiryId: enquiry.id
//             })
//             const message = complaint_register_msg(customer.firstName+ " "+customer.lastName)
//             whatsappMessage(message, customer.primary_phone)
//         }

//         return res.status(200).json({
//             message: "Slot book Successfully",
//             data: check,
//             status: true
//         })


//     } catch (error) {
//         next(error)
//     }
// }

exports.makeAComplaint = async (req, res, next) => {
    try {

        for (let i = 0; i < req.body.complaint_details.length; i++) {
            const element = req.body.complaint_details[i];
            const complaint = await Complaint.findOne({ where: { id: element.complaintId } })
            dataNotFound(complaint, 400, 'Complaint Not Exists')
        }

        const exists_complaint = await ComplaintTask.findOne({
            where: {
                customerId: req.body.customerId
            },
            order: [["id", "DESC"]]
        })
        if ((exists_complaint && (exists_complaint.status == "active" || exists_complaint.status == "pending"))) {
            return res.status(400).json({
                message: "Your previous complaint is already in proccess",
                status: false
            })
        }

        const check = await ComplaintTask.create({
            scheduleId: req.body.scheduleId,
            enquiryId: req.body.enquiryId,
            status: "pending",
            date: req.body.date,
            remark: JSON.stringify([req.body.remark]),
            complaint_info: JSON.stringify(req.body.complaint_details),
            customerId: req.body.customerId
        });


        if(req.body.enquiryId){
            const enquiry = await Enquiry.findOne({ where: { id: req.body.enquiryId } })
    
            await EnquiryStatus.create({
                remark: "complaint raised",
                status: "completed",
                enquiryId: enquiry.id
            })
        }

        ////////***************** COMPLAINT REGISTERAION MESSAGE ****************////////////////////////
        const customer = await Customer.findOne({ where: { id: req.body.customerId } })
        const message = complaint_register_msg(customer.firstName+ " "+ customer.lastName)
        whatsappMessage(message, customer.primary_phone)
        ////////***************** COMPLAINT REGISTERAION MESSAGE ****************////////////////////////
         
        return res.status(200).json({
            message: "Slot book Successfully",
            data: check,
            status: true
        })


    } catch (error) {
        next(error)
    }
}

exports.addComplaintImages = async (req, res, next) => {
    try {
        const { file, body } = await UploadFile(req, "complaint");
        
        const complaint = await ComplaintTask.findByPk(req.params.id)
        dataNotFound(complaint, "Complaint not found", 400);
        
        const img = complaint.images ? complaint.images : [];
        
        const new_images = [];
        
        for (var i = 0; i < file.length; i++) {
            new_images.push(file[i].path) 
        }
        
        await complaint.update({images: [...img, ...new_images]})
        return res.status(200).json({
            message: "Images add Successfully",
            data: new_images,
            status: true
        })

    } catch (e) {
        next(e) 
    }
}

exports.deleteComplaintImages = async (req, res, next) =>{
    try {
        const complaint = await ComplaintTask.findByPk(req.params.id)
        dataNotFound(complaint, "Complaint not found", 400);
        
        const img = complaint.images ? complaint.images : [];
        
        if(img.includes(req.body.img_url)){
            
            await removefile(req.body.img_url)
            
            if(img.length == 1) {
                await complaint.update({images: []});
            } else {
                const changedArray = img.filter((value) => value === req.body.img_url);
              
                await complaint.update({images: changedArray});
            }
            
            return res.status(200).json({
                message: "Images delete Successfully",
                data: complaint.images,
                status: true
            })
        }else{
            return res.status(400).json({
                message: "Images not found",
                status: false
            })
        }
    } catch (e) {
        next(e)
    }
}

exports.addFeedback = async (req, res, next) => {
    try {
        const check = await Feedback.findOne({ where: { enquiryId: req.body.enquiryId } })
        dataFound(check, 400, "You are already send a feedback on this enquiry")
        const feedback = await Feedback.create({
            description: JSON.stringify(req.body.description),
            enquiryId: req.body.enquiryId
        })
        await EnquiryStatus.create({
            remark: "Client Feedback Completed",
            status: "completed",
            enquiryId: req.body.enquiryId
        })

        return res.status(200).json({
            message: "Feedback Sent Successfully",
            data: feedback,
            status: true
        })

    } catch (error) {
        next(error)
    }
}

exports.getFeedback = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.pageSize) || 10;
        const page = parseInt(req.query.pageNo) || 1;
        
        const offset = (page - 1) * limit;
        
        const salesPersonIdFromQuery = req.query.salesId || '';
        const salesPersonIds = [];
        let stores;
        
        if(salesPersonIdFromQuery){
            salesPersonIds.push(salesPersonIdFromQuery)
        }else{
            if (req.query.storeId) {
                stores = await User.findAll({ where: { id: req.query.storeId } });
            } else {
                stores = await User.findAll({ where: { type: "outlet" } });
            }
            dataNotFound(stores[0], 404, "Store Not Found");
    
            
            for (let i = 0; i < stores.length; i++) {
                const store = stores[i];
                const storeSalesPersons = await OutletUser.findAll({
                    where: { outletId: store.id },
                });
    
                for (let j = 0; j < storeSalesPersons.length; j++) {
                    const storeSalesPerson = storeSalesPersons[j];
                    
                    if(storeSalesPerson){
                        salesPersonIds.push(storeSalesPerson.dataValues.salesPersonId)
                    }
                    
                }
            }   
        }
        
        const feedback = await Feedback.findAndCountAll({
            include: {
                model: Enquiry,where:{salesId:{[Op.in]: salesPersonIds}}, include: [
                    { model: Customer },
                    { model: User, attributes: { exclude: ['password', 'accessToken'] } }
                ]
            },
            limit,offset,
            order: [['createdAt', 'DESC']]
        })
        
        const totalPages = Math.ceil(feedback.count / limit);
    
        return res.status(200).json({
            message: "All Feedback Fatched Successfully",
            data: feedback.rows,
            status: true,
            pagination: {
                currentPage: page,
                perPage: limit,
                total: feedback.count,
                totalPages: totalPages,
            },
        })
    } catch (error) {
        next(error)
    }
}


exports.sendMessage = async (req, res, next) => {
    try {
        const enquiry = await Enquiry.findOne({ where: { id: req.query.enquiryId }, include: Customer })
        const customer = await Customer.findOne({ where: { id: enquiry.customerId } })
     
       
        const message = feedback_message(customer.firstName + ' ' + customer.lastName, enquiry.id)
        whatsappMessage(message, customer.primary_phone)

        return res.status(200).json({
            message: "Message send Successfully",
            status: true
        })
    } catch (error) {
        next(error)
    }
}

exports.sendInstallationMessage = async (req, res, next) =>{
    try {
        const enquiry = await Enquiry.findOne({ where: { id: req.params.enquiryId } })
        
        if(enquiry){
            const customer = await Customer.findOne({ where: { id: enquiry.customerId } })
            const message_data = await Message.findOne({ where: { enquiryId: enquiry.id, message: 'book_installation_time_slot' } });
            const order = await Order.findOne({ where: { enquiryId: enquiry.id } });

            if (!message_data && customer) {
                await Message.create({
                    message: 'book_installation_time_slot',
                    enquiryId: enquiry.id,
                });
                
                const message = book_installation_time_slot(`${customer.firstName} ${customer.lastName}`, "order.orderId" ,enquiry.id);
                whatsappMessage(message, "8386059147");
            }
           
            return res.status(200).json({
                message: "Message send Successfully",
                status: true
            })
        } else {
            return res.status(400).json({
                message: "Enquiry not found",
                status: false
            })
        }
        
        
    } catch (e) {
        next(e)
    }
}


exports.measurerSlotBooking = async (req, res, next) => {
    try {
        const enquirySchedule = await Enquiry_Schedule.findOne({
            where: {
                enquiryId: req.body.enquiryId,
            }
        })
        if (enquirySchedule && (enquirySchedule.status == "accepted" || enquirySchedule.status == "completed" || enquirySchedule.status == "pending")) {
            return res.status(400).json({
                message: "Measurer Already Assigned",
                status: false
            })
        }
        if (enquirySchedule && enquirySchedule.status == "slot_booked") {
            return res.status(400).json({
                message: "You are already slot booked in this enquiry",
                status: false
            })
        }

        const check = await Enquiry_Schedule.create({
            ScheduleId: req.body.ScheduleId,
            enquiryId: req.body.enquiryId,
            status: "slot_booked",
            date: req.body.date
        });


        await EnquiryStatus.create({
            remark: "Measurer Slot Booked",
            status: "completed",
            enquiryId: enquiry.id
        })
        res.status(200).json({
            message: "Measurer Slot Booked Successfully",
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

exports.get_measurer_slot = async (req, res, next) => {
    try {
        const pageNo = parseInt(req.query.pageNo) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const offset = (pageNo - 1) * pageSize;

        const measurer_slot = await Enquiry_Schedule.findAll({
            where: { status: 'slot_booked' },
            include: [
                {
                    model: Enquiry,
                    include: [
                        { model: Customer },
                        { model: User, attributes: { exclude: ['password', 'accessToken', 'image'] } },
                    ],
                },
                { model: Schedule }
            ],
            offset: offset,
            limit: pageSize,
        });

        res.status(200).json({
            message: "measurer slots",
            data: measurer_slot,
            status: true,
            pagination: {
                currentPage: pageNo,
                perPage: pageSize,
                totalItems: measurer_slot.length,
            },
        });


    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}


exports.installer_slot_booking = async (req, res, next) => {
    try {
        const enquirySchedule = await InstallerTasks.findOne({
            where: {
                enquiryId: req.body.enquiryId
            },
            order: [["id", "DESC"]]
        })
        dataFound(enquirySchedule && enquirySchedule.status == "slot_booked", 400, "You are already slot booked in this enquiry")

        if ((enquirySchedule && (enquirySchedule.status == "completed" || enquirySchedule.status == "pending"))) {
            throw new Error("Installer Already Assigned.")
        }

        const check = await InstallerTasks.create({
            scheduleId: req.body.scheduleId,
            enquiryId: req.body.enquiryId,
            status: "slot_booked",
            date: req.body.date,
            customerId: req.body.customerId
        });

        const enquiry = await Enquiry.findOne({ where: { id: req.body.enquiryId }, include: [Customer] })

        await EnquiryStatus.create({
            remark: "Installer Slot Booked",
            status: "completed",
            enquiryId: enquiry.id
        })

        res.status(200).json({
            message: "slot booked Successfully",
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

exports.get_installer_slot = async (req, res, next) => {
    try {
        const pageNo = parseInt(req.query.pageNo) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const offset = (pageNo - 1) * pageSize;

        const installer = await InstallerTasks.findAll({
            where: { status: 'slot_booked' },
            include: [
                {
                    model: Enquiry,
                    include: [
                        { model: Customer },
                        { model: User, attributes: { exclude: ['password', 'accessToken', 'image'] } },
                    ],
                },
                { model: Schedule }
            ],
            offset: offset,
            limit: pageSize,
        });

        res.status(200).json({
            message: "installer slots",
            data: installer,
            status: true,
            pagination: {
                currentPage: pageNo,
                perPage: pageSize,
                totalItems: installer.length,
            },
        });


    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}


exports.assign_installer_for_complaint = async (req, res, next) => {
    try {
        const data = await User.findOne({
            where: { id: req.body.installerId }
        });

        if (!data) throw new Error('schedule Person not found');

        const enquirySchedule = await ComplaintTask.findOne({
            where: {
                id: req.body.complaintId
            }
        })
        if ((enquirySchedule && ( enquirySchedule.status == "completed") && enquirySchedule.installerId == data.id)) {
            throw new Error("Installer Already Assigned.")
        }

        await enquirySchedule.update({
            scheduleId: req.body.scheduleId,
            enquiryId: enquirySchedule.enquiryId,
            status: "active",
            installerId: req.body.installerId,
            date: req.body.date,
            warehouseId: req.body.warehouseId,
            customerId: req.body.customerId
        })

        if(req.body.enquiryId){
            const enquiry = await Enquiry.findOne({ where: { id: enquirySchedule.enquiryId }, include: [Customer] })
    
            await EnquiryStatus.create({
                remark: "Installer Assigned For Complaint",
                status: "completed",
                enquiryId: enquiry.id
            })
        }
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

exports.addComplaintRemark = async (req, res, next) => {
    try {
        const complaint_task = await ComplaintTask.findOne({ where: { id: req.body.complaint_id } });
        const data = JSON.parse(complaint_task.remark)

        const arr = []
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                const oldremark = data[i]
                arr.push(oldremark)
            }
        }
        arr.push(req.body.remark);

        await complaint_task.update({ remark: JSON.stringify(arr) });

        res.status(200).json({
            message: "Remark added successfully",
            data: complaint_task,
            status: true
        });

    } catch (e) {
        next(e)
    }
}

exports.walkinData = async (req, res, next) =>{
    try {
        const customer_type = ["New", "Repeat"]
        const customer_group = ["Retail", "Int-Arch"]
        const schedule_update = ["Busy", "Travelling", "Didn’t pick the call", "Visit Schedule", "Not Interested Anymore"]
        const category = ["Curtains","Sheers", "Upholstery", "Bed Linen", "Bath Linen", "Rugs", "W2W Carpets", "Wood Flooring", "Furniture", "Mattress", "Wall Paper", "Décor item", "Blinds"]
        const followUp = ["Follow up 1", "Follow up 2", "Follow up 3"]
        const customer_status = ["Win", "Loss", "Follow up"]
        const win_remark = [ "Enq Genereated", "Puschase only Fabric", "Puschase only linen"]
        const loss_remark = ["High Price", "Design", "Browsing arround", "Looking for Customization"]
        const query_register_for = ["Information for Single Product", "Home Renovation", "New Home"]
        
        res.status(200).json({
            message: "Walkin data fatched successfully",
            data: { customer_type, customer_group, category, followUp, schedule_update, customer_status, win_remark, loss_remark, query_register_for },
            status: true
        });
    } catch (e) {
        next(e)
    }
}

exports.addClient = async (req, res, next) => {
    try {
        const identification = await Identification.findOne({
            where: { mobileNo: req.body.mobileNo, clientName: req.body.clientName },
        });
        dataFound(identification, 403, "user already exist");
        const client = await Identification.create({
            clientName: req.body.clientName,
            mobileNo: req.body.mobileNo,
            email: req.body.email,
            adress: req.body.adress,
            customerType: req.body.customerType,
            customerGroup: req.body.customerGroup,
            category: JSON.stringify(req.body.category),
            query_register: req.body.query_register,
            pin_code: req.body.pin_code,
            followUp: req.body.followUp,
            date: req.body.date,
            updates: req.body.scheduleUpdate,
            customerStatus: req.body.customerStatus,
            remarks: req.body.remarks,
            business: req.body.business,
            enquiryId: req.body.enquiryId,
            salesId: req.userId
        });
        res.status(200).json({
            status: true,
            data: client,
            message: "client added"
        });
    } catch (e) {next(e)}
 
};

exports.getClient = async (req, res, next) => {
 
    const salesPersonIdFromQuery = req.query.salesId;
        const salesPersonIds = [];
        let stores;
        
        const user = await User.findByPk(req.userId)
        if(user.type == "sales-person" || salesPersonIdFromQuery){
            salesPersonIds.push(req.userId)
            salesPersonIds.push(salesPersonIdFromQuery)
        }else{
            if (req.query.storeId) {
                stores = await User.findAll({ where: { id: req.query.storeId } });
            } else {
                stores = await User.findAll({ where: { type: "outlet" } });
            }
            dataNotFound(stores[0], 404, "Store Not Found");
    
            
            for (let i = 0; i < stores.length; i++) {
                const store = stores[i];
                const storeSalesPersons = await OutletUser.findAll({
                    where: { outletId: store.id },
                });
    
                for (let j = 0; j < storeSalesPersons.length; j++) {
                    const storeSalesPerson = storeSalesPersons[j];
                    
                    if(storeSalesPerson){
                        salesPersonIds.push(storeSalesPerson.dataValues.salesPersonId)
                    }
                    
                }
            }   
        }
    
    const client = await Identification.findAll({where: { salesId: {[Op.in]: salesPersonIds} }})
    dataNotFound(client, 404, "client not found")
    res.status(200).json({
        status: true,
        data: client,
        message: "client fetched"
    })
}
exports.deleteClient = async (req, res, next) => {
    const isFound = await Identification.findOne({ where: { id: req.params.id } })
    dataNotFound(isFound, 404, 'client not found')
    const client = await Identification.destroy({ where: { id: req.params.id } })
    res.status(200).json({
        status: true,
        data: [],
        message: "deleted successfully "
    })
}
exports.getClientById = async (req, res, next) => {
    const client = await Identification.findOne({ where: { id: req.params.id } })
    dataNotFound(client, 404, "client not found")
    res.status(200).json({
        status: true,
        data: client,
        message: "client found"
    })
}
exports.updateClient = async (req, res, next) => {
    const client = await Identification.findOne({ where: { id: req.params.id } })
    dataNotFound(client, 404, "client not found")
    
    await client.update({
            clientName: req.body.clientName,
            mobileNo: req.body.mobileNo,
            adress: req.body.adress,
            email: req.body.email,
            customerType: req.body.customerType,
            customerGroup: req.body.customerGroup,
            category: JSON.stringify(req.body.category),
            query_register: req.body.query_register,
            pin_code: req.body.pin_code,
            followUp: req.body.followUp,
            date: req.body.date,
            updates: req.body.scheduleUpdate,
            customerStatus: req.body.customerStatus,
            remarks: req.body.remarks,
            business: req.body.business,
            enquiryId: req.body.enquiryId
        });
        res.status(200).json({
            status: true,
            data: client,
            message: "client updated"
        });
}

exports.walkinDashboard = async (req, res, next)=>{
    try {
        let fromDate = req.query.fromDate;
        const toDate = req.query.toDate || new Date();
    
        fromDate = fromDate ? fromDate : new Date('2021-01-01')
        
        const whereCondition = {};
        const date_filter = {}
        if (fromDate && toDate) {
            date_filter.createdAt = { [Op.gte]: new Date(fromDate), [Op.lte]: new Date(toDate) }
        }
        const outletId = []
        if (req.query.storeId) {
            const data = await OutletUser.findAll({ where: { outletId: req.query.storeId } })
            data.forEach(element => {
                outletId.push(element.salesPersonId)
            });
        }
       
        let userInclude = {};
        if (req.query.storeId && outletId.length > 0) {
            userInclude = {
                model: User,
                where: {
                    id: outletId
                }
            };
        } else if (!req.query.storeId) {
            userInclude = { model: User };
        } else {
            userInclude = { model: User, where: { id: outletId } }
        }
        
        const customer_status = new Object();
        const customer_type = new Object();
        const customer_group = new Object();
        const followUp =  new Object();
        
        let customer_win = 0;
        let customer_loss = 0;
        let customer_followUp = 0;
        
        let new_customer = 0;
        let repeat_customer = 0;
        
        let retail_customer = 0;
        let int_arch_customer = 0;
        
        let followUp1 = 0;
        let followUp2 = 0;
        let followUp3 = 0;
        
        const dashboard = await Identification.findAll({ where: {...date_filter, ...whereCondition }, include: userInclude})
        
        let total_client = dashboard.length;
        for (var i = 0; i < dashboard.length; i++) {
            const item = dashboard[i]
            
            if(item){
                customer_win = item.customerStatus == "Win" ? customer_win+1: customer_win+0;
                customer_loss = item.customerStatus == "Loss" ? customer_loss+1: customer_loss+0;
                customer_followUp = item.customerStatus == "Follow up" ? customer_followUp+1: customer_followUp+0;
                
                new_customer = item.customerType == "New" ? new_customer+1: new_customer+0;
                repeat_customer = item.customerType == "Repeat" ? repeat_customer+1: repeat_customer+0;
                
                retail_customer = item.customerGroup == "Retail" ? retail_customer+1: retail_customer+0;
                int_arch_customer = item.customerGroup == "Int-Arch" ? int_arch_customer+1: int_arch_customer+0;
                
                followUp1 = item.followUp == "Follow up 1" ? followUp1+1: followUp1+0;
                followUp2 = item.followUp == "Follow up 2" ? followUp2+1: followUp2+0;
                followUp3 = item.followUp == "Follow up 3" ? followUp3+1: followUp3+0;
            }
            
        }
        
        customer_status.customer_win = customer_win
        customer_status.customer_loss = customer_loss
        customer_status.customer_followUp = customer_followUp
        
        customer_type.new_customer = new_customer
        customer_type.repeat_customer = repeat_customer
        
        customer_group.retail_customer = retail_customer
        customer_group.int_arch_customer = int_arch_customer
        
        followUp.followUp1 = followUp1
        followUp.followUp2 = followUp2
        followUp.followUp3 = followUp3
        
        
        res.status(200).json({
            status: true,
            message: "Data fetched",
            data: {total_client, customer_status, customer_type, customer_group, followUp}
        });
    } catch (e) {
        next(e)
    }
}

const Excel = require('exceljs');

exports.walkinReportExcel = async (req, res, next) => {
    try {
         const outletId = []
        if (req.query.storeId) {
            const data = await OutletUser.findAll({ where: { outletId: req.query.storeId } })
            data.forEach(element => {
                outletId.push(element.salesPersonId)
            });
        }
       
        let userInclude = [];
        if (req.query.storeId && outletId.length > 0) {
            userInclude.push({
                model: User,
                where: {
                    id: outletId
                }
            });
        } else if (!req.query.storeId) {
            userInclude.push({ model: User });
        } else {
            userInclude.push({ model: User, where: { id: outletId } });
        }
        
        // Adding the additional 'sales' model to the include array
        userInclude.push({ model: User });

        
        const data = await Identification.findAll({include: userInclude, order: [['id', 'DESC']] });

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Walkin_Report');
        const headerAlignment = { horizontal: 'left' };

        worksheet.columns = [
            { header: 'Sr No', key: 'sr', width: 5, style: { alignment: headerAlignment } },
            { header: 'Name', key: 'name', width: 30, style: { alignment: headerAlignment } },
            { header: 'Email', key: 'email', width: 30, style: { alignment: headerAlignment } },
            { header: 'Mobile', key: 'mobile', width: 20, style: { alignment: headerAlignment } },
            { header: 'Sales Person', key: 'sales_person', width: 15, style: { alignment: headerAlignment } },
            { header: 'Address', key: 'address', width: 30, style: { alignment: headerAlignment } },
            { header: 'Customer Type', key: 'customerType', width: 20, style: { alignment: headerAlignment } },
            { header: 'Customer Group', key: 'customerGroup', width: 20, style: { alignment: headerAlignment } },
            { header: 'Category', key: 'category', width: 20, style: { alignment: headerAlignment } },
            { header: 'FollowUp', key: 'followUp', width: 20, style: { alignment: headerAlignment } },
            { header: 'Date', key: 'date', width: 15, style: { alignment: headerAlignment } },
            { header: 'Update', key: 'update', width: 30, style: { alignment: headerAlignment } },
            { header: 'Customer Status', key: 'customerStatus', width: 20, style: { alignment: headerAlignment } },
            { header: 'Remarks', key: 'remarks', width: 30, style: { alignment: headerAlignment } },
            { header: 'Business', key: 'business', width: 15, style: { alignment: headerAlignment } },
            { header: 'Store', key: 'store', width: 30, style: { alignment: headerAlignment } },
        ];

        for (var i = 0; i < data.length; i++) {
            const item = data[i]
            const store = await OutletUser.findOne({ where: { salesPersonId: item.user.id }, include: [{ model: User, as: 'outlet' } ] });
            
            const row = worksheet.addRow({
                sr: i+1,
                name: item.clientName,
                email: item.email,
                mobile: item.mobileNo,
                sales_person: item.user.firstName + " " + item.user.lastName,
                address: item.adress,
                // pin_code: item.pin_code,
                customerType: item.customerType,
                customerGroup: item.customerGroup,
                category: item.category ? JSON.parse(item.category).join(", ") : "N/A",
                followUp: item.followUp,
                date: item.date,
                update: item.updates,
                customerStatus: item.customerStatus,
                remarks: item.remarks,
                business: item.business,
                store: store.outlet.firstName
            });
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = headerAlignment;
            });
        }

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename= Walkin_report.xlsx"
        );

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (e) {
        next(e);
    }
};


