const { Quality_Check, Quality_Check_Remarks, User, Enquiry, QualityCheckType,Customer, Material, UserQualityDetail, Order, OrderItem, EnquiryStatus , Message} = require('../model');
const QualityCheckRemark = require('../model/quality-check-remarks');
const { dataNotFound, dataFound} = require("../helper/functions");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { sendMail } = require("../helper/mailer")
const { bill_submission } = require("../helper/mail")
const  axios  = require("axios");
const { whatsappMessage } = require('../helper/mailer');
const { book_installation_time_slot, Qc1_message_without_payment, Qc1_message_with_payment, Qc3_message_with_payemnt } = require('../helper/messages');
const { sendPaymentLink, checkPendingPayments } = require("../helper/payment");
const { customerOutstandingAmount, enquiryOutstandingAmount } = require("../helper/ax-function");

exports.createQualityCheck = async (req, res, next) => {
    try {
        const { checks, description, quality_check_type, product_type } = req.body;
        const qualityCheck = await Quality_Check.create({
            checks,
            description,
            quality_check_type,
            product_type
        });
        res.status(201).json({
            message: "Quality Check Created Successfully",
            qualityCheck,
            status: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.updateQualityCheck = async (req, res, next) => {
    try {
        const { checks, description, quality_check_type } = req.body;
        const qualityCheck = await Quality_Check.update({
            checks,
            description,
            quality_check_type
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(201).json({
            message: "Quality Check Updated Successfully",
            qualityCheck,
            status: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

exports.getAllQualityChecks = async (req, res, next) => {
    try {
        const qualityChecks = await QualityCheckType.findAll();
        res.status(200).json({
            message: "All Quality Checks Fetched Successfully",
            data: qualityChecks,
            status: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


exports.getQualityChecks = async (req, res, next) => {
    try {
        const product_type = req.body.product_type;
        const material = await Quality_Check.findAll({
            where: { product_type: {[Op.in]: product_type}, quality_check_type: req.query.qc },
         });
        res.status(200).json({
            message: "All Quality Checks Fetched Successfully",
            data: material,
            status: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

exports.getAQualityCheck = async (req, res, next) => {
    try {
        const qc = await QualityCheckType.findAll()

        const material = await Material.findAll({ include: { model: Quality_Check, include: Material } });

        const obj = new Object();

        for (let i = 0; i < material.length; i++) {
            for (let j = 0; j < material[i].quality_check_details.length; j++) {
                if (material[i].quality_check_details.length > 0) {
                    for (let k = 0; k < qc.length; k++) {
                        if (material[i].quality_check_details[j].quality_check_type == qc[k].id) {
                            if (obj.hasOwnProperty(qc[k].quality_check_type)) {
                                obj[qc[k].quality_check_type].push(material[i].quality_check_details[j])
                            }
                            else {
                                obj[qc[k].quality_check_type] = [material[i].quality_check_details[j]]
                            }
                        }
                    }
                }
            }
        }

        res.status(200).json({
            message: "Quality Check Fetched Successfully",
            data: obj,
            status: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.deleteQualityCheck = async (req, res, next) => {
    try {
        const qualityCheck = await Quality_Check.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({
            message: "Quality Check Deleted Successfully",
            qualityCheck,
            status: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.blockQualityCheck = async (req, res, next) => {
    try {
        const qualityCheck = await Quality_Check.findOne({
            where: {
                id: req.params.id
            }
        });
        if (qualityCheck.status == false) {
            qualityCheck.update({
                status: true
            })
        }
        else {
            qualityCheck.update({
                status: false
            })
        }
        res.status(200).json({
            message: "Check status update Successfully",
            qualityCheck,
            status: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.CheckQuality = async (req, res, next) => {
    try {
        const QualityCheck = await UserQualityDetail.findOne({ where: { descriptionId: req.params.id, enquiryId: req.body.enquiryId, orderItemId: req.body.orderItemId } });
        const description = await Quality_Check.findOne({ where: { id: req.params.id }, include: [QualityCheckType] })
        
        if (QualityCheck) {
            QualityCheck.update({
                isChecked: req.body.isChecked,
                userId: req.userId,
                orderItemId: req.body.orderItemId,
                QCId: description.quality_type.id

            })
            return res.status(200).json({
                message: "Check status update Successfully",
                status: true,
                data: QualityCheck
            });
        }
        else {
            const description = await Quality_Check.findOne({ where: { id: req.params.id }, include: [QualityCheckType] })
           
            const newQualityCheck = await UserQualityDetail.create({
                isChecked: req.body.isChecked,
                descriptionId: req.params.id,
                enquiryId: req.body.enquiryId,
                userId: req.userId,
                orderItemId: req.body.orderItemId,
                QCId: description.quality_type.id
            })
            return res.status(200).json({
                message: "Quality Check Created Successfully",
                data: newQualityCheck,
                status: true
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const onlyQc1ItemTypes = [
    "primary_track",
    "primary_track_motor",
    "primary_track_remote",
    "secondary_track",
    "secondary_track_motor",
    "secondary_track_remote",
    "mock_track",
    "mock_track_motor",
    "mock_track_remote",
    "primary_rod",
    "secondary_rod",
    "blind_track",
    "blind_track_remote",
    "blind_track_motor",
    "extra_bracket",
    "end_cap_wall_support",
    "rod_tieknob",
    "finial",
    "blind_type_search_fabric",

    "sofa_primary_fabric",
    "sofa_secondary_fabric",
    "sofa_piping_fabric",
    "mural",
    "wallpaper",
    "carpet",
    "binding",
    "skirting",
    "reducer",
    "t_profile",
    "beeding",
    "flooring"
]

exports.submitRemarks = async (req, res, next) => {
    try {
        const remarkedCheck = await QualityCheckRemark.findOne({ where: { orderItemId: req.body.orderItemId, enquiryId: req.body.enquiryId, QCId: req.body.QCId } })
       
        const orderitem = await OrderItem.findOne({ where: { id: req.body.orderItemId } })
        
        if (!orderitem) {
            return res.status(404).json({
                message: "No OrderItem Found",
                status: false
            });
        }
        
        const order = await Order.findOne({where: {id: orderitem.orderId}});
        dataNotFound(order, 400, "Order not found");
        
        if(req.body.status == "rejected"){
            await order.update({
                orderStatus: 'rejected',
                remark: req.body.remark
            })
            
            await orderitem.update({
                status: 'rejected'
            })
        }
        if(req.body.status == "completed"){
            
            await orderitem.update({
                status: 'accepted'
            })
            
            const rejectedOrder = await OrderItem.findOne({where: {orderId: orderitem.orderId, status: "rejected"}});
            if(!rejectedOrder){
                await order.update({    
                    orderStatus: 'accepted',
                    remark: req.body.remark
                })
            }
        }
        
        const isQc1OnlyType = onlyQc1ItemTypes.includes(orderitem.sta_id);
        if (remarkedCheck) {
            const quality_check_remarks = await Quality_Check_Remarks.findOne({where:{id: remarkedCheck.id}});
             
            const remark = quality_check_remarks ? quality_check_remarks.remark : ''; 
            const new_remark = req.body.remark;
          
            const combined_remark = remark ? `${remark},${new_remark}` : new_remark;

            
            await quality_check_remarks.update({
                remark: req.body.remark,
                qcDone: req.body.qcDone,
                status: req.body.status
            })
            
            if(req.body.QCId == 3 && req.body.qcDone == true){
                await orderitem.update({status: "completed"})
            }
            
             
            if(isQc1OnlyType && req.body.QCId == 1 && quality_check_remarks.qcDone == true){
                // Perform QC 2 and QC 3 updates for QC 1 only item types
                await orderitem.update({status: "completed"});
                await QualityCheckRemark.create({
                    orderItemId: req.body.orderItemId,
                    enquiryId: req.body.enquiryId,
                    remark: "Auto completed after QC1",
                    qcDone: true,
                    QCId: 2,
                    status: 'completed'
                });
                await QualityCheckRemark.create({
                    orderItemId: req.body.orderItemId,
                    enquiryId: req.body.enquiryId,
                    remark: "Auto completed after QC1",
                    qcDone: true,
                    QCId: 3,
                    status: 'completed'
                });
            }

        }
        else {

            const newCheck = await QualityCheckRemark.create({
                orderItemId: req.body.orderItemId,
                enquiryId: req.body.enquiryId,
                remark: req.body.remark,
                qcDone: req.body.qcDone,
                QCId: req.body.QCId,
                status: req.body.status
            })

            if(req.body.QCId == 3 && req.body.qcDone == true){
                await orderitem.update({status: "completed"})
            }
            
            if(isQc1OnlyType && req.body.QCId == 1 && newCheck.qcDone == true){
                // Perform QC 2 and QC 3 updates for QC 1 only item types
                await orderitem.update({status: "completed"});
                await QualityCheckRemark.create({
                    orderItemId: req.body.orderItemId,
                    enquiryId: req.body.enquiryId,
                    remark: "Auto completed after QC1",
                    qcDone: true,
                    QCId: 2,
                    status: 'completed'
                });
                await QualityCheckRemark.create({
                    orderItemId: req.body.orderItemId,
                    enquiryId: req.body.enquiryId,
                    remark: "Auto completed after QC1",
                    qcDone: true,
                    QCId: 3,
                    status: 'completed'
                });
            }

        }
        
        const orderitems = await OrderItem.findAll({where: {orderId: order.id}});
        
        let qc1Count = 0;
        let qc2Count = 0;
        let qc3Count = 0;
 
        if(req.body.QCId == 1){
            qc1Count = await Quality_Check_Remarks.count({where: {enquiryId: order.enquiryId, QCId: req.body.QCId, status: "completed"}});
        }
        qc2Count = await Quality_Check_Remarks.count({where: {enquiryId: order.enquiryId, QCId: 2, status: "completed"}});

        qc3Count = await Quality_Check_Remarks.count({where: {enquiryId: order.enquiryId, QCId: 3, status: "completed"}});

        if(orderitems.length == qc1Count){
            if (order.QC1 == false) {
                await order.update({
                    QC1: true,
                    QC_Start: new Date()
                })
                await EnquiryStatus.create({
                    status: "completed",
                    remark: "Material rec. at warehouse",
                    enquiryId: order.enquiryId
                });
                
                const message_data = await Message.findOne({ where: { enquiryId: order.enquiryId, message: 'Qc1_material_received' } })
                if (!message_data) {
                    const customer = await Customer.findOne({ where: { id: order.customerId } });
                    
                    await Message.create({
                        message: "Qc1_material_received",
                        enquiryId: order.enquiryId
                    })
                    
                    
                    const data = await customerOutstandingAmount(customer.ACCOUNTNUM)
                    const amount = data.openSoAmount + data.ledgerAmount;
                    console.log(amount, order.enquiryId, "-----------------------")
                    if (amount && amount > 0 ){
                        
                        const data = await sendPaymentLink(order.enquiryId, amount, "order_complete");
                        const paymentLink = data &&  data.short_url
                        
                        const message = Qc1_message_with_payment(customer.firstName + ' ' + customer.lastName, order.enquiryId, paymentLink, amount)
                        whatsappMessage(message, customer.primary_phone)
                    } else {
                        
                        const message = Qc1_message_without_payment(customer.firstName + ' ' + customer.lastName, order.enquiryId)
                        whatsappMessage(message, customer.primary_phone)
                    }
                    
                }
            }
        }
        if(orderitems.length == qc2Count){
            if (order.QC2 == false) {
                await order.update({
                    QC2: true,
                    QC2_Completed: new Date()
                })

                await EnquiryStatus.create({
                    status: "completed",
                    remark: "QC 2 completed",
                    enquiryId: order.enquiryId
                });
            }
        }
        if(orderitems.length == qc3Count){
            if (order.QC3 == false) {
                await order.update({
                    QC3: true,
                    QC_Complete: new Date()
                })
            }
        }
        
        return res.status(200).json({
            message: "Remarks submitted Successfully",
            status: true
        });
        
    } catch (error) {
        next(error)
        // return res.status(500).json({
        //     message: error.message
        // });
    }
}

exports.submitMultipleQc = async (req, res, next) => {
    try {
        const orderItems = req.body.orderItems;
        
        const order = await Order.findOne({where: { enquiryId: req.body.enquiryId }});
        dataNotFound(order, 400, "Order not found");
        
        
        for (var i = 0; i < orderItems.length; i++) {
            const item = orderItems[i];
            
            const remarkedCheck = await QualityCheckRemark.findOne({ where: { orderItemId: item.orderItemId, enquiryId: req.body.enquiryId, QCId: req.body.QCId } })
            
            const orderitem = await OrderItem.findOne({ where: { id: item.orderItemId } })
            
            if (!orderitem) {
                    return res.status(404).json({
                        message: "No OrderItem Found",
                        status: false
                    });
                }
                
            if(item.status == "rejected"){
                await order.update({
                    orderStatus: 'rejected',
                    remark: item.remark
                })
                
                await orderitem.update({
                    status: 'rejected'
                })
            }
            
            if(item.status == "completed"){
                
                await orderitem.update({
                    status: 'accepted'
                })
                
                const rejectedOrder = await OrderItem.findOne({where: {orderId: orderitem.orderId, status: "rejected"}});
                if(!rejectedOrder){
                    await order.update({    
                        orderStatus: 'accepted',
                        remark: item.remark
                    })
                }
            }
                
            const isQc1OnlyType = onlyQc1ItemTypes.includes(orderitem.sta_id);
            if (remarkedCheck) {
                const quality_check_remarks = await Quality_Check_Remarks.findOne({where:{id: remarkedCheck.id}});
                 
                const remark = quality_check_remarks ? quality_check_remarks.remark : ''; 
                const new_remark = item.remark;
              
                const combined_remark = remark ? `${remark},${new_remark}` : new_remark;
    
                
                await quality_check_remarks.update({
                    remark: item.remark,
                    qcDone: item.qcDone,
                    status: item.status
                })
                
                if(req.body.QCId == 3 && item.qcDone == true){
                    await orderitem.update({status: "completed"})
                }
                
                if(isQc1OnlyType && req.body.QCId == 1 && item.qcDone == true){
                    // Perform QC 2 and QC 3 updates for QC 1 only item types
                    await orderitem.update({status: "completed"});
                    await QualityCheckRemark.create({
                        orderItemId: item.orderItemId,
                        enquiryId: req.body.enquiryId,
                        remark: "Auto completed after QC1",
                        qcDone: true,
                        QCId: 2,
                        status: 'completed'
                    });
                    await QualityCheckRemark.create({
                        orderItemId: item.orderItemId,
                        enquiryId: req.body.enquiryId,
                        remark: "Auto completed after QC1",
                        qcDone: true,
                        QCId: 3,
                        status: 'completed'
                    });
                }
    
            }
            else {
    
                const newCheck = await QualityCheckRemark.create({
                    orderItemId: item.orderItemId,
                    enquiryId: req.body.enquiryId,
                    remark: item.remark,
                    qcDone: item.qcDone,
                    QCId: req.body.QCId,
                    status: item.status
                })
                
                if(isQc1OnlyType && req.body.QCId == 1 && item.qcDone == true){
                    // Perform QC 2 and QC 3 updates for QC 1 only item types
                    await orderitem.update({status: "completed"});
                    await QualityCheckRemark.create({
                        orderItemId: item.orderItemId,
                        enquiryId: req.body.enquiryId,
                        remark: "Auto completed after QC1",
                        qcDone: true,
                        QCId: 2,
                        status: 'completed'
                    });
                    await QualityCheckRemark.create({
                        orderItemId: item.orderItemId,
                        enquiryId: req.body.enquiryId,
                        remark: "Auto completed after QC1",
                        qcDone: true,
                        QCId: 3,
                        status: 'completed'
                    });
                }
    
                if(req.body.QCId == 3 && item.qcDone == true){
                    await orderitem.update({status: "completed"})
                }
    
            }
            
        }
        
        const orderitems = await OrderItem.findAll({where: {orderId: order.id}});
        
        let qc1Count = 0;
        let qc2Count = 0;
        let qc3Count = 0;
 
        if(req.body.QCId == 1){
            qc1Count = await Quality_Check_Remarks.count({where: {enquiryId: order.enquiryId, QCId: req.body.QCId, status: "completed"}});
        }

        qc2Count = await Quality_Check_Remarks.count({where: {enquiryId: order.enquiryId, QCId: 2, status: "completed"}});

        qc3Count = await Quality_Check_Remarks.count({where: {enquiryId: order.enquiryId, QCId: 3, status: "completed"}});
  
      
        if(orderitems.length == qc1Count){
            if (order.QC1 == false) {
                await order.update({
                    QC1: true,
                    QC_Start: new Date()
                })
                await EnquiryStatus.create({
                    status: "completed",
                    remark: "Material rec. at warehouse",
                    enquiryId: order.enquiryId
                });
                
                const message_data = await Message.findOne({ where: { enquiryId: order.enquiryId, message: 'Qc1_material_received' } })
                if (!message_data) {
                    const customer = await Customer.findOne({ where: { id: order.customerId } });
                    await Message.create({
                        message: "Qc1_material_received",
                        enquiryId: order.enquiryId
                    })
                    
                    const data = await customerOutstandingAmount(customer.ACCOUNTNUM)
                    const amount = data.openSoAmount + data.ledgerAmount;
                    
                    console.log(amount, order.enquiryId, "-----------------------")
                    if (amount && amount > 0 ){
                        
                        const data = await sendPaymentLink(order.enquiryId, amount, "order_complete");
                        const paymentLink = data && data.short_url
                        
                        const message = Qc1_message_with_payment(customer.firstName + ' ' + customer.lastName, order.enquiryId, paymentLink, amount)
                        whatsappMessage(message, customer.primary_phone)
                    } else {
                        
                        const message = Qc1_message_without_payment(customer.firstName + ' ' + customer.lastName, order.enquiryId)
                        whatsappMessage(message, customer.primary_phone)
                    }
                }
            }
        }
        if(orderitems.length == qc2Count){
            if (order.QC2 == false) {
                await order.update({
                    QC2: true,
                    QC2_Completed: new Date()
                })

                await EnquiryStatus.create({
                    status: "completed",
                    remark: "QC 2 completed",
                    enquiryId: order.enquiryId
                });
            }
        }
        if(orderitems.length == qc3Count){
            if (order.QC3 == false) {
                await order.update({
                    QC3: true,
                    QC_Complete: new Date()
                })
            }
        }
        
        return res.status(200).json({
            message: "Remarks submitted Successfully",
            status: true
        });
        
    } catch (error) {
        next(error)
        // return res.status(500).json({
        //     message: error.message
        // });
    }
}


exports.updateFabricStaus = async(req, res, next) =>{
    try {
        const orderitem = await OrderItem.findOne({ where: { id: req.body.orderItemId } });
        if (!orderitem) {
            return res.status(404).json({
                message: "No OrderItem Found",
                status: false
            });
        }
        
        const order = await Order.findOne({ where: { id : orderitem.orderId } });

        if(!(order.sta_received_date)){
            await order.update({sta_received_date: new Date()})
        }
        
        await orderitem.update({
            fabric_status: req.body.fabric_status
        })
        if(req.body.fabric_status == "fabric-out-of-stock"){
            await Order.update({is_partial_material: true} , {where: {id : orderitem.orderId}})
        }else{
            const orderitemcount = await OrderItem.count({where: {orderId: orderitem.orderId, fabric_status: "fabric-out-of-stock"}});
           
            if(orderitemcount == 0){
                await Order.update({is_partial_material: false} , {where: {id : orderitem.orderId}})
            }
        }
        
        return res.status(200).json({
            message: "Order item updated Successfully",
            data: orderitem,
            status: true
        });
    } catch (e) {
        next(e)
    }
}

exports.completeQC = async (req, res, next) => {
    try {
        const order = await Order.findOne({ where: { orderId: req.params.id } });
        if (!order) {
            return res.status(404).json({
                message: "No Order Found",
                status: false
            });
        }

        if (req.body.QCId == 1) {
            if (order.QC1 == false) {
                await order.update({
                    QC1: req.body.QC1,
                    QC_Start: new Date()
                })
                await EnquiryStatus.create({
                    status: "completed",
                    remark: "Material rec. at warehouse",
                    enquiryId: order.enquiryId
                });
            }
        }

        else if (req.body.QCId == 2) {
            if (order.QC2 == false) {
                await order.update({
                    QC2: req.body.QC2
                })

                await EnquiryStatus.create({
                    status: "completed",
                    remark: "QC Pending",
                    enquiryId: order.enquiryId
                });
            }
        }

        else if (req.body.QCId == 3) {
            if (order.QC3 == false) {
                await order.update({
                    QC3: req.body.QC3,
                    QC_Complete: new Date()
                })
            }
            await EnquiryStatus.create({
                status: "completed",
                remark: "Material Ready to Dispatch",
                enquiryId: order.enquiryId
            });
            await Enquiry.update({
                status: "qc-complete",
            }, { where: { id: order.enquiryId } })

            await order.update({
                orderStatus: "completed"
            })
           
            
            const customer = await Customer.findOne({ where: { id: order.customerId } });
            const amountData = await customerOutstandingAmount(customer.ACCOUNTNUM)
            const amount = amountData.openSoAmount + amountData.ledgerAmount;
            console.log(amount, order.enquiryId, "-----------------------")
            if (amount && amount > 0 ){
               
                const message_data = await Message.findOne({ where: { enquiryId: order.enquiryId, message: 'Qc3_message_with_payemnt' } })
                if (!message_data) {
                   
                    await Message.create({
                        message: "Qc3_message_with_payemnt",
                        enquiryId: order.enquiryId
                    })
                    
                    const data = await sendPaymentLink(order.enquiryId, amount, "final_payment");
                    const paymentLink = data && data.short_url
                
                    const message = Qc3_message_with_payemnt(customer.firstName + ' ' + customer.lastName, paymentLink, amount)
                    whatsappMessage(message, customer.primary_phone)
                }
                
            } else {
                const message_data = await Message.findOne({ where: { enquiryId: order.enquiryId, message: 'book_installation_time_slot' } })
                if (!message_data) {
            
                    await Message.create({
                        message: "book_installation_time_slot",
                        enquiryId: order.enquiryId
                    })
                    
                    const message = book_installation_time_slot(customer.firstName + ' ' + customer.lastName, order.orderId, order.enquiryId)
                    whatsappMessage(message, customer.primary_phone)
                }
            }
            
            
        }


        res.status(200).json({
            message: `QC${req.body.QCId} Done`,
            status: true,
            data: order
        })
    } catch (error) {
       next(error)
    }
}

exports.updateQcRemark = async(req, res, next)=>{
    try {

        const quality_check_remarks = await Quality_Check_Remarks.findOne({where:{id: req.body.remark_id}});
        if (!quality_check_remarks) {
            return res.status(404).json({
                message: "QC remark not Found",
                status: false
            });
        }
        
        const remark = quality_check_remarks ? quality_check_remarks.remark : ''; 
        const new_remark = req.body.remark;
     
        const combined_remark = remark ? `${remark},${new_remark}` : new_remark;

        
        await quality_check_remarks.update({
            remark: combined_remark,
            status: req.body.status
        })
        
         res.status(200).json({
            message: `QC Remark updated`,
            status: true,
            data: quality_check_remarks
        })
    } catch (e) {
        next(e)
        
    }
}






