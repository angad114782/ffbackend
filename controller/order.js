const {
  dataNotFound,
  dataFound,
  getAuthHeaderConfig,
} = require("../helper/functions");
const {
  Order,
  Enquiry,
  Customer,
  User,
  EnquiryStatus,
  Room,
  RoomAsset,
  OutletUser,
  Notification,
  Order_Bill,
  Enquiry_Schedule,
  Media,
  SelectedMaterial,
  Material,
  SelectedCurtain,
  CurtainFabric,
  CurtainStyle,
  Gathering,
  ScrewSize,
  BracketSize,
  Motorized_track,
  RodType,
  Finial,
  TieKnob,
  SelectedSheer,
  SheerFabric,
  Book,
  Brand,
  CurtainPattern,
  BorderType,
  Quality_Check,
  Liniing,
  BeltType,
  Quality_Check_Remarks,
  OrderItem,
  UserQualityDetail,
  LiningFabric,
  Message,
} = require("../model");
const QualityCheck = require("../model/quality-check");
const axios = require("axios");
const { customerOutstandingAmount } = require("../helper/ax-function");
const sequelize = require("../utils/database");
const { order_confirmation } = require("../helper/messages");
const { whatsappMessage, send_notification } = require("../helper/mailer");
const { UploadFile, removefile } = require("../helper/multer");
const { Op } = require("sequelize");

exports.assignVendor = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { enquiryId: req.body.enquiryId },
    });
    dataFound(order, 400, "Vendor already assign");

    const newOrder = Order.create({
      orderId: "",
      orderDate: new Date(),
      enquiryId: req.body.enquiryId,
      userId: req.body.userId ? req.body.userId : null,
      orderStatus: "pending",
      vendor_assign_date: req.body.vendor_assign_date,
      customerId: req.body.customerId,
    });

    await EnquiryStatus.create({
      remark: "QC Pending",
      status: "completed",
      enquiryId: req.body.enquiryId,
    });

    res.status(200).json({
      message: "Vendor assign Successfully",
      data: newOrder,
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

exports.searchOrder = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.enquiryId) {
      where.enquiryId = req.query.enquiryId;
    }
    if (req.query.orderId) {
      where.orderId = req.query.orderId;
    }
    const order = await Order.findOne({ where: { ...where } });
    dataNotFound(order, 404, "Order Not Found");

    res.status(200).json({
      message: "Order Found Successfully",
      data: [order],
      status: true,
    });
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.assignOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { orderId: req.params.orderId },
    });
    dataNotFound(order, 404, "Order Not Found");

    await order.update({
      userId: req.params.userId,
    });

    res.status(200).json({
      message: "Order Found Successfully",
      data: order,
      status: true,
    });
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateDeliveryDate = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.update(
      {
        // status: "order-confirmed",
        expected_delivery_date: req.body.expected_delivery_date,
      },
      { where: { id: req.body.enquiryId } },
    );

    res.status(200).json({
      message: "Order Update Successfully",
      data: enquiry,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

exports.GetMyOrders = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.enquiryId) {
      where.enquiryId = req.query.enquiryId;
    }
    if (req.query.orderId) {
      where.orderId = req.query.orderId;
    }
    if (req.query.status) {
      where.orderStatus = req.query.status;
      where.is_partial_material = false;
    }
    if (req.query.partial_material) {
      where.is_partial_material = req.query.partial_material;
    }

    const page = parseInt(req.query.pageNo) || 1;
    const perPage = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * perPage;

    const order = await Order.findAndCountAll({
      where: { userId: req.userId, ...where },
      include: [
        User,
        {
          model: Customer,
          include: {
            model: User,
            as: "sales",
            attributes: { exclude: ["password", "activity"] },
          },
        },
        {
          model: Enquiry,
          where: { status: { [Op.notIn]: ["cancelled", "completed"] } },
          include: {
            model: User,
            attributes: [
              "userId",
              "id",
              "firstName",
              "lastName",
              "phone",
              "email",
              "type",
            ],
          },
        },
      ],
      limit: perPage,
      offset,
    });

    return res.status(200).json({
      message: "Order Found Successfully",
      data: order.rows,
      status: true,
      pageInfo: {
        count: order.count,
        currentPage: page,
        totalPage: Math.ceil(order.count / perPage),
      },
    });
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.GetMyDashboard = async (req, res, next) => {
  try {
    // const pending_orders = await Order.count({ where: { userId: req.userId, orderStatus: "pending", is_partial_material: false } });
    // const completed_orders = await Order.count({ where: { userId: req.userId, orderStatus: "completed", is_partial_material: false } });
    // const rejected_orders = await Order.count({ where: { userId: req.userId, orderStatus: "rejected", is_partial_material: false } });
    // const accepted_orders = await Order.count({ where: { userId: req.userId, orderStatus: "accepted", is_partial_material: false } });
    // const partial_material = await Order.count({ where: { userId: req.userId, is_partial_material: true}});
    const notification = await Notification.count({
      where: { qcId: req.userId },
    });
    const pending_orders = await Order.count({
      where: {
        userId: req.userId,
        is_partial_material: false,
        orderStatus: "pending",
      },
      include: {
        model: Enquiry,
        where: { status: { [Op.notIn]: ["cancelled", "completed"] } },
      },
    });
    const completed_orders = await Order.count({
      where: {
        userId: req.userId,
        is_partial_material: false,
        orderStatus: "completed",
      },
      include: {
        model: Enquiry,
        where: { status: { [Op.notIn]: ["cancelled"] } },
      },
    });
    const rejected_orders = await Order.count({
      where: {
        userId: req.userId,
        is_partial_material: false,
        orderStatus: "rejected",
      },
      include: {
        model: Enquiry,
        where: { status: { [Op.notIn]: ["cancelled", "completed"] } },
      },
    });
    const accepted_orders = await Order.count({
      where: {
        userId: req.userId,
        is_partial_material: false,
        orderStatus: "accepted",
      },
      include: {
        model: Enquiry,
        where: { status: { [Op.notIn]: ["cancelled", "completed"] } },
      },
    });
    const partial_material = await Order.count({
      where: { userId: req.userId, is_partial_material: true },
      include: { model: Enquiry, where: { status: { [Op.ne]: "cancelled" } } },
    });

    res.status(200).json({
      message: "Order Found Successfully",
      data: {
        pending_orders,
        completed_orders,
        rejected_orders,
        accepted_orders,
        partial_material,
        notification,
      },
      status: true,
    });
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAdminOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.orderId },
      include: [
        {
          model: Customer,
          include: {
            model: User,
            as: "sales",
            attributes: { exclude: ["password", "activity"] },
          },
        },
        User,
        {
          model: Enquiry,
          include: [
            {
              model: User,
              attributes: [
                "userId",
                "id",
                "firstName",
                "lastName",
                "phone",
                "email",
                "type",
              ],
            },
            { model: EnquiryStatus },
            { model: Enquiry_Schedule, include: User },
          ],
        },
      ],
    });
    dataNotFound(order, 404, "Order Not Found");

    const rooms = await Room.findAll({
      // include: [
      include: [
        {
          model: OrderItem,
          where: { orderId: order.id },

          include: [
            {
              model: UserQualityDetail,
              attributes: ["isChecked"],
              include: {
                model: Quality_Check,
                attributes: ["checks", "description"],
              },
            },
            Quality_Check_Remarks,
          ],
        },
      ],
      // ]
    });

    if (rooms.length > 0) {
      for (var i = 0; i < rooms.length; i++) {
        const order_items = rooms[i].order_items;

        if (order_items.length > 0) {
          for (let i = 0; i < order_items.length; i++) {
            const quality_check = order_items[i];

            const qc1 = [];
            const qc2 = [];
            const qc3 = [];

            for (
              let j = 0;
              j < quality_check.quality_check_remarks.length;
              j++
            ) {
              if (quality_check.quality_check_remarks[j].QCId == 1) {
                qc1.push(quality_check.quality_check_remarks[j]);
              } else if (quality_check.quality_check_remarks[j].QCId == 2) {
                qc2.push(quality_check.quality_check_remarks[j]);
              } else {
                qc3.push(quality_check.quality_check_remarks[j]);
              }
            }

            quality_check.dataValues.qc_details = { qc1, qc2, qc3 };
          }
        }

        // const selected_material = await SelectedMaterial.findAll({where: {roomId: rooms[i].id}, include: Material});
        // rooms[i].dataValues.selected_material = selected_material;
      }
    }

    order.dataValues.rooms = rooms;

    res.status(200).json({
      message: "Order items Found Successfully",
      data: order,
      status: true,
    });
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { orderId: req.params.orderId },
      include: [
        {
          model: OrderItem,
          attributes: [
            "id",
            "productId",
            "product_name",
            "size",
            "status",
            "quantity",
            "type",
            "price",
            "totalAmount",
            "roomId",
            "fabric_status",
            "sta_id",
            "delivery_date",
          ],
          include: [
            {
              model: UserQualityDetail,
              attributes: ["isChecked"],
              include: {
                model: Quality_Check,
                attributes: ["checks", "description"],
              },
            },
            Quality_Check_Remarks,
          ],
        },
        { model: Customer, include: { model: User, as: "sales" } },
        User,
        {
          model: Enquiry,
          include: [
            { model: EnquiryStatus },
            { model: Enquiry_Schedule, include: User },
          ],
        },
      ],
    });
    dataNotFound(order, 404, "Order Not Found");

    if (order.order_items.length > 0) {
      for (let i = 0; i < order.order_items.length; i++) {
        const quality_check = order.order_items[i];

        const qc1 = [];
        const qc2 = [];
        const qc3 = [];

        for (let j = 0; j < quality_check.quality_check_remarks.length; j++) {
          if (quality_check.quality_check_remarks[j].QCId == 1) {
            qc1.push(quality_check.quality_check_remarks[j]);
          } else if (quality_check.quality_check_remarks[j].QCId == 2) {
            qc2.push(quality_check.quality_check_remarks[j]);
          } else {
            qc3.push(quality_check.quality_check_remarks[j]);
          }
        }

        quality_check.dataValues.qc_details = { qc1, qc2, qc3 };
      }
    }

    res.status(200).json({
      message: "Order Found Successfully",
      data: order,
      status: true,
    });
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createSalesOrder = async (req, res, next) => {
  try {
    if (!req.body.enquiryId) {
      throw new Error("Enquiry Id Required!");
    }
    const enquiry = await Enquiry.findOne({
      where: { enquiryId: req.body.enquiryId },
    });

    const order = await Order.findOne({ where: { enquiryId: enquiry.id } });

    if (!order) {
      const newOrder = await Order.create({
        orderId: req.body.orderId,
        enquiryId: enquiry.id,
        userId: 51,
        orderStatus: "pending",
        orderDate: new Date(),
        customerId: enquiry.customerId,
      });

      await Enquiry.update(
        {
          status: "order-confirmed",
          estimate_created: true,
          expected_delivery_date: req.body.expected_delivery_date,
        },
        { where: { id: enquiry.id } },
      );

      const customer = await Customer.findOne({
        where: { id: enquiry.customerId },
      });
      const salesPerson = await User.findOne({
        where: { id: enquiry.salesId },
      });

      await EnquiryStatus.create({
        remark: "Order created with Order No: " + req.body.orderId,
        status: "completed",
        enquiryId: enquiry.id,
      });

      const getEstimateResponse = await axios.get(
        `${process.env.LOCAL_URL}api/v1/sales/get-estimate/` + enquiry.id,
        getAuthHeaderConfig(req),
      );
      const response = getEstimateResponse.data.data;
      for (var i = 0; i < response.length; i++) {
        const resp = response[i];
        if (resp.curtain) {
          if (resp.curtain.fabric1 && resp.curtain.fabric1.length > 0) {
            for (var j = 0; j < resp.curtain.fabric1.length; j++) {
              const fabric = resp.curtain.fabric1[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "curtain",
                sta_id: "main_fabric",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 1,
              });
            }
          }
          if (resp.curtain.fabric2 && resp.curtain.fabric2.length > 0) {
            for (var j = 0; j < resp.curtain.fabric2.length; j++) {
              const fabric = resp.curtain.fabric2[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "curtain",
                sta_id: "secondary_fabric",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 1,
              });
            }
          }
          if (resp.curtain.mock_fabric && resp.curtain.mock_fabric.length > 0) {
            for (var j = 0; j < resp.curtain.mock_fabric.length; j++) {
              const fabric = resp.curtain.mock_fabric[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "curtain",
                sta_id: "mock_fabric",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 1,
              });
            }
          }
          if (
            resp.curtain.lining_fabric &&
            resp.curtain.lining_fabric.length > 0
          ) {
            for (var j = 0; j < resp.curtain.lining_fabric.length; j++) {
              const fabric = resp.curtain.lining_fabric[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "curtain_lining",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 1,
                sta_id: "lining_fabric",
              });
            }
          }
          if (resp.curtain.pelmet && resp.curtain.pelmet.length > 0) {
            for (var j = 0; j < resp.curtain.pelmet.length; j++) {
              const fabric = resp.curtain.pelmet[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "pelmet",
                price: fabric.mrp,
                totalAmount: fabric.netAmount ? fabric.netAmount : 0,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 1,
                sta_id: "pelmet",
              });
            }
          }
          if (resp.curtain.belt && resp.curtain.belt.length > 0) {
            for (var j = 0; j < resp.curtain.belt.length; j++) {
              const fabric = resp.curtain.belt[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "belt",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 1,
                sta_id: "belt",
              });
            }
          }
          if (resp.curtain.beltBorder && resp.curtain.beltBorder.length > 0) {
            for (var j = 0; j < resp.curtain.beltBorder.length; j++) {
              const fabric = resp.curtain.beltBorder[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "belt_bordor",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 1,
                sta_id: "belt_border",
              });
            }
          }
          if (
            resp.curtain.primary_border &&
            resp.curtain.primary_border.length > 0
          ) {
            for (var j = 0; j < resp.curtain.primary_border.length; j++) {
              const fabric = resp.curtain.primary_border[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "border",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 1,
                sta_id: "primary_border",
              });
            }
          }
          if (
            resp.curtain.secondary_border &&
            resp.curtain.secondary_border.length > 0
          ) {
            for (var j = 0; j < resp.curtain.secondary_border.length; j++) {
              const fabric = resp.curtain.secondary_border[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "border",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 1,
                sta_id: "secondary_border",
              });
            }
          }
          if (resp.curtain.beltPiping && resp.curtain.beltPiping.length > 0) {
            for (var j = 0; j < resp.curtain.beltPiping.length; j++) {
              const fabric = resp.curtain.beltPiping[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "belt_piping",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 1,
                sta_id: "belt_piping",
              });
            }
          }
          if (
            resp.curtain.pelmet_track &&
            resp.curtain.pelmet_track.length > 0
          ) {
            for (var j = 0; j < resp.curtain.pelmet_track.length; j++) {
              const fabric = resp.curtain.pelmet_track[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "pelmet_track",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 1,
                sta_id: "pelmet_track",
              });
            }
          }
        }
        if (resp.sheer) {
          if (resp.sheer.fabric && resp.sheer.fabric.length > 0) {
            for (var j = 0; j < resp.sheer.fabric.length; j++) {
              const fabric = resp.sheer.fabric[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "sheer",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 2,
                sta_id: "sheer",
              });
            }
          }
        }
        if (resp.track) {
          if (resp.track.primary_track && resp.track.primary_track.length > 0) {
            for (var j = 0; j < resp.track.primary_track.length; j++) {
              const fabric = resp.track.primary_track[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.width,
                status: "pending",
                type: "track",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "primary_track",
              });
            }
          }
          if (
            resp.track.primaryTrackMotor &&
            resp.track.primaryTrackMotor.length > 0
          ) {
            for (var j = 0; j < resp.track.primaryTrackMotor.length; j++) {
              const fabric = resp.track.primaryTrackMotor[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: 1,
                status: "pending",
                type: "track motor",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "primary_track_motor",
              });
            }
          }
          if (
            resp.track.secondaryTrackMotor &&
            resp.track.secondaryTrackMotor.length > 0
          ) {
            for (var j = 0; j < resp.track.secondaryTrackMotor.length; j++) {
              const fabric = resp.track.secondaryTrackMotor[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: 1,
                status: "pending",
                type: "track motor",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "secondary_track_motor",
              });
            }
          }
          if (
            resp.track.mockTrackMotor &&
            resp.track.mockTrackMotor.length > 0
          ) {
            for (var j = 0; j < resp.track.mockTrackMotor.length; j++) {
              const fabric = resp.track.mockTrackMotor[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: 1,
                status: "pending",
                type: "track motor",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "mock_track_motor",
              });
            }
          }
          if (
            resp.track.primaryTrackRemote &&
            resp.track.primaryTrackRemote.length > 0
          ) {
            for (var j = 0; j < resp.track.primaryTrackRemote.length; j++) {
              const fabric = resp.track.primaryTrackRemote[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "track remote",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "primary_track_remote",
              });
            }
          }
          if (
            resp.track.secondaryTrackRemote &&
            resp.track.secondaryTrackRemote.length > 0
          ) {
            for (var j = 0; j < resp.track.secondaryTrackRemote.length; j++) {
              const fabric = resp.track.secondaryTrackRemote[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "track remote",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "secondary_track_remote",
              });
            }
          }
          if (
            resp.track.mockTrackRemote &&
            resp.track.mockTrackRemote.length > 0
          ) {
            for (var j = 0; j < resp.track.mockTrackRemote.length; j++) {
              const fabric = resp.track.mockTrackRemote[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "track remote",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "mock_track_remote",
              });
            }
          }
          if (
            resp.track.primary_overlapper &&
            resp.track.primary_overlapper.length > 0
          ) {
            for (var j = 0; j < resp.track.primary_overlapper.length; j++) {
              const fabric = resp.track.primary_overlapper[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "Overlapper",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "primary_track_overlapper",
              });
            }
          }
          if (
            resp.track.secondaryOverlapper &&
            resp.track.secondaryOverlapper.length > 0
          ) {
            for (var j = 0; j < resp.track.secondaryOverlapper.length; j++) {
              const fabric = resp.track.secondaryOverlapper[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "Overlapper",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "secondary_track_overlapper",
              });
            }
          }
          if (
            resp.track.mock_overlappper &&
            resp.track.mock_overlappper.length > 0
          ) {
            for (var j = 0; j < resp.track.mock_overlappper.length; j++) {
              const fabric = resp.track.mock_overlappper[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "Overlapper",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "mock_track_overlapper",
              });
            }
          }
          if (
            resp.track.primary_track_curatin_stick &&
            resp.track.primary_track_curatin_stick.length > 0
          ) {
            for (
              var j = 0;
              j < resp.track.primary_track_curatin_stick.length;
              j++
            ) {
              const fabric = resp.track.primary_track_curatin_stick[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "Curtain Stick",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "primary_track_curatin_stick",
              });
            }
          }
          if (
            resp.track.secondary_track_curatin_stick &&
            resp.track.secondary_track_curatin_stick.length > 0
          ) {
            for (
              var j = 0;
              j < resp.track.secondary_track_curatin_stick.length;
              j++
            ) {
              const fabric = resp.track.secondary_track_curatin_stick[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "Curtain Stick",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "secondary_track_curatin_stick",
              });
            }
          }
          if (
            resp.track.mock_track_curatin_stick &&
            resp.track.mock_track_curatin_stick.length > 0
          ) {
            for (
              var j = 0;
              j < resp.track.mock_track_curatin_stick.length;
              j++
            ) {
              const fabric = resp.track.mock_track_curatin_stick[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "Curtain Stick",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "mock_track_curatin_stick",
              });
            }
          }
          if (
            resp.track.primary_extra_track_bracket &&
            resp.track.primary_extra_track_bracket.length > 0
          ) {
            for (
              var j = 0;
              j < resp.track.primary_extra_track_bracket.length;
              j++
            ) {
              const fabric = resp.track.primary_extra_track_bracket[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "Extra Track Braket",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "primary_track_extra_track_bracket",
              });
            }
          }
          if (
            resp.track.secondary_extra_track_bracket &&
            resp.track.secondary_extra_track_bracket.length > 0
          ) {
            for (
              var j = 0;
              j < resp.track.secondary_extra_track_bracket.length;
              j++
            ) {
              const fabric = resp.track.secondary_extra_track_bracket[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "Extra Track Braket",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "secondary_track_extra_bracket",
              });
            }
          }
          if (
            resp.track.mock_extra_track_bracket &&
            resp.track.mock_extra_track_bracket.length > 0
          ) {
            for (
              var j = 0;
              j < resp.track.mock_extra_track_bracket.length;
              j++
            ) {
              const fabric = resp.track.mock_extra_track_bracket[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "Extra Track Braket",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "mock_track_extra_track_bracket",
              });
            }
          }
          if (
            resp.track.primary_track_tieknob &&
            resp.track.primary_track_tieknob.length > 0
          ) {
            for (var j = 0; j < resp.track.primary_track_tieknob.length; j++) {
              const fabric = resp.track.primary_track_tieknob[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "TieKnob",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "primary_track_tieknob",
              });
            }
          }
          if (
            resp.track.secondary_track_tieknob &&
            resp.track.secondary_track_tieknob.length > 0
          ) {
            for (
              var j = 0;
              j < resp.track.secondary_track_tieknob.length;
              j++
            ) {
              const fabric = resp.track.secondary_track_tieknob[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "TieKnob",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "secondary_track_tieknob",
              });
            }
          }
          if (
            resp.track.mock_track_tieknob &&
            resp.track.mock_track_tieknob.length > 0
          ) {
            for (var j = 0; j < resp.track.mock_track_tieknob.length; j++) {
              const fabric = resp.track.mock_track_tieknob[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "TieKnob",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "mock_track_tieknob",
              });
            }
          }
          if (resp.track.Lbracket && resp.track.Lbracket.length > 0) {
            for (var j = 0; j < resp.track.Lbracket.length; j++) {
              const fabric = resp.track.Lbracket[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "Lbracket",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "l_bracket",
              });
            }
          }
          if (
            resp.track.secondary_track_data &&
            resp.track.secondary_track_data.length > 0
          ) {
            for (var j = 0; j < resp.track.secondary_track_data.length; j++) {
              const fabric = resp.track.secondary_track_data[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.width,
                status: "pending",
                type: "track",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "secondary_track",
              });
            }
          }
          if (
            resp.track.mock_track_data &&
            resp.track.mock_track_data.length > 0
          ) {
            for (var j = 0; j < resp.track.mock_track_data.length; j++) {
              const fabric = resp.track.mock_track_data[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.width,
                status: "pending",
                type: "track",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "mock_track",
              });
            }
          }
        }
        if (resp.rod) {
          if (resp.rod.primary_rod && resp.rod.primary_rod.length > 0) {
            for (var j = 0; j < resp.rod.primary_rod.length; j++) {
              const fabric = resp.rod.primary_rod[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.width,
                status: "pending",
                type: "rod",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "primary_rod",
              });
            }
          }
          if (resp.rod.curtainStick && resp.rod.curtainStick.length > 0) {
            for (var j = 0; j < resp.rod.curtainStick.length; j++) {
              const fabric = resp.rod.curtainStick[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "Curtain Stick",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "curtain_stick",
              });
            }
          }
          if (
            resp.rod.extraBracketSupport &&
            resp.rod.extraBracketSupport.length > 0
          ) {
            for (var j = 0; j < resp.rod.extraBracketSupport.length; j++) {
              const fabric = resp.rod.extraBracketSupport[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "Extra Bracket Support",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "extra_bracket_support",
              });
            }
          }
          if (resp.rod.extraBracket && resp.rod.extraBracket.length > 0) {
            for (var j = 0; j < resp.rod.extraBracket.length; j++) {
              const fabric = resp.rod.extraBracket[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "Extra Bracket",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "extra_bracket",
              });
            }
          }
          if (resp.rod.endCap && resp.rod.endCap.length > 0) {
            for (var j = 0; j < resp.rod.endCap.length; j++) {
              const fabric = resp.rod.endCap[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "End cap",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "end_cap_wall_support",
              });
            }
          }
          if (resp.rod.secondary_rod && resp.rod.secondary_rod.length > 0) {
            for (var j = 0; j < resp.rod.secondary_rod.length; j++) {
              const fabric = resp.rod.secondary_rod[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.width,
                status: "pending",
                type: "rod",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "secondary_rod",
              });
            }
          }
          if (
            resp.rod.endCapWallSupport &&
            resp.rod.endCapWallSupport.length > 0
          ) {
            for (var j = 0; j < resp.rod.endCapWallSupport.length; j++) {
              const fabric = resp.rod.endCapWallSupport[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.width,
                status: "pending",
                type: "rod",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "end_cap_wall_support",
              });
            }
          }
          if (resp.rod.finial && resp.rod.finial.length > 0) {
            for (var j = 0; j < resp.rod.finial.length; j++) {
              const fabric = resp.rod.finial[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.width,
                status: "pending",
                type: "rod",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "finial",
              });
            }
          }
          if (resp.rod.rodTieKnob && resp.rod.rodTieKnob.length > 0) {
            for (var j = 0; j < resp.rod.rodTieKnob.length; j++) {
              const fabric = resp.rod.rodTieKnob[j];
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.width,
                status: "pending",
                type: "rod",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 3,
                sta_id: "rod_tieknob",
              });
            }
          }
        }
        if (resp.blind) {
          if (
            resp.blind.blindFabricArr &&
            resp.blind.blindFabricArr.length > 0
          ) {
            for (var j = 0; j < resp.blind.blindFabricArr.length; j++) {
              const fabric =
                resp.blind.blindFabricArr[j] == 0
                  ? 0
                  : resp.blind.blindFabricArr[j];
              if (fabric && fabric != 0) {
                await OrderItem.create({
                  product_name: fabric.fabric1_name,
                  productId: fabric.id,
                  size: fabric.runningFeet,
                  status: "pending",
                  type: "blind fabric",
                  price: fabric.mrp,
                  totalAmount: fabric.netAmount,
                  orderId: newOrder.id,
                  roomId: resp.roomInfo.id,
                  materialId: 5,
                  sta_id: "blind_fabric",
                });
              }
            }
          }
          if (
            resp.blind.blindLiningArr &&
            resp.blind.blindLiningArr.length > 0
          ) {
            for (var j = 0; j < resp.blind.blindLiningArr.length; j++) {
              const fabric =
                resp.blind.blindLiningArr[j] == 0
                  ? 0
                  : resp.blind.blindLiningArr[j];
              if (fabric && fabric != 0) {
                await OrderItem.create({
                  product_name: fabric.fabric1_name,
                  productId: fabric.id,
                  size: resp.blind.blindFabricArr[j].runningFeet,
                  status: "pending",
                  type: "blind lining",
                  price: fabric.mrp,
                  totalAmount: fabric.netAmount,
                  orderId: newOrder.id,
                  roomId: resp.roomInfo.id,
                  materialId: 5,
                  sta_id: "blind_lining_fabric",
                });
              }
            }
          }
          if (
            resp.blind.blindShadesArr &&
            resp.blind.blindShadesArr.length > 0
          ) {
            for (var j = 0; j < resp.blind.blindShadesArr.length; j++) {
              const fabric =
                resp.blind.blindShadesArr[j] == 0
                  ? 0
                  : resp.blind.blindShadesArr[j];
              if (fabric && fabric != 0) {
                await OrderItem.create({
                  product_name: fabric.fabric1_name,
                  productId: fabric.id,
                  size: fabric.totalFabricUse,
                  status: "pending",
                  type: "blind shades",
                  price: fabric.mrp,
                  totalAmount: fabric.netAmount,
                  orderId: newOrder.id,
                  roomId: resp.roomInfo.id,
                  materialId: 5,
                  sta_id: "blind_shades",
                });
              }
            }
          }
          if (
            resp.blind.blindBorderFabricArr &&
            resp.blind.blindBorderFabricArr.length > 0
          ) {
            for (var j = 0; j < resp.blind.blindBorderFabricArr.length; j++) {
              const fabric =
                resp.blind.blindBorderFabricArr[j] == 0
                  ? 0
                  : resp.blind.blindBorderFabricArr[j];
              if (fabric && fabric != 0) {
                await OrderItem.create({
                  product_name: fabric.fabric1_name,
                  productId: fabric.id,
                  size: fabric.totalFabricUse,
                  status: "pending",
                  type: "blind border fabric",
                  price: fabric.mrp,
                  totalAmount: fabric.netAmount,
                  orderId: newOrder.id,
                  roomId: resp.roomInfo.id,
                  materialId: 5,
                  sta_id: "blind_border_fabric",
                });
              }
            }
          }
          if (resp.blind.blindTrack && resp.blind.blindTrack.length > 0) {
            for (var j = 0; j < resp.blind.blindTrack.length; j++) {
              const fabric =
                resp.blind.blindTrack[j] == 0 ? 0 : resp.blind.blindTrack[j];
              if (fabric && fabric != 0) {
                await OrderItem.create({
                  product_name: fabric.fabric1_name,
                  productId: fabric.id,
                  size: fabric.width,
                  status: "pending",
                  type: "blind track",
                  price: fabric.mrp,
                  totalAmount: fabric.netAmount,
                  orderId: newOrder.id,
                  roomId: resp.roomInfo.id,
                  materialId: 5,
                  sta_id: "blind_track",
                });
              }
            }
          }
          if (
            resp.blind.blindTrackRemote &&
            resp.blind.blindTrackRemote.length > 0
          ) {
            for (var j = 0; j < resp.blind.blindTrackRemote.length; j++) {
              const fabric =
                resp.blind.blindTrackRemote[j] == 0
                  ? 0
                  : resp.blind.blindTrackRemote[j];
              if (fabric && fabric != 0) {
                await OrderItem.create({
                  product_name: fabric.fabric1_name,
                  productId: fabric.id,
                  quantity: fabric.totalFabricUse,
                  status: "pending",
                  type: "blind track remote",
                  price: fabric.mrp,
                  totalAmount: fabric.netAmount,
                  orderId: newOrder.id,
                  roomId: resp.roomInfo.id,
                  materialId: 5,
                  sta_id: "blind_track_remote",
                });
              }
            }
          }
          if (
            resp.blind.blind_track_motor &&
            resp.blind.blind_track_motor.length > 0
          ) {
            for (var j = 0; j < resp.blind.blind_track_motor.length; j++) {
              const fabric =
                resp.blind.blind_track_motor[j] == 0
                  ? 0
                  : resp.blind.blind_track_motor[j];
              if (fabric && fabric != 0) {
                await OrderItem.create({
                  product_name: fabric.fabric1_name,
                  productId: fabric.id,
                  quantity: 1,
                  status: "pending",
                  type: "blind track remote",
                  price: fabric.mrp,
                  totalAmount: fabric.netAmount,
                  orderId: newOrder.id,
                  roomId: resp.roomInfo.id,
                  materialId: 5,
                  sta_id: "blind_track_motor",
                });
              }
            }
          }
          if (
            resp.blind.blindExtraBracket &&
            resp.blind.blindExtraBracket.length > 0
          ) {
            for (var j = 0; j < resp.blind.blindExtraBracket.length; j++) {
              const fabric =
                resp.blind.blindExtraBracket[j] == 0
                  ? 0
                  : resp.blind.blindExtraBracket[j];
              if (fabric && fabric != 0) {
                await OrderItem.create({
                  product_name: fabric.fabric1_name,
                  productId: fabric.id,
                  quantity: fabric.totalFabricUse,
                  status: "pending",
                  type: "blind extra bracket",
                  price: fabric.mrp,
                  totalAmount: fabric.netAmount,
                  orderId: newOrder.id,
                  roomId: resp.roomInfo.id,
                  materialId: 5,
                  sta_id: "blind_extra_bracket",
                });
              }
            }
          }
          if (
            resp.blind.blind_type_search_fabric &&
            resp.blind.blind_type_search_fabric.length > 0
          ) {
            for (
              var j = 0;
              j < resp.blind.blind_type_search_fabric.length;
              j++
            ) {
              const fabric =
                resp.blind.blind_type_search_fabric[j] == 0
                  ? 0
                  : resp.blind.blind_type_search_fabric[j];
              if (fabric && fabric != 0) {
                await OrderItem.create({
                  product_name: fabric.fabric1_name,
                  productId: fabric.id,
                  quantity: fabric.totalFabricUse,
                  status: "pending",
                  type: "blind type search fabric",
                  price: fabric.mrp,
                  totalAmount: fabric.netAmount,
                  orderId: newOrder.id,
                  roomId: resp.roomInfo.id,
                  materialId: 5,
                  sta_id: "blind_type_search_fabric",
                });
              }
            }
          }
        }
        if (resp.sofa.length > 0) {
          for (var j = 0; j < resp.sofa.length; j++) {
            const fabric = resp.sofa[j];
            if (fabric && fabric.primary_fabric) {
              await OrderItem.create({
                product_name: fabric.primary_fabric,
                productId: fabric.primary_fabric_id,
                size: fabric.primary_fabric_qty,
                status: "pending",
                type: "Primary Fabric " + fabric.type,
                price: fabric.primary_fabric_price,
                totalAmount: fabric.net_primary_fabric_price,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 6,
                sta_id: "sofa_primary_fabric",
              });
            }
            if (fabric && fabric.secondary_fabric) {
              await OrderItem.create({
                product_name: fabric.secondary_fabric,
                productId: fabric.secondary_fabric_id,
                size: fabric.secondary_fabric_qty,
                status: "pending",
                type: "Secondary Fabric " + fabric.type,
                price: fabric.secondary_fabric_price,
                totalAmount: fabric.net_secondary_fabric_price,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 6,
                sta_id: "sofa_secondary_fabric",
              });
            }
            if (fabric && fabric.piping_fabric) {
              await OrderItem.create({
                product_name: fabric.piping_fabric,
                productId: fabric.piping_fabric_id,
                size: fabric.piping_fabric_qty,
                status: "pending",
                type: "Piping Fabric " + fabric.type,
                price: fabric.piping_fabric_price,
                totalAmount: fabric.net_piping_fabric_price,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 6,
                sta_id: "sofa_piping_fabric",
              });
            }
          }
        }
        if (resp.Wallpaper) {
          for (var j = 0; j < resp.Wallpaper.wall_information.length; j++) {
            const fabric = resp.Wallpaper.wall_information[j];
            await OrderItem.create({
              product_name: fabric.wallpaper,
              productId: fabric.id,
              size:
                fabric.type == "mural"
                  ? fabric.total_area_sqft
                  : fabric.total_wallpaer_required,
              status: "pending",
              type: fabric.type,
              price: fabric.type == "mural" ? fabric.price : fabric.roll_price,
              totalAmount:
                fabric.type == "mural"
                  ? fabric.mural_cost
                  : fabric.total_roll_cost,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 9,
              sta_id: fabric.type,
            });
          }
        }
        if (resp.flooring) {
          const fabric = resp.flooring;
          await OrderItem.create({
            product_name: fabric.fabric1_name,
            productId: fabric.id,
            size:
              fabric.type == "carpet" ? fabric.width : fabric.totalFabricUse,
            status: "pending",
            type: fabric.type,
            price: fabric.mrp,
            totalAmount: fabric.gross_amount,
            orderId: newOrder.id,
            roomId: resp.roomInfo.id,
            materialId: 8,
            sta_id: fabric.type,
          });

          if (fabric.flooringItems) {
            // if(fabric.flooringItems.binding){
            //      await OrderItem.create({
            //         product_name: fabric.flooringItems.binding,
            //         productId: fabric.flooringItems.binding_id,
            //         quantity: fabric.flooringItems.binding_quantity,
            //         status: "pending",
            //         type: "Binding",
            //         price: fabric.flooringItems.binding_mrp,
            //         totalAmount: fabric.flooringItems.binding_cost,
            //         orderId: newOrder.id,
            //         roomId: resp.roomInfo.id,
            //         materialId: 8
            //     })
            // }
            // if(fabric.flooringItems.binding){
            //      await OrderItem.create({
            //         product_name: fabric.flooringItems.binding,
            //         productId: fabric.flooringItems.binding_id,
            //         quantity: fabric.flooringItems.binding_quantity,
            //         status: "pending",
            //         type: "Binding",
            //         price: fabric.flooringItems.binding_mrp,
            //         totalAmount: fabric.flooringItems.binding_cost,
            //         orderId: newOrder.id,
            //         roomId: resp.roomInfo.id,
            //         materialId: 8
            //     })
            // }
            if (fabric.flooringItems.binding) {
              await OrderItem.create({
                product_name: fabric.flooringItems.binding,
                productId: fabric.flooringItems.binding_id,
                quantity: fabric.flooringItems.binding_quantity,
                status: "pending",
                type: "Binding",
                price: fabric.flooringItems.binding_mrp,
                totalAmount: fabric.flooringItems.binding_cost,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 8,
                sta_id: "binding",
              });
            }
            if (fabric.flooringItems.skirting) {
              await OrderItem.create({
                product_name: fabric.flooringItems.skirting,
                productId: fabric.flooringItems.skirting_id,
                quantity: fabric.flooringItems.skirting_quantity,
                status: "pending",
                type: "Skirting",
                price: fabric.flooringItems.skirting_mrp,
                totalAmount: fabric.flooringItems.skirting_cost,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 8,
                sta_id: "skirting",
              });
            }
            if (fabric.flooringItems.reducer) {
              await OrderItem.create({
                product_name: fabric.flooringItems.reducer,
                productId: fabric.flooringItems.reducer_id,
                quantity: fabric.flooringItems.reducer_quantity,
                status: "pending",
                type: "Reducer",
                price: fabric.flooringItems.reducer_mrp,
                totalAmount: fabric.flooringItems.reducer_cost,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 8,
                sta_id: "reducer",
              });
            }
            if (fabric.flooringItems.t_profile) {
              await OrderItem.create({
                product_name: fabric.flooringItems.t_profile,
                productId: fabric.flooringItems.t_profile_id,
                quantity: fabric.flooringItems.t_profile_quantity,
                status: "pending",
                type: "TProfile",
                price: fabric.flooringItems.t_profile_mrp,
                totalAmount: fabric.flooringItems.t_profile_cost,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 8,
                sta_id: "t_profile",
              });
            }
            if (fabric.flooringItems.beeding) {
              await OrderItem.create({
                product_name: fabric.flooringItems.beeding,
                productId: fabric.flooringItems.beeding_id,
                quantity: fabric.flooringItems.beeding_quantity,
                status: "pending",
                type: "Beeding",
                price: fabric.flooringItems.beeding_mrp,
                totalAmount: fabric.flooringItems.beeding_cost,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 8,
                sta_id: "beeding",
              });
            }
            // if(fabric.flooringItems.margin){
            //      await OrderItem.create({
            //         product_name: fabric.flooringItems.margin,
            //         productId: fabric.flooringItems.margin_id,
            //         quantity: fabric.flooringItems.margin_quantity,
            //         status: "pending",
            //         type: "Margin",
            //         price: fabric.flooringItems.margin_mrp,
            //         totalAmount: fabric.flooringItems.margin_cost,
            //         orderId: newOrder.id,
            //         roomId: resp.roomInfo.id,
            //         materialId: 8,
            //         sta_id: fabric.type
            //     })
            // }
          }
        }
      }

      return res.status(201).json({
        message: "Order & QC Generated Successfully",
        status: true,
        data: newOrder,
      });
    }

    // const customer = await Customer.findOne({where: {id: enquiry.customerId}});
    // if(customer.ACCOUNTNUM){
    //     const data = await customerOutstandingAmount(customer.ACCOUNTNUM)

    //     const amount = data.openSoAmount + data.ledgerAmount;
    //     await customer.update({ outstanding_amount: amount});

    //     await enquiry.reload()
    // }

    res.status(201).json({
      message: "Order & QC Generated Successfully",
      status: true,
      data: order,
    });
  } catch (e) {
    next(e);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { enquiryId: req.body.enquiryId },
    });
    if (order) {
      return res.status(400).json({
        message: "Order Already Exist",
        data: order,
        status: false,
      });
    }
    const check_enquiry = await Enquiry.findOne({
      where: { id: req.body.enquiryId },
    });
    if (
      check_enquiry.status == "fresh" ||
      check_enquiry.status == "inprogess"
    ) {
      return res.status(200).json({
        message: "Enquiry measurement not completed",
        status: false,
      });
    }

    let newOrder = await Order.create({
      orderId: req.body.orderId,
      enquiryId: req.body.enquiryId,
      userId: req.body.userId ? req.body.userId : 51,
      orderStatus: "pending",
      orderDate: req.body.orderDate,
      customerId: check_enquiry.customerId,
    });

    const getEstimateResponse = await axios.get(
      `${process.env.LOCAL_URL}api/v1/sales/get-estimate/` + req.body.enquiryId,
      getAuthHeaderConfig(req),
    );
    const response = getEstimateResponse.data.data;
    for (var i = 0; i < response.length; i++) {
      const resp = response[i];
      if (resp.curtain) {
        if (resp.curtain.fabric1 && resp.curtain.fabric1.length > 0) {
          for (var j = 0; j < resp.curtain.fabric1.length; j++) {
            const fabric = resp.curtain.fabric1[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.totalFabricUse,
              status: "pending",
              type: "curtain",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 1,
            });
          }
        }
        if (resp.curtain.fabric2 && resp.curtain.fabric2.length > 0) {
          for (var j = 0; j < resp.curtain.fabric2.length; j++) {
            const fabric = resp.curtain.fabric2[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.totalFabricUse,
              status: "pending",
              type: "curtain",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 1,
            });
          }
        }
        if (resp.curtain.mock_fabric && resp.curtain.mock_fabric.length > 0) {
          for (var j = 0; j < resp.curtain.mock_fabric.length; j++) {
            const fabric = resp.curtain.mock_fabric[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.totalFabricUse,
              status: "pending",
              type: "curtain",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 1,
            });
          }
        }
        if (
          resp.curtain.lining_fabric &&
          resp.curtain.lining_fabric.length > 0
        ) {
          for (var j = 0; j < resp.curtain.lining_fabric.length; j++) {
            const fabric = resp.curtain.lining_fabric[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.totalFabricUse,
              status: "pending",
              type: "curtain_lining",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 1,
            });
          }
        }
        if (resp.curtain.pelmet && resp.curtain.pelmet.length > 0) {
          for (var j = 0; j < resp.curtain.pelmet.length; j++) {
            const fabric = resp.curtain.pelmet[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.totalFabricUse,
              status: "pending",
              type: "pelmet",
              price: fabric.mrp,
              totalAmount: fabric.netAmount ? fabric.netAmount : 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 1,
            });
          }
        }
        if (resp.curtain.belt && resp.curtain.belt.length > 0) {
          for (var j = 0; j < resp.curtain.belt.length; j++) {
            const fabric = resp.curtain.belt[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.totalFabricUse,
              status: "pending",
              type: "belt",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 1,
            });
          }
        }
        if (resp.curtain.beltBorder && resp.curtain.beltBorder.length > 0) {
          for (var j = 0; j < resp.curtain.beltBorder.length; j++) {
            const fabric = resp.curtain.beltBorder[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.totalFabricUse,
              status: "pending",
              type: "belt_bordor",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 1,
            });
          }
        }
        if (
          resp.curtain.primary_border &&
          resp.curtain.primary_border.length > 0
        ) {
          for (var j = 0; j < resp.curtain.primary_border.length; j++) {
            const fabric = resp.curtain.primary_border[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.totalFabricUse,
              status: "pending",
              type: "border",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 1,
            });
          }
        }
        if (
          resp.curtain.secondary_border &&
          resp.curtain.secondary_border.length > 0
        ) {
          for (var j = 0; j < resp.curtain.secondary_border.length; j++) {
            const fabric = resp.curtain.secondary_border[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.totalFabricUse,
              status: "pending",
              type: "border",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 1,
            });
          }
        }
        if (resp.curtain.beltPiping && resp.curtain.beltPiping.length > 0) {
          for (var j = 0; j < resp.curtain.beltPiping.length; j++) {
            const fabric = resp.curtain.beltPiping[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.totalFabricUse,
              status: "pending",
              type: "belt_piping",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 1,
            });
          }
        }
      }
      if (resp.sheer) {
        if (resp.sheer.fabric && resp.sheer.fabric.length > 0) {
          for (var j = 0; j < resp.sheer.fabric.length; j++) {
            const fabric = resp.sheer.fabric[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.totalFabricUse,
              status: "pending",
              type: "sheer",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 2,
            });
          }
        }
      }
      if (resp.track) {
        if (resp.track.primary_track && resp.track.primary_track.length > 0) {
          for (var j = 0; j < resp.track.primary_track.length; j++) {
            const fabric = resp.track.primary_track[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.width,
              status: "pending",
              type: "track",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.primaryTrackMotor &&
          resp.track.primaryTrackMotor.length > 0
        ) {
          for (var j = 0; j < resp.track.primaryTrackMotor.length; j++) {
            const fabric = resp.track.primaryTrackMotor[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: 1,
              status: "pending",
              type: "track motor",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.secondaryTrackMotor &&
          resp.track.secondaryTrackMotor.length > 0
        ) {
          for (var j = 0; j < resp.track.secondaryTrackMotor.length; j++) {
            const fabric = resp.track.secondaryTrackMotor[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: 1,
              status: "pending",
              type: "track motor",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (resp.track.mockTrackMotor && resp.track.mockTrackMotor.length > 0) {
          for (var j = 0; j < resp.track.mockTrackMotor.length; j++) {
            const fabric = resp.track.mockTrackMotor[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: 1,
              status: "pending",
              type: "track motor",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.primaryTrackRemote &&
          resp.track.primaryTrackRemote.length > 0
        ) {
          for (var j = 0; j < resp.track.primaryTrackRemote.length; j++) {
            const fabric = resp.track.primaryTrackRemote[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "track remote",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.secondaryTrackRemote &&
          resp.track.secondaryTrackRemote.length > 0
        ) {
          for (var j = 0; j < resp.track.secondaryTrackRemote.length; j++) {
            const fabric = resp.track.secondaryTrackRemote[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "track remote",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.mockTrackRemote &&
          resp.track.mockTrackRemote.length > 0
        ) {
          for (var j = 0; j < resp.track.mockTrackRemote.length; j++) {
            const fabric = resp.track.mockTrackRemote[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "track remote",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.primary_overlapper &&
          resp.track.primary_overlapper.length > 0
        ) {
          for (var j = 0; j < resp.track.primary_overlapper.length; j++) {
            const fabric = resp.track.primary_overlapper[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "Overlapper",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.secondaryOverlapper &&
          resp.track.secondaryOverlapper.length > 0
        ) {
          for (var j = 0; j < resp.track.secondaryOverlapper.length; j++) {
            const fabric = resp.track.secondaryOverlapper[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "Overlapper",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.mock_overlappper &&
          resp.track.mock_overlappper.length > 0
        ) {
          for (var j = 0; j < resp.track.mock_overlappper.length; j++) {
            const fabric = resp.track.mock_overlappper[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "Overlapper",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.primary_track_curatin_stick &&
          resp.track.primary_track_curatin_stick.length > 0
        ) {
          for (
            var j = 0;
            j < resp.track.primary_track_curatin_stick.length;
            j++
          ) {
            const fabric = resp.track.primary_track_curatin_stick[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "Curtain Stick",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.secondary_track_curatin_stick &&
          resp.track.secondary_track_curatin_stick.length > 0
        ) {
          for (
            var j = 0;
            j < resp.track.secondary_track_curatin_stick.length;
            j++
          ) {
            const fabric = resp.track.secondary_track_curatin_stick[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "Curtain Stick",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.mock_track_curatin_stick &&
          resp.track.mock_track_curatin_stick.length > 0
        ) {
          for (var j = 0; j < resp.track.mock_track_curatin_stick.length; j++) {
            const fabric = resp.track.mock_track_curatin_stick[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "Curtain Stick",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.primary_extra_track_bracket &&
          resp.track.primary_extra_track_bracket.length > 0
        ) {
          for (
            var j = 0;
            j < resp.track.primary_extra_track_bracket.length;
            j++
          ) {
            const fabric = resp.track.primary_extra_track_bracket[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "Extra Track Braket",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.secondary_extra_track_bracket &&
          resp.track.secondary_extra_track_bracket.length > 0
        ) {
          for (
            var j = 0;
            j < resp.track.secondary_extra_track_bracket.length;
            j++
          ) {
            const fabric = resp.track.secondary_extra_track_bracket[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "Extra Track Braket",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.mock_extra_track_bracket &&
          resp.track.mock_extra_track_bracket.length > 0
        ) {
          for (var j = 0; j < resp.track.mock_extra_track_bracket.length; j++) {
            const fabric = resp.track.mock_extra_track_bracket[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "Extra Track Braket",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.primary_track_tieknob &&
          resp.track.primary_track_tieknob.length > 0
        ) {
          for (var j = 0; j < resp.track.primary_track_tieknob.length; j++) {
            const fabric = resp.track.primary_track_tieknob[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "TieKnob",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.secondary_track_tieknob &&
          resp.track.secondary_track_tieknob.length > 0
        ) {
          for (var j = 0; j < resp.track.secondary_track_tieknob.length; j++) {
            const fabric = resp.track.secondary_track_tieknob[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "TieKnob",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.mock_track_tieknob &&
          resp.track.mock_track_tieknob.length > 0
        ) {
          for (var j = 0; j < resp.track.mock_track_tieknob.length; j++) {
            const fabric = resp.track.mock_track_tieknob[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "TieKnob",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (resp.track.Lbracket && resp.track.Lbracket.length > 0) {
          for (var j = 0; j < resp.track.Lbracket.length; j++) {
            const fabric = resp.track.Lbracket[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "Lbracket",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.secondary_track_data &&
          resp.track.secondary_track_data.length > 0
        ) {
          for (var j = 0; j < resp.track.secondary_track_data.length; j++) {
            const fabric = resp.track.secondary_track_data[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.width,
              status: "pending",
              type: "track",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.track.mock_track_data &&
          resp.track.mock_track_data.length > 0
        ) {
          for (var j = 0; j < resp.track.mock_track_data.length; j++) {
            const fabric = resp.track.mock_track_data[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.width,
              status: "pending",
              type: "track",
              price: fabric.mrp,
              totalAmount: fabric.netAmount || 0,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
      }
      if (resp.rod) {
        if (resp.rod.primary_rod && resp.rod.primary_rod.length > 0) {
          for (var j = 0; j < resp.rod.primary_rod.length; j++) {
            const fabric = resp.rod.primary_rod[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.width,
              status: "pending",
              type: "rod",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (resp.rod.curtainStick && resp.rod.curtainStick.length > 0) {
          for (var j = 0; j < resp.rod.curtainStick.length; j++) {
            const fabric = resp.rod.curtainStick[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "Curtain Stick",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (
          resp.rod.extraBracketSupport &&
          resp.rod.extraBracketSupport.length > 0
        ) {
          for (var j = 0; j < resp.rod.extraBracketSupport.length; j++) {
            const fabric = resp.rod.extraBracketSupport[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "Extra Bracket Support",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (resp.rod.extraBracket && resp.rod.extraBracket.length > 0) {
          for (var j = 0; j < resp.rod.extraBracket.length; j++) {
            const fabric = resp.rod.extraBracket[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "Extra Bracket",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (resp.rod.endCap && resp.rod.endCap.length > 0) {
          for (var j = 0; j < resp.rod.endCap.length; j++) {
            const fabric = resp.rod.endCap[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              quantity: fabric.totalFabricUse,
              status: "pending",
              type: "End cap",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
        if (resp.rod.secondary_rod && resp.rod.secondary_rod.length > 0) {
          for (var j = 0; j < resp.rod.secondary_rod.length; j++) {
            const fabric = resp.rod.secondary_rod[j];
            await OrderItem.create({
              product_name: fabric.fabric1_name,
              productId: fabric.id,
              size: fabric.width,
              status: "pending",
              type: "rod",
              price: fabric.mrp,
              totalAmount:
                fabric.netAmount && fabric.netAmount == "NaN"
                  ? 0
                  : fabric.netAmount,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 3,
            });
          }
        }
      }
      if (resp.blind) {
        if (resp.blind.blindFabricArr && resp.blind.blindFabricArr.length > 0) {
          for (var j = 0; j < resp.blind.blindFabricArr.length; j++) {
            const fabric =
              resp.blind.blindFabricArr[j] == 0
                ? 0
                : resp.blind.blindFabricArr[j];
            if (fabric && fabric != 0) {
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.runningFeet,
                status: "pending",
                type: "blind fabric",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 5,
                sta_id: "blind_fabric",
              });
            }
          }
        }
        if (resp.blind.blindLiningArr && resp.blind.blindLiningArr.length > 0) {
          for (var j = 0; j < resp.blind.blindLiningArr.length; j++) {
            const fabric =
              resp.blind.blindLiningArr[j] == 0
                ? 0
                : resp.blind.blindLiningArr[j];
            if (fabric && fabric != 0) {
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "blind lining",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 5,
                sta_id: "blind_lining_fabric",
              });
            }
          }
        }
        if (resp.blind.blindShadesArr && resp.blind.blindShadesArr.length > 0) {
          for (var j = 0; j < resp.blind.blindShadesArr.length; j++) {
            const fabric =
              resp.blind.blindShadesArr[j] == 0
                ? 0
                : resp.blind.blindShadesArr[j];
            if (fabric && fabric != 0) {
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "blind shades",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 5,
                sta_id: "blind_shades",
              });
            }
          }
        }
        if (
          resp.blind.blindBorderFabricArr &&
          resp.blind.blindBorderFabricArr.length > 0
        ) {
          for (var j = 0; j < resp.blind.blindBorderFabricArr.length; j++) {
            const fabric =
              resp.blind.blindBorderFabricArr[j] == 0
                ? 0
                : resp.blind.blindBorderFabricArr[j];
            if (fabric && fabric != 0) {
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.totalFabricUse,
                status: "pending",
                type: "blind border fabric",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 5,
                sta_id: "blind_border_fabric",
              });
            }
          }
        }
        if (resp.blind.blindTrack && resp.blind.blindTrack.length > 0) {
          for (var j = 0; j < resp.blind.blindTrack.length; j++) {
            const fabric =
              resp.blind.blindTrack[j] == 0 ? 0 : resp.blind.blindTrack[j];
            if (fabric && fabric != 0) {
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                size: fabric.width,
                status: "pending",
                type: "blind track",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 5,
                sta_id: "blind_track",
              });
            }
          }
        }
        if (
          resp.blind.blindTrackRemote &&
          resp.blind.blindTrackRemote.length > 0
        ) {
          for (var j = 0; j < resp.blind.blindTrackRemote.length; j++) {
            const fabric =
              resp.blind.blindTrackRemote[j] == 0
                ? 0
                : resp.blind.blindTrackRemote[j];
            if (fabric && fabric != 0) {
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "blind track remote",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 5,
                sta_id: "blind_track_remote",
              });
            }
          }
        }
        if (
          resp.blind.blind_track_motor &&
          resp.blind.blind_track_motor.length > 0
        ) {
          for (var j = 0; j < resp.blind.blind_track_motor.length; j++) {
            const fabric =
              resp.blind.blind_track_motor[j] == 0
                ? 0
                : resp.blind.blind_track_motor[j];
            if (fabric && fabric != 0) {
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: 1,
                status: "pending",
                type: "blind track remote",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 5,
                sta_id: "blind_track_motor",
              });
            }
          }
        }
        if (
          resp.blind.blindExtraBracket &&
          resp.blind.blindExtraBracket.length > 0
        ) {
          for (var j = 0; j < resp.blind.blindExtraBracket.length; j++) {
            const fabric =
              resp.blind.blindExtraBracket[j] == 0
                ? 0
                : resp.blind.blindExtraBracket[j];
            if (fabric && fabric != 0) {
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "blind extra bracket",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 5,
                sta_id: "blind_extra_bracket",
              });
            }
          }
        }
        if (
          resp.blind.blind_type_search_fabric &&
          resp.blind.blind_type_search_fabric.length > 0
        ) {
          for (var j = 0; j < resp.blind.blind_type_search_fabric.length; j++) {
            const fabric =
              resp.blind.blind_type_search_fabric[j] == 0
                ? 0
                : resp.blind.blind_type_search_fabric[j];
            if (fabric && fabric != 0) {
              await OrderItem.create({
                product_name: fabric.fabric1_name,
                productId: fabric.id,
                quantity: fabric.totalFabricUse,
                status: "pending",
                type: "blind type search fabric",
                price: fabric.mrp,
                totalAmount: fabric.netAmount,
                orderId: newOrder.id,
                roomId: resp.roomInfo.id,
                materialId: 5,
                sta_id: "blind_type_search_fabric",
              });
            }
          }
        }
      }
      if (resp.sofa.length > 0) {
        for (var j = 0; j < resp.sofa.length; j++) {
          const fabric = resp.sofa[j];
          if (fabric && fabric.primary_fabric) {
            await OrderItem.create({
              product_name: fabric.primary_fabric,
              productId: fabric.primary_fabric_id,
              size: fabric.primary_fabric_qty,
              status: "pending",
              type: "Primary Fabric " + fabric.type,
              price: fabric.primary_fabric_price,
              totalAmount: fabric.net_primary_fabric_price,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 6,
            });
          }
          if (fabric && fabric.secondary_fabric) {
            await OrderItem.create({
              product_name: fabric.secondary_fabric,
              productId: fabric.secondary_fabric_id,
              size: fabric.secondary_fabric_qty,
              status: "pending",
              type: "Secondary Fabric " + fabric.type,
              price: fabric.secondary_fabric_price,
              totalAmount: fabric.net_secondary_fabric_price,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 6,
            });
          }
          if (fabric && fabric.piping_fabric) {
            await OrderItem.create({
              product_name: fabric.piping_fabric,
              productId: fabric.piping_fabric_id,
              size: fabric.piping_fabric_qty,
              status: "pending",
              type: "Piping Fabric " + fabric.type,
              price: fabric.piping_fabric_price,
              totalAmount: fabric.net_piping_fabric_price,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 6,
            });
          }
        }
      }
      if (resp.Wallpaper) {
        for (var j = 0; j < resp.Wallpaper.wall_information.length; j++) {
          const fabric = resp.Wallpaper.wall_information[j];
          await OrderItem.create({
            product_name: fabric.wallpaper,
            productId: fabric.id,
            size:
              fabric.type == "mural"
                ? fabric.total_area_sqft
                : fabric.total_wallpaer_required,
            status: "pending",
            type: fabric.type,
            price: fabric.type == "mural" ? fabric.price : fabric.roll_price,
            totalAmount:
              (fabric.type == "mural"
                ? fabric.mural_cost
                : fabric.total_roll_cost) || 0,
            orderId: newOrder.id,
            roomId: resp.roomInfo.id,
            materialId: 9,
          });
        }
      }
      if (resp.flooring) {
        const fabric = resp.flooring;
        await OrderItem.create({
          product_name: fabric.fabric1_name,
          productId: fabric.id,
          size: fabric.type == "carpet" ? fabric.width : fabric.totalFabricUse,
          status: "pending",
          type: fabric.type,
          price: fabric.mrp,
          totalAmount: fabric.gross_amount,
          orderId: newOrder.id,
          roomId: resp.roomInfo.id,
          materialId: 8,
        });

        if (fabric.flooringItems) {
          if (fabric.flooringItems.binding) {
            await OrderItem.create({
              product_name: fabric.flooringItems.binding,
              productId: fabric.flooringItems.binding_id,
              quantity: fabric.flooringItems.binding_quantity,
              status: "pending",
              type: "Binding",
              price: fabric.flooringItems.binding_mrp,
              totalAmount: fabric.flooringItems.binding_cost,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 8,
            });
          }
          if (fabric.flooringItems.binding) {
            await OrderItem.create({
              product_name: fabric.flooringItems.binding,
              productId: fabric.flooringItems.binding_id,
              quantity: fabric.flooringItems.binding_quantity,
              status: "pending",
              type: "Binding",
              price: fabric.flooringItems.binding_mrp,
              totalAmount: fabric.flooringItems.binding_cost,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 8,
            });
          }
          if (fabric.flooringItems.binding) {
            await OrderItem.create({
              product_name: fabric.flooringItems.binding,
              productId: fabric.flooringItems.binding_id,
              quantity: fabric.flooringItems.binding_quantity,
              status: "pending",
              type: "Binding",
              price: fabric.flooringItems.binding_mrp,
              totalAmount: fabric.flooringItems.binding_cost,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 8,
            });
          }
          if (fabric.flooringItems.skirting) {
            await OrderItem.create({
              product_name: fabric.flooringItems.skirting,
              productId: fabric.flooringItems.skirting_id,
              quantity: fabric.flooringItems.skirting_quantity,
              status: "pending",
              type: "Skirting",
              price: fabric.flooringItems.skirting_mrp,
              totalAmount: fabric.flooringItems.skirting_cost,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 8,
            });
          }
          if (fabric.flooringItems.reducer) {
            await OrderItem.create({
              product_name: fabric.flooringItems.reducer,
              productId: fabric.flooringItems.reducer_id,
              quantity: fabric.flooringItems.reducer_quantity,
              status: "pending",
              type: "Reducer",
              price: fabric.flooringItems.reducer_mrp,
              totalAmount: fabric.flooringItems.reducer_cost,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 8,
            });
          }
          if (fabric.flooringItems.t_profile) {
            await OrderItem.create({
              product_name: fabric.flooringItems.t_profile,
              productId: fabric.flooringItems.t_profile_id,
              quantity: fabric.flooringItems.t_profile_quantity,
              status: "pending",
              type: "TProfile",
              price: fabric.flooringItems.t_profile_mrp,
              totalAmount: fabric.flooringItems.t_profile_cost,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 8,
            });
          }
          if (fabric.flooringItems.beeding) {
            await OrderItem.create({
              product_name: fabric.flooringItems.beeding,
              productId: fabric.flooringItems.beeding_id,
              quantity: fabric.flooringItems.beeding_quantity,
              status: "pending",
              type: "Beeding",
              price: fabric.flooringItems.beeding_mrp,
              totalAmount: fabric.flooringItems.beeding_cost,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 8,
            });
          }
          if (fabric.flooringItems.margin) {
            await OrderItem.create({
              product_name: fabric.flooringItems.margin,
              productId: fabric.flooringItems.margin_id,
              quantity: fabric.flooringItems.margin_quantity,
              status: "pending",
              type: "Margin",
              price: fabric.flooringItems.margin_mrp,
              totalAmount: fabric.flooringItems.margin_cost,
              orderId: newOrder.id,
              roomId: resp.roomInfo.id,
              materialId: 8,
            });
          }
        }
      }
    }

    await Enquiry.update(
      {
        status: "order-confirmed",
        expected_delivery_date: req.body.expected_delivery_date,
      },
      { where: { id: req.body.enquiryId } },
    );

    const customer = await Customer.findOne({
      where: { id: check_enquiry.customerId },
    });
    const salesPerson = await User.findOne({
      where: { id: check_enquiry.salesId },
    });

    await EnquiryStatus.create({
      remark: "Order created with Order No: " + req.body.orderId,
      status: "completed",
      enquiryId: req.body.enquiryId,
    });

    res.status(201).json({
      message: "Order & QC Generated Successfully",
      status: true,
    });
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.GetAllOrders = async (req, res, next) => {
  try {
    if (req.query.userId) {
      const order = await Order.findAll({
        where: { userId: req.query.userId },
        include: [User, Enquiry],
      });
      dataNotFound(order, 404, "Order Not Found");
      return res.status(200).json({
        message: "Orders Found Successfully",
        data: order,
        status: true,
      });
    } else {
      const order = await Order.findAll({ include: [User, Enquiry] });
      dataNotFound(order, 404, "Order Not Found");
      return res.status(200).json({
        message: "Orders Found Successfully",
        data: order,
        status: true,
      });
    }
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.acceptOrderItem = async (req, res, next) => {
  try {
    const orderItem = await OrderItem.findOne({
      where: { id: req.params.id },
      include: [Order],
    });
    dataNotFound(orderItem, 404, "No Item Found");

    const newStatus = await orderItem.update({
      status: req.body.status,
    });
    await EnquiryStatus.create({
      remark: "Order Item Accepted",
      status: "completed",
      enquiryId: orderItem.order.enquiryId,
    });

    res.status(200).json({
      message: `Product ${req.body.status}`,
      data: orderItem,
      status: true,
    });
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.acceptOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ where: { orderId: req.params.id } });
    dataNotFound(order, 404, "Order not found");

    await order.update({
      orderStatus: req.body.status,
      remark: req.body.remark,
    });

    await EnquiryStatus.create({
      remark: "Order Accepted",
      status: "completed",
      enquiryId: order.enquiryId,
    });

    res.status(200).json({
      message: `order ${req.body.status}`,
      status: true,
      data: order,
    });
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.submitOrderBill = async (req, res, next) => {
  let allFile;
  try {
    const { file, body } = await UploadFile(req, "order-bill");
    allFile = file;
    const order = await Order.findOne({ where: { orderId: body.orderId } });
    dataNotFound(order, 404, "Order not found");

    const enquiry = await Enquiry.findOne({ where: { id: order.enquiryId } });

    // const orderBill = await Order_Bill.findOne({where: {orderId: order.id, enquiryId: enquiry.id}});
    // if(!orderBill){
    await Order_Bill.create({
      orderId: order.id,
      enquiryId: enquiry.id,
      image: file.path,
      remark: body.remark,
    });
    // }

    res.status(200).json({
      message: `order bill submit`,
      status: true,
      data: order,
    });
  } catch (e) {
    if (allFile.length == 1) {
      removefile(allFile.path);
    }
    next(e);
  }
};

exports.getOrderBills = async (req, res, next) => {
  try {
    let { pageSize, pageNumber, searchData } = req.query;

    const where = {};
    if (searchData) {
      where.id = req.query.searchData;
    }

    pageSize = parseInt(pageSize) || 10;
    const page = parseInt(pageNumber) || 1;
    const offset = (page - 1) * pageSize;

    const enquirys = await Enquiry.findAndCountAll({
      where,
      include: [{ model: Order, include: Order_Bill }],
      limit: pageSize,
      offset: offset,
      distinct: true,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: `Fetched order bills`,
      status: true,
      data: enquirys,
    });
  } catch (e) {
    next(e);
  }
};

exports.getOrderItem = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { orderId: req.params.orderId },
      include: [
        {
          model: Customer,
          include: {
            model: User,
            as: "sales",
            attributes: { exclude: ["password", "activity"] },
          },
        },
        User,
        {
          model: Enquiry,
          include: [
            {
              model: User,
              attributes: [
                "userId",
                "id",
                "firstName",
                "lastName",
                "phone",
                "email",
                "type",
              ],
            },
            { model: EnquiryStatus },
            { model: Enquiry_Schedule, include: User },
          ],
        },
      ],
    });
    dataNotFound(order, 404, "Order Not Found");

    const rooms = await Room.findAll({
      // include: [
      include: [
        {
          model: OrderItem,
          where: { orderId: order.id },

          include: [
            {
              model: UserQualityDetail,
              attributes: ["isChecked"],
              include: {
                model: Quality_Check,
                attributes: ["checks", "description"],
              },
            },
            Quality_Check_Remarks,
          ],
        },
      ],
      // ]
    });

    if (rooms.length > 0) {
      for (var i = 0; i < rooms.length; i++) {
        const order_items = rooms[i].order_items;

        if (order_items.length > 0) {
          for (let i = 0; i < order_items.length; i++) {
            const quality_check = order_items[i];

            const qc1 = [];
            const qc2 = [];
            const qc3 = [];

            for (
              let j = 0;
              j < quality_check.quality_check_remarks.length;
              j++
            ) {
              if (quality_check.quality_check_remarks[j].QCId == 1) {
                qc1.push(quality_check.quality_check_remarks[j]);
              } else if (quality_check.quality_check_remarks[j].QCId == 2) {
                qc2.push(quality_check.quality_check_remarks[j]);
              } else {
                qc3.push(quality_check.quality_check_remarks[j]);
              }
            }

            quality_check.dataValues.qc_details = { qc1, qc2, qc3 };
          }
        }

        // const selected_material = await SelectedMaterial.findAll({where: {roomId: rooms[i].id}, include: Material});
        // rooms[i].dataValues.selected_material = selected_material;
      }
    }

    order.dataValues.rooms = rooms;

    res.status(200).json({
      message: "Order items Found Successfully",
      data: order,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
