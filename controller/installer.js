const {
  InstallerSchedule,
  Notification,
  InstallerTasks,
  Address,
  User,
  OutletUser,
  OrderProof,
  WarehouseOrder,
  CustomerOrder,
  Enquiry,
  EnquiryStatus,
  Warehouse,
  Customer,
  Wcr,
  Schedule,
  Message,
  Enquiry_Schedule,
  Wcr_Report,
} = require("../model");
const { UploadFile, removefile } = require("../helper/multer");
const {
  dataNotFound,
  encrypt,
  getAuthHeaderConfig,
} = require("../helper/functions");
const {
  sendMail,
  send_notification,
  whatsappMessage,
} = require("../helper/mailer");
const { Op } = require("sequelize");
const {
  feedback_message,
  installation_done_otp,
} = require("../helper/messages");
const axios = require("axios");

const fabricCategory = ["Curtains", "sheers", "Rods/tracks", "Blinds"];
const wallpaperCategory = ["Wallpaper"];
const upholsteryCategory = ["Upholstery", "Other"];
const flooringCategory = ["Flooring/Carpet"];

async function nextInstallerAssing(id, date, schedules) {
  const taskCount = await InstallerTasks.count({
    where: {
      [Op.or]: [{ date }, { postponeDate: date }],
      installerId: id,
      status: { [Op.or]: ["pending", "postponed"] },
    },
  });
  if (id == 98) {
    return taskCount >= schedules ? 106 : id;
  } else if (id == 106) {
    return taskCount >= schedules ? 105 : id;
  } else if (id == 105) {
    return taskCount >= schedules ? 98 : id;
  } else if (id == 99) {
    return taskCount >= schedules ? 159 : id;
  } else if (id == 159) {
    return taskCount >= schedules ? 118 : id;
  } else if (id == 118) {
    return taskCount >= schedules ? 109 : id;
  } else if (id == 109) {
    return taskCount >= schedules ? 99 : id;
  }
}

exports.get_unassign_user = async (req, res, next) => {
  try {
    const categories = req.body.categories;
    const date = req.body.date || new Date();
    let schedules = await Schedule.count({ where: { type: "installer" } });

    const store = await User.findByPk(req.body.storeId);
    dataNotFound(store, 400, "store not found");

    let usedCategory = "";

    if (categories.every((category) => fabricCategory.includes(category))) {
      usedCategory = "fabricCategory";
    }
    if (categories.every((category) => wallpaperCategory.includes(category))) {
      usedCategory = "wallpaperCategory";
    }
    if (categories.every((category) => upholsteryCategory.includes(category))) {
      usedCategory = "upholsteryCategory";
    }
    if (categories.every((category) => flooringCategory.includes(category))) {
      usedCategory = "flooringCategory";
    }

    const installerIds = [];

    const upholsteryInstaller = await InstallerTasks.findAll({
      where: { installerId: { [Op.in]: [71, 139, 76, 75, 167] } },
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    const fabricInstaller1 = await InstallerTasks.findAll({
      where: { installerId: { [Op.in]: [98, 106, 105, 99, 159, 118, 109] } },
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    // const fabricInstaller2 = await InstallerTasks.findAll({
    //             where: { installerId: { [Op.in]: [99, 159, 118, 109] } },
    //             order: [['createdAt', 'DESC']],
    //             limit: 1
    // });

    // const wallpaperInstaller = await InstallerTasks.findAll({
    //   where: { installerId: { [Op.in]: [52, 73] } },
    //   order: [["createdAt", "DESC"]],
    //   limit: 1,
    // });

    if (usedCategory == "upholsteryCategory") {
      const measurer = await Enquiry_Schedule.findOne({
        where: { enquiryId: req.body.enquiryId },
        include: [{ model: User }],
      });
      if (measurer && measurer.user) {
        if (measurer.user.id == 59) {
          installerIds.push(71);
        } else if (measurer.user.id == 60) {
          installerIds.push(139);
        } else if (measurer.user.id == 66) {
          installerIds.push(76);
        } else if (measurer.user.id == 144) {
          installerIds.push(75);
        } else if (measurer.user.id == 165) {
          installerIds.push(167);
        } else if (measurer.user.id == 128) {
          installerIds.push(147);
        } else if (measurer.user.id == 170) {
          // installerIds.push(171)
          installerIds.push(180);
        } else {
          installerIds.push(180);
        }
      }
    } else {
      const getInstallerIdByStoreAndCategory = (storeId, usedCategory) => {
        const storeConfig = {
          22: {
            fabricCategory: () => getFabricInstaller_1(fabricInstaller1),
            wallpaperCategory: () => getWallpaperInstaller(22), // Montu
            flooringCategory: [159], // Triloki
          },
          179: {
            fabricCategory: () => getFabricInstaller_1(fabricInstaller1),
            wallpaperCategory: () => getWallpaperInstaller(179), // Montu
            flooringCategory: [159], // Triloki
          },
          42: {
            fabricCategory: () => getFabricInstaller_1(fabricInstaller1),
            wallpaperCategory: () => getWallpaperInstaller(42), // Montu
            flooringCategory: [159], // Triloki
          },
          81: {
            fabricCategory: () => getFabricInstaller_1(fabricInstaller1),
            wallpaperCategory: () => getWallpaperInstaller(81), // Montu
            flooringCategory: [159], // Triloki
          },
          79: {
            fabricCategory: () => getFabricInstaller_1(fabricInstaller1),
            wallpaperCategory: () => getWallpaperInstaller(79), // Montu
            flooringCategory: [159], // Triloki
          },
          80: {
            fabricCategory: () => getFabricInstaller_1(fabricInstaller1),
            wallpaperCategory: () => getWallpaperInstaller(80), // Montu
            flooringCategory: [159], // Triloki
          },
          83: {
            fabricCategory: () => getFabricInstaller_1(fabricInstaller1),
            wallpaperCategory: () => getWallpaperInstaller(83), // Montu
            flooringCategory: [159], // Triloki
          },
          82: {
            fabricCategory: [147], // Kamlesh
            wallpaperCategory: [146], // Darban
            flooringCategory: [147], // Kamlesh
          },
          162: {
            fabricCategory: () => getFabricInstaller_1(fabricInstaller1),
            wallpaperCategory: () => getWallpaperInstaller(162), // Montu
            flooringCategory: [147], // Kamlesh
          },
        };

        const storeData = storeConfig[storeId];
        if (storeData && storeData[usedCategory]) {
          const installer = storeData[usedCategory];
          return typeof installer === "function" ? installer() : installer;
        }
        return [];
      };

       // As discussed wih ashish, last measurer will be installer
      const getWallpaperInstaller = async (outletId) => {
        const measurer = await Enquiry_Schedule.findOne({
          where: { enquiryId: req.body.enquiryId },
          include: [{ model: User }],
        });
        if(measurer.user.id===202){
          return [203];          
        }
        const find = await InstallerTasks.findAll({
          where: {
            [Op.or]: [{ date }, { postponeDate: date }],
            installerId: 73,
            status: { [Op.or]: ["pending", "postponed"] },
          },
        });
        if (find.length >= schedules) {
          return[52];
        } else {
          return [73];
        }
      };

      let getFabricInstaller_1 = null;
      const measurer = await Enquiry_Schedule.findOne({
        where: { enquiryId: req.body.enquiryId },
        include: [{ model: User }],
      });
      console.log(measurer.user.id);
      if (measurer && measurer.user.id == 64) {
        getFabricInstaller_1 = async (installerList) => {
          const fabricInstaller1 = await InstallerTasks.findAll({
            where: { installerId: { [Op.in]: [98, 106, 105] } },
            order: [["createdAt", "DESC"]],
            limit: 1,
          });

          let nextInstallerId = fabricInstaller1[0].installerId;

          if (installerList.length > 0) {
            const installerId = fabricInstaller1[0].installerId;
            switch (installerId) {
              case 98:
                nextInstallerId = 106; // Govind
                break;
              case 106:
                nextInstallerId = 105; // Gulzar
                break;
              case 105:
                nextInstallerId = 98; // Naresh
            }
          }

          if (nextInstallerId == 98) {
            const nareshTasks = await InstallerTasks.count({
              where: {
                [Op.or]: [{ date }, { postponeDate: date }],
                installerId: 98,
                status: { [Op.or]: ["pending", "postponed"] },
              },
            });
            nextInstallerId = nareshTasks >= schedules ? 106 : 98;

            if (nextInstallerId === 106) {
              const govindTasks = await InstallerTasks.count({
                where: {
                  [Op.or]: [{ date }, { postponeDate: date }],
                  installerId: 106,
                  status: { [Op.or]: ["pending", "postponed"] },
                },
              });
              nextInstallerId = govindTasks >= schedules ? 105 : 106;

              if (nextInstallerId === 105) {
                const gulzarTasks = await InstallerTasks.count({
                  where: {
                    [Op.or]: [{ date }, { postponeDate: date }],
                    installerId: 105,
                    status: { [Op.or]: ["pending", "postponed"] },
                  },
                });
                nextInstallerId = gulzarTasks >= schedules ? 98 : 105;
              }
            }
          } else if (nextInstallerId == 106) {
            const govindTasks = await InstallerTasks.count({
              where: {
                [Op.or]: [{ date }, { postponeDate: date }],
                installerId: 106,
                status: { [Op.or]: ["pending", "postponed"] },
              },
            });
            nextInstallerId = govindTasks >= schedules ? 105 : 106;

            if (nextInstallerId === 105) {
              const gulzarTasks = await InstallerTasks.count({
                where: {
                  [Op.or]: [{ date }, { postponeDate: date }],
                  installerId: 105,
                  status: { [Op.or]: ["pending", "postponed"] },
                },
              });
              nextInstallerId = gulzarTasks >= schedules ? 98 : 105;

              if (nextInstallerId === 98) {
                const nareshTasks = await InstallerTasks.count({
                  where: {
                    [Op.or]: [{ date }, { postponeDate: date }],
                    installerId: 98,
                    status: { [Op.or]: ["pending", "postponed"] },
                  },
                });
                nextInstallerId = nareshTasks >= schedules ? 106 : 98;
              }
            }
          } else if (nextInstallerId === 105) {
            const gulzarTasks = await InstallerTasks.count({
              where: {
                [Op.or]: [{ date }, { postponeDate: date }],
                installerId: 105,
                status: { [Op.or]: ["pending", "postponed"] },
              },
            });
            nextInstallerId = gulzarTasks >= schedules ? 98 : 105;

            if (nextInstallerId === 98) {
              const nareshTasks = await InstallerTasks.count({
                where: {
                  [Op.or]: [{ date }, { postponeDate: date }],
                  installerId: 98,
                  status: { [Op.or]: ["pending", "postponed"] },
                },
              });
              nextInstallerId = nareshTasks >= schedules ? 106 : 98;

              if (nextInstallerId === 106) {
                const govindTasks = await InstallerTasks.count({
                  where: {
                    [Op.or]: [{ date }, { postponeDate: date }],
                    installerId: 106,
                    status: { [Op.or]: ["pending", "postponed"] },
                  },
                });
                nextInstallerId = govindTasks >= schedules ? 105 : 106;
              }
            }
          }
          console.log(nextInstallerId, "------------------>>-");
          return [nextInstallerId]; // Naresh
        };
      } else {
        getFabricInstaller_1 = async (installerList) => {
          if (installerList.length > 0) {
            const fabricInstaller2 = await InstallerTasks.findAll({
              where: { installerId: { [Op.in]: [99, 159, 118, 109] } },
              order: [["createdAt", "DESC"]],
              limit: 1,
            });

            let nextInstallerId = fabricInstaller2[0].installerId;
            const installerId = fabricInstaller2[0].installerId;
            console.log(installerId, "scheduler 4 ");
            switch (installerId) {
              case 99:
                nextInstallerId = 159; // triloki
                break;
              // return [159]; // triloki
              case 159:
                nextInstallerId = 118; // brijesh
                break;
              // return [118]; // brijesh
              case 118:
                nextInstallerId = 109; // kanahiya
                break;
              // return [109]; // kanahiya
              case 109:
                nextInstallerId = 99;
            }
            if (nextInstallerId == 99) {
              console.log("nextInstallerAssing 99 ::", nextInstallerId);
              nextInstallerId = await nextInstallerAssing(99, date, schedules);
              if (nextInstallerId == 159) {
                nextInstallerId = await nextInstallerAssing(
                  159,
                  date,
                  schedules,
                );
                if (nextInstallerId == 118) {
                  nextInstallerId = await nextInstallerAssing(
                    118,
                    date,
                    schedules,
                  );
                  if (nextInstallerId == 109) {
                    nextInstallerId = await nextInstallerAssing(
                      109,
                      date,
                      schedules,
                    );
                  }
                }
              }
            } else if (nextInstallerId == 159) {
              console.log("nextInstallerAssing 159 ::", nextInstallerId);
              nextInstallerId = await nextInstallerAssing(159, date, schedules);
              if (nextInstallerId == 118) {
                nextInstallerId = await nextInstallerAssing(
                  118,
                  date,
                  schedules,
                );
                if (nextInstallerId == 109) {
                  nextInstallerId = await nextInstallerAssing(
                    109,
                    date,
                    schedules,
                  );
                  if (nextInstallerId == 99) {
                    nextInstallerId = await nextInstallerAssing(
                      99,
                      date,
                      schedules,
                    );
                  }
                }
              }
            } else if (nextInstallerId === 118) {
              console.log("nextInstallerAssing 118 ::", nextInstallerId);
              nextInstallerId = await nextInstallerAssing(118, date, schedules);
              if (nextInstallerId == 109) {
                nextInstallerId = await nextInstallerAssing(
                  109,
                  date,
                  schedules,
                );
                if (nextInstallerId == 99) {
                  nextInstallerId = await nextInstallerAssing(
                    99,
                    date,
                    schedules,
                  );
                  if (nextInstallerId == 159) {
                    nextInstallerId = await nextInstallerAssing(
                      159,
                      date,
                      schedules,
                    );
                  }
                }
              }
            } else if (nextInstallerId === 109) {
              console.log("nextInstallerAssing 109 ::", nextInstallerId);
              nextInstallerId = await nextInstallerAssing(109, date, schedules);
              if (nextInstallerId == 99) {
                nextInstallerId = await nextInstallerAssing(
                  99,
                  date,
                  schedules,
                );
                if (nextInstallerId == 159) {
                  nextInstallerId = await nextInstallerAssing(
                    159,
                    date,
                    schedules,
                  );
                  if (nextInstallerId == 118) {
                    nextInstallerId = await nextInstallerAssing(
                      118,
                      date,
                      schedules,
                    );
                  }
                }
              }
            }
            console.log(
              "+++++++++++final installerId schedule 4 :::",
              nextInstallerId,
            );
            return [nextInstallerId]; //dilip
          }
        };
      }

      const data = await getInstallerIdByStoreAndCategory(
        store.id,
        usedCategory,
      );
      try{
      installerIds.push(data);
      }
      catch(error){
        next({"iinstallerIds":installerIds});
      }
    }

    if (upholsteryInstaller.length == 0) {
      installerIds.push(71);
    }

    const data = await User.findAll({
      where: { type: "installer", id: { [Op.in]: installerIds } },
    });
  
    return res.status(200).json({
      message: "Schedule Fetched Successfully",
      data: data,
      status: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.get_unassign_user_slot = async (req, res, next) => {
  try {
    const category = req.query.category;

    const date = new Date(req.query.date);
    const dayIndex = date.getDay();

    const user = await User.findOne({
      where: { id: req.query.userid, type: "installer" },
    });
    if (!user) throw new Error("User not found");

    const find = await InstallerTasks.findAll({
      where: { date: req.query.date, installerId: user.id, status: "pending" },
    });

    const findPostpone = await InstallerTasks.findAll({
      where: {
        postponeDate: req.query.date,
        installerId: user.id,
        status: "postponed",
      },
    });

    let val = [];

    find.forEach((element) => {
      val.push(element.scheduleId);
    });

    findPostpone.forEach((element) => {
      val.push(element.scheduleId);
    });

    let schedules = await Schedule.findAll({
      where: { id: { [Op.notIn]: val }, type: "installer" },
    });

    if (dayIndex == 0 && category == "curtain") {
      schedules = [];
    }

    return res.status(200).json({
      message: "Schedule Fetched Successfully",
      data: { user, schedules },
      status: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 400;
    }
    next(err);
  }
};

exports.assign_installer = async (req, res, next) => {
  try {
    const data = await User.findOne({
      where: { id: req.body.installerId },
    });

    if (!data) throw new Error("schedule Person not found");

    const enquirySchedule = await InstallerTasks.findOne({
      where: {
        enquiryId: req.body.enquiryId,
      },
      order: [["id", "DESC"]],
    });
    if (
      enquirySchedule &&
      (enquirySchedule.status == "active" ||
        enquirySchedule.status == "completed") &&
      enquirySchedule.installerId == data.id
    ) {
      return res.status(400).json({
        message: "Installer Already Assigned",
        status: false,
      });
    }

    if (enquirySchedule && enquirySchedule.status == "pending") {
      return res.status(400).json({
        message: "Installer Already Assigned",
        status: false,
      });
    }

    if (enquirySchedule) {
      await enquirySchedule.update({
        scheduleId: req.body.scheduleId,
        enquiryId: req.body.enquiryId,
        status: "pending",
        installerId: req.body.installerId,
        date: req.body.date,
        warehouseId: req.body.warehouseId,
        customerId: req.body.customerId,
      });
    } else {
      const check = await InstallerTasks.create({
        scheduleId: req.body.scheduleId,
        enquiryId: req.body.enquiryId,
        status: "pending",
        installerId: req.body.installerId,
        date: req.body.date,
        warehouseId: req.body.warehouseId,
        customerId: req.body.customerId,
      });
    }

    const enquiry = await Enquiry.findOne({
      where: { id: req.body.enquiryId },
      include: [Customer],
    });
    await enquiry.update({
      expected_installation_date: req.body.date,
      status: "installer-assigned",
    });

    let sch;
    if (req.body.scheduleId) {
      sch = await Schedule.findOne({ where: { id: req.body.scheduleId } });
    }
    await EnquiryStatus.create({
      remark: "Delivery/Installation Assigned",
      status: "completed",
      enquiryId: enquiry.id,
      details: {
        date: req.body.date,
        start_time: req.body.scheduleId ? sch.start_time : "",
        end_time: req.body.scheduleId ? sch.end_time : "",
      },
    });
    const work_assigned_count =
      data.work_assigned_count !== undefined
        ? parseInt(data.work_assigned_count) + 1
        : 0;
    await data.update({ work_assigned_count });

    // await send_notification(data.fcmToken, 'New Installation Assigned', obj);

    // await Notification.create({
    //     message: "Installer Scheduled",
    //     enquiryId: enquiry.id
    // })

    // const super_user = await User.findAll({
    //     where: { type: "super-admin" }
    // });

    // await super_user.forEach(async (element) => {
    //     await send_notification(element.fcmToken, 'Customer Schduled Installer', obj);

    //     await Notification.create({
    //         message: "Customer Schduled Installer",
    //         enquiryId: enquiry.id

    //     })
    // });

    ////start notification functioin-------------------
    const installer = await User.findOne({
      where: { id: req.body.installerId },
    });
    const outletUser = await OutletUser.findOne({
      where: { salesPersonId: enquiry.salesId },
    });
    const obj = {
      message: `Installer assigned for enquiry ${enquiry.enquiryId} on ${req.body.date}.`,
      enquiryId: enquiry.id,
    };

    await send_notification(installer.fcmToken, "Installation assigned", obj);

    const notification = await Notification.findOne({
      where: { message: obj.message, enquiryId: enquiry.id },
    });
    await Notification.create({
      message: obj.message,
      enquiryId: enquiry.id,
      installerId: installer.id,
      adminId: outletUser.outletId,
    });
    ////end Notification functioin-------------------

    res.status(200).json({
      message: "Person assign Successfully",
      data: [],
      status: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyTasks = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.pageSize) || 10;
    const page = parseInt(req.query.pageNo) || 1;
    const offset = (page - 1) * limit;

    const date_clause = {};
    if (req.query.postpone_date) {
      date_clause.postponeDate = req.query.postpone_date;
    }
    if (req.query.date) {
      date_clause.date = req.query.date;
    }

    if (req.query.status) {
      if (req.query.status == "overdue") {
        const tasks = await InstallerTasks.findAndCountAll({
          where: {
            installerId: req.userId,
            date: { [Op.lt]: new Date() },
            status: "pending",
            ...date_clause,
          },
          include: [
            { model: Customer, include: Address },
            Schedule,
            { model: User, as: "installer" },
            { model: User, as: "warehouse" },
          ],
          distinct: true,
          limit,
          offset,
          order: [["enquiryId", "DESC"]],
        });

        const totalPages = Math.ceil(tasks.count / limit);
        return res.status(200).json({
          message: `All ${req.query.status} Tasks Fetched`,
          status: true,
          data: tasks.rows,
          pagination: {
            currentPage: page,
            perPage: limit,
            total: tasks.count,
            totalPages: totalPages,
          },
        });
      }

      const tasks = await InstallerTasks.findAndCountAll({
        where: {
          installerId: req.userId,
          status: req.query.status,
          ...date_clause,
        },
        include: [
          { model: Customer, include: Address },
          Schedule,
          { model: User, as: "installer" },
          { model: User, as: "warehouse" },
        ],
        distinct: true,
        limit,
        offset,
        order: [["enquiryId", "DESC"]],
      });

      const totalPages = Math.ceil(tasks.count / limit);
      return res.status(200).json({
        message: `All ${req.query.status} Tasks Fetched`,
        status: true,
        data: tasks.rows,
        pagination: {
          currentPage: page,
          perPage: limit,
          total: tasks.count,
          totalPages: totalPages,
        },
      });
    } else {
      const tasks = await InstallerTasks.findAndCountAll({
        where: {
          installerId: req.userId,
          ...date_clause,
          status: { [Op.ne]: "wcr_completed" },
        },
        include: [
          { model: Customer, include: Address },
          Schedule,
          { model: User, as: "installer" },
          { model: User, as: "warehouse" },
        ],
        distinct: true,
        limit,
        offset,
        order: [["enquiryId", "DESC"]],
      });

      const totalPages = Math.ceil(tasks.count / limit);
      return res.status(200).json({
        message: "All Tasks Fetched",
        status: true,
        data: tasks.rows,
        pagination: {
          currentPage: page,
          perPage: limit,
          total: tasks.count,
          totalPages: totalPages,
        },
      });
    }
  } catch (e) {
    next(e);
  }
};
exports.getMyTasksCount = async (req, res, next) => {
  try {
    const date_clause = {};
    const date_where = {};
    if (req.query.postpone_date) {
      date_clause.postponeDate = req.query.postpone_date;
    }
    if (req.query.date) {
      date_where.date = req.query.date;
    }
    const obj = {
      todayTasks: await InstallerTasks.count({
        where: { installerId: req.userId, ...date_where, status: "pending" },
      }),
      totalTasks: await InstallerTasks.count({
        where: {
          installerId: req.userId,
          status: { [Op.notIn]: ["wcr_completed"] },
        },
      }),
      pendingTasks: await InstallerTasks.count({
        where: { installerId: req.userId, status: "pending" },
      }),
      canceledTasks: await InstallerTasks.count({
        where: { installerId: req.userId, status: "canceled" },
      }),
      completedTasks: await InstallerTasks.count({
        where: { installerId: req.userId, status: "completed" },
      }),
      activeTasks: await InstallerTasks.count({
        where: { installerId: req.userId, status: "active" },
      }),
      postponedTasks: await InstallerTasks.count({
        where: { installerId: req.userId, status: "postponed", ...date_clause },
      }),
      overdueTasks: await InstallerTasks.count({
        where: {
          installerId: req.userId,
          date: { [Op.lt]: new Date() },
          status: "pending",
        },
      }),
      wcr_completed: await InstallerTasks.count({
        where: { installerId: req.userId, status: "wcr_completed" },
      }),
      notification: await Notification.count({
        where: { installerId: req.userId },
      }),
    };
    return res.status(200).json({
      message: "All Tasks Fetched",
      data: obj,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
exports.GetOrderPackage = async (req, res, next) => {
  try {
    if (req.query.type == "warehouse") {
      const { file, body } = await UploadFile(req, "warehouse-order-proof");
      if (file.length == 1) {
        const warehouseOrder = await OrderProof.create({
          type: "warehouse",
          image: file.path,
          enquiryId: req.params.id,
        });
      } else {
        for (let i = 0; i < file.length; i++) {
          const warehouseOrder = await OrderProof.create({
            type: "warehouse",
            image: file[i].path,
            enquiryId: req.params.id,
          });
        }
      }
      const warehouse_order = await WarehouseOrder.findOne({
        where: { enquiryId: req.params.id },
      });
      if (!warehouse_order) {
        const assignedUser = await InstallerTasks.findOne({
          where: { enquiryId: req.params.id, installerId: req.userId },
          order: [["id", "desc"]],
        });

        const newOrder = await WarehouseOrder.create({
          otp: Math.floor(100000 + Math.random() * 900000),
          enquiryId: req.params.id,
          warehouseId: assignedUser.warehouseId,
          installerId: req.userId,
        });

        await Enquiry.update(
          {
            status: "installer-assigned",
          },
          { where: { id: req.params.id } },
        );

        return res.status(200).json({
          message: "Order Proof Submitted Please Verify the OTP",
          data: newOrder,
          status: true,
        });
      }
      return res.status(400).json({
        message: "Order Already Submitted",
        data: warehouse_order,
        status: true,
      });
    } else if (req.query.type == "customer") {
      const { file, body } = await UploadFile(req, "customer-order-proof");
      if (file.length > 1) {
        for (let i = 0; i < file.length; i++) {
          await Enquiry.update(
            {
              status: "installation-started",
            },
            { where: { id: req.params.id } },
          );

          const warehouseOrder = await OrderProof.create({
            type: file[i].fieldname,
            image: file[i].path,
            enquiryId: req.params.id,
          });
        }
      } else {
        const warehouseOrder = await OrderProof.create({
          type: file.fieldname,
          image: file.path,
          enquiryId: req.params.id,
        });
      }
      const customer_order = await CustomerOrder.findOne({
        where: { enquiryId: req.params.id },
      });

      if (!customer_order) {
        const assignedUser = await InstallerTasks.findOne({
          where: { enquiryId: req.params.id },
          order: [["id", "desc"]],
        });

        const otp = Math.floor(100000 + Math.random() * 900000);
        const newOrder = await CustomerOrder.create({
          otp,
          enquiryId: req.params.id,
          customerId: assignedUser.customerId,
          installerId: req.userId,
        });

        const enquiry = await Enquiry.findOne({
          where: { id: req.params.id },
          include: [Customer],
        });
        const message = installation_done_otp(
          enquiry.customer.firstName + " " + enquiry.customer.lastName,
          otp,
        );
        whatsappMessage(message, enquiry.customer.primary_phone,true);

        return res.status(200).json({
          message: "Order Proof Submitted Please Verify the OTP",
          data: newOrder,
          status: true,
        });
      }
      return res.status(400).json({
        message: "Order Already Submitted",
        data: customer_order,
        status: true,
      });
    } else {
      return res.status(400).json({
        message: "Invalid Request Choose Either Warehouse or Customer",
        data: [],
        status: false,
      });
    }
  } catch (e) {
    next(e);
  }
};
exports.verifyOTP = async (req, res, next) => {
  try {
    if (req.query.type == "warehouse") {
      const warehouseOrder = await WarehouseOrder.findOne({
        where: { installerId: req.userId, enquiryId: req.params.id },
      });
      if (warehouseOrder.otp == warehouseOrder.otp) {
        const assignedUser = await InstallerTasks.findOne({
          where: { enquiryId: req.params.id, installerId: req.userId },
          order: [["id", "desc"]],
        });
        await assignedUser.update({
          status: "active",
        });
        await warehouseOrder.update({
          status: "verified",
        });
        return res.status(200).json({
          message: "OTP Verified Order Ready For Shipping",
          data: warehouseOrder,
          status: true,
        });
      } else {
        return res.status(400).json({
          message: "Invalid OTP",
          status: false,
        });
      }
    } else if (req.query.type == "customer") {
      console.log(req.userId, req.params.id);
      const assignedUser = await InstallerTasks.findOne({
        where: { enquiryId: req.params.id },
        order: [["id", "DESC"]],
      });
      const customerOrder = await CustomerOrder.findOne({
        where: {
          installerId: assignedUser.installerId,
          enquiryId: req.params.id,
        },
      });
      if (req.body.otp == customerOrder.otp) {
        await assignedUser.update({
          status: "completed",
          installation_done: new Date(),
        });

        await customerOrder.update({
          status: "verified",
        });

        await Enquiry.update(
          {
            status: "installation-done",
          },
          { where: { id: req.params.id } },
        );

        await EnquiryStatus.create({
          remark: "Delivery/Installation Done",
          status: "completed",
          enquiryId: req.params.id,
        });

        return res.status(200).json({
          message: "OTP Verified Order Placed And Installed",
          data: customerOrder,
          status: true,
        });
      } else {
        return res.status(400).json({
          message: "Invalid OTP",
          status: false,
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid Request Choose Either Warehouse or Customer",
        data: [],
        status: false,
      });
    }
  } catch (e) {
    next(e);
  }
};

exports.updateSchedules = async (req, res, next) => {
  try {
    const schedule = await InstallerTasks.findOne({
      where: { id: req.body.id },
    });
    dataNotFound(schedule, 404, "No schedule found");

    if (req.body.status == "accepted") {
      await schedule.update({
        status: "active",
      });
      const enquiryStatus = await EnquiryStatus.findOne({
        where: {
          remark: "Installation Started",
          status: "completed",
          enquiryId: schedule.enquiryId,
        },
      });

      if (!enquiryStatus) {
        await EnquiryStatus.create({
          remark: "Installation Started",
          status: "completed",
          enquiryId: schedule.enquiryId,
        });
      }
    } else if (req.body.status == "postponed") {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const postponeDate = req.body.postponeDate; // YYYY-MM-DD

      const isSameDate = today === postponeDate;

      await schedule.update({
        status: isSameDate ? "pending" : "postponed",
        remark: req.body.remark,
        date: isSameDate ? req.body.postponeDate : null,
        postponeDate: isSameDate ? null : req.body.postponeDate,
        scheduleId: req.body.scheduleId,
        installerId: req.body.installerId,
        postpone_count: schedule.postpone_count + 1,
      });
      // await schedule.update({
      //     status : "postponed",
      //     remark : req.body.remark,
      //     date: null,
      //     postponeDate : req.body.postponeDate,
      //     scheduleId: req.body.scheduleId,
      //     postpone_count: schedule.postpone_count + 1
      // })

      let sch;
      if (req.body.scheduleId) {
        sch = await Schedule.findOne({ where: { id: req.body.scheduleId } });
      }
      await EnquiryStatus.create({
        remark: "Installation Postponed",
        status: "completed",
        enquiryId: schedule.enquiryId,
        details: {
          remark: req.body.remark,
          date: req.body.postponeDate,
          start_time: req.body.scheduleId ? sch.start_time : "",
          end_time: req.body.scheduleId ? sch.end_time : "",
        },
      });

      ////Start push notification function-----------
      const enquirydata = await Enquiry.findOne({
        where: { id: schedule.enquiryId },
      });
      const installer = await User.findOne({
        where: { id: schedule.installerId },
      });
      const outletUser = await OutletUser.findOne({
        where: { salesPersonId: enquirydata.salesId },
      });
      const obj = {
        message: `Installation postponed for enquiry ${enquirydata.enquiryId} on ${req.body.postponeDate}.`,
        enquiryId: enquirydata.id,
      };

      await send_notification(installer.fcmToken, "Installation postpone", obj);
      const notification = await Notification.findOne({
        where: { message: obj.message, enquiryId: enquirydata.id },
      });
      await Notification.create({
        message: obj.message,
        enquiryId: enquirydata.id,
        installerId: installer.id,
        adminId: outletUser.outletId,
      });
      //end push Notification function-----------
    } else if (req.body.status == "cancelled") {
      await schedule.update({
        status: "canceled",
        remark: req.body.remark,
      });
      const enquiryStatus = await EnquiryStatus.findOne({
        where: {
          remark: "Installation Cancelled",
          status: "completed",
          enquiryId: schedule.enquiryId,
        },
      });

      if (!enquiryStatus) {
        await EnquiryStatus.create({
          remark: "Installation Cancelled",
          status: "completed",
          enquiryId: schedule.enquiryId,
        });
      }
    } else {
      throw new Error("Invalid Status Choose Either Accept Reject Or Postpone");
    }

    return res.status(200).json({
      message: "Enquiry Updated",
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

exports.add_wcr = async (req, res, next) => {
  try {
    const enquery = await Enquiry.findOne({
      where: { id: req.params.enquiryId },
    });
    if (!enquery) {
      return res.status(400).json({
        message: "Enquiry not Exists",
        status: false,
      });
    }

    const wcrData = await Wcr.findOne({
      where: { enquiryId: req.params.enquiryId },
    });
    if (!wcrData) {
      const newWcr = await Wcr.create({
        pelmet: req.body.pelmet,
        belt: req.body.belt,
        beltPiping: req.body.beltPiping,
        beltBorder: req.body.beltBorder,
        primaryBorder: req.body.primaryBorder,
        secondaryBorder: req.body.secondaryBorder,
        fabric1: req.body.fabric1,
        fabric2: req.body.fabric2,
        mock: req.body.mock,
        lining: req.body.lining,
        sheer: req.body.sheer,
        primaryRod: req.body.primaryRod,
        curtainStick: req.body.curtainStick,
        endCapWallSupport: req.body.endCapWallSupport,
        extraBracketSupport: req.body.extraBracketSupport,
        extraBracket: req.body.extraBracket,
        endCap: req.body.endCap,
        finial: req.body.finial,
        tieKnob: req.body.tieKnob,
        secondaryRod: req.body.secondaryRod,
        primary_track: req.body.primary_track,
        primaryTrackMotor: req.body.primaryTrackMotor,
        primaryTrackRemote: req.body.primaryTrackRemote,
        primaryOverlapper: req.body.primaryOverlapper,
        primaryTrackCuratinStick: req.body.primaryTrackCuratinStick,
        primaryExtraTrackBracket: req.body.primaryExtraTrackBracket,
        primary_track_tieknob: req.body.primary_track_tieknob,
        secondary_track_tieknob: req.body.secondary_track_tieknob,
        mock_track_tieknob: req.body.mock_track_tieknob,
        Lbracket: req.body.Lbracket,
        secondary_track: req.body.secondary_track,
        secondaryTrackMotor: req.body.secondaryTrackMotor,
        secondaryTrackRemote: req.body.secondaryTrackRemote,
        secondaryOverlapper: req.body.secondaryOverlapper,
        mockTrackCuratinStick: req.body.mockTrackCuratinStick,
        mockExtraTrackBracket: req.body.mockExtraTrackBracket,
        flooring: req.body.flooring,
        sofa: req.body.sofa,
        wallpanel: req.body.wallpanel,
        bedback: req.body.bedback,
        pouffee: req.body.pouffee,
        cushion: req.body.cushion,
        wallpaper: req.body.wallpaper,
        blindFabricArr: req.body.blindFabricArr,
        blindLiningArr: req.body.blindLiningArr,
        blindShadesArr: req.body.blindShadesArr,
        blindBorderFabricArr: req.body.blindBorderFabricArr,
        blindTrack: req.body.blindTrack,
        blindTrackRemote: req.body.blindTrackRemote,
        blind_track_motor: req.body.blind_track_motor,
        blindExtraBracket: req.body.blindExtraBracket,
        blind_type_search_fabric: req.body.blind_type_search_fabric,
        enquiryId: enquery.id,
      });
      // const newWcr = await Wcr.create({
      //     report: JSON.stringify(req.body.report),
      //     enquiryId: req.params.enquiryId
      // })
      await EnquiryStatus.create({
        remark: "WCR Completed",
        status: "completed",
        enquiryId: req.params.enquiryId,
      });

      return res.status(200).json({
        message: `Wcr added seccessfully`,
        status: true,
        data: newWcr,
      });
    }
    await wcrData.update({
      pelmet: req.body.pelmet,
      belt: req.body.belt,
      beltPiping: req.body.beltPiping,
      beltBorder: req.body.beltBorder,
      primaryBorder: req.body.primaryBorder,
      secondaryBorder: req.body.secondaryBorder,
      fabric1: req.body.fabric1,
      fabric2: req.body.fabric2,
      mock: req.body.mock,
      lining: req.body.lining,
      sheer: req.body.sheer,
      primaryRod: req.body.primaryRod,
      curtainStick: req.body.curtainStick,
      endCapWallSupport: req.body.endCapWallSupport,
      extraBracketSupport: req.body.extraBracketSupport,
      extraBracket: req.body.extraBracket,
      endCap: req.body.endCap,
      finial: req.body.finial,
      tieKnob: req.body.tieKnob,
      secondaryRod: req.body.secondaryRod,
      primary_track: req.body.primary_track,
      primaryTrackMotor: req.body.primaryTrackMotor,
      primaryTrackRemote: req.body.primaryTrackRemote,
      primaryOverlapper: req.body.primaryOverlapper,
      primaryTrackCuratinStick: req.body.primaryTrackCuratinStick,
      primaryExtraTrackBracket: req.body.primaryExtraTrackBracket,
      primary_track_tieknob: req.body.primary_track_tieknob,
      secondary_track_tieknob: req.body.secondary_track_tieknob,
      mock_track_tieknob: req.body.mock_track_tieknob,
      Lbracket: req.body.Lbracket,
      secondary_track: req.body.secondary_track,
      secondaryTrackMotor: req.body.secondaryTrackMotor,
      secondaryTrackRemote: req.body.secondaryTrackRemote,
      secondaryOverlapper: req.body.secondaryOverlapper,
      mockTrackCuratinStick: req.body.mockTrackCuratinStick,
      mockExtraTrackBracket: req.body.mockExtraTrackBracket,
      flooring: req.body.flooring,
      sofa: req.body.sofa,
      wallpanel: req.body.wallpanel,
      bedback: req.body.bedback,
      pouffee: req.body.pouffee,
      cushion: req.body.cushion,
      wallpaper: req.body.wallpaper,
      blindFabricArr: req.body.blindFabricArr,
      blindLiningArr: req.body.blindLiningArr,
      blindShadesArr: req.body.blindShadesArr,
      blindBorderFabricArr: req.body.blindBorderFabricArr,
      blindTrack: req.body.blindTrack,
      blindTrackRemote: req.body.blindTrackRemote,
      blind_track_motor: req.body.blind_track_motor,
      blindExtraBracket: req.body.blindExtraBracket,
      blind_type_search_fabric: req.body.blind_type_search_fabric,
    });
    // await wcrData.update({
    //     report: JSON.stringify(req.body.report),
    //     enquiryId: req.params.enquiryId
    // })

    return res.status(200).json({
      message: `Wcr upadated seccessfully`,
      status: true,
      data: wcrData,
    });
  } catch (error) {
    next(error);
  }
};

exports.get_wcr = async (req, res, next) => {
  try {
    const wcrData = await Wcr.findOne({
      where: { enquiryId: req.params.enquiryId },
    });
    if (!wcrData) {
      return res.status(200).json({
        message: "Wcr Enquiry",
        status: true,
        data: null,
      });
    }

    // wcrData.dataValues.report = JSON.parse(wcrData.report)

    return res.status(200).json({
      message: "Wcr Enquiry",
      status: true,
      data: wcrData,
    });
  } catch (error) {
    next(error);
  }
};

exports.getWcrReport = async (req, res, next) => {
  try {
    const wcrData = await Wcr_Report.findOne({
      where: { enquiryId: req.params.enquiryId },
    });
    if (!wcrData) {
      return res.status(200).json({
        message: "Wcr Enquiry",
        status: true,
        data: null,
      });
    }

    // wcrData.dataValues.report = JSON.parse(wcrData.report)

    return res.status(200).json({
      message: "Wcr Enquiry",
      status: true,
      data: wcrData,
    });
  } catch (error) {
    next(error);
  }
};

exports.addWcrReport = async (req, res, next) => {
  const report = await Wcr_Report.findOne({
    where: { enquiryId: req.body.enquiryId },
  });

  const enquiry = await Enquiry.findOne({ where: { id: req.body.enquiryId } });
  await enquiry.update({ status: "completed" });

  const assignedUser = await InstallerTasks.findOne({
    where: { enquiryId: enquiry.id },
    order: [["id", "DESC"]],
  });

  await assignedUser.update({ status: "wcr_completed" });

  const installation = await InstallerTasks.findOne({
    where: { enquiryId: enquiry.id },
    order: [["id", "ASC"]],
  });
  if (installation) {
    const createdAt = new Date(installation.createdAt);
    const now = new Date();

    const timeDifference = now - createdAt;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    let tatParts = [];

    if (days > 0) {
      tatParts.push(`${days} days`);
    }

    if (days > 0 || remainingHours > 0) {
      tatParts.push(`${remainingHours} hours`);
    }

    if (days > 0 || remainingHours > 0 || remainingMinutes > 0) {
      tatParts.push(`${remainingMinutes} minutes`);
    }

    tatParts.push(`${remainingSeconds} seconds`);

    const tat = tatParts.join(", ");
    await assignedUser.update({ tat });
  }

  ///////////////////////////whatsappMessage----------------
  const customer = await Customer.findOne({
    where: { id: enquiry.customerId },
  });
  const message_data = await Message.findOne({
    where: { enquiryId: enquiry.id, message: "feedback_message" },
  });
  if (!message_data) {
    await Message.create({
      message: "feedback_message",
      enquiryId: enquiry.id,
    });
    const message = feedback_message(
      customer.firstName + " " + customer.lastName,
      enquiry.id,
    );
    whatsappMessage(message, customer.primary_phone);
  }

  if (report) {
    await report.update({
      report: req.body.report,
      enquiryId: req.body.enquiryId,
    });

    return res.status(200).json({
      message: `Wcr upadated seccessfully`,
      status: true,
      data: report,
    });
  }

  const newReport = await Wcr_Report.create({
    report: req.body.report,
    enquiryId: req.body.enquiryId,
  });

  await EnquiryStatus.create({
    remark: "WCR Completed",
    status: "completed",
    enquiryId: req.body.enquiryId,
  });

  const assignedMeasurer = await Enquiry_Schedule.findOne({
    where: { enquiryId: enquiry.id },
    order: [["id", "DESC"]],
  });

  const userData = await User.findByPk(assignedMeasurer.enquiryschedules);

  const salesPerson = await User.findByPk(enquiry.salesId);

  return res.status(200).json({
    message: `Wcr added seccessfully`,
    status: true,
    data: newReport,
  });
};

exports.getWcrChecks = async (req, res, next) => {
  try {
    const response = await axios.get(
      `${process.env.LOCAL_URL}api/v1/sales/enquiry-detail/${req.query.id}`,
      getAuthHeaderConfig(req),
    );

    const types = {};

    const typeKeys = [
      "curtain",
      "rod",
      "sheer",
      "track",
      "blind",
      "sofa",
      "wallpanel",
      "pouffee",
      "bedback",
      "flooring",
      "Wallpaper",
    ];

    typeKeys.forEach((typeKey) => {
      const typeSet = new Set();
      response.data[typeKey].forEach((item) => {
        if (item.type) {
          let type = item.type;
          if (type.includes("_")) {
            type = type
              .replace(/_/g, " ")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }
          typeSet.add(type);
        }
      });
      types[typeKey] = Array.from(typeSet);
    });

    return res.status(200).json({
      message: "Data Fetched",
      status: true,
      data: types,
    });
  } catch (error) {
    console.error("Error:", error);
  }
};
