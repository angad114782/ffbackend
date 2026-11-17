const bcryptjs = require("bcryptjs");
const { Op } = require("sequelize");
const { dataNotFound, dataFound } = require("../helper/functions");
const { UploadFile, removefile } = require("../helper/multer");
const { User, Address, Customer, Material, CeilingType, WallType, Liniing, Room, SheerFabric,ComplaintTask,Complaint, CurtainFabric, CurtainStyle, ScrewSize, Brand, Book, SelectedCurtain, SelectedSheer, BorderType, BeltType, CurtainPattern, Motorized_track, BracketSize, TieKnob, RodType, Enquiry, EnquiryStatus, SelectedMaterial, OutletUser, Outlet, Notification, Ladder, Enquiry_Schedule, RoomAsset, Media, Gathering, CurtainOperation, Finial, LiningFabric, SelectedRod, SelectedTrack, LBracket, MaterialImage, PelmetType, Track, MotorOperation, BlindStyle, BlindFittingType, BlindWindowType, BlindBorderType, SelectedBlind, BlindTrackType, BlindMotorType, BlindMotorTrackType, ParkingSpace, BlindSubType, OutletAddress, BlindShades, BlindAsset, Blind_Lining, Blind_Lining_Fabric, Schedule, Warehouse, InstallerSchedule, Order, InstallerTasks, SofaType } = require("../model");
const ejs = require('ejs');
const path = require('path');
const axios = require("axios");
const Excel = require('exceljs');
const sequelize = require('../utils/database');
const { sendMail, send_notification } = require("../helper/mailer");

exports.dashboard = async (req, res, next) => {
    try {
        const fromDate = req.query.fromDate || '';
        const comingToDate = req.query.toDate || '';
        const salesId = req.query.salesId || '';
        let toDate = ''
        if (comingToDate) {
            const setToDate = new Date(comingToDate);
            setToDate.setDate(setToDate.getDate() + 1);
            toDate = setToDate.toISOString().split('T')[0];
        }
        const enquiry = []
        const store = await User.findOne({ where: { id: req.params.id, type: "outlet" } });
        dataNotFound(store, 404, "Store Not Found")

        const storeSalesPersons = await OutletUser.findAll({ where: { outletId: store.id } });

        for (var i = 0; i < storeSalesPersons.length; i++) {
            const sales = storeSalesPersons[i]
            let dateCondition;
            if (fromDate && toDate) {
                dateCondition = {
                    createdAt: {
                        [Op.gte]: fromDate,
                        [Op.lte]: toDate
                    }
                }
            }

            if (salesId && salesId == sales.salesPersonId) {
                const enq = await Enquiry.findAll({ where: { salesId: sales.salesPersonId, ...dateCondition } })
                enq.map(item => {
                    enquiry.push(item)
                })
            } else if (!salesId) {
                const enq = await Enquiry.findAll({ where: { salesId: sales.salesPersonId, ...dateCondition }, })
                enq.map(item => {
                    enquiry.push(item)
                })
            }
        }

        const pendingEnquiry = enquiry.filter((enq) => enq.status === 'fresh' || enq.status === 'inprogess');
        const measurementCompleted = enquiry.filter((enq) => enq.status === 'measurement-complete');
        const orderConfirmed = enquiry.filter((enq) => enq.status === "order-confirmed");
        const qcComplete = enquiry.filter((enq) => enq.status === "qc-complete");
        const installerAssigned = enquiry.filter((enq) => enq.status === 'installer-assigned');
        const installerStarted = enquiry.filter((enq) => enq.status === 'installer-started');
        const completed = enquiry.filter((enq) => enq.status === 'completed');
        const cancelled = enquiry.filter((enq) => enq.status === 'cancelled');
        const open_enquiry = enquiry.filter((enq) => enq.status !== 'completed')
        const obj = {
            totalEnquiry: { enquiry: enquiry.length, open_enquiry: open_enquiry.length, report: true, url: `${process.env.LOCAL_URL}api/v1/outlet/total-enquiry/` + store.id + `?fromDate=${fromDate}&toDate=${toDate}&salesId=${salesId}` },
            measurementPending: { enquiry: pendingEnquiry.length, report: true, url: `${process.env.LOCAL_URL}api/v1/outlet/measurement-aging/` + store.id + `?fromDate=${fromDate}&toDate=${toDate}&salesId=${salesId}` },
            estimateShared: { enquiry: measurementCompleted.length, report: true, url: `${process.env.LOCAL_URL}api/v1/outlet/estimate-completed/` + store.id + `?fromDate=${fromDate}&toDate=${toDate}&salesId=${salesId}` },
            orderConfirmed: { enquiry: orderConfirmed.length, report: true, url: `${process.env.LOCAL_URL}api/v1/outlet/order-created/` + store.id + `?fromDate=${fromDate}&toDate=${toDate}&salesId=${salesId}` },
            qcComplete: { enquiry: qcComplete.length, report: true, url: `${process.env.LOCAL_URL}api/v1/outlet/qc-completed/` + store.id + `?fromDate=${fromDate}&toDate=${toDate}&salesId=${salesId}` },
            installerAssigned: { enquiry: installerAssigned.length, report: true, url: `${process.env.LOCAL_URL}api/v1/outlet/installation-aging/` + store.id + `?fromDate=${fromDate}&toDate=${toDate}&salesId=${salesId}` },
            installationStarted: { enquiry: installerStarted.length, report: true, url: `${process.env.LOCAL_URL}api/v1/outlet/installation-started/` + store.id + `?fromDate=${fromDate}&toDate=${toDate}&salesId=${salesId}` },
            completedEnquiry: { enquiry: completed.length, report: true, url: `${process.env.LOCAL_URL}api/v1/outlet/installation-completed/` + store.id + `?fromDate=${fromDate}&toDate=${toDate}&salesId=${salesId}` },
            cancelledEnquiry: { enquiry: cancelled.length, report: false, url: null },
        }
        return res.status(200).json({
            message: 'Notificaiton send successfully',
            data: obj,
            status: true
        });
    } catch (e) {
        next(e)
    }

}

exports.getAllEnquiries2 = async (req, res, next) => {
    try {
        
        const store = await User.findOne({ where: { id: req.params.id, type: "outlet" } });
        dataNotFound(store, 404, "Store Not Found");
        
        const data = await Enquiry.findAndCountAll()
        let page = req.query.page;      // page number
        let limit = 20;   // number of records per page
        let pages = Math.ceil(data.count / limit);

        if (req.query.page) {
            let offset = 0;

            offset = limit * (page - 1);

            const enquiries = await Enquiry.findAll({
                include: [EnquiryStatus, Customer, User], order: [["id", "DESC"]], limit: limit,
                offset: offset
            });

            for (var i = 0; i < enquiries.length; i++) {
                const enq = enquiries[i]

                const products = []
                const room = await Room.findAll({ where: { enquiryId: enq.id }, include: [{ model: SelectedMaterial, include: Material }] })
                for (const i of room) {
                    for (const j of i.selectedmaterials) {

                        if (!products.includes(j.material.name)) {
                           
                            products.push(j.material.name);
                        }
                    }
                    //   const materials = await Material.findOne({ where: { id: i.materialId } });
                }

                enq.dataValues.products = products
            }

            return res.status(200).json({
                message: "Enquiries Fetched Successfully",
                data: enquiries,
                status: true,
                pages: pages,
                currentPage: page
            })
        }
        else {
            const enquiries = await Enquiry.findAll({ include: [EnquiryStatus, Customer, User], order: [["id", "DESC"]], limit: 20 })
            for (var i = 0; i < enquiries.length; i++) {
                const enq = enquiries[i]

                const products = []
                const selectedmaterial = await SelectedMaterial.findAll({ where: { enquiryId: enq.id }, include: [Material] })

                for (const i of selectedmaterial) {
                    const materials = await Material.findOne({ where: { id: i.materialId } });
                    if (!products.includes(materials.name)) {
                        products.push(materials.name);
                    }
                }

                enq.dataValues.products = products

            }
            res.status(200).json({
                message: "Enquiries Fetched Successfully",
                data: enquiries,
                status: true,
                pages: pages,

            })
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
};


exports.totalEnquiry = async (req, res, next) => {
    try {
        const enquiry = [];
        const page = req.query.page || 1; // Default page is 1
        const limit = 20; // Number of records per page

        const store = await User.findOne({ where: { id: req.params.id, type: "outlet" } });
        dataNotFound(store, 404, "Store Not Found");

        const storeSalesPersons = await OutletUser.findAll({ where: { outletId: store.id } });

        for (var i = 0; i < storeSalesPersons.length; i++) {
            const sales = storeSalesPersons[i];
            const enq = await Enquiry.findAll({
                where: { salesId: sales.salesPersonId },
                include: [SelectedMaterial],
                order: [['id', 'DESC']]
            });

            for (const item of enq) {
                const products = [];
                for (const selected of item.selectedmaterials) {
                    const material = await Material.findOne({ where: { id: selected.materialId } });
                    if (material && !products.includes(material.name)) {
                        products.push(material.name);
                    }
                }

                item.dataValues.products = products;
                enquiry.push(item);
            }
        }

        const sortedEnquiry = enquiry.sort((a, b) => b.id - a.id); // Sort the enquiry array based on ID in descending order

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedEnquiries = sortedEnquiry.slice(startIndex, endIndex);

        const totalPages = Math.ceil(sortedEnquiry.length / limit);

        return res.status(200).json({
            message: 'Enquiry fetched successfully',
            data: paginatedEnquiries,
            status: true,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (e) {
        next(e);
    }
}

exports.StoreWiseMesurementAging = async (req, res, next) => {
    try {
        const EnquiryArray = []
        const salesId = req.query.salesId || '';
        const stores = await User.findAll({ where: { id: req.params.id, type: "outlet" } });
        dataNotFound(stores[0], 404, "Store Not Found")

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Measurement (Store)");
        worksheet.columns = [
            { header: 'Enquiry Id', key: 'enquiryId', width: 15 },
            { header: 'Date', key: 'date', width: 15, },
            { header: 'Customer Name', key: 'customerName', width: 32, },
            { header: 'Customer Mobile No.', key: 'phone', width: 32, },
            { header: 'Secondary Mobile No.', key: 'phone2', width: 32, },
            { header: 'Category', key: 'category', width: 30, },
            { header: 'Products', key: 'products', width: 50, },
            { header: 'Sales Person', key: 'sales_person', width: 50, },
            { header: 'Task Start', key: 'task_start', width: 32, },
            { header: 'Measurement Start Date', key: 'assign_date', width: 32, },
            { header: 'Measurment Complete Date', key: 'task_end', width: 32, },
            { header: 'Measurment Status', key: 'measurement_status', width: 32, },
            { header: 'Days', key: 'days', width: 15, },
            { header: 'Aging', key: 'aging', width: 15, },
            { header: 'Measurer', key: 'measurer', width: 32, },
            { header: 'Status', key: 'status', width: 32, },
            { header: 'Address', key: 'address', width: 80, },
            { header: 'Store', key: 'store', width: 50, },
        ];
        for (let i = 0; i < stores.length; i++) {
            const store = stores[i];
            const storeSalesPersons = await OutletUser.findAll({ where: { outletId: store.id } });

            for (let j = 0; j < storeSalesPersons.length; j++) {
                const storeSalesPerson = storeSalesPersons[j];
                let dateCondition;
                if (req.query.fromDate && req.query.toDate) {
                    dateCondition = {
                        createdAt: {
                            [Op.gte]: req.query.fromDate,
                            [Op.lte]: req.query.toDate
                        }
                    }
                }
                const enquiry = [];
                if (salesId && salesId == storeSalesPerson.salesPersonId) {
                    const enquiries = await Enquiry.findAll({
                        where: {
                            salesId: storeSalesPerson.dataValues.salesPersonId,
                            status: {
                                [Op.or]: ["inprogess", "measurement-complete"]
                            }
                        }, include: [
                            { model: EnquiryStatus },
                            { model: Customer },
                            { model: User },
                            { model: Enquiry_Schedule, include: User, },
                            { model: Room }
                        ]
                    })
                    enquiry.push(...enquiries)
                } else if (!salesId) {
                    const enquiries = await Enquiry.findAll({
                        where: {
                            salesId: storeSalesPerson.dataValues.salesPersonId,
                            status: {
                                [Op.or]: ["inprogess", "measurement-complete"]
                            }
                        }, include: [
                            { model: EnquiryStatus },
                            { model: Customer },
                            { model: User },
                            { model: Enquiry_Schedule, include: User, },
                            { model: Room }
                        ]
                    })
                    enquiry.push(...enquiries)
                }
                for (let k = 0; k < enquiry.length; k++) {

                    const item = enquiry[k];
                    const products = []
                    const selectedmaterial = await SelectedMaterial.findAll({ where: { enquiryId: item.id }, include: [Material] })

                    for (const l of selectedmaterial) {
                        const materials = await Material.findOne({ where: { id: l.materialId } });
                        if (!products.includes(materials.name)) {
                            products.push(materials.name);
                        }
                    }
                    const startTime = item.enquiryschedules.length > 0 ? item.enquiryschedules[item.enquiryschedules.length - 1].createdAt : item.createdAt
                    const endTime = item.enquiryschedules.length > 0 ? item.enquiryschedules[item.enquiryschedules.length - 1].updatedAt : item.updatedAt
                    const date = endTime.toISOString().split("T")[0]
                    const parts = date.split('-');
                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

                    const measurer = item.enquiryschedules.length > 0 && item.enquiryschedules[0].user ? `${item.enquiryschedules[item.enquiryschedules.length - 1].user.firstName} ${item.enquiryschedules[item.enquiryschedules.length - 1].user.lastName}` : "User Not Available or Assigned"

                    const timeDiff = new Date(endTime).getTime() - new Date(startTime).getTime();
                    let daysDiff = timeDiff / (1000 * 3600 * 24).toFixed(0);
                    let hours = (daysDiff * 24).toFixed(0)
                    worksheet.addRow({
                        enquiryId: item.enquiryId,
                        date: new Date(item.createdAt).toISOString().split("T")[0],
                        customerName: item.customer.firstName + (item.customer.lastName ? item.customer.lastName : ""),
                        phone: ` ${item.customer.primary_phone} `,
                        phone2: ` ${item.customer.secondary_phone ? item.customer.secondary_phone : ""}`,
                        address: `${item.street}, ${item.address}, ${item.city}, ${item.state}, ${item.pincode}`,
                        category: item.enquirystatuses[item.enquirystatuses.length - 1].remark,
                        sales_person: item.user.firstName + (item.user.lastName ? item.user.lastName : ""),
                        task_start: startTime.toISOString().split("T")[0],
                        task_end: item.status == "inprogess" ? " Measurement not completed yet " : formattedDate,
                        days: item.status == "inprogess" ? "" : daysDiff < 1 ? "< 1" : Math.round(daysDiff).toString(),
                        aging: item.status == "inprogess" ? "" : hours < 24 ? "<24hrs" : hours > 24 && hours < 48 ? "24hrs" : hours > 48 && hours < 72 ? "48hrs" : hours == 72 ? "72hrs" : ">72hrs",
                        measurer,
                        assign_date: item.enquiryschedules.length == 0 ? "Measurer not assgined" : startTime,
                        status: item.status,
                        store: store.firstName,
                        products: products.toString(),
                        measurement_status: item.enquiryschedules.length == 0 ? "Measurer not assgined" : item.enquiryschedules[item.enquiryschedules.length - 1].status
                    }).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    EnquiryArray.push(item);
                }

            }
        }

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Measurement Completed(Store).xlsx"
        );
        await workbook.xlsx.write(res)
        res.status(200).end();
        // return res.status(200).json({
        //     message: "Enquiry Data Fetched",
        //     status: true,
        //     data: EnquiryArray
        // })
    } catch (e) {
        next(e)
    }
}

exports.StoreWiseQcCompleted = async (req, res, next) => {
    try {
        const EnquiryArray = []
        const salesId = req.query.salesId || '';
        const stores = await User.findAll({ where: { id: req.params.id, type: "outlet" } });
        dataNotFound(stores[0], 404, "Store Not Found")

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("QC (Store)");
        worksheet.columns = [
            { header: 'Enquiry Id', key: 'enquiryId', width: 15 },
            { header: 'Date', key: 'date', width: 15, },
            { header: 'Customer Name', key: 'customerName', width: 32, },
            { header: 'Customer Mobile No.', key: 'phone', width: 32, },
            { header: 'Secondary Mobile No.', key: 'phone2', width: 32, },
            { header: 'Category', key: 'category', width: 30, },
            { header: 'Products', key: 'products', width: 50, },
            { header: 'Sales Person', key: 'sales_person', width: 50, },
            { header: 'Task Start', key: 'task_start', width: 32, },
            { header: 'Measurement Start Date', key: 'assign_date', width: 32, },
            { header: 'Measurment Complete Date', key: 'task_end', width: 32, },
            { header: 'Measurment Status', key: 'measurement_status', width: 32, },
            { header: 'Days', key: 'days', width: 15, },
            { header: 'Aging', key: 'aging', width: 15, },
            { header: 'Measurer', key: 'measurer', width: 32, },
            { header: 'Status', key: 'status', width: 32, },
            { header: 'Address', key: 'address', width: 80, },
            { header: 'Store', key: 'store', width: 50, },
        ];
        for (let i = 0; i < stores.length; i++) {
            const store = stores[i];
            const storeSalesPersons = await OutletUser.findAll({ where: { outletId: store.id } });

            for (let j = 0; j < storeSalesPersons.length; j++) {
                const storeSalesPerson = storeSalesPersons[j];
                let dateCondition;
                if (req.query.fromDate && req.query.toDate) {
                    dateCondition = {
                        createdAt: {
                            [Op.gte]: req.query.fromDate,
                            [Op.lte]: req.query.toDate
                        }
                    }
                }
                const enquiry = [];
                if (salesId && salesId == storeSalesPerson.salesPersonId) {
                    const enquiries = await Enquiry.findAll({
                        where: {
                            salesId: storeSalesPerson.dataValues.salesPersonId,
                            status: {
                                [Op.or]: ["qc-complete"]
                            }
                        }, include: [
                            { model: EnquiryStatus },
                            { model: Customer },
                            { model: User },
                            { model: Enquiry_Schedule, include: User, },
                            { model: Room }
                        ]
                    })
                    enquiry.push(...enquiries)
                } else if (!salesId) {
                    const enquiries = await Enquiry.findAll({
                        where: {
                            salesId: storeSalesPerson.dataValues.salesPersonId,
                            status: {
                                [Op.or]: ["qc-complete"]
                            }
                        }, include: [
                            { model: EnquiryStatus },
                            { model: Customer },
                            { model: User },
                            { model: Enquiry_Schedule, include: User, },
                            { model: Room }
                        ]
                    })
                    enquiry.push(...enquiries)
                }

                for (let k = 0; k < enquiry.length; k++) {

                    const item = enquiry[k];
                    const products = []
                    const selectedmaterial = await SelectedMaterial.findAll({ where: { enquiryId: item.id }, include: [Material] })

                    for (const l of selectedmaterial) {
                        const materials = await Material.findOne({ where: { id: l.materialId } });
                        if (!products.includes(materials.name)) {
                            products.push(materials.name);
                        }
                    }
                    const startTime = item.enquiryschedules.length > 0 ? item.enquiryschedules[item.enquiryschedules.length - 1].createdAt : item.createdAt
                    const endTime = item.enquiryschedules.length > 0 ? item.enquiryschedules[item.enquiryschedules.length - 1].updatedAt : item.updatedAt
                    const date = endTime.toISOString().split("T")[0]
                    const parts = date.split('-');
                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

                    const measurer = item.enquiryschedules.length > 0 && item.enquiryschedules[0].user ? `${item.enquiryschedules[item.enquiryschedules.length - 1].user.firstName} ${item.enquiryschedules[item.enquiryschedules.length - 1].user.lastName}` : "User Not Available or Assigned"

                    const timeDiff = new Date(endTime).getTime() - new Date(startTime).getTime();
                    let daysDiff = timeDiff / (1000 * 3600 * 24).toFixed(0);
                    let hours = (daysDiff * 24).toFixed(0)
                    worksheet.addRow({
                        enquiryId: item.enquiryId,
                        date: new Date(item.createdAt).toISOString().split("T")[0],
                        customerName: item.customer.firstName + (item.customer.lastName ? item.customer.lastName : ""),
                        phone: ` ${item.customer.primary_phone} `,
                        phone2: ` ${item.customer.secondary_phone ? item.customer.secondary_phone : ""}`,
                        address: `${item.street}, ${item.address}, ${item.city}, ${item.state}, ${item.pincode}`,
                        category: item.enquirystatuses[item.enquirystatuses.length - 1].remark,
                        sales_person: item.user.firstName + (item.user.lastName ? item.user.lastName : ""),
                        task_start: startTime.toISOString().split("T")[0],
                        task_end: item.status == "inprogess" ? " Measurement not completed yet " : formattedDate,
                        days: item.status == "inprogess" ? "" : daysDiff < 1 ? "< 1" : Math.round(daysDiff).toString(),
                        aging: item.status == "inprogess" ? "" : hours < 24 ? "<24hrs" : hours > 24 && hours < 48 ? "24hrs" : hours > 48 && hours < 72 ? "48hrs" : hours == 72 ? "72hrs" : ">72hrs",
                        measurer,
                        assign_date: item.enquiryschedules.length == 0 ? "Measurer not assgined" : startTime,
                        status: item.status,
                        store: store.firstName,
                        products: products.toString(),
                        measurement_status: item.enquiryschedules.length == 0 ? "Measurer not assgined" : item.enquiryschedules[item.enquiryschedules.length - 1].status
                    }).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    EnquiryArray.push(item);
                }

            }
        }

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Measurement Completed(Store).xlsx"
        );
        await workbook.xlsx.write(res)
        res.status(200).end();
        // return res.status(200).json({
        //     message: "Enquiry Data Fetched",
        //     status: true,
        //     data: EnquiryArray
        // })
    } catch (e) {
        next(e)
    }
}

exports.StoreWiseOrderCreated = async (req, res, next) => {
    try {
        const EnquiryArray = []
        const stores = await User.findAll({ where: {id : req.params.id, type: "outlet" } });
        dataNotFound(stores[0], 404, "Store Not Found")

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("QC (Store)");
        worksheet.columns = [
            { header: 'Enquiry Id', key: 'enquiryId', width: 15 },
            { header: 'Date', key: 'date', width: 15, },
            { header: 'Customer Name', key: 'customerName', width: 32, },
            { header: 'Customer Mobile No.', key: 'phone', width: 32, },
            { header: 'Secondary Mobile No.', key: 'phone2', width: 32, },
            { header: 'Category', key: 'category', width: 30, },
            { header: 'Products', key: 'products', width: 50, },
            { header: 'Sales Person', key: 'sales_person', width: 50, },
            { header: 'Task Start', key: 'task_start', width: 32, },
            { header: 'Measurement Start Date', key: 'assign_date', width: 32, },
            { header: 'Measurment Complete Date', key: 'task_end', width: 32, },
            { header: 'Measurment Status', key: 'measurement_status', width: 32, },
            { header: 'Days', key: 'days', width: 15, },
            { header: 'Aging', key: 'aging', width: 15, },
            { header: 'Measurer', key: 'measurer', width: 32, },
            { header: 'Status', key: 'status', width: 32, },
            { header: 'Address', key: 'address', width: 80, },
            { header: 'Store', key: 'store', width: 50, },
        ];
        for (let i = 0; i < stores.length; i++) {
            const store = stores[i];
            const storeSalesPersons = await OutletUser.findAll({ where: { outletId: store.id } });

            for (let j = 0; j < storeSalesPersons.length; j++) {
                const storeSalesPerson = storeSalesPersons[j];
                const enquiry = await Enquiry.findAll({
                    where: {
                        salesId: storeSalesPerson.dataValues.salesPersonId,
                        status: {
                            [Op.or]: ["order-confirmed"]
                        }
                    }, include: [
                        { model: EnquiryStatus },
                        { model: Customer },
                        { model: User },
                        { model: Enquiry_Schedule, include: User, },
                        { model: Room }
                    ]
                })

                for (let k = 0; k < enquiry.length; k++) {

                    const item = enquiry[k];
                    const products = []
                    const selectedmaterial = await SelectedMaterial.findAll({ where: { enquiryId: item.id }, include: [Material] })

                    for (const l of selectedmaterial) {
                        const materials = await Material.findOne({ where: { id: l.materialId } });
                        if (!products.includes(materials.name)) {
                            products.push(materials.name);
                        }
                    }
                    const startTime = item.enquiryschedules.length > 0 ? item.enquiryschedules[item.enquiryschedules.length - 1].createdAt : item.createdAt
                    const endTime = item.enquiryschedules.length > 0 ? item.enquiryschedules[item.enquiryschedules.length - 1].updatedAt : item.updatedAt
                    const date = endTime.toISOString().split("T")[0]
                    const parts = date.split('-');
                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    
                    const measurer = item.enquiryschedules.length > 0 && item.enquiryschedules[0].user ? `${item.enquiryschedules[item.enquiryschedules.length - 1].user.firstName} ${item.enquiryschedules[item.enquiryschedules.length - 1].user.lastName}` : "User Not Available or Assigned"
                    
                    const timeDiff = new Date(endTime).getTime() - new Date(startTime).getTime();
                    let daysDiff = timeDiff / (1000 * 3600 * 24).toFixed(0);
                    let hours = (daysDiff * 24).toFixed(0)
                    worksheet.addRow({
                        enquiryId: item.enquiryId,
                        date: new Date(item.createdAt).toISOString().split("T")[0],
                        customerName: item.customer.firstName + " "+ (item.customer.lastName ? item.customer.lastName : ""),
                        phone: ` ${item.customer.primary_phone} `,
                        phone2: ` ${item.customer.secondary_phone ? item.customer.secondary_phone : ""}`,
                        address: `${item.street}, ${item.address}, ${item.city}, ${item.state}, ${item.pincode}`,
                        category: item.enquirystatuses[item.enquirystatuses.length - 1].remark,
                        sales_person: item.user.firstName + (item.user.lastName ? item.user.lastName : ""),
                        task_start:  startTime.toISOString().split("T")[0],
                        task_end:item.status == "inprogess" ? " Measurement not completed yet " : formattedDate ,
                        days: item.status == "inprogess" ? "" : daysDiff < 1 ? "< 1" : Math.round(daysDiff).toString(),
                        aging: item.status == "inprogess" ? "" :hours < 24 ? "<24hrs" : hours > 24 && hours < 48 ? "24hrs" : hours > 48 && hours < 72 ? "48hrs" : hours == 72 ? "72hrs" : ">72hrs",
                        measurer,
                        assign_date: item.enquiryschedules.length ==0 ? "Measurer not assgined" : startTime ,
                        status: item.status,
                        store: store.firstName,
                        products: products.toString(),
                        measurement_status : item.enquiryschedules.length ==0 ? "Measurer not assgined" : item.enquiryschedules[item.enquiryschedules.length -1 ].status
                    }).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    EnquiryArray.push(item);
                }

            }
        }

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Measurement Completed(Store).xlsx"
        );
        await workbook.xlsx.write(res)
        res.status(200).end();
        // return res.status(200).json({
        //     message: "Enquiry Data Fetched",
        //     status: true,
        //     data: EnquiryArray
        // })
    } catch (e) {
        next(e)
    }
}

exports.StoreWiseTotal = async (req, res, next) => {
    try {
        const salesId = req.query.salesId || '';
        const EnquiryArray = []
        const stores = await User.findAll({ where: { id: req.params.id, type: "outlet" } });
        dataNotFound(stores[0], 404, "Store Not Found")

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("QC (Store)");
        worksheet.columns = [
            { header: 'Enquiry Id', key: 'enquiryId', width: 15 },
            { header: 'Date', key: 'date', width: 15, },
            { header: 'Customer Name', key: 'customerName', width: 32, },
            { header: 'Customer Mobile No.', key: 'phone', width: 32, },
            { header: 'Secondary Mobile No.', key: 'phone2', width: 32, },
            // { header: 'Category', key: 'category', width: 30, },
            { header: 'Products', key: 'products', width: 50, },
            { header: 'Sales Person', key: 'sales_person', width: 50, },
            { header: 'Task Start', key: 'task_start', width: 32, },
            { header: 'Measurement Start Date', key: 'assign_date', width: 32, },
            { header: 'Measurment Complete Date', key: 'task_end', width: 32, },
            { header: 'Measurment Status', key: 'measurement_status', width: 32, },
            { header: 'Days', key: 'days', width: 15, },
            { header: 'Aging', key: 'aging', width: 15, },
            { header: 'Measurer', key: 'measurer', width: 32, },
            { header: 'Status', key: 'status', width: 32, },
            { header: 'Address', key: 'address', width: 80, },
            { header: 'Store', key: 'store', width: 50, },
        ];
        for (let i = 0; i < stores.length; i++) {
            const store = stores[i];
            const storeSalesPersons = await OutletUser.findAll({ where: { outletId: store.id } });

            for (let j = 0; j < storeSalesPersons.length; j++) {
                const storeSalesPerson = storeSalesPersons[j];
                let dateCondition;
                if (req.query.fromDate && req.query.toDate) {
                    dateCondition = {
                        createdAt: {
                            [Op.gte]: req.query.fromDate,
                            [Op.lte]: req.query.toDate
                        }
                    }
                }
                const enquiry = [];
                if (salesId && salesId == storeSalesPerson.salesPersonId) {
                    const enquiries = await Enquiry.findAll({
                        where: {
                            salesId: storeSalesPerson.dataValues.salesPersonId,
                            ...dateCondition
                        }, include: [
                            { model: EnquiryStatus },
                            { model: Customer },
                            { model: User },
                            { model: Enquiry_Schedule, include: User, },
                            { model: Room }
                        ]
                    })
                    enquiry.push(...enquiries)
                } else if (!salesId) {
                    const enquiries = await Enquiry.findAll({
                        where: {
                            salesId: storeSalesPerson.dataValues.salesPersonId,
                            ...dateCondition
                        }, include: [
                            { model: EnquiryStatus },
                            { model: Customer },
                            { model: User },
                            { model: Enquiry_Schedule, include: User, },
                            { model: Room }
                        ]
                    })
                    enquiry.push(...enquiries)
                }
                for (let k = 0; k < enquiry.length; k++) {

                    const item = enquiry[k];
                    const products = []
                    const selectedmaterial = await SelectedMaterial.findAll({ where: { enquiryId: item.id }, include: [Material] })

                    for (const l of selectedmaterial) {
                        const materials = await Material.findOne({ where: { id: l.materialId } });
                        if (!products.includes(materials.name)) {
                            products.push(materials.name);
                        }
                    }
                    const startTime = item.enquiryschedules.length > 0 ? item.enquiryschedules[item.enquiryschedules.length - 1].createdAt : item.createdAt
                    const endTime = item.enquiryschedules.length > 0 ? item.enquiryschedules[item.enquiryschedules.length - 1].updatedAt : item.updatedAt
                    const date = endTime.toISOString().split("T")[0]
                    const parts = date.split('-');
                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

                    const measurer = item.enquiryschedules.length > 0 && item.enquiryschedules[0].user ? `${item.enquiryschedules[item.enquiryschedules.length - 1].user.firstName} ${item.enquiryschedules[item.enquiryschedules.length - 1].user.lastName}` : "User Not Available or Assigned"

                    const timeDiff = new Date(endTime).getTime() - new Date(startTime).getTime();
                    let daysDiff = timeDiff / (1000 * 3600 * 24).toFixed(0);
                    let hours = (daysDiff * 24).toFixed(0)
                    worksheet.addRow({
                        enquiryId: item.enquiryId,
                        date: new Date(item.createdAt).toISOString().split("T")[0],
                        customerName: item.customer.firstName + " " + (item.customer.lastName ? item.customer.lastName : ""),
                        phone: ` ${item.customer.primary_phone} `,
                        phone2: ` ${item.customer.secondary_phone ? item.customer.secondary_phone : ""}`,
                        address: `${item.street}, ${item.address}, ${item.city}, ${item.state}, ${item.pincode}`,
                        // category: item.enquirystatuses[item.enquirystatuses.length - 1].remark,
                        sales_person: item.user.firstName + (item.user.lastName ? item.user.lastName : ""),
                        task_start: startTime.toISOString().split("T")[0],
                        task_end: item.status == "inprogess" ? " Measurement not completed yet " : formattedDate,
                        days: item.status == "inprogess" ? "" : daysDiff < 1 ? "< 1" : Math.round(daysDiff).toString(),
                        aging: item.status == "inprogess" ? "" : hours < 24 ? "<24hrs" : hours > 24 && hours < 48 ? "24hrs" : hours > 48 && hours < 72 ? "48hrs" : hours == 72 ? "72hrs" : ">72hrs",
                        measurer,
                        assign_date: item.enquiryschedules.length == 0 ? "Measurer not assgined" : startTime,
                        status: item.status,
                        store: store.firstName,
                        products: products.toString(),
                        measurement_status: item.enquiryschedules.length == 0 ? "Measurer not assgined" : item.enquiryschedules[item.enquiryschedules.length - 1].status
                    }).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    EnquiryArray.push(item);
                }

            }
        }

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Measurement Completed(Store).xlsx"
        );
        await workbook.xlsx.write(res)
        res.status(200).end();
        // return res.status(200).json({
        //     message: "Enquiry Data Fetched",
        //     status: true,
        //     data: EnquiryArray
        // })
    } catch (e) {
        next(e)
    }
}

exports.StoreWiseShareEstimateAging = async (req, res, next) => {
    try {
        const salesId = req.query.salesId || '';
        const EnquiryArray = []
        const stores = await User.findAll({ where: { id: req.params.id, type: "outlet" } });
        dataNotFound(stores[0], 404, "Store Not Found")

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Estimate Shared");
        worksheet.columns = [
            { header: 'Enquiry Id', key: 'enquiryId', width: 15 },
            { header: 'Date', key: 'date', width: 15, },
            { header: 'Customer Name', key: 'customerName', width: 32, },
            { header: 'Customer Mobile No.', key: 'phone', width: 32, },
            { header: 'Secondary Mobile No.', key: 'phone2', width: 32, },
            { header: 'Category', key: 'category', width: 30, },
            { header: 'Products', key: 'products', width: 50, },
            { header: 'Sales Person', key: 'sales_person', width: 50, },
            { header: 'Task Start', key: 'task_start', width: 32, },
            { header: 'Measurement Start Date', key: 'assign_date', width: 32, },
            { header: 'Measurment Complete Date', key: 'task_end', width: 32, },
            { header: 'Days', key: 'days', width: 15, },
            { header: 'Aging', key: 'aging', width: 15, },
            { header: 'Measurer', key: 'measurer', width: 32, },
            { header: 'Status', key: 'status', width: 32, },
            { header: 'Address', key: 'address', width: 80, },
            { header: 'Store', key: 'store', width: 50, },
        ];
        for (let i = 0; i < stores.length; i++) {
            const store = stores[i];
            const storeSalesPersons = await OutletUser.findAll({ where: { outletId: store.id } });

            for (let j = 0; j < storeSalesPersons.length; j++) {
                const storeSalesPerson = storeSalesPersons[j];
                let dateCondition;
                if (req.query.fromDate && req.query.toDate) {
                    dateCondition = {
                        createdAt: {
                            [Op.gte]: req.query.fromDate,
                            [Op.lte]: req.query.toDate
                        }
                    }
                }
                const enquiry = [];
                if (salesId && salesId == storeSalesPerson.salesPersonId) {
                    const enquiries = await Enquiry.findAll({
                        where: {
                            salesId: storeSalesPerson.dataValues.salesPersonId,

                            status: {
                                [Op.or]: ["measurement-complete"]
                            }
                        }, include: [
                            { model: EnquiryStatus },
                            { model: Customer },
                            { model: User },
                            { model: Enquiry_Schedule, include: User, },
                            { model: Room }
                        ]
                    })
                    enquiry.push(...enquiries)
                } else if (!salesId) {
                    const enquiries = await Enquiry.findAll({
                        where: {
                            salesId: storeSalesPerson.dataValues.salesPersonId,

                            status: {
                                [Op.or]: ["measurement-complete"]
                            }
                        }, include: [
                            { model: EnquiryStatus },
                            { model: Customer },
                            { model: User },
                            { model: Enquiry_Schedule, include: User, },
                            { model: Room }
                        ]
                    })
                    enquiry.push(...enquiries)
                }
                for (let k = 0; k < enquiry.length; k++) {

                    const item = enquiry[k];
                    const products = []
                    const selectedmaterial = await SelectedMaterial.findAll({ where: { enquiryId: item.id }, include: [Material] })

                    for (const l of selectedmaterial) {
                        const materials = await Material.findOne({ where: { id: l.materialId } });
                        if (!products.includes(materials.name)) {
                            products.push(materials.name);
                        }
                    }
                    
                    const startTime =item.enquiryschedules.length > 0 && item.enquiryschedules[item.enquiryschedules.length - 1].date
                    const endTime = item.updatedAt
                    const date = endTime.toISOString().split("T")[0]
                    const parts = date.split('-');
                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

                    const measurer = item.enquiryschedules.length > 0 && item.enquiryschedules[0].user ? `${item.enquiryschedules[item.enquiryschedules.length - 1].user.firstName} ${item.enquiryschedules[item.enquiryschedules.length - 1].user.lastName}` : "User Not Available or Assigned"

                    const timeDiff = new Date(endTime).getTime() - new Date(startTime).getTime();
                    let daysDiff = timeDiff / (1000 * 3600 * 24).toFixed(0);
                    let hours = (daysDiff * 24).toFixed(0)
                    worksheet.addRow({
                        enquiryId: item.enquiryId,
                        date: new Date(item.createdAt).toISOString().split("T")[0],
                        customerName: item.customer.firstName + " " + (item.customer.lastName ? item.customer.lastName : ""),
                        phone: ` ${item.customer.primary_phone} `,
                        phone2: ` ${item.customer.secondary_phone ? item.customer.secondary_phone : ""}`,
                        address: `${item.street}, ${item.address}, ${item.city}, ${item.state}, ${item.pincode}`,
                        category: item.enquirystatuses[item.enquirystatuses.length - 1].remark,
                        sales_person: item.user.firstName + (item.user.lastName ? item.user.lastName : ""),
                        task_start: startTime,
                        task_end: item.status == "inprogess" ? " Measurement not completed yet " : formattedDate,
                        days: item.status == "inprogess" ? "" : daysDiff < 1 ? "< 1" : Math.round(daysDiff).toString(),
                        aging: item.status == "inprogess" ? "" : hours < 24 ? "<24hrs" : hours > 24 && hours < 48 ? "24hrs" : hours > 48 && hours < 72 ? "48hrs" : hours == 72 ? "72hrs" : ">72hrs",
                        measurer,
                        assign_date: item.enquiryschedules.length == 0 ? "Measurer not assgined" : startTime,
                        status: item.status,
                        store: store.firstName,
                        products: products.toString(),
                    }).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    EnquiryArray.push(item);
                }

            }
        }

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Measurement Completed(Store).xlsx"
        );
        await workbook.xlsx.write(res)
        res.status(200).end();
        // return res.status(200).json({
        //     message: "Enquiry Data Fetched",
        //     status: true,
        //     data: EnquiryArray
        // })
    } catch (e) {
        next(e)
    }
}

exports.InstallerWiseInstallationAging = async (req, res, next) => {
    try {
        const EnquiryArray = []
        const salesId = req.query.salesId || '';
        const stores = await User.findAll({ where: { id: req.params.id, type: "outlet" } });
        dataNotFound(stores[0], 404, "Store Not Found")

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Installation (Store)");
        worksheet.columns = [
            { header: 'Enquiry Id', key: 'enquiryId', width: 15 },
            { header: 'Date', key: 'date', width: 15, },
            { header: 'Customer Name', key: 'customerName', width: 32, },
            { header: 'Customer Mobile No.', key: 'phone', width: 32, },
            { header: 'Secondary Mobile No.', key: 'phone2', width: 32, },
            { header: 'Category', key: 'category', width: 30, },
            { header: 'Products', key: 'products', width: 50, },
            { header: 'Sales Person', key: 'sales_person', width: 50, },
            { header: 'Task Start', key: 'task_start', width: 32, },
            { header: 'Installation Assign Date', key: 'expected_installation', width: 32, },
            { header: 'Expected Installation Date', key: 'expected_delivery', width: 32, },
            { header: 'Expected Delivery Date', key: 'installation_assign_date', width: 32, },
            { header: 'Installation Start Date', key: 'assign_date', width: 32, },
            { header: 'Installation Complete Date', key: 'task_end', width: 32, },
            { header: 'Installation Status', key: 'installation_status', width: 32, },
            { header: 'Days', key: 'days', width: 15, },
            { header: 'Aging', key: 'aging', width: 15, },
            { header: 'Installer', key: 'installer', width: 32, },
            { header: 'Status', key: 'status', width: 32, },
            { header: 'Address', key: 'address', width: 80, },
            { header: 'Store', key: 'store', width: 50, },
        ];
        for (let i = 0; i < stores.length; i++) {
            const store = stores[i];
            const storeSalesPersons = await OutletUser.findAll({ where: { outletId: store.id } });

            for (let j = 0; j < storeSalesPersons.length; j++) {
                const storeSalesPerson = storeSalesPersons[j];
                let dateCondition;
                if (req.query.fromDate && req.query.toDate) {
                    dateCondition = {
                        createdAt: {
                            [Op.gte]: req.query.fromDate,
                            [Op.lte]: req.query.toDate
                        }
                    }
                }
                const enquiry = [];
                if (salesId && salesId == storeSalesPerson.salesPersonId) {
                    const enquiries = await Enquiry.findAll({
                        where: {
                            salesId: storeSalesPerson.dataValues.salesPersonId,
                            status: {
                                [Op.or]: ["qc-complete", "installer-assigned", "installation-started"]
                            }
                        }, include: [
                            { model: InstallerTasks, include: [{ model: User, as: "installer" }, { model: User, as: "warehouse" }] },
                            { model: EnquiryStatus },
                            { model: Customer },
                            { model: User },
                            { model: Enquiry_Schedule, include: User, },
                            { model: Room }
                        ]
                    })
                    enquiry.push(...enquiries)
                } else if (!salesId) {
                    const enquiries = await Enquiry.findAll({
                        where: {
                            salesId: storeSalesPerson.dataValues.salesPersonId,
                            status: {
                                [Op.or]: ["qc-complete", "installer-assigned", "installation-started"]
                            }
                        }, include: [
                            { model: InstallerTasks, include: [{ model: User, as: "installer" }, { model: User, as: "warehouse" }] },
                            { model: EnquiryStatus },
                            { model: Customer },
                            { model: User },
                            { model: Enquiry_Schedule, include: User, },
                            { model: Room }
                        ]
                    })
                    enquiry.push(...enquiries)
                }
                for (let k = 0; k < enquiry.length; k++) {

                    const item = enquiry[k];
                    const products = []
                    const selectedmaterial = await SelectedMaterial.findAll({ where: { enquiryId: item.id }, include: [Material] })

                    for (const l of selectedmaterial) {
                        const materials = await Material.findOne({ where: { id: l.materialId } });
                        if (!products.includes(materials.name)) {
                            products.push(materials.name);
                        }
                    }
                    const startTime = item.installer_tasks.length > 0 ? item.installer_tasks[item.installer_tasks.length - 1].date : item.createdAt
                    const endTime = item.installer_tasks.length > 0 ? item.installer_tasks[item.installer_tasks.length - 1].updatedAt : item.updatedAt
                    const date = endTime.toISOString().split("T")[0]
                    const parts = date.split('-');
                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

                    const installer = item.installer_tasks.length > 0 && item.installer_tasks[0].installer ? `${item.installer_tasks[item.installer_tasks.length - 1].installer.firstName} ${item.installer_tasks[item.installer_tasks.length - 1].installer.lastName}` : "User Not Available or Assigned"

                    const timeDiff = new Date(endTime).getTime() - new Date(startTime).getTime();
                    let daysDiff = timeDiff / (1000 * 3600 * 24).toFixed(0);
                    let hours = (daysDiff * 24).toFixed(0)
                    worksheet.addRow({
                        enquiryId: item.enquiryId,
                        date: new Date(item.createdAt).toISOString().split("T")[0],
                        customerName: item.customer.firstName + " " + (item.customer.lastName ? item.customer.lastName : ""),
                        phone: ` ${item.customer.primary_phone} `,
                        phone2: ` ${item.customer.secondary_phone ? item.customer.secondary_phone : ""}`,
                        address: `${item.street}, ${item.address}, ${item.city}, ${item.state}, ${item.pincode}`,
                        category: item.enquirystatuses[item.enquirystatuses.length - 1].remark,
                        sales_person: item.user.firstName + (item.user.lastName ? item.user.lastName : ""),
                        task_start: item.installer_tasks.length != 0 ? item.installer_tasks[item.installer_tasks.length - 1].date : "Installer not assigned",
                        task_end: item.installer_tasks.length != 0 && item.installer_tasks[item.installer_tasks.length - 1].status != "completed" ? " Installation not completed yet " : formattedDate,
                        days: item.installer_tasks.length != 0 && item.installer_tasks[item.installer_tasks.length - 1].status != "completed" ? "" : daysDiff < 1 ? "< 1" : Math.round(daysDiff).toString(),
                        aging: item.installer_tasks.length != 0 && item.installer_tasks[item.installer_tasks.length - 1].status != "completed" ? "" : hours < 24 ? "<24hrs" : hours > 24 && hours < 48 ? "24hrs" : hours > 48 && hours < 72 ? "48hrs" : hours == 72 ? "72hrs" : ">72hrs",
                        installer,
                        assign_date: item.installer_tasks.length != 0 && item.installer_tasks.length == 0 ? "Installer not assgined" : startTime,
                        installation_assign_date: item.installer_tasks.length == 0 ? "" : item.installer_tasks[item.installer_tasks.length - 1].createdAt,
                        status: item.status,
                        store: store.firstName,
                        products: products.toString(),
                        installation_status: item.installer_tasks.length == 0 ? "" : item.installer_tasks[item.installer_tasks.length - 1].status,
                        expected_installation: item.expected_installation_date,
                        expected_delivery: item.expected_delivery_date,
                    }).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    EnquiryArray.push(item);
                }

            }
        }

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Measurement Completed(Store).xlsx"
        );
        await workbook.xlsx.write(res)
        res.status(200).end();
        // return res.status(200).json({
        //     message: "Enquiry Data Fetched",
        //     status: true,
        //     data: EnquiryArray
        // })
    } catch (e) {
        next(e)
    }
}

exports.InstallerWiseInstallationComplete = async (req, res, next) => {
    try {
        const EnquiryArray = []
        const salesId = req.query.salesId || '';
        const stores = await User.findAll({ where: { id: req.params.id, type: "outlet" } });
        dataNotFound(stores[0], 404, "Store Not Found")

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Installation (Store)");
        worksheet.columns = [
            { header: 'Enquiry Id', key: 'enquiryId', width: 15 },
            { header: 'Date', key: 'date', width: 15, },
            { header: 'Customer Name', key: 'customerName', width: 32, },
            { header: 'Customer Mobile No.', key: 'phone', width: 32, },
            { header: 'Secondary Mobile No.', key: 'phone2', width: 32, },
            { header: 'Category', key: 'category', width: 30, },
            { header: 'Products', key: 'products', width: 50, },
            { header: 'Sales Person', key: 'sales_person', width: 50, },
            { header: 'Task Start', key: 'task_start', width: 32, },
            { header: 'Installation Assign Date', key: 'expected_installation', width: 32, },
            { header: 'Expected Installation Date', key: 'expected_delivery', width: 32, },
            { header: 'Expected Delivery Date', key: 'installation_assign_date', width: 32, },
            { header: 'Installation Start Date', key: 'assign_date', width: 32, },
            { header: 'Installation Complete Date', key: 'task_end', width: 32, },
            { header: 'Installation Status', key: 'installation_status', width: 32, },
            { header: 'Days', key: 'days', width: 15, },
            { header: 'Aging', key: 'aging', width: 15, },
            { header: 'Installer', key: 'installer', width: 32, },
            { header: 'Status', key: 'status', width: 32, },
            { header: 'Address', key: 'address', width: 80, },
            { header: 'Store', key: 'store', width: 50, },
        ];
        for (let i = 0; i < stores.length; i++) {
            const store = stores[i];
            const storeSalesPersons = await OutletUser.findAll({ where: { outletId: store.id } });

            for (let j = 0; j < storeSalesPersons.length; j++) {
                const storeSalesPerson = storeSalesPersons[j];
                let dateCondition;
                if (req.query.fromDate && req.query.toDate) {
                    dateCondition = {
                        createdAt: {
                            [Op.gte]: req.query.fromDate,
                            [Op.lte]: req.query.toDate
                        }
                    }
                }
                const enquiry = [];
                if (salesId && salesId == storeSalesPerson.salesPersonId) {
                    const enquiries = await Enquiry.findAll({
                        where: {
                            salesId: storeSalesPerson.dataValues.salesPersonId,
                            status: {
                                [Op.or]: ["completed"]
                            }
                        }, include: [
                            { model: InstallerTasks, include: [{ model: User, as: "installer" }, { model: User, as: "warehouse" }] },
                            { model: EnquiryStatus },
                            { model: Customer },
                            { model: User },
                            { model: Enquiry_Schedule, include: User, },
                            { model: Room }
                        ]
                    })
                    enquiry.push(...enquiries)
                } else if (!salesId) {
                    const enquiries = await Enquiry.findAll({
                        where: {
                            salesId: storeSalesPerson.dataValues.salesPersonId,
                            status: {
                                [Op.or]: ["completed"]
                            }
                        }, include: [
                            { model: InstallerTasks, include: [{ model: User, as: "installer" }, { model: User, as: "warehouse" }] },
                            { model: EnquiryStatus },
                            { model: Customer },
                            { model: User },
                            { model: Enquiry_Schedule, include: User, },
                            { model: Room }
                        ]
                    })
                    enquiry.push(...enquiries)
                }

                for (let k = 0; k < enquiry.length; k++) {

                    const item = enquiry[k];
                    const products = []
                    const selectedmaterial = await SelectedMaterial.findAll({ where: { enquiryId: item.id }, include: [Material] })

                    for (const l of selectedmaterial) {
                        const materials = await Material.findOne({ where: { id: l.materialId } });
                        if (!products.includes(materials.name)) {
                            products.push(materials.name);
                        }
                    }
                    const startTime = item.installer_tasks.length > 0 ? item.installer_tasks[item.installer_tasks.length - 1].date : item.createdAt
                    const endTime = item.installer_tasks.length > 0 ? item.installer_tasks[item.installer_tasks.length - 1].updatedAt : item.updatedAt
                    const date = endTime.toISOString().split("T")[0]
                    const parts = date.split('-');
                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

                    const installer = item.installer_tasks.length > 0 && item.installer_tasks[0].installer ? `${item.installer_tasks[item.installer_tasks.length - 1].installer.firstName} ${item.installer_tasks[item.installer_tasks.length - 1].installer.lastName}` : "User Not Available or Assigned"

                    const timeDiff = new Date(endTime).getTime() - new Date(startTime).getTime();
                    let daysDiff = timeDiff / (1000 * 3600 * 24).toFixed(0);
                    let hours = (daysDiff * 24).toFixed(0)
                    worksheet.addRow({
                        enquiryId: item.enquiryId,
                        date: new Date(item.createdAt).toISOString().split("T")[0],
                        customerName: item.customer.firstName + " " + (item.customer.lastName ? item.customer.lastName : ""),
                        phone: ` ${item.customer.primary_phone} `,
                        phone2: ` ${item.customer.secondary_phone ? item.customer.secondary_phone : ""}`,
                        address: `${item.street}, ${item.address}, ${item.city}, ${item.state}, ${item.pincode}`,
                        category: item.enquirystatuses[item.enquirystatuses.length - 1].remark,
                        sales_person: item.user.firstName + (item.user.lastName ? item.user.lastName : ""),
                        task_start: item.installer_tasks.length != 0 ? item.installer_tasks[item.installer_tasks.length - 1].date : "Installer not assigned",
                        task_end: item.installer_tasks.length != 0 && item.installer_tasks[item.installer_tasks.length - 1].status != "completed" ? " Installation not completed yet " : formattedDate,
                        days: item.installer_tasks.length != 0 && item.installer_tasks[item.installer_tasks.length - 1].status != "completed" ? "" : daysDiff < 1 ? "< 1" : Math.round(daysDiff).toString(),
                        aging: item.installer_tasks.length != 0 && item.installer_tasks[item.installer_tasks.length - 1].status != "completed" ? "" : hours < 24 ? "<24hrs" : hours > 24 && hours < 48 ? "24hrs" : hours > 48 && hours < 72 ? "48hrs" : hours == 72 ? "72hrs" : ">72hrs",
                        installer,
                        assign_date: item.installer_tasks.length != 0 && item.installer_tasks.length == 0 ? "Installer not assgined" : startTime,
                        installation_assign_date: item.installer_tasks.length == 0 ? "" : item.installer_tasks[item.installer_tasks.length - 1].createdAt,
                        status: item.status,
                        store: store.firstName,
                        products: products.toString(),
                        installation_status: item.installer_tasks.length == 0 ? "" : item.installer_tasks[item.installer_tasks.length - 1].status,
                        expected_installation: item.expected_installation_date,
                        expected_delivery: item.expected_delivery_date,
                    }).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    EnquiryArray.push(item);
                }

            }
        }

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Measurement Completed(Store).xlsx"
        );
        await workbook.xlsx.write(res)
        res.status(200).end();
        // return res.status(200).json({
        //     message: "Enquiry Data Fetched",
        //     status: true,
        //     data: EnquiryArray
        // })
    } catch (e) {
        next(e)
    }
}
exports.InstallerWiseInstallationStarted = async (req, res, next) => {
    try {
        const EnquiryArray = []
        const salesId = req.query.salesId || '';
        const stores = await User.findAll({ where: { id: req.params.id, type: "outlet" } });
        dataNotFound(stores[0], 404, "Store Not Found")

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Installation (Store)");
        worksheet.columns = [
            { header: 'Enquiry Id', key: 'enquiryId', width: 15 },
            { header: 'Date', key: 'date', width: 15, },
            { header: 'Customer Name', key: 'customerName', width: 32, },
            { header: 'Customer Mobile No.', key: 'phone', width: 32, },
            { header: 'Secondary Mobile No.', key: 'phone2', width: 32, },
            { header: 'Category', key: 'category', width: 30, },
            { header: 'Products', key: 'products', width: 50, },
            { header: 'Sales Person', key: 'sales_person', width: 50, },
            { header: 'Task Start', key: 'task_start', width: 32, },
            { header: 'Installation Assign Date', key: 'expected_installation', width: 32, },
            { header: 'Expected Installation Date', key: 'expected_delivery', width: 32, },
            { header: 'Expected Delivery Date', key: 'installation_assign_date', width: 32, },
            { header: 'Installation Start Date', key: 'assign_date', width: 32, },
            { header: 'Installation Complete Date', key: 'task_end', width: 32, },
            { header: 'Installation Status', key: 'installation_status', width: 32, },
            { header: 'Days', key: 'days', width: 15, },
            { header: 'Aging', key: 'aging', width: 15, },
            { header: 'Installer', key: 'installer', width: 32, },
            { header: 'Status', key: 'status', width: 32, },
            { header: 'Address', key: 'address', width: 80, },
            { header: 'Store', key: 'store', width: 50, },
        ];
        for (let i = 0; i < stores.length; i++) {
            const store = stores[i];
            const storeSalesPersons = await OutletUser.findAll({ where: { outletId: store.id } });

            for (let j = 0; j < storeSalesPersons.length; j++) {
                const storeSalesPerson = storeSalesPersons[j];
                let dateCondition;
                if (req.query.fromDate && req.query.toDate) {
                    dateCondition = {
                        createdAt: {
                            [Op.gte]: req.query.fromDate,
                            [Op.lte]: req.query.toDate
                        }
                    }
                }
                const enquiry = [];
                if (salesId && salesId == storeSalesPerson.salesPersonId) {
                    const enquiries = await Enquiry.findAll({
                        where: {
                            salesId: storeSalesPerson.dataValues.salesPersonId,
                            status: {
                                [Op.or]: ["installation-started"]
                            }
                        }, include: [
                            { model: InstallerTasks, include: [{ model: User, as: "installer" }, { model: User, as: "warehouse" }] },
                            { model: EnquiryStatus },
                            { model: Customer },
                            { model: User },
                            { model: Enquiry_Schedule, include: User, },
                            { model: Room }
                        ]
                    })
                    enquiry.push(...enquiries)
                } else if (!salesId) {
                    const enquiries = await Enquiry.findAll({
                        where: {
                            salesId: storeSalesPerson.dataValues.salesPersonId,
                            status: {
                                [Op.or]: ["installation-started"]
                            }
                        }, include: [
                            { model: InstallerTasks, include: [{ model: User, as: "installer" }, { model: User, as: "warehouse" }] },
                            { model: EnquiryStatus },
                            { model: Customer },
                            { model: User },
                            { model: Enquiry_Schedule, include: User, },
                            { model: Room }
                        ]
                    })
                }
                for (let k = 0; k < enquiry.length; k++) {

                    const item = enquiry[k];
                    const products = []
                    const selectedmaterial = await SelectedMaterial.findAll({ where: { enquiryId: item.id }, include: [Material] })

                    for (const l of selectedmaterial) {
                        const materials = await Material.findOne({ where: { id: l.materialId } });
                        if (!products.includes(materials.name)) {
                            products.push(materials.name);
                        }
                    }
                    const startTime = item.installer_tasks.length > 0 ? item.installer_tasks[item.installer_tasks.length - 1].date : item.createdAt
                    const endTime = item.installer_tasks.length > 0 ? item.installer_tasks[item.installer_tasks.length - 1].updatedAt : item.updatedAt
                    const date = endTime.toISOString().split("T")[0]
                    const parts = date.split('-');
                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

                    const installer = item.installer_tasks.length > 0 && item.installer_tasks[0].installer ? `${item.installer_tasks[item.installer_tasks.length - 1].installer.firstName} ${item.installer_tasks[item.installer_tasks.length - 1].installer.lastName}` : "User Not Available or Assigned"

                    const timeDiff = new Date(endTime).getTime() - new Date(startTime).getTime();
                    let daysDiff = timeDiff / (1000 * 3600 * 24).toFixed(0);
                    let hours = (daysDiff * 24).toFixed(0)
                    worksheet.addRow({
                        enquiryId: item.enquiryId,
                        date: new Date(item.createdAt).toISOString().split("T")[0],
                        customerName: item.customer.firstName + " " + (item.customer.lastName ? item.customer.lastName : ""),
                        phone: ` ${item.customer.primary_phone} `,
                        phone2: ` ${item.customer.secondary_phone ? item.customer.secondary_phone : ""}`,
                        address: `${item.street}, ${item.address}, ${item.city}, ${item.state}, ${item.pincode}`,
                        category: item.enquirystatuses[item.enquirystatuses.length - 1].remark,
                        sales_person: item.user.firstName + (item.user.lastName ? item.user.lastName : ""),
                        task_start: item.installer_tasks.length != 0 ? item.installer_tasks[item.installer_tasks.length - 1].date : "Installer not assigned",
                        task_end: item.installer_tasks.length != 0 && item.installer_tasks[item.installer_tasks.length - 1].status != "completed" ? " Installation not completed yet " : formattedDate,
                        days: item.installer_tasks.length != 0 && item.installer_tasks[item.installer_tasks.length - 1].status != "completed" ? "" : daysDiff < 1 ? "< 1" : Math.round(daysDiff).toString(),
                        aging: item.installer_tasks.length != 0 && item.installer_tasks[item.installer_tasks.length - 1].status != "completed" ? "" : hours < 24 ? "<24hrs" : hours > 24 && hours < 48 ? "24hrs" : hours > 48 && hours < 72 ? "48hrs" : hours == 72 ? "72hrs" : ">72hrs",
                        installer,
                        assign_date: item.installer_tasks.length != 0 && item.installer_tasks.length == 0 ? "Installer not assgined" : startTime,
                        installation_assign_date: item.installer_tasks.length == 0 ? "" : item.installer_tasks[item.installer_tasks.length - 1].createdAt,
                        status: item.status,
                        store: store.firstName,
                        products: products.toString(),
                        installation_status: item.installer_tasks.length == 0 ? "" : item.installer_tasks[item.installer_tasks.length - 1].status,
                        expected_installation: item.expected_installation_date,
                        expected_delivery: item.expected_delivery_date,
                    }).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    EnquiryArray.push(item);
                }

            }
        }

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Measurement Completed(Store).xlsx"
        );
        await workbook.xlsx.write(res)
        res.status(200).end();
        // return res.status(200).json({
        //     message: "Enquiry Data Fetched",
        //     status: true,
        //     data: EnquiryArray
        // })
    } catch (e) {
        next(e)
    }
}


exports.complaintList = async (req, res, next) => {
    try {
        const all_data = [];
        const desiredStoreId = req.params.id;
        const stores = await User.findAll({ where: { id: req.params.id, type: "outlet" } });
        dataNotFound(stores[0], 404, "Store Not Found")

        const complaint_task = await ComplaintTask.findAll({
            include: [
                { model: Enquiry, include: [Customer, User] },
                 {
                    model: Schedule
                },
                { model: User, as: "INSTALLER", attributes: ["id", "firstName", "lastName", "phone"] }
            ]
        });

        for (let i = 0; i < complaint_task.length; i++) {
            const data = JSON.parse(complaint_task[i].complaint_info);
            complaint_task[i].dataValues.complaint_info = data;

            const outlet_user = await OutletUser.findOne({ where: { salesPersonId: complaint_task[i].enquiry.salesId } });
            const store = await User.findOne({ where: { id: outlet_user.outletId } });

            // Check if the store ID matches the desired store ID
            if (store.id == desiredStoreId) {
                complaint_task[i].enquiry.dataValues.store = store;

                const category = [];
                const complaint_type = [];

                for (let j = 0; j < complaint_task[i].complaint_info.length; j++) {
                    const item = complaint_task[i].complaint_info[j];
                    const complaint_details = await Complaint.findOne({ where: { id: item.complaintId }, include: Material });
                    item.material = complaint_details.material;

                    category.push(complaint_task[i].complaint_info[j].material.name);
                    complaint_type.push(complaint_task[i].complaint_info[j].type);
                }

                const item = complaint_task[i];
                all_data.push(item);
            }
        }

        return res.status(200).json({
            message: "Complaint Data Fetched",
            status: true,
            data: all_data
        });

    } catch (e) {
        next(e);
    }
};


