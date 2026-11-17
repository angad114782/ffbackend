const {
  RoomAsset,
  Media,
  Room,
  Schedule,
  InstallerTasks,
  Enquiry_Schedule,
  CurtainStyle,
  CeilingType,
  SelectedMaterial,
  Material,
  WallType,
  Message,
  SelectedWallpaper,
  CurtainOperation,
  Ladder,
  Notification,
  Enquiry,
  Customer,
  User,
  SelectedCurtain,
  SelectedRod,
  SelectedSheer,
  EnquiryStatus,
  CurtainFabric,
  Track,
  SelectedTrack,
  BlindStyle,
  BlindFittingType,
  BlindWindowType,
  BlindBorderType,
  SelectedBlind,
  BlindTrackType,
  BlindMotorType,
  BlindFabric,
  BlindMotorTrackType,
  ParkingSpace,
  BlindSubType,
  BlindAsset,
  SheerFabric,
  Area,
  WallpaperArea,
  Wall,
  SelectedFlooring,
  OutletUser,
  OutletAddress,
  Client_Signature,
} = require("../model");
const { UploadFile, removefile } = require("../helper/multer");
const { dataNotFound, getAuthHeaderConfig } = require("../helper/functions");
const sequelize = require("../utils/database");
const { Op, Sequelize } = require("sequelize");
const {
  sendMail,
  send_notification,
  whatsappMessage,
} = require("../helper/mailer");
const axios = require("axios");
const { style_update } = require("../helper/messages");

function checkOddOrEven(num) {
  if (num % 2 === 0) {
    return "Even";
  } else {
    return "Odd";
  }
}

async function measurement(width, heights, gathering, VRepeat) {
  if (gathering == 1) {
    if (VRepeat == 0 || VRepeat == "0") {
      const widths = parseFloat(width);
      const drops = parseFloat(heights);
      const gatherings = 50.08;

      const panel = Math.ceil(widths / gatherings);
      const readyLength = drops + 35;
      const fabricRequired = panel * readyLength;
      const meterFabric = fabricRequired / 100;
      return { meterFabric, panel };
    } else {
      const widths = parseFloat(width); //230
      const drops = parseFloat(heights); //602
      const gatherings = 50.08;

      const panel = Math.ceil(widths / gatherings); // 5
      const readyLength = (drops + 35) / 100; // 6.42
      const repeat = VRepeat / 100; // 0.2438
      const data = Math.ceil(readyLength / repeat); // 26.5
      const repeatInMeter = repeat * data; // 6.46
      const meterFabric = repeatInMeter * panel; // 32.3
      return { meterFabric, panel };
    }
  } else if (gathering == 2) {
    if (VRepeat == 0 || VRepeat == "0") {
      const widths = parseFloat(width);
      const drops = parseFloat(heights);
      const gatherings = 55.88;

      const panel = Math.ceil(widths / gatherings);
      const readyLength = drops + 35;
      const fabricRequired = panel * readyLength;
      const meterFabric = fabricRequired / 100;
      return { meterFabric, panel };
    } else {
      const widths = parseFloat(width);
      const drops = parseFloat(heights);
      const gatherings = 55.88;

      const panel = Math.ceil(widths / gatherings);
      const readyLength = (drops + 35) / 100;
      const repeat = VRepeat / 100;
      const data = Math.ceil(readyLength / repeat);
      const repeatInMeter = repeat * data;
      const meterFabric = repeatInMeter * panel;

      return { meterFabric, panel };
    }
  } else if (gathering == 3) {
    if (VRepeat == 0 || VRepeat == "0") {
      const widths = parseFloat(width);
      const drops = parseFloat(heights);
      const gatherings = 45.72;

      const panel = Math.ceil(widths / gatherings);
      const readyLength = drops + 35;
      const fabricRequired = panel * readyLength;
      const meterFabric = fabricRequired / 100;
      return { meterFabric, panel };
    } else {
      const widths = parseFloat(width);
      const drops = parseFloat(heights);
      const gatherings = 45.72;

      const panel = Math.ceil(widths / gatherings); //   187/45.72 = 5
      const readyLength = (drops + 35) / 100; //   214+40/100 = 2.54
      const repeat = VRepeat / 100; //   0.4/100 = 0.004
      const data = Math.ceil(readyLength / repeat); //   2.54/0.004 = 635
      const repeatInMeter = repeat * data; //   0.004 * 635 = 2.54
      const meterFabric = repeatInMeter * panel; //   2.54 * 5 = 12.7
      return { meterFabric, panel }; //  { 12.7, 5 }
    }
  } else if (gathering == 4) {
    if (VRepeat == 0 || VRepeat == "0") {
      const widths = parseFloat(width);
      const drops = parseFloat(heights);
      const gatherings = 60.96;

      const panel = Math.ceil(widths / gatherings);
      const readyLength = drops + 35;
      const fabricRequired = panel * readyLength;
      const meterFabric = fabricRequired / 100;
      return { meterFabric, panel };
    } else {
      const widths = parseFloat(width);
      const drops = parseFloat(heights);
      const gatherings = 60.96;

      const panel = Math.ceil(widths / gatherings);
      const readyLength = (drops + 35) / 100;
      const repeat = VRepeat / 100;
      const data = Math.ceil(readyLength / repeat);
      const repeatInMeter = repeat * data;
      const meterFabric = repeatInMeter * panel;
      return { meterFabric, panel };
    }
  } else if (gathering == 5) {
    if (VRepeat == 0 || VRepeat == "0") {
      const widths = parseFloat(width);
      const drops = parseFloat(heights);
      const gatherings = 66.04;

      const panel = Math.ceil(widths / gatherings);
      const readyLength = drops + 35;
      const fabricRequired = panel * readyLength;
      const meterFabric = fabricRequired / 100;
      return { meterFabric, panel };
    } else {
      const widths = parseFloat(width);
      const drops = parseFloat(heights);
      const gatherings = 66.04;

      const panel = Math.ceil(widths / gatherings);
      const readyLength = (drops + 35) / 100;
      const repeat = VRepeat / 100;
      const data = Math.ceil(readyLength / repeat);
      const repeatInMeter = repeat * data;
      const meterFabric = repeatInMeter * panel;
      return { meterFabric, panel };
    }
  }
}
async function BlindMeasurement(width, heights, numberOfPanel, repeat) {
  if (repeat == 0) {
    let readyDrop = heights + 25;
    const obj = {
      readyDrop: heights + 25,
      totalFabric: parseFloat(readyDrop / numberOfPanel / 100),
    };
    return obj;
  } else {
    const readyDrop = parseFloat(heights) + parseFloat(repeat / 100);
    const calc = parseFloat(readyDrop) / parseFloat(repeat / 100);
    const fabric = calc * parseFloat(repeat / 100);
    const totalFabric = parseFloat(fabric * parseFloat(numberOfPanel));
    return totalFabric;
  }
}

exports.addWindow = async (req, res, next) => {
  try {
    const window = await RoomAsset.create({
      roomId: req.body.roomId,
    });
    return res.status(200).json({
      message: "New Window Added",
      data: window,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

exports.removeWindow = async (req, res, next) => {
  try {
    await RoomAsset.destroy({ where: { id: req.params.id } });

    return res.status(200).json({
      message: "Window removed",
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

exports.add_assets = async (req, res, next) => {
  try {
    const arr = [];
    let old_curtain_style = null;
    let new_curtain_style = null;
    let old_mock_curtain_style = null;
    let new_mock_curtain_style = null;
    let old_sheer_style = null;
    let new_sheer_style = null;

    for (var i = 0; i < req.body.length; i++) {
      if (req.body[i].roomAssetId) {
        const check = await RoomAsset.findOne({
          where: { id: req.body[i].roomAssetId },
        });

        if (!check) throw new Error("Room Asset not found");
        const Checkroom = await Room.findOne({ where: { id: check.roomId } });

        const checkEnq = await Enquiry.findOne({
          where: { id: Checkroom.enquiryId },
        });
        if (checkEnq.status == "cancelled") {
          throw new Error("Enquiry Cancelled");
        }

        const data = await check.update({
          height: req.body[i].height,
          width: req.body[i].width,
          curtain_plywoord_required: req.body[i].curtain_plywoord_required,
          sheer_window_height: req.body[i].sheer_window_height,
          sheer_window_width: req.body[i].sheer_window_width,
          sheer_window_same_as: req.body[i].sheer_window_same_as,
          widhtOfCove: req.body[i].widhtOfCove,
          ladderHeight: req.body[i].ladderHeight,
          mount_type: req.body[i].mount_type,
          ceilingTypeId: req.body[i].ceilingTypeId,
          wallTypeId: req.body[i].wallTypeId,
          ladderId: req.body[i].ladderId,
          accept_driling_from_FF_side: req.body[i].accept_driling_from_FF_side,
          accept_driling_from_client_side:
            req.body[i].accept_driling_from_client_side,
          curtainOperationId: req.body[i].curtainOperationId,
          blind_drilling_msg: req.body[i].blind_drilling_msg,
          pelmet: req.body[i].pelmet_data,
          primary_track_length: req.body[i].primary_track_length,
          secondary_track_length: req.body[i].secondary_track_length,
          mock_track_length: req.body[i].mock_track_length,
          primary_rod_length: req.body[i].primary_rod_length,
          secondary_rod_length: req.body[i].secondary_rod_length,
          pelmet_track_length: req.body[i].pelmet_track_length,
        });

        if (
          req.body[i].blind_width_top ||
          req.body[i].blind_width_middle ||
          req.body[i].blind_width_bottom ||
          req.body[i].blind_drop_left ||
          req.body[i].blind_drop_right ||
          req.body[i].blind_drop_middle ||
          req.body[i].blind_track_size ||
          req.body[i].blind_chain_length ||
          req.body[i].blind_mount_type ||
          req.body[i].blind_parking_space ||
          req.body[i].blind_remark
        ) {
          const blindAsset = await BlindAsset.findOne({
            where: { roomAssetId: check.id },
          });

          if (!blindAsset) {
            await BlindAsset.create({
              blind_custom_dimentions: req.body[i].blind_custom_dimentions,
              blind_plywood_required: req.body[i].blind_plywood_required,
              blind_width_top: req.body[i].blind_width_top,
              blind_width_middle: req.body[i].blind_width_middle,
              blind_width_bottom: req.body[i].blind_width_bottom,
              blind_drop_left: req.body[i].blind_drop_left,
              blind_drop_right: req.body[i].blind_drop_right,
              blind_drop_middle: req.body[i].blind_drop_middle,
              blind_track_size: req.body[i].blind_track_size,
              blind_chain_length: req.body[i].blind_chain_length,
              blind_mount_type: req.body[i].blind_mount_type,
              blind_parking_space: req.body[i].blind_parking_space,
              blind_remark: req.body[i].blind_remark,
              curtainOperationId: req.body[i].curtainOperationId,
              ceilingTypeId: req.body[i].ceilingTypeId,
              wallTypeId: req.body[i].wallTypeId,
              parkingSpaceId: req.body[i].parkingSpaceId,
              roomAssetId: data.id,
              accept_blind_driling_from_FF_side:
                req.body[i].accept_blind_driling_from_FF_side,
              accept_blind_driling_from_client_side:
                req.body[i].accept_blind_driling_from_client_side,
            });
          } else {
            await blindAsset.update({
              blind_custom_dimentions: req.body[i].blind_custom_dimentions,
              blind_width_top: req.body[i].blind_width_top,
              blind_width_middle: req.body[i].blind_width_middle,
              blind_width_bottom: req.body[i].blind_width_bottom,
              blind_drop_left: req.body[i].blind_drop_left,
              blind_drop_right: req.body[i].blind_drop_right,
              blind_drop_middle: req.body[i].blind_drop_middle,
              blind_track_size: req.body[i].blind_track_size,
              blind_chain_length: req.body[i].blind_chain_length,
              blind_mount_type: req.body[i].blind_mount_type,
              blind_parking_space: req.body[i].blind_parking_space,
              blind_remark: req.body[i].blind_remark,
              curtainOperationId: req.body[i].curtainOperationId,
              ceilingTypeId: req.body[i].ceilingTypeId,
              wallTypeId: req.body[i].wallTypeId,
              parkingSpaceId: req.body[i].parkingSpaceId,
              roomAssetId: data.id,
              accept_blind_driling_from_FF_side:
                req.body[i].accept_blind_driling_from_FF_side,
              accept_blind_driling_from_client_side:
                req.body[i].accept_blind_driling_from_client_side,
            });
          }

          if (
            req.body[i].blind_required ||
            req.body[i].blind_lining_required ||
            req.body[i].blind_lining_width ||
            req.body[i].blind_hardware_required ||
            req.body[i].blind_border_required ||
            req.body[i].blind_screw_required ||
            req.body[i].blind_extra_bracket_support_required ||
            req.body[i].blind_extra_bracket_support_quantity
          ) {
            const blinds = await SelectedBlind.findOne({
              where: { roomAssetId: check.id },
            });
            if (!blinds) {
              await SelectedBlind.create({
                tdbu_is_required: req.body[i].tdbu_is_required,
                blind_border_type: req.body[i].blind_border_type,
                blind_fabric_required: req.body[i].blind_fabric_required,
                blind_track: req.body[i].blind_track,
                blind_motor_type: req.body[i].blind_motor_type,
                blind_motor_track_type: req.body[i].blind_motor_track_type,
                blind_fabric: req.body[i].blind_fabric,
                blind_shades: req.body[i].blind_shades,
                blind_border_fabric: req.body[i].blind_border_fabric,
                blind_window_type: req.body[i].blind_window_type,
                blind_fitting_type: req.body[i].blind_fitting_type,
                blind_style: req.body[i].blind_style,
                blind_sub_type: req.body[i].blind_sub_type,
                LiningFabric: req.body[i].blind_lining,
                LiningType: req.body[i].blind_lining_type,
                blind_required: req.body[i].blind_required,
                blind_lining_required: req.body[i].blind_lining_required,
                blind_lining_width: req.body[i].blind_lining_width,
                blind_hardware_required: req.body[i].blind_hardware_required,
                blind_border_required: req.body[i].blind_border_required,
                blind_screw_required: req.body[i].blind_screw_required,
                blind_screw_size: req.body[i].blind_screw_size,
                blind_extra_bracket_support_required:
                  req.body[i].blind_extra_bracket_support_required,
                blind_extra_bracket_support_quantity:
                  req.body[i].blind_extra_bracket_support_quantity,
                roomAssetId: data.id,
                no_of_blinds: req.body[i].no_of_blinds,
                blind_default_width: req.body[i].blind_default_width,
                blind_default_drop: req.body[i].blind_default_drop,
                no_of_blind_motor_remote: req.body[i].no_of_blind_motor_remote,
                blind_border_fabric_required:
                  req.body[i].blind_border_fabric_required,
                blind_border_curtain_fabric_required:
                  req.body[i].blind_border_curtain_fabric_required,
                blind_border_curtain_fabric:
                  req.body[i].blind_border_curtain_fabric,
                blind_pelmet_required: req.body[i].blind_pelmet_required,
                blind_pelmet_width: req.body[i].blind_pelmet_width,
                blind_pelmet_drop: req.body[i].blind_pelmet_drop,
                blindTypeSearchFabric: req.body[i].blindTypeSearchFabric,
                blindTypeSearchMotor: req.body[i].blindTypeSearchMotor,
                blindTypeSearchRemote: req.body[i].blindTypeSearchRemote,
                blindTypeSearchRemoteQuantity:
                  req.body[i].blindTypeSearchRemoteQuantity,
                blindTrackMotor: req.body[i].blindTrackMotor,
                blindTrackRemote: req.body[i].blindTrackRemote,
                blind_extra_bracket: req.body[i].blind_extra_bracket,
                isBlindTypeMotorized: req.body[i].isBlindTypeMotorized,
                border_length: req.body[i].border_length,
                border_price: req.body[i].border_price,
                blind_fabric_discount: req.body[i].blind_fabric_discount,
                blind_track_motor_discount:
                  req.body[i].blind_track_motor_discount,
                blind_track_remote_discount:
                  req.body[i].blind_track_remote_discount,
                blind_extra_bracket_discount:
                  req.body[i].blind_extra_bracket_discount,
                blind_track_discount: req.body[i].blind_track_discount,
                blind_shades_discount: req.body[i].blind_shades_discount,
                blind_type_search_remote_discount:
                  req.body[i].blind_type_search_remote_discount,
                blind_type_search_motor_discount:
                  req.body[i].blind_type_search_motor_discount,
                blind_type_search_discount:
                  req.body[i].blind_type_search_discount,
                blind_lining_discount: req.body[i].blind_lining_discount,
                blind_border_discount: req.body[i].blind_border_discount,
                blind_border_curtain_fabric_discount:
                  req.body[i].blind_border_curtain_fabric_discount,
                border_curtain_length: req.body[i].border_curtain_length,
                border_curtain_price: req.body[i].border_curtain_price,
                blind_custom_title: req.body[i].blind_custom_title,
              });
            } else {
              await blinds.update({
                tdbu_is_required: req.body[i].tdbu_is_required,
                blind_border_type: req.body[i].blind_border_type,
                blind_fabric_required: req.body[i].blind_fabric_required,
                blind_track: req.body[i].blind_track,
                blind_motor_type: req.body[i].blind_motor_type,
                blind_motor_track_type: req.body[i].blind_motor_track_type,
                blind_fabric: req.body[i].blind_fabric,
                blind_shades: req.body[i].blind_shades,
                blind_border_fabric: req.body[i].blind_border_fabric,
                blind_window_type: req.body[i].blind_window_type,
                blind_fitting_type: req.body[i].blind_fitting_type,
                blind_style: req.body[i].blind_style,
                blind_sub_type: req.body[i].blind_sub_type,
                LiningFabric: req.body[i].blind_lining,
                LiningType: req.body[i].blind_lining_type,
                blind_required: req.body[i].blind_required,
                blind_lining_required: req.body[i].blind_lining_required,
                blind_lining_width: req.body[i].blind_lining_width,
                blind_hardware_required: req.body[i].blind_hardware_required,
                blind_border_required: req.body[i].blind_border_required,
                blind_screw_required: req.body[i].blind_screw_required,
                blind_screw_size: req.body[i].blind_screw_size,
                blind_extra_bracket_support_required:
                  req.body[i].blind_extra_bracket_support_required,
                blind_extra_bracket_support_quantity:
                  req.body[i].blind_extra_bracket_support_quantity,
                roomAssetId: data.id,
                no_of_blinds: req.body[i].no_of_blinds,
                blind_default_width: req.body[i].blind_default_width,
                blind_default_drop: req.body[i].blind_default_drop,
                no_of_blind_motor_remote: req.body[i].no_of_blind_motor_remote,
                blind_border_fabric_required:
                  req.body[i].blind_border_fabric_required,
                blind_border_curtain_fabric_required:
                  req.body[i].blind_border_curtain_fabric_required,
                blind_border_curtain_fabric:
                  req.body[i].blind_border_curtain_fabric,
                blind_pelmet_required: req.body[i].blind_pelmet_required,
                blind_pelmet_width: req.body[i].blind_pelmet_width,
                blind_pelmet_drop: req.body[i].blind_pelmet_drop,
                blindTypeSearchFabric: req.body[i].blindTypeSearchFabric,
                blindTypeSearchMotor: req.body[i].blindTypeSearchMotor,
                blindTypeSearchRemote: req.body[i].blindTypeSearchRemote,
                blindTypeSearchRemoteQuantity:
                  req.body[i].blindTypeSearchRemoteQuantity,
                blindTrackMotor: req.body[i].blindTrackMotor,
                blindTrackRemote: req.body[i].blindTrackRemote,
                blind_extra_bracket: req.body[i].blind_extra_bracket,
                isBlindTypeMotorized: req.body[i].isBlindTypeMotorized,
                border_length: req.body[i].border_length,
                border_price: req.body[i].border_price,
                blind_fabric_discount: req.body[i].blind_fabric_discount,
                blind_track_motor_discount:
                  req.body[i].blind_track_motor_discount,
                blind_track_remote_discount:
                  req.body[i].blind_track_remote_discount,
                blind_extra_bracket_discount:
                  req.body[i].blind_extra_bracket_discount,
                blind_track_discount: req.body[i].blind_track_discount,
                blind_shades_discount: req.body[i].blind_shades_discount,
                blind_type_search_remote_discount:
                  req.body[i].blind_type_search_remote_discount,
                blind_type_search_motor_discount:
                  req.body[i].blind_type_search_motor_discount,
                blind_type_search_discount:
                  req.body[i].blind_type_search_discount,
                blind_lining_discount: req.body[i].blind_lining_discount,
                blind_border_discount: req.body[i].blind_border_discount,
                blind_border_curtain_fabric_discount:
                  req.body[i].blind_border_curtain_fabric_discount,
                border_curtain_length: req.body[i].border_curtain_length,
                border_curtain_price: req.body[i].border_curtain_price,
                blind_custom_title: req.body[i].blind_custom_title,
              });
            }
          }
        }
        const fabMesurement = await SelectedCurtain.findOne({
          where: { roomId: req.body[i].roomId },
        });
        const SheerMesurement = await SelectedSheer.findOne({
          where: { roomId: req.body[i].roomId },
        });
        const blindmeasurement = await SelectedBlind.findOne({
          where: { roomAssetId: req.body[i].roomAssetId },
        });

        if (fabMesurement) {
          ///---------------------update room style send message-------------------
          if (fabMesurement.curtain_style && req.body[i].curtain_style) {
            if (fabMesurement.curtain_style !== req.body[i].curtain_style) {
              const curtainStyleOld = await CurtainStyle.findByPk(
                fabMesurement.curtain_style,
              );
              const curtainStyleNew = await CurtainStyle.findByPk(
                req.body[i].curtain_style,
              );

              old_curtain_style =
                old_curtain_style +
                "," +
                (curtainStyleOld ? curtainStyleOld.curtainStyle : "");
              new_curtain_style =
                new_curtain_style +
                "," +
                (curtainStyleNew ? curtainStyleNew.curtainStyle : "");
            }
          }
          await fabMesurement.update({
            curtain_style: req.body[i].curtain_style,
          });

          if (fabMesurement.beltFabric) {
            check.total_belt_fabric_required = 0.25; ////////////////// 0.5
            await check.save();
            await check.reload();
          }
          if (fabMesurement.primaryBorderFabric) {
            check.total_primary_border_fabric_required =
              (parseFloat(check.width) + 20) / 100;
            await check.save();
            await check.reload();
          }
          if (fabMesurement.secondaryBorderFabric) {
            check.total_secondary_border_fabric_required =
              (parseFloat(check.width) + 20) / 100;
            await check.save();
            await check.reload();
          }
          if (fabMesurement.beltPipingFabricId) {
            check.total_belt_piping_fabric_required = 0.5;
            await check.save();
            await check.reload();
          }
          if (fabMesurement.beltBorderFabricId) {
            check.total_belt_border_fabric_required = 0.5;
            await check.save();
            await check.reload();
          }
          if (fabMesurement.pelmetFabric) {
            if (check.pelmet) {
              const pelmet = JSON.parse(check.pelmet);
              if (pelmet.pelmetWidth && pelmet.pelmetDrop) {
                check.total_pelmet_fabric_required =
                  (parseFloat(pelmet.pelmetWidth) +
                    parseFloat(pelmet.pelmetDrop) +
                    30) /
                  100;
                await check.save();
                await check.reload();
              }
            }
          }
          if (fabMesurement.fabric_gathering && fabMesurement.LiningFabric) {
            const fabric = await CurtainFabric.findOne({
              where: { id: fabMesurement.LiningFabric },
            });

            let curtainMeasurement = { meterFabric: 0, panel: 0 };

            if (check.width && check.height) {
              curtainMeasurement = await measurement(
                check.width,
                check.height,
                fabMesurement.fabric_gathering,
                0,
              );
            }

            if (fabric.width >= 280) {
              check.total_lining_fabric_required =
                curtainMeasurement.meterFabric / 2 + 0.5;
              check.number_of_panel_lining_fabric = curtainMeasurement.panel;
              await check.save();
              await check.reload();
            } else {
              check.total_lining_fabric_required =
                curtainMeasurement.meterFabric;
              check.number_of_panel_lining_fabric = curtainMeasurement.panel;
              await check.save();
              await check.reload();
            }
          }
          if (fabMesurement.mock_fabric_gathering && fabMesurement.mockFabric) {
            ///---------------------update room style send message-------------------
            if (
              fabMesurement.mock_curtain_style &&
              req.body[i].mock_curtain_style
            ) {
              if (
                fabMesurement.mock_curtain_style !==
                req.body[i].mock_curtain_style
              ) {
                const mockCurtainStyleOld = await CurtainStyle.findByPk(
                  fabMesurement.mock_curtain_style,
                );
                const mockCurtainStyleNew = await CurtainStyle.findByPk(
                  req.body[i].mock_curtain_style,
                );

                old_mock_curtain_style =
                  old_mock_curtain_style +
                  "," +
                  (mockCurtainStyleOld ? mockCurtainStyleOld.curtainStyle : "");
                new_mock_curtain_style =
                  new_mock_curtain_style +
                  "," +
                  (mockCurtainStyleNew ? mockCurtainStyleNew.curtainStyle : "");
              }
            }
            await fabMesurement.update({
              mock_curtain_style: req.body[i].mock_curtain_style,
            });

            const fabric = await CurtainFabric.findOne({
              where: { id: fabMesurement.mockFabric },
            });

            let curtainMeasurement = { meterFabric: 0, panel: 0 };
            if (check.width && check.height) {
              curtainMeasurement = await measurement(
                check.width,
                check.height,
                fabMesurement.mock_fabric_gathering,
                fabric.repeat_vertical,
              );
            }

            const panel = Math.floor(curtainMeasurement.panel / 2);
            const readyLength = check.height + 40;
            const fabricRequired = panel * readyLength;
            const meterFabric = fabricRequired / 100;

            if (fabric.width >= 280) {
              check.total_mock_fabric_required = meterFabric / 2 + 0.5;
              check.number_of_panel_mock_fabric = panel;
              await check.save();
              await check.reload();
            } else {
              check.total_mock_fabric_required = meterFabric;
              check.number_of_panel_mock_fabric = panel;
              await check.save();
              await check.reload();
            }
          }
          if (
            fabMesurement.fabric_gathering &&
            fabMesurement.mainFabric1 &&
            fabMesurement.customization_fabric_required == "Yes"
          ) {
            const foldingMargin = 35;
            if (fabMesurement.pattern == 1) {
              const fabric1 = await CurtainFabric.findOne({
                where: { id: fabMesurement.mainFabric1 },
              });
              const fabric2 = await CurtainFabric.findOne({
                where: { id: fabMesurement.mainFabric2 },
              });
              const repeat = fabric1.repeat_vertical;
              const repeat2 = fabric2.repeat_vertical;

              let curtainMeasurement = { meterFabric: 0, panel: 0 };
              if (check.width && check.height) {
                curtainMeasurement = await measurement(
                  check.width,
                  check.height,
                  fabMesurement.fabric_gathering,
                  repeat,
                );
              }
              const evenOrOdd = checkOddOrEven(curtainMeasurement.panel);

              if (evenOrOdd == "Even") {
                if (repeat == "0" && repeat2 == "0") {
                  const readyLength = parseFloat(check.height) + foldingMargin;
                  const fabricRequired =
                    (curtainMeasurement.panel / 2) * readyLength;
                  const meterFabric = fabricRequired / 100;
                  check.number_of_panel_fabric1 = curtainMeasurement.panel / 2;
                  check.total_fabric1_required = meterFabric;
                  check.total_fabric2_required = meterFabric;
                  check.number_of_panel_fabric2 = curtainMeasurement.panel / 2;
                  await check.save();
                  await check.reload();
                } else if (repeat != "0" && repeat2 != "0") {
                  const readyLength =
                    (parseFloat(check.height) + foldingMargin) / 100;
                  const VRepeat1 = repeat / 100;
                  const VRepeat2 = repeat2 / 100;
                  const data = Math.ceil(readyLength / VRepeat1);
                  const data2 = Math.ceil(readyLength / VRepeat2);
                  const repeatInMeter = VRepeat1 * data;
                  const repeatInMeter2 = VRepeat2 * data2;
                  const meterFabric =
                    (repeatInMeter * curtainMeasurement.panel) / 2;
                  const meterFabric2 =
                    (repeatInMeter2 * curtainMeasurement.panel) / 2;
                  check.number_of_panel_fabric1 = curtainMeasurement.panel / 2;
                  check.total_fabric1_required = meterFabric;
                  check.total_fabric2_required = meterFabric2;
                  check.number_of_panel_fabric2 = curtainMeasurement.panel / 2;
                  await check.save();
                  await check.reload();
                } else if (repeat == "0" && repeat2 != "0") {
                  const readyLength =
                    (parseFloat(check.height) + foldingMargin) / 100;
                  const VRepeat = repeat2 / 100;
                  const data = Math.ceil(readyLength / VRepeat);
                  const repeatInMeter = VRepeat * data;
                  const meterFabric2 =
                    (repeatInMeter * curtainMeasurement.panel) / 2;
                  const meterFabric1 =
                    (readyLength * curtainMeasurement.panel) / 2;
                  check.number_of_panel_fabric1 = curtainMeasurement.panel / 2;
                  check.total_fabric1_required = meterFabric1;
                  check.total_fabric2_required = meterFabric2;
                  check.number_of_panel_fabric2 = curtainMeasurement.panel / 2;
                  await check.save();
                  await check.reload();
                } else if (repeat != "0" && repeat2 == "0") {
                  const readyLength =
                    (parseFloat(check.height) + foldingMargin) / 100;
                  const VRepeat = repeat / 100;
                  const data = Math.ceil(readyLength / VRepeat);
                  const repeatInMeter = VRepeat * data;
                  const meterFabric1 =
                    (repeatInMeter * curtainMeasurement.panel) / 2;
                  const meterFabric2 =
                    (readyLength * curtainMeasurement.panel) / 2;

                  check.number_of_panel_fabric1 = curtainMeasurement.panel / 2;
                  check.total_fabric1_required = meterFabric1;
                  check.total_fabric2_required = meterFabric2;
                  check.number_of_panel_fabric2 = curtainMeasurement.panel / 2;
                  await check.save();
                  await check.reload();
                }
              } else {
                if (repeat == "0" && repeat2 == "0") {
                  const readyLength = parseFloat(check.height) + foldingMargin;

                  const panelForFabric1 = Math.ceil(
                    curtainMeasurement.panel / 2,
                  );
                  const panelForFabric2 = Math.floor(
                    curtainMeasurement.panel / 2,
                  );

                  const fabric1Required = (panelForFabric1 * readyLength) / 100;
                  const fabric2Required = (panelForFabric2 * readyLength) / 100;

                  check.number_of_panel_fabric1 = panelForFabric1;
                  check.total_fabric1_required = fabric1Required;
                  check.total_fabric2_required = fabric2Required;
                  check.number_of_panel_fabric2 = panelForFabric2;
                  await check.save();
                  await check.reload();
                } else if (repeat == "0" && repeat2 != "0") {
                  const readyLength =
                    (parseFloat(check.height) + foldingMargin) / 100;
                  const VRepeat = repeat2 / 100;
                  const data = Math.ceil(readyLength / VRepeat);
                  const repeatInMeter = VRepeat * data;
                  const panelForFabric1 = Math.ceil(
                    curtainMeasurement.panel / 2,
                  );
                  const panelForFabric2 = Math.floor(
                    curtainMeasurement.panel / 2,
                  );
                  const meterFabric1 = repeatInMeter * panelForFabric1;
                  const meterFabric2 = readyLength * panelForFabric2;

                  check.number_of_panel_fabric1 = panelForFabric1;
                  check.total_fabric1_required = meterFabric1;
                  check.total_fabric2_required = meterFabric2;
                  check.number_of_panel_fabric2 = panelForFabric2;
                  await check.save();
                  await check.reload();
                } else if (repeat != "0" && repeat2 == "0") {
                  const readyLength =
                    (parseFloat(check.height) + foldingMargin) / 100;
                  const VRepeat = repeat / 100;
                  const data = Math.ceil(readyLength / VRepeat);
                  const repeatInMeter = VRepeat * data;
                  // var digits = curtainMeasurement.panel.toString().split('.')[1] < 1;
                  // const panelForFabric1 = digits ? : Math.ceil(curtainMeasurement.panel / 2)
                  const panelForFabric1 = 1;
                  const panelForFabric2 = Math.floor(
                    curtainMeasurement.panel / 2,
                  );
                  const meterFabric1 = readyLength * panelForFabric1;
                  const meterFabric2 = repeatInMeter * panelForFabric2;

                  check.number_of_panel_fabric1 = panelForFabric1;
                  check.total_fabric1_required = meterFabric1;
                  check.total_fabric2_required = meterFabric2;
                  check.number_of_panel_fabric2 = panelForFabric2;
                  await check.save();
                  await check.reload();
                } else if (repeat != "0" && repeat2 != "0") {
                  const readyLength =
                    (parseFloat(check.height) + foldingMargin) / 100;
                  const VRepeat = repeat / 100;
                  const VRepeat2 = repeat2 / 100;
                  const data = Math.ceil(readyLength / VRepeat);
                  const data2 = Math.ceil(readyLength / VRepeat2);
                  const repeatInMeter = VRepeat * data;
                  const repeatInMeter2 = VRepeat2 * data2;
                  const panelForFabric1 = Math.ceil(
                    curtainMeasurement.panel / 2,
                  );
                  const panelForFabric2 = Math.floor(
                    curtainMeasurement.panel / 2,
                  );
                  const meterFabric1 = repeatInMeter * panelForFabric1;
                  const meterFabric2 = repeatInMeter2 * panelForFabric2;

                  check.number_of_panel_fabric1 = panelForFabric1;
                  check.total_fabric1_required = meterFabric1;
                  check.total_fabric2_required = meterFabric2;
                  check.number_of_panel_fabric2 = panelForFabric2;
                  await check.save();
                  await check.reload();
                }
              }
            } else if (fabMesurement.pattern == 2) {
              const fabric1 = await CurtainFabric.findOne({
                where: { id: fabMesurement.mainFabric1 },
              });
              const fabric2 = await CurtainFabric.findOne({
                where: { id: fabMesurement.mainFabric2 },
              });

              const repeat = fabric1.repeat_vertical;
              const repeat2 = fabric2.repeat_vertical;

              const curtainMeasurement = await measurement(
                check.width,
                check.height,
                fabMesurement.fabric_gathering,
                repeat,
              );
              const curtainMeasurement2 = await measurement(
                check.width,
                check.height,
                fabMesurement.fabric_gathering,
                repeat2,
              );

              const evenOrOdd = checkOddOrEven(curtainMeasurement.panel);

              if (evenOrOdd == "Even") {
                if (repeat == "0" && repeat2 == "0") {
                  const panel1 =
                    curtainMeasurement.panel - 2 <= 0
                      ? Math.ceil(curtainMeasurement.panel / 2)
                      : curtainMeasurement.panel - 2;
                  const panel2 =
                    curtainMeasurement.panel - 2 <= 0
                      ? Math.ceil(curtainMeasurement.panel / 2)
                      : 2;

                  const readyLength = parseFloat(check.height) + foldingMargin;
                  const primaryfabricRequired = panel1 * readyLength;
                  const secondaryfabricRequired = panel2 * readyLength;
                  // const meterFabric = primaryfabricRequired / 100

                  check.number_of_panel_fabric1 = panel1;
                  check.total_fabric1_required = primaryfabricRequired / 100;
                  check.total_fabric2_required = secondaryfabricRequired / 100;
                  check.number_of_panel_fabric2 = panel2;
                  await check.save();
                  await check.reload();
                } else if (repeat == "0" && repeat2 != "0") {
                  const readyLength = parseFloat(check.height);
                  const panel1 =
                    curtainMeasurement.panel - 2 <= 0
                      ? Math.ceil(curtainMeasurement.panel / 2)
                      : curtainMeasurement.panel - 2;
                  const panel2 =
                    curtainMeasurement.panel - 2 <= 0
                      ? Math.ceil(curtainMeasurement.panel / 2)
                      : 2;
                  const primaryfabricRequired = panel1 * readyLength;

                  const readyLength2 =
                    (parseFloat(check.height) + foldingMargin) / 100;
                  const VRepeat = repeat2 / 100;
                  const data = Math.ceil(readyLength / VRepeat);
                  const repeatInMeter = VRepeat * data;
                  const secondaryMeterFabric = repeatInMeter * panel2;

                  check.number_of_panel_fabric1 =
                    curtainMeasurement.panel - 2 < 0
                      ? Math.ceil(curtainMeasurement.panel / 2)
                      : curtainMeasurement.panel - 2;
                  check.total_fabric1_required = primaryfabricRequired;
                  check.total_fabric2_required = secondaryMeterFabric;
                  check.number_of_panel_fabric2 =
                    curtainMeasurement.panel - 2 < 0
                      ? Math.ceil(curtainMeasurement.panel / 2)
                      : 2;
                  await check.save();
                  await check.reload();
                } else if (repeat != "0" && repeat2 != "0") {
                  const readyLength =
                    (parseFloat(check.height) + foldingMargin) / 100;
                  const VRepeat = repeat / 100;
                  const VRepeat2 = repeat2 / 100;
                  const data = Math.ceil(readyLength / VRepeat);
                  const data2 = Math.ceil(readyLength / VRepeat2);

                  const repeatInMeter = VRepeat * data;
                  const repeatInMeter2 = VRepeat2 * data2;

                  const panel1 =
                    curtainMeasurement.panel - 2 <= 0
                      ? Math.ceil(curtainMeasurement.panel / 2)
                      : curtainMeasurement.panel - 2;
                  const panel2 =
                    curtainMeasurement.panel - 2 <= 0
                      ? Math.ceil(curtainMeasurement.panel / 2)
                      : 2;

                  const primaryMeterFabric = repeatInMeter * panel1;
                  const secondaryMeterFabric = repeatInMeter2 * panel2;

                  check.number_of_panel_fabric1 = panel1;
                  check.total_fabric1_required = primaryMeterFabric;
                  check.total_fabric2_required = secondaryMeterFabric;
                  check.number_of_panel_fabric2 = panel2;
                  await check.save();
                  await check.reload();
                } else if (repeat != "0" && repeat2 == "0") {
                  const panel1 =
                    curtainMeasurement.panel - 2 <= 0
                      ? Math.ceil(curtainMeasurement.panel / 2)
                      : curtainMeasurement.panel - 2;
                  const panel2 =
                    curtainMeasurement.panel - 2 <= 0
                      ? Math.ceil(curtainMeasurement.panel / 2)
                      : 2;

                  const readyLength =
                    (parseFloat(check.height) + foldingMargin) / 100;
                  const VRepeat = repeat / 100;
                  const data = Math.ceil(readyLength / VRepeat);
                  const repeatInMeter = VRepeat * data;
                  const primaryMeterFabric = repeatInMeter * panel1;

                  const readyLength2 = parseFloat(check.height) + foldingMargin;
                  const secondaryfabricRequired = panel2 * readyLength2;

                  check.number_of_panel_fabric1 = panel1;
                  check.total_fabric1_required = primaryMeterFabric;
                  check.total_fabric2_required = secondaryfabricRequired / 100;
                  check.number_of_panel_fabric2 = panel2;
                  await check.save();
                  await check.reload();
                }
              } else {
                if (repeat == "0" && repeat2 == "0") {
                  const readyLength = parseFloat(check.height) + foldingMargin;

                  const panelForFabric1 = curtainMeasurement.panel - 1;
                  const panelForFabric2 = 1;

                  const fabric1Required = (panelForFabric1 * readyLength) / 100;
                  const fabric2Required = (panelForFabric2 * readyLength) / 100;

                  check.number_of_panel_fabric1 = panelForFabric1;
                  check.total_fabric1_required = fabric1Required;
                  check.total_fabric2_required = fabric2Required;
                  check.number_of_panel_fabric2 = panelForFabric2;
                  await check.save();
                  await check.reload();
                } else if (repeat == "0" && repeat2 != "0") {
                  const readyLength = parseFloat(check.height) + foldingMargin;

                  const panelForFabric1 = curtainMeasurement.panel - 1;
                  const panelForFabric2 = 1;

                  const readyLength2 =
                    (parseFloat(check.height) + foldingMargin) / 100;
                  const VRepeat = repeat2 / 100;
                  const data = Math.ceil(readyLength2 / VRepeat);
                  const repeatInMeter = VRepeat * data;

                  const fabric1Required = (panelForFabric1 * readyLength) / 100;
                  const fabric2Required = repeatInMeter;

                  check.number_of_panel_fabric1 = panelForFabric1;
                  check.total_fabric1_required = fabric1Required;
                  check.total_fabric2_required = fabric2Required;
                  check.number_of_panel_fabric2 = panelForFabric2;
                  await check.save();
                  await check.reload();
                } else if (repeat != "0" && repeat2 != "0") {
                  const readyLength =
                    (parseFloat(check.height) + foldingMargin) / 100;
                  const VRepeat = repeat / 100;
                  const VRepeat2 = repeat2 / 100;
                  const data = Math.ceil(readyLength / VRepeat);
                  const data2 = Math.ceil(readyLength / VRepeat2);
                  const repeatInMeter = VRepeat * data;
                  const repeatInMeter2 = VRepeat2 * data2;
                  const panelForFabric1 = curtainMeasurement.panel - 1;
                  const panelForFabric2 = 1;
                  const meterFabric1 = repeatInMeter * panelForFabric1;
                  const meterFabric2 = repeatInMeter2 * panelForFabric2;

                  check.number_of_panel_fabric1 = panelForFabric1;
                  check.total_fabric1_required = meterFabric1;
                  check.total_fabric2_required = meterFabric2;
                  check.number_of_panel_fabric2 = panelForFabric2;
                  await check.save();
                  await check.reload();
                } else if (repeat != "0" && repeat2 == "0") {
                  const readyLength =
                    (parseFloat(check.height) + foldingMargin) / 100;
                  const VRepeat = repeat / 100;
                  const data = Math.ceil(readyLength / VRepeat);
                  const repeatInMeter = VRepeat * data;
                  const panelForFabric1 = curtainMeasurement.panel - 1;
                  const panelForFabric2 = 1;
                  const meterFabric1 = repeatInMeter * panelForFabric1;
                  const meterFabric2 = panelForFabric2 * readyLength;

                  check.number_of_panel_fabric1 = panelForFabric1;
                  check.total_fabric1_required = meterFabric1;
                  check.total_fabric2_required = meterFabric2;
                  check.number_of_panel_fabric2 = panelForFabric2;
                  await check.save();
                  await check.reload();
                }
              }
            } else if (fabMesurement.pattern == 3) {
              const fabric1 = await CurtainFabric.findOne({
                where: { id: fabMesurement.mainFabric1 },
              });
              const fabric2 = await CurtainFabric.findOne({
                where: { id: fabMesurement.mainFabric2 },
              });
              const repeat = fabric1.repeat_vertical;
              const repeat2 = fabric2.repeat_vertical;
              const curtainMeasurement = await measurement(
                check.width,
                check.height,
                fabMesurement.fabric_gathering,
                repeat,
              );
              const curtainMeasurement2 = await measurement(
                check.width,
                check.height,
                fabMesurement.fabric_gathering,
                repeat2,
              );

              if (repeat == "0" && repeat2 == "0") {
                const readyLength = parseFloat(check.height) + foldingMargin;

                const panelForFabric1 = curtainMeasurement.panel - 1;
                const panelForFabric2 = 1;

                const fabric1Required = (panelForFabric1 * readyLength) / 100;
                const fabric2Required = (panelForFabric2 * readyLength) / 100;

                check.number_of_panel_fabric1 = panelForFabric1;
                check.total_fabric1_required = fabric1Required;
                check.total_fabric2_required = fabric2Required;
                check.number_of_panel_fabric2 = panelForFabric2;
                await check.save();
                await check.reload();
              } else if (repeat == "0" && repeat2 != "0") {
                const readyLength = parseFloat(check.height) + foldingMargin;

                const panelForFabric1 = curtainMeasurement.panel - 1;
                const panelForFabric2 = 1;

                const readyLength2 =
                  (parseFloat(check.height) + foldingMargin) / 100;
                const VRepeat = repeat2 / 100;
                const data = Math.ceil(readyLength2 / VRepeat);
                const repeatInMeter = VRepeat * data;

                const fabric1Required = (panelForFabric1 * readyLength) / 100;
                const fabric2Required = repeatInMeter;

                check.number_of_panel_fabric1 = panelForFabric1;
                check.total_fabric1_required = fabric1Required;
                check.total_fabric2_required = fabric2Required;
                check.number_of_panel_fabric2 = panelForFabric2;
                await check.save();
                await check.reload();
              } else if (repeat != "0" && repeat2 != "0") {
                const readyLength =
                  (parseFloat(check.height) + foldingMargin) / 100;
                const VRepeat = repeat / 100;
                const VRepeat2 = repeat2 / 100;
                const data = Math.ceil(readyLength / VRepeat);
                const data2 = Math.ceil(readyLength / VRepeat2);
                const repeatInMeter = VRepeat * data;
                const repeatInMeter2 = VRepeat2 * data2;
                const panelForFabric1 = curtainMeasurement.panel - 1;
                const panelForFabric2 = 1;
                const meterFabric1 = repeatInMeter * panelForFabric1;
                const meterFabric2 = repeatInMeter2 * panelForFabric2;

                check.number_of_panel_fabric1 = panelForFabric1;
                check.total_fabric1_required = meterFabric1;
                check.total_fabric2_required = meterFabric2;
                check.number_of_panel_fabric2 = panelForFabric2;
                await check.save();
                await check.reload();
              } else if (repeat != "0" && repeat2 == "0") {
                const readyLength =
                  (parseFloat(check.height) + foldingMargin) / 100;
                const VRepeat = repeat / 100;
                const data = Math.ceil(readyLength / VRepeat);
                const repeatInMeter = VRepeat * data;
                const panelForFabric1 = curtainMeasurement.panel - 1;
                const panelForFabric2 = 1;
                const meterFabric1 = repeatInMeter * panelForFabric1;
                const meterFabric2 = panelForFabric2 * readyLength;

                check.number_of_panel_fabric1 = panelForFabric1;
                check.total_fabric1_required = meterFabric1;
                check.total_fabric2_required = meterFabric2;
                check.number_of_panel_fabric2 = panelForFabric2;
                await check.save();
                await check.reload();
              }
            }
          } else if (
            fabMesurement.fabric_gathering &&
            fabMesurement.mainFabric1 &&
            fabMesurement.customization_fabric_required == "No"
          ) {
            const fabric = await CurtainFabric.findOne({
              where: { id: fabMesurement.mainFabric1 },
            });
            const repeat =
              fabric.repeat_vertical == 0 || fabric.repeat_vertical == "0"
                ? 0
                : fabric.repeat_vertical;

            const curtainMeasurement = await measurement(
              check.width,
              check.height,
              fabMesurement.fabric_gathering,
              repeat,
            );

            if (fabric.width >= 280) {
              check.total_fabric1_required =
                curtainMeasurement.meterFabric / 2 + 0.5;
              check.number_of_panel_fabric1 = curtainMeasurement.panel;
              await check.save();
              await check.reload();
            } else {
              console.log(curtainMeasurement.panel, "-----------------");
              check.total_fabric1_required = curtainMeasurement.meterFabric;
              check.number_of_panel_fabric1 = curtainMeasurement.panel;
              await check.save();
              await check.reload();
            }
          }
        }
        if (SheerMesurement) {
          if (SheerMesurement.sheerGathering && SheerMesurement.sheerFabricId) {
            ///---------------------update room style send message-------------------
            if (SheerMesurement.SheerStyleId && req.body[i].SheerStyleId) {
              if (SheerMesurement.SheerStyleId !== req.body[i].SheerStyleId) {
                const sheerStyleOld = await CurtainStyle.findByPk(
                  SheerMesurement.SheerStyleId,
                );
                const sheerStyleNew = await CurtainStyle.findByPk(
                  req.body[i].SheerStyleId,
                );

                old_sheer_style =
                  old_sheer_style + "," + sheerStyleOld
                    ? sheerStyleOld.curtainStyle
                    : "";
                new_sheer_style =
                  new_sheer_style + "," + sheerStyleNew
                    ? sheerStyleNew.curtainStyle
                    : "";
              }
            }

            const fabric = await CurtainFabric.findOne({
              where: { id: SheerMesurement.sheerFabricId },
            });

            await SheerMesurement.update({
              SheerStyleId: req.body[i].SheerStyleId,
            });

            const widthOfSheer =
              req.body[i].sheer_window_same_as == "Yes"
                ? check.width
                : req.body[i].sheer_window_width;
            const heightOfSheer =
              req.body[i].sheer_window_same_as == "Yes"
                ? check.height
                : req.body[i].sheer_window_height;

            const curtainMeasurement = await measurement(
              widthOfSheer,
              heightOfSheer,
              SheerMesurement.sheerGathering,
              fabric.repeat_vertical,
            );

            if (fabric.width >= 280) {
              check.total_sheer_fabric_required =
                curtainMeasurement.meterFabric / 2 + 0.5;
              check.number_of_panel_sheer_fabric = curtainMeasurement.panel;
              await check.save();
              await check.reload();
            } else {
              check.total_sheer_fabric_required =
                curtainMeasurement.meterFabric;
              check.number_of_panel_sheer_fabric = curtainMeasurement.panel;
              await check.save();
              await check.reload();
            }
          }
        }
        if (blindmeasurement) {
          const assetBlind = await BlindAsset.findOne({
            where: { roomAssetId: check.id },
          });
          if (blindmeasurement.blind_fabric) {
            const fabric = await CurtainFabric.findOne({
              where: { id: blindmeasurement.blind_fabric },
            });
            if (fabric && assetBlind) {
              const lowestWidth = Math.min(
                assetBlind.blind_width_top,
                assetBlind.blind_width_middle,
                assetBlind.blind_width_bottom,
              );
              const lowestHeight = Math.min(
                assetBlind.blind_drop_left,
                assetBlind.blind_drop_right,
                assetBlind.blind_drop_middle,
              );
              const numberOfPanel = Math.ceil(
                parseFloat(lowestWidth) /
                parseFloat(
                  fabric.width == 0 || fabric.width == "0"
                    ? 140
                    : parseFloat(fabric.width),
                ),
              );
              const readyLength = (parseFloat(lowestHeight) + 25) / 100;

              if (
                fabric.repeat_vertical == "0" ||
                fabric.repeat_vertical == 0
              ) {
                check.total_blind_fabric_required = numberOfPanel * readyLength;
                check.number_of_panel_blind_fabric = numberOfPanel;
                await check.save();
                await check.reload();
              } else {
                const VRepeat = fabric.repeat_vertical / 100;
                const noOfRepeat = Math.ceil(readyLength / VRepeat);
                const fabricLength = noOfRepeat * VRepeat;
                const totalFabricRequired = fabricLength * numberOfPanel;

                check.total_blind_fabric_required = totalFabricRequired;
                check.number_of_panel_blind_fabric = numberOfPanel;
                await check.save();
                await check.reload();
              }
            }
          }
          if (blindmeasurement.blind_shades) {
            const fabric = await CurtainFabric.findOne({
              where: { id: blindmeasurement.blind_shades },
            });

            if (fabric) {
              const numberOfPanel = Math.ceil(
                parseFloat(blindmeasurement.blind_default_width) /
                parseFloat(
                  fabric.width == 0 || fabric.width == "0"
                    ? 140
                    : parseFloat(fabric.width),
                ),
              );
              const readyLength =
                (parseFloat(blindmeasurement.blind_default_drop) +
                  25 +
                  parseFloat(fabric.repeat_vertical)) /
                100;

              check.total_blind_fabric_required = 0;
              check.number_of_panel_blind_fabric = 0;
              await check.save();
              await check.reload();
            }
          }
          if (blindmeasurement.LiningFabric) {
            const fabric = await CurtainFabric.findOne({
              where: { id: blindmeasurement.LiningFabric },
            });
            if (fabric && assetBlind) {
              const lowestWidth = Math.min(
                assetBlind.blind_width_top,
                assetBlind.blind_width_middle,
                assetBlind.blind_width_bottom,
              );
              const lowestHeight = Math.min(
                assetBlind.blind_drop_left,
                assetBlind.blind_drop_right,
                assetBlind.blind_drop_middle,
              );

              const numberOfPanel = Math.ceil(
                parseFloat(lowestWidth) /
                parseFloat(
                  fabric.width == 0 || fabric.width == "0"
                    ? 140
                    : parseFloat(fabric.width),
                ),
              );
              const readyLength = (parseFloat(lowestHeight) + 25) / 100;

              if (
                fabric.repeat_vertical == "0" ||
                fabric.repeat_vertical == 0
              ) {
                await RoomAsset.update(
                  {
                    total_blind_lining_fabric_required:
                      numberOfPanel * readyLength,
                    number_of_panel_blind_lining_fabric: numberOfPanel,
                  },
                  { where: { id: check.id } },
                );
              } else {
                const VRepeat = fabric.repeat_vertical / 100;
                const noOfRepeat = Math.ceil(readyLength / VRepeat);
                const fabricLength = noOfRepeat * VRepeat;
                const totalFabricRequired = fabricLength * numberOfPanel;

                await RoomAsset.update(
                  {
                    total_blind_lining_fabric_required: totalFabricRequired,
                    number_of_panel_blind_lining_fabric: numberOfPanel,
                  },
                  { where: { id: check.id } },
                );
              }
            }
          }
          if (blindmeasurement.blind_border_fabric && assetBlind) {
            let lowestWidth = Math.min(
              assetBlind.blind_width_top,
              assetBlind.blind_width_middle,
              assetBlind.blind_width_bottom,
            );

            check.total_blind_border_fabric_required =
              (parseFloat(
                lowestWidth ? lowestWidth : assetBlind.blind_default_width,
              ) +
                20) /
              100;
            await check.save();
            await check.reload();
          }
          if (blindmeasurement.blind_border_curtain_fabric && assetBlind) {
            const lowestWidth = Math.min(
              assetBlind.blind_width_top,
              assetBlind.blind_width_middle,
              assetBlind.blind_width_bottom,
            );

            check.total_blind_border_curtain_fabric_required =
              (parseFloat(
                lowestWidth ? lowestWidth : assetBlind.blind_default_width,
              ) +
                20) /
              100;
            await check.save();
            await check.reload();
          }
        }
      }
      if (req.body[i].roomId) {
        const flooring = await SelectedFlooring.findOne({
          where: { roomId: req.body[i].roomId },
          include: [{ model: CurtainFabric, as: "flooring" }],
        });

        const walls = await Wall.findAll({
          where: { roomId: req.body[i].roomId },
          include: [{ model: CurtainFabric }],
        });

        if (
          flooring &&
          flooring.type == "carpet" &&
          flooring.flooring_required == "Yes"
        ) {
          const areas = await Area.findAll({
            where: { selectedflooringId: flooring.id },
          });

          let removedAreaSQFT = 0;
          let totalsqm = 0;
          const carpetAmount = flooring.mrpPerSqmts;

          for (var j = 0; j < areas.length; j++) {
            const item = areas[j];
            totalsqm +=
              ((item.flooring_length / 100) * item.flooring_breadth) / 100;

            let removedAreaLength = 0;
            let removedAreaWidth = 0;

            if (item && item.remove_area && item.remove_area.length) {
              for (var p = 0; p < item.remove_area.length; p++) {
                const ITEM = item.remove_area[p];
                removedAreaLength =
                  removedAreaLength + parseInt(ITEM.area_length);
                removedAreaWidth = removedAreaWidth + parseInt(ITEM.area_width);
              }
            }
            removedAreaSQFT = (removedAreaWidth * removedAreaLength) / 10000;
          }

          flooring.room_total_sqm =
            totalsqm - removedAreaSQFT ? totalsqm - removedAreaSQFT : 0;
          flooring.room_carpet_price = carpetAmount ? carpetAmount : 0;

          await flooring.save();
          await flooring.reload();
        }
        if (
          flooring &&
          flooring.type == "flooring" &&
          flooring.flooring_required == "Yes"
        ) {
          const areas = await Area.findAll({
            where: { selectedflooringId: flooring.id },
          });

          let totalsqm = 0;
          let flooring_box_amount = flooring.mrpPerSqmts;

          const box_width = flooring.box_width;
          let removedAreaSQFT = 0;
          for (var j = 0; j < areas.length; j++) {
            const item = areas[j];
            totalsqm += parseFloat(
              ((item.flooring_length / 100) * item.flooring_breadth) / 100,
            );

            let removedAreaLength = 0;
            let removedAreaWidth = 0;
            if (item.remove_area && item.remove_area.length) {
              for (var p = 0; p < item.remove_area.length; p++) {
                const ITEM = item.remove_area[p];
                removedAreaLength =
                  removedAreaLength + parseInt(ITEM.area_length);
                removedAreaWidth = removedAreaWidth + parseInt(ITEM.area_width);
              }
            }
            removedAreaSQFT = (removedAreaWidth * removedAreaLength) / 1000;
          }

          flooring.room_total_sqm =
            totalsqm - removedAreaSQFT ? totalsqm - removedAreaSQFT : 0;
          flooring.room_flooring_box_quantity =
            totalsqm && box_width
              ? parseFloat(totalsqm) / parseFloat(box_width)
              : 0;
          flooring.room_flooring_price =
            totalsqm && box_width && flooring_box_amount
              ? Math.ceil(parseFloat(totalsqm) / parseFloat(box_width)) *
              flooring_box_amount
              : 0;

          await flooring.save();
        }
      }
    }

    const room = await Room.findOne({ where: { id: req.body[0].roomId } });

    const enquirydata = await Enquiry.findOne({
      where: { id: room.enquiryId },
    });

    const schedule = await Enquiry_Schedule.findOne({
      where: { enquiryId: room.enquiryId },
      include: [User],
      order: [["id", "DESC"]],
    });

    await enquirydata.save();
    await enquirydata.reload();

    if (
      (old_curtain_style && new_curtain_style) ||
      (old_mock_curtain_style && new_mock_curtain_style) ||
      (old_sheer_style && new_sheer_style)
    ) {
      if (schedule) {
        const obj = {
          curtain_style: {
            old: old_curtain_style || "",
            new: new_curtain_style || "",
          },
          mock_curtain_style: {
            old: old_mock_curtain_style || "",
            new: new_mock_curtain_style || "",
          },
          sheer_style: {
            old: old_sheer_style || "",
            new: new_sheer_style || "",
          },
        };

        const userData = await User.findByPk(enquirydata.salesId);
        const message = style_update(
          obj,
          enquirydata.enquiryId,
          userData.firstName + " " + userData.lastName,
          schedule.user.firstName + " " + schedule.user.lastName,
        );

        whatsappMessage(message, userData.phone);
      }
    }

    return res.status(200).json({
      message: "room assets added Successfully",
      data: req.body,
      status: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.addWalpaperArea = async (req, res, next) => {
  try {
    let selectedWallpaper;

    let selectedWallpaperId;
    if (
      req.body.wallpaper.roomId &&
      req.body.wallpaper.wallpaper_required == "Yes"
    ) {
      const wall = await Wall.findOne({
        where: { roomId: req.body.wallpaper.roomId },
      });
      if (wall) {
        selectedWallpaperId = wall.selectedWallpaperId;
      }
    }

    if (selectedWallpaperId && req.body.wallpaper.wallpaper_required == "Yes") {
      selectedWallpaper = await SelectedWallpaper.findOne({
        where: { id: selectedWallpaperId },
      });

      await selectedWallpaper.update({
        wallpaper_required: req.body.wallpaper.wallpaper_required,
        enquiryId: req.body.enquiryId,
        number_of_wall: req.body.wallpaper.wall.length,
      });
    } else {
      selectedWallpaper = await SelectedWallpaper.findOne({
        where: { enquiryId: req.body.enquiryId },
      });

      if (!selectedWallpaper) {
        selectedWallpaper = await SelectedWallpaper.create({
          wallpaper_required: req.body.wallpaper.wallpaper_required,
          enquiryId: req.body.enquiryId,
          number_of_wall:
            req.body.wallpaper.wallpaper_required == "Yes"
              ? req.body.wallpaper.wall.length
              : null,
        });
      }
    }
    if (req.body.wallpaper.wallpaper_required == "Yes") {
      for (let i = 0; i < req.body.wallpaper.wall.length; i++) {
        let wal;
        if (req.body.wallpaper.wall[i].id) {
          req.body.wallpaper.wall[i];
          wal = await Wall.findOne({
            where: { id: req.body.wallpaper.wall[i].id },
          });

          if (wal) {
            wal = await wal.update({
              wall_name: req.body.wallpaper.wall[i].wall_name,
              roomId: req.body.wallpaper.wall[i].roomId,
              premier_required: req.body.wallpaper.wall[i].primer_required,
              type: req.body.wallpaper.wall[i].type,
              wallpaperId: req.body.wallpaper.wall[i].wallpaperId,
              rollWidth: req.body.wallpaper.wall[i].rollWidth,
              rollLength: req.body.wallpaper.wall[i].rollLength,
              rate_type: req.body.wallpaper.wall[i].rate_type,
              wallLength: req.body.wallpaper.wall[i].wall_length,
              wallWidth: req.body.wallpaper.wall[i].wall_width,
              wallpaper_discount: req.body.wallpaper.wall[i].wallpaper_discount,
              wallpaper_wastage: req.body.wallpaper.wall[i].wallpaper_wastage,
              wallpaper_already_installed:
                req.body.wallpaper.wall[i].wallpaper_already_installed,
            });
          }
        } else {
          wal = await Wall.create({
            wall_name: req.body.wallpaper.wall[i].wall_name,
            premier_required: req.body.wallpaper.wall[i].primer_required,
            type: req.body.wallpaper.wall[i].type,
            wallpaperId: req.body.wallpaper.wall[i].wallpaperId,
            wallpaper_discount: req.body.wallpaper.wall[i].wallpaper_discount,
            roomId: req.body.wallpaper.wall[i].roomId,
            selectedWallpaperId: selectedWallpaper.dataValues.id,
            rollWidth: req.body.wallpaper.wall[i].rollWidth,
            wallLength: parseInt(req.body.wallpaper.wall[i].wall_length),
            wallWidth: parseInt(req.body.wallpaper.wall[i].wall_width),
            rollLength: req.body.wallpaper.wall[i].rollLength,
            rate_type: req.body.wallpaper.wall[i].rate_type,
            wallpaper_wastage: req.body.wallpaper.wall[i].wallpaper_wastage,
            wallpaper_already_installed:
              req.body.wallpaper.wall[i].wallpaper_already_installed,
          });
        }

        const wallpaper_area = await WallpaperArea.findOne({
          where: { wallId: wal.id },
        });

        if (wallpaper_area) {
          await wallpaper_area.update({
            length: wal.wallLength,
            breadth: wal.wallWidth,
            roomId: wal.roomId,
            wallId: wal.id,
            windowData: req.body.wallpaper.wall[i].windowData,
          });
        } else {
          await WallpaperArea.create({
            length: wal.wallLength,
            breadth: wal.wallWidth,
            roomId: wal.roomId,
            wallId: wal.id,
            windowData: req.body.wallpaper.wall[i].windowData,
            roomId: wal.roomId,
          });
        }
      }
    }

    return res.status(200).json({
      message: "Area Added In Room",
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
exports.removeWallpaperArea = async (req, res, next) => {
  try {
    await WallpaperArea.destroy({ where: { id: req.params.id } });
    return res.status(200).json({
      message: "Area removed from Room",
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

const enquiryStatus = [
  "measurement-complete",
  "order-confirmed",
  "qc-complete",
  "installer-assigned",
  "installation-started",
];

exports.addArea = async (req, res, next) => {
  try {
    const flooring = await SelectedFlooring.findOne({
      where: { id: req.body.selectedFlooringId },
    });
    dataNotFound(flooring, 404, "Flooring not found");

    const element = req.body.area;
    const area = await Area.findOne({
      where: { selectedFlooringId: flooring.id },
    });
    if (area && element) {
      await area.update({
        flooring_polythene_required: element.flooring_polythene_required,
        flooring_foam_required: element.flooring_foam_required,
        door_cut_required: element.door_cut_required,
        binding_required: element.binding_required,
        binding_unit: element.binding_unit,
        binding_quantity: element.binding_quantity,
        skirting_required: element.skirting_required,
        skirting_unit: element.skirting_unit,
        skirting_quantity: element.skirting_quantity,
        reducer_required: element.reducer_required,
        reducer_unit: element.reducer_unit,
        reducer_quantity: element.reducer_quantity,
        t_profile_required: element.t_profile_required,
        t_profile_unit: element.t_profile_unit,
        t_profile_quantity: element.t_profile_quantity,
        beeding_required: element.beeding_required,
        beeding_unit: element.beeding_unit,
        beeding_quantity: element.beeding_quantity,
        margin_required: element.margin_required,
        margin_unit: element.margin_unit,
        margin_quantity: element.margin_quantity,
        flooring_length: element.flooring_length,
        flooring_breadth: element.flooring_breadth,
        foamWidth: element.foamWidth,
        type: element.type,
        roomId: element.roomId,
        selectedFlooringId: flooring.id,
        polytheneId: element.polytheneId,
        foamId: element.foamId,
        skirtingId: element.skirtingId,
        reducerId: element.reducerId,
        t_profileId: element.t_profileId,
        beedingId: element.beedingId,
        bindingId: element.bindingId,
        marginId: element.marginId,
        binding_discount: element.binding_discount,
        skirting_discount: element.skirting_discount,
        reducer_discount: element.reducer_discount,
        t_profile_discount: element.t_profile_discount,
        beeding_discount: element.beeding_discount,
        margin_discount: element.margin_discount,
        remove_area: element.remove_area,
      });
    } else {
      await Area.create({
        flooring_polythene_required: element.flooring_polythene_required,
        flooring_foam_required: element.flooring_foam_required,
        door_cut_required: element.door_cut_required,
        binding_required: element.binding_required,
        binding_unit: element.binding_unit,
        binding_quantity: element.binding_quantity,
        skirting_required: element.skirting_required,
        skirting_unit: element.skirting_unit,
        skirting_quantity: element.skirting_quantity,
        reducer_required: element.reducer_required,
        reducer_unit: element.reducer_unit,
        reducer_quantity: element.reducer_quantity,
        t_profile_required: element.t_profile_required,
        t_profile_unit: element.t_profile_unit,
        t_profile_quantity: element.t_profile_quantity,
        beeding_required: element.beeding_required,
        beeding_unit: element.beeding_unit,
        beeding_quantity: element.beeding_quantity,
        margin_required: element.margin_required,
        margin_unit: element.margin_unit,
        margin_quantity: element.margin_quantity,
        flooring_length: element.flooring_length,
        flooring_breadth: element.flooring_breadth,
        foamWidth: element.foamWidth,
        type: element.type,
        roomId: element.roomId,
        selectedflooringId: flooring.id,
        polytheneId: element.polytheneId,
        foamId: element.foamId,
        skirtingId: element.skirtingId,
        reducerId: element.reducerId,
        t_profileId: element.t_profileId,
        beedingId: element.beedingId,
        bindingId: element.bindingId,
        marginId: element.marginId,
        binding_discount: element.binding_discount,
        skirting_discount: element.skirting_discount,
        reducer_discount: element.reducer_discount,
        t_profile_discount: element.t_profile_discount,
        beeding_discount: element.beeding_discount,
        margin_discount: element.margin_discount,
        remove_area: element.remove_area,
      });
    }

    const enq = await Enquiry.findOne({ where: { id: flooring.enquiryId } });
    if (flooring.roomId) {
      const roomAssets = await RoomAsset.findAll({
        where: { roomId: flooring.roomId },
      });
      for (var j = 0; j < roomAssets.length; j++) {
        const r = roomAssets[j];
        if (enquiryStatus.includes(enq.status)) {
          await axios.post(
            `${process.env.LOCAL_URL}api/v1/measurer/update-assets`,
            [{ roomAssetId: r.id, roomId: flooring.roomId }],
            getAuthHeaderConfig(req),
          );
        }
      }
    }
    return res.status(200).json({
      message: "Area Added In Room",
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
exports.removeArea = async (req, res, next) => {
  try {
    await Area.destroy({ where: { id: req.params.id } });
    return res.status(200).json({
      message: "Area removed from Room",
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

exports.add_hardware_detail = async (req, res, next) => {
  try {
    const { file, body } = await UploadFile(req, "assets/hardware-details");
    if (req.body.pelmet_required) {
      const pelmetData = await SelectedCurtain.findOne({
        where: { roomId: req.body.roomId },
      });
      if (pelmetData) {
        await pelmetData.update({
          pelmet_required: req.body.pelmet_required,
          pelmetFabric: req.body.pelmetFabric,
          pelmetTypeId: req.body.pelmetTypeId,
          pelmet_style: req.body.pelmet_style,
          pelmet_width: req.body.pelmet_width,
          pelmet_drop: req.body.pelmet_drop,
          pelmet_turning: req.body.pelmet_turning,
          pelmet_LBracket_required: req.body.pelmet_LBracket_required,
          pelmet_LBracket_quantity: req.body.pelmet_LBracket_quantity,
        });
      }
    }
    if (
      req.body.primary_track_type ||
      req.body.secondary_track_type ||
      req.body.mock_track_type ||
      req.body.primary_track_required
    ) {
      const track = await SelectedTrack.findOne({
        where: { roomId: req.body.roomId },
      });
      if (!track) {
        const newTrack = await SelectedTrack.create({
          roomId: body.roomId,
          no_of_primary_track_motor: req.body.no_of_primary_track_motor,
          no_of_secondary_track_motor: req.body.no_of_secondary_track_motor,
          no_of_mock_track_motor: req.body.no_of_mock_track_motor,
          primary_track_required: req.body.primary_track_required,
          secondary_track_required: req.body.secondary_track_required,
          no_of_primary_track_remote: req.body.no_of_primary_track_remote,
          no_of_secondary_track_remote: req.body.no_of_secondary_track_remote,
          no_of_mock_track_remote: req.body.no_of_mock_track_remote,
          track_required: req.body.track_required,
          track_selection: req.body.track_selection,
          primary_track_length: req.body.primary_track_length,
          primary_extra_track_bracket_required:
            req.body.primary_extra_track_bracket_required,
          primary_extra_track_bracket_quantity:
            req.body.primary_extra_track_bracket_quantity,
          primary_overlappper_required: req.body.primary_overlappper_required,
          primary_number_of_overlappper_pair:
            req.body.primary_number_of_overlappper_pair,
          screw_size_required: req.body.screw_size_required,
          screw_quantity: req.body.screw_quantity,
          l_bracket_required: req.body.l_bracket_required,
          l_bracket_quantity: req.body.l_bracket_quantity,
          primary_track_curatin_stick_required:
            req.body.primary_track_curatin_stick_required,
          primary_track_curatin_stick_pair:
            req.body.primary_track_curatin_stick_pair,
          primary_tie_knobs_required: req.body.primary_tie_knobs_required,
          primary_tie_knobs_pair: req.body.primary_tie_knobs_pair,
          secondary_track_length: req.body.secondary_track_length,
          secondary_extra_track_bracket_required:
            req.body.secondary_extra_track_bracket_required,
          secondary_extra_track_bracket_quantity:
            req.body.secondary_extra_track_bracket_quantity,
          secondary_overlappper_required:
            req.body.secondary_overlappper_required,
          secondary_number_of_overlappper_pair:
            req.body.secondary_number_of_overlappper_pair,
          secondary_track_curatin_stick_required:
            req.body.secondary_track_curatin_stick_required,
          secondary_track_curatin_stick_pair:
            req.body.secondary_track_curatin_stick_pair,
          secondary_tie_knobs_required: req.body.secondary_tie_knobs_required,
          secondary_tie_knobs_pair: req.body.secondary_tie_knobs_pair,
          mock_track_required: req.body.mock_track_required,
          mock_track_length: req.body.mock_track_length,
          mock_extra_track_bracket_required:
            req.body.mock_extra_track_bracket_required,
          mock_extra_track_bracket_quantity:
            req.body.mock_extra_track_bracket_quantity,
          mock_overlappper_required: req.body.mock_overlappper_required,
          mock_number_of_overlappper_pair:
            req.body.mock_number_of_overlappper_pair,
          mock_track_curatin_stick_required:
            req.body.mock_track_curatin_stick_required,
          mock_track_curatin_stick_pair: req.body.mock_track_curatin_stick_pair,
          mock_tie_knobs_required: req.body.mock_tie_knobs_required,
          mock_tie_knobs_pair: req.body.mock_tie_knobs_pair,
          primary_track_function: req.body.primary_track_function
            ? req.body.primary_track_function
            : null,
          primary_motor_operation: req.body.primary_motor_operation,
          primary_track_type: req.body.primary_track_type,
          primary_track_motor: req.body.primary_track_motor,
          primary_track_remote: req.body.primary_track_remote,
          primary_track: req.body.primary_track,
          primary_overlapper: req.body.primary_overlapper,
          primary_track_curatin_stick: req.body.primary_track_curatin_stick,
          primary_extra_track_bracket: req.body.primary_extra_track_bracket,
          secondary_track: req.body.secondary_track,
          secondary_track_remote: req.body.secondary_track_remote,
          secondary_track_motor: req.body.secondary_track_motor,
          secondary_overlapper: req.body.secondary_overlapper,
          secondary_motor_operation: req.body.secondary_motor_operation,
          secondary_track_type: req.body.secondary_track_type,
          secondary_track_function: req.body.secondary_track_function
            ? req.body.secondary_track_function
            : null,
          secondary_track_curatin_stick: req.body.secondary_track_curatin_stick,
          secondary_extra_track_bracket: req.body.secondary_extra_track_bracket,
          mock_track_type: req.body.mock_track_type,
          mock_track_remote: req.body.mock_track_remote,
          mock_track_motor: req.body.mock_track_motor,
          mock_overlapper: req.body.mock_overlapper,
          mock_track: req.body.mock_track,
          mock_motor_operation: req.body.mock_motor_operation,
          mock_track_function: req.body.mock_track_function
            ? req.body.mock_track_function
            : null,
          mock_track_curatin_stick: req.body.mock_track_curatin_stick
            ? req.body.mock_track_curatin_stick
            : null,
          mock_extra_track_bracket: req.body.mock_extra_track_bracket
            ? req.body.mock_extra_track_bracket
            : null,
          lBracketId: req.body.lBracketId ? req.body.lBracketId : null,
          track_screw_size: req.body.track_screw_size
            ? req.body.track_screw_size
            : null,
          primary_track_tieknobId: req.body.primary_track_tieknobId
            ? req.body.primary_track_tieknobId
            : null,
          secondary_track_tieknobId: req.body.secondary_track_tieknobId
            ? req.body.secondary_track_tieknobId
            : null,
          mock_track_tieknobId: req.body.mock_track_tieknobId
            ? req.body.mock_track_tieknobId
            : null,
          primary_track_discount: req.body.primary_track_discount,
          primary_track_remote_discount: req.body.primary_track_remote_discount,
          primary_track_motor_discount: req.body.primary_track_motor_discount,
          primary_extra_track_bracket_discount:
            req.body.primary_extra_track_bracket_discount,
          primary_overlapper_discount: req.body.primary_overlapper_discount,
          lbracket_discount: req.body.lbracket_discount,
          primary_track_curatin_stick_discount:
            req.body.primary_track_curatin_stick_discount,
          primary_tieknob_discount: req.body.primary_tieknob_discount,
          secondary_track_discount: req.body.secondary_track_discount,
          secondary_track_remote_discount:
            req.body.secondary_track_remote_discount,
          secondary_track_motor_discount:
            req.body.secondary_track_motor_discount,
          secondary_extra_track_bracket_discount:
            req.body.secondary_extra_track_bracket_discount,
          secondary_overlappper_discount:
            req.body.secondary_overlappper_discount,
          secondary_track_curatin_stick_discount:
            req.body.secondary_track_curatin_stick_discount,
          secondary_tieknobs_discount: req.body.secondary_tieknobs_discount,
          mock_track_discount: req.body.mock_track_discount,
          mock_track_remote_discount: req.body.mock_track_remote_discount,
          mock_track_motor_discount: req.body.mock_track_motor_discount,
          mock_overlappper_discount: req.body.mock_overlappper_discount,
          mock_track_curatin_stick_discount:
            req.body.mock_track_curatin_stick_discount,
          mock_extra_track_bracket_discunt:
            req.body.mock_extra_track_bracket_discount,
          mock_tie_knobs_discount: req.body.mock_tie_knobs_discount,
        });
        if (file) {
          if (file.length == 1) {
            if (file.fieldname == "primary_track_image") {
              await newTrack.update({
                primary_track_image: file.path,
              });
            } else if (file.fieldname == "secondary_track_image") {
              await newTrack.update({
                secondary_track_image: file.path,
              });
            } else if (file.fieldname == "mock_track_image") {
              await newTrack.update({
                mock_track_image: file.path,
              });
            } else if (file.fieldname == "primary_track_tie_knobs_image") {
              await newTrack.update({
                primary_track_tie_knobs_image: file.path,
              });
            } else if (file.fieldname == "secondary_track_tie_knobs_image") {
              await newTrack.update({
                secondary_track_tie_knobs_image: file.path,
              });
            }
          } else {
            for (let i = 0; i < file.length; i++) {
              if (file[i].fieldname == "primary_track_image") {
                await newTrack.update({
                  primary_rod_image: file[i].path,
                });
              }
              if (file[i].fieldname == "secondary_track_image") {
                await newTrack.update({
                  secondary_rod_image: file[i].path,
                });
              }
              if (file[i].fieldname == "primary_track_tie_knobs_image") {
                await newTrack.update({
                  primary_track_tie_knobs_image: file[i].path,
                });
              }
              if (file[i].fieldname == "secondary_track_tie_knobs_image") {
                await newTrack.update({
                  secondary_track_tie_knobs_image: file[i].path,
                });
              }
              if (file[i].fieldname == "mock_track_image") {
                await newTrack.update({
                  mock_track_image: file[i].path,
                });
              }
            }
          }
        }
      } else {
        const updatedTrack = await track.update({
          roomId: body.roomId,
          no_of_primary_track_motor: req.body.no_of_primary_track_motor,
          no_of_secondary_track_motor: req.body.no_of_secondary_track_motor,
          no_of_mock_track_motor: req.body.no_of_mock_track_motor,
          primary_track_required: req.body.primary_track_required,
          secondary_track_required: req.body.secondary_track_required,
          no_of_primary_track_remote: req.body.no_of_primary_track_remote,
          no_of_secondary_track_remote: req.body.no_of_secondary_track_remote,
          no_of_mock_track_remote: req.body.no_of_mock_track_remote,
          track_required: req.body.track_required,
          track_selection: req.body.track_selection,
          primary_track_length: req.body.primary_track_length,
          primary_extra_track_bracket_required:
            req.body.primary_extra_track_bracket_required,
          primary_extra_track_bracket_quantity:
            req.body.primary_extra_track_bracket_quantity,
          primary_overlappper_required: req.body.primary_overlappper_required,
          primary_number_of_overlappper_pair:
            req.body.primary_number_of_overlappper_pair,
          screw_size_required: req.body.screw_size_required,
          screw_quantity: req.body.screw_quantity,
          l_bracket_required: req.body.l_bracket_required,
          l_bracket_quantity: req.body.l_bracket_quantity,
          primary_track_curatin_stick_required:
            req.body.primary_track_curatin_stick_required,
          primary_track_curatin_stick_pair:
            req.body.primary_track_curatin_stick_pair,
          primary_tie_knobs_required: req.body.primary_tie_knobs_required,
          primary_tie_knobs_pair: req.body.primary_tie_knobs_pair,
          secondary_track_length: req.body.secondary_track_length,
          secondary_extra_track_bracket_required:
            req.body.secondary_extra_track_bracket_required,
          secondary_extra_track_bracket_quantity:
            req.body.secondary_extra_track_bracket_quantity,
          secondary_overlappper_required:
            req.body.secondary_overlappper_required,
          secondary_number_of_overlappper_pair:
            req.body.secondary_number_of_overlappper_pair,
          secondary_track_curatin_stick_required:
            req.body.secondary_track_curatin_stick_required,
          secondary_track_curatin_stick_pair:
            req.body.secondary_track_curatin_stick_pair,
          secondary_tie_knobs_required: req.body.secondary_tie_knobs_required,
          secondary_tie_knobs_pair: req.body.secondary_tie_knobs_pair,
          mock_track_required: req.body.mock_track_required,
          mock_track_length: req.body.mock_track_length,
          mock_extra_track_bracket_required:
            req.body.mock_extra_track_bracket_required,
          mock_extra_track_bracket_quantity:
            req.body.mock_extra_track_bracket_quantity,
          mock_overlappper_required: req.body.mock_overlappper_required,
          mock_number_of_overlappper_pair:
            req.body.mock_number_of_overlappper_pair,
          mock_track_curatin_stick_required:
            req.body.mock_track_curatin_stick_required,
          mock_track_curatin_stick_pair: req.body.mock_track_curatin_stick_pair,
          mock_tie_knobs_required: req.body.mock_tie_knobs_required,
          mock_tie_knobs_pair: req.body.mock_tie_knobs_pair,
          primary_motor_operation: req.body.primary_motor_operation,
          primary_track_type: req.body.primary_track_type,
          primary_track: req.body.primary_track,
          primary_track: req.body.primary_track,
          primary_track_motor: req.body.primary_track_motor,
          primary_track_remote: req.body.primary_track_remote,
          primary_overlapper: req.body.primary_overlapper,
          primary_track_curatin_stick: req.body.primary_track_curatin_stick,
          primary_extra_track_bracket: req.body.primary_extra_track_bracket,
          secondary_track: req.body.secondary_track,
          secondary_track_remote: req.body.secondary_track_remote,
          secondary_track_motor: req.body.secondary_track_motor,
          secondary_overlapper: req.body.secondary_overlapper,
          secondary_motor_operation: req.body.secondary_motor_operation,
          secondary_track_type: req.body.secondary_track_type,
          secondary_track_curatin_stick: req.body.secondary_track_curatin_stick,
          secondary_extra_track_bracket: req.body.secondary_extra_track_bracket,
          mock_track_type: req.body.mock_track_type,
          mock_overlapper: req.body.mock_overlapper,
          mock_track: req.body.mock_track,
          mock_track_remote: req.body.mock_track_remote,
          mock_track_motor: req.body.mock_track_motor,
          mock_motor_operation: req.body.mock_motor_operation,
          primary_track_function: req.body.primary_track_function
            ? req.body.primary_track_function
            : null,
          secondary_track_function: req.body.secondary_track_function
            ? req.body.secondary_track_function
            : null,
          mock_track_function: req.body.mock_track_function
            ? req.body.mock_track_function
            : null,
          mock_track_curatin_stick: req.body.mock_track_curatin_stick
            ? req.body.mock_track_curatin_stick
            : null,
          mock_extra_track_bracket: req.body.mock_extra_track_bracket
            ? req.body.mock_extra_track_bracket
            : null,
          lBracketId: req.body.lBracketId ? req.body.lBracketId : null,
          track_screw_size: req.body.track_screw_size
            ? req.body.track_screw_size
            : null,
          primary_track_tieknobId: req.body.primary_track_tieknobId
            ? req.body.primary_track_tieknobId
            : null,
          secondary_track_tieknobId: req.body.secondary_track_tieknobId
            ? req.body.secondary_track_tieknobId
            : null,
          mock_track_tieknobId: req.body.mock_track_tieknobId
            ? req.body.mock_track_tieknobId
            : null,
          primary_track_discount: req.body.primary_track_discount,
          primary_track_remote_discount: req.body.primary_track_remote_discount,
          primary_track_motor_discount: req.body.primary_track_motor_discount,
          primary_extra_track_bracket_discount:
            req.body.primary_extra_track_bracket_discount,
          primary_overlapper_discount: req.body.primary_overlapper_discount,
          lbracket_discount: req.body.lbracket_discount,
          primary_track_curatin_stick_discount:
            req.body.primary_track_curatin_stick_discount,
          primary_tieknob_discount: req.body.primary_tieknob_discount,
          secondary_track_discount: req.body.secondary_track_discount,
          secondary_track_remote_discount:
            req.body.secondary_track_remote_discount,
          secondary_track_motor_discount:
            req.body.secondary_track_motor_discount,
          secondary_extra_track_bracket_discount:
            req.body.secondary_extra_track_bracket_discount,
          secondary_overlappper_discount:
            req.body.secondary_overlappper_discount,
          secondary_track_curatin_stick_discount:
            req.body.secondary_track_curatin_stick_discount,
          secondary_tieknobs_discount: req.body.secondary_tieknobs_discount,
          mock_track_discount: req.body.mock_track_discount,
          mock_track_remote_discount: req.body.mock_track_remote_discount,
          mock_track_motor_discount: req.body.mock_track_motor_discount,
          mock_overlappper_discount: req.body.mock_overlappper_discount,
          mock_track_curatin_stick_discount:
            req.body.mock_track_curatin_stick_discount,
          mock_extra_track_bracket_discunt:
            req.body.mock_extra_track_bracket_discount,
          mock_tie_knobs_discount: req.body.mock_tie_knobs_discount,
        });
        if (file) {
          if (file.length == 1) {
            if (file.fieldname == "primary_track_image") {
              await removefile(track.primary_track_image);
              await track.update({
                primary_track_image: file.path,
              });
            } else if (file.fieldname == "secondary_track_image") {
              await removefile(track.secondary_track_image);
              await track.update({
                secondary_track_image: file.path,
              });
            } else if (file.fieldname == "primary_track_tie_knobs_image") {
              await removefile(track.primary_track_tie_knobs_image);
              await track.update({
                primary_track_tie_knobs_image: file.path,
              });
            } else if (file.fieldname == "secondary_track_tie_knobs_image") {
              await removefile(track.secondary_track_tie_knobs_image);
              await track.update({
                secondary_track_tie_knobs_image: file.path,
              });
            } else if (file.fieldname == "mock_track_image") {
              await removefile(track.mock_track_image);
              await track.update({
                mock_track_image: file.path,
              });
            }
          } else {
            for (let i = 0; i < file.length; i++) {
              if (file[i].fieldname == "primary_track_image") {
                await removefile(track.primary_track_image);
                await track.update({
                  primary_track_image: file[i].path,
                });
              }
              if (file[i].fieldname == "secondary_track_image") {
                await removefile(track.secondary_track_image);
                await track.update({
                  secondary_track_image: file[i].path,
                });
              }
              if (file[i].fieldname == "primary_track_tie_knobs_image") {
                await removefile(track.primary_track_tie_knobs_image);
                await track.update({
                  primary_track_tie_knobs_image: file[i].path,
                });
              }
              if (file[i].fieldname == "secondary_track_tie_knobs_image") {
                await removefile(track.secondary_track_tie_knobs_image);
                await track.update({
                  secondary_track_tie_knobs_image: file[i].path,
                });
              }
              if (file[i].fieldname == "mock_track_image") {
                await removefile(track.mock_track_image);
                await track.update({
                  mock_track_image: file[i].path,
                });
              }
            }
          }
        }
      }
    }
    if (
      body.primary_rod_type ||
      req.body.primary_rod ||
      body.secondary_rod_type ||
      body.rod_required
    ) {
      const rod = await SelectedRod.findOne({
        where: { roomId: req.body.roomId },
      });
      if (!rod) {
        const newRod = await SelectedRod.create({
          rod_required: body.rod_required,
          primary_rod_required: req.body.primary_rod_required,
          secondary_rod_required: req.body.secondary_rod_required,
          rod_selection: body.rod_selection,
          primary_rod_length: body.primary_rod_length,
          extra_bracket_required: body.extra_bracket_required,
          extra_bracket_type: body.extra_bracket_type,
          extra_bracket_quantity: body.extra_bracket_quantity,
          extra_bracket_support_required: body.extra_bracket_support_required,
          extra_bracket_support_quantity: body.extra_bracket_support_quantity,
          extra_ring_required: body.extra_ring_required,
          extra_ring_quantity: body.extra_ring_quantity,
          rod_tie_knobs_required: body.rod_tie_knobs_required,
          rod_number_of_tie_knobs_pair: body.rod_number_of_tie_knobs_pair,
          finial_quantity: body.finial_quantity,
          end_cap_required: body.end_cap_required,
          end_cap_quantity: body.end_cap_quantity,
          end_cap_wall_support_required: body.end_cap_wall_support_required,
          end_cap_wall_support_quantity: body.end_cap_wall_support_quantity,
          curatin_stick_required: body.curatin_stick_required,
          number_of_curatin_stick_pair: body.number_of_curatin_stick_pair,
          secondary_rod_length: body.secondary_rod_length,
          primary_rod_type: req.body.primary_rod_type
            ? req.body.primary_rod_type
            : null,
          primary_rod: req.body.primary_rod ? req.body.primary_rod : null,
          secondary_rod_type: req.body.secondary_rod_type
            ? req.body.secondary_rod_type
            : null,
          secondary_rod: req.body.secondary_rod ? req.body.secondary_rod : null,
          rod_tieknobId: req.body.rod_tieknobId ? req.body.rod_tieknobId : null,
          end_cap: req.body.end_cap ? req.body.end_cap : null,
          extra_bracket: req.body.extra_bracket ? req.body.extra_bracket : null,
          extra_bracket_support: req.body.extra_bracket_support
            ? req.body.extra_bracket_support
            : null,
          end_cap_wall_support: req.body.end_cap_wall_support
            ? req.body.end_cap_wall_support
            : null,
          extra_ring: req.body.extra_ring ? req.body.extra_ring : null,
          curatin_stick: req.body.curatin_stick ? req.body.curatin_stick : null,
          finialId: req.body.finialId ? req.body.finialId : null,
          roomId: body.roomId,
          primary_rod_discount: req.body.primary_rod_discount,
          secondary_rod_discount: req.body.secondary_rod_discount,
          extra_bracket_discount: req.body.extra_bracket_discount,
          extra_bracket_support_discount:
            req.body.extra_bracket_support_discount,
          extra_ring_discount: req.body.extra_ring_discount,
          rod_tieknob_discount: req.body.rod_tieknob_discount,
          finial_discount: req.body.finial_discount,
          end_cap_discount: req.body.end_cap_discount,
          end_cap_wall_support_discount: req.body.end_cap_wall_support_discount,
          curtain_stick_discount: req.body.curtain_stick_discount,
          finial_required: req.body.finial_required,
        });
        if (file) {
          if (file.length == 1) {
            if (file.fieldname == "primary_rod_image") {
              await newRod.update({
                primary_rod_image: file.path,
              });
            } else if (file.fieldname == "secondary_rod_image") {
              await newRod.update({
                secondary_rod_image: file.path,
              });
            } else if (file.fieldname == "rod_tie_knobs_image") {
              await newRod.update({
                rod_tie_knobs_image: file.path,
              });
            }
          } else {
            for (let i = 0; i < file.length; i++) {
              if (file[i].fieldname == "primary_rod_image") {
                await newRod.update({
                  primary_rod_image: file[i].path,
                });
              }
              if (file[i].fieldname == "secondary_rod_image") {
                await newRod.update({
                  secondary_rod_image: file[i].path,
                });
              }
              if (file[i].fieldname == "rod_tie_knobs_image") {
                await newRod.update({
                  rod_tie_knobs_image: file[i].path,
                });
              }
            }
          }
        }
      } else {
        await rod.update({
          rod_required: body.rod_required,
          primary_rod_required: req.body.primary_rod_required,
          secondary_rod_required: req.body.secondary_rod_required,
          rod_selection: body.rod_selection,
          primary_rod_length: body.primary_rod_length,
          extra_bracket_required: body.extra_bracket_required,
          extra_bracket_type: body.extra_bracket_type,
          extra_bracket_quantity: body.extra_bracket_quantity,
          extra_bracket_support_required: body.extra_bracket_support_required,
          extra_bracket_support_quantity: body.extra_bracket_support_quantity,
          extra_ring_required: body.extra_ring_required,
          extra_ring_quantity: body.extra_ring_quantity,
          rod_tie_knobs_required: body.rod_tie_knobs_required,
          rod_number_of_tie_knobs_pair: body.rod_number_of_tie_knobs_pair,
          finial_quantity: body.finial_quantity,
          end_cap_required: body.end_cap_required,
          end_cap_quantity: body.end_cap_quantity,
          end_cap_wall_support_required: body.end_cap_wall_support_required,
          end_cap_wall_support_quantity: body.end_cap_wall_support_quantity,
          curatin_stick_required: body.curatin_stick_required,
          number_of_curatin_stick_pair: body.number_of_curatin_stick_pair,
          secondary_rod_length: body.secondary_rod_length,
          primary_rod_type: req.body.primary_rod_type
            ? req.body.primary_rod_type
            : null,
          primary_rod: req.body.primary_rod ? req.body.primary_rod : null,
          secondary_rod_type: req.body.secondary_rod_type
            ? req.body.secondary_rod_type
            : null,
          secondary_rod: req.body.secondary_rod ? req.body.secondary_rod : null,
          rod_tieknobId: req.body.rod_tieknobId ? req.body.rod_tieknobId : null,
          end_cap: req.body.end_cap ? req.body.end_cap : null,
          extra_bracket: req.body.extra_bracket ? req.body.extra_bracket : null,
          extra_bracket_support: req.body.extra_bracket_support
            ? req.body.extra_bracket_support
            : null,
          end_cap_wall_support: req.body.end_cap_wall_support
            ? req.body.end_cap_wall_support
            : null,
          extra_ring: req.body.extra_ring ? req.body.extra_ring : null,
          curatin_stick: req.body.curatin_stick ? req.body.curatin_stick : null,
          finialId: req.body.finialId ? req.body.finialId : null,
          roomId: body.roomId,
          primary_rod_discount: req.body.primary_rod_discount,
          secondary_rod_discount: req.body.secondary_rod_discount,
          extra_bracket_discount: req.body.extra_bracket_discount,
          extra_bracket_support_discount:
            req.body.extra_bracket_support_discount,
          extra_ring_discount: req.body.extra_ring_discount,
          rod_tieknob_discount: req.body.rod_tieknob_discount,
          finial_discount: req.body.finial_discount,
          end_cap_discount: req.body.end_cap_discount,
          end_cap_wall_support_discount: req.body.end_cap_wall_support_discount,
          curtain_stick_discount: req.body.curtain_stick_discount,
          finial_required: req.body.finial_required,
        });
        if (file) {
          if (file.length == 1) {
            if (file.fieldname == "primary_rod_image") {
              await removefile(rod.primary_rod_image);
              await rod.update({
                primary_rod_image: file.path,
              });
            } else if (file.fieldname == "secondary_rod_image") {
              await removefile(rod.secondary_rod_image);
              await rod.update({
                secondary_rod_image: file.path,
              });
            } else if (file.fieldname == "rod_tie_knobs_image") {
              await removefile(rod.rod_tie_knobs_image);
              await rod.update({
                rod_tie_knobs_image: file.path,
              });
            }
          } else {
            for (let i = 0; i < file.length; i++) {
              if (file[i].fieldname == "primary_rod_image") {
                await removefile(rod.primary_rod_image);
                await rod.update({
                  primary_rod_image: file[i].path,
                });
              }
              if (file[i].fieldname == "secondary_rod_image") {
                await removefile(rod.secondary_rod_image);
                await rod.update({
                  secondary_rod_image: file[i].path,
                });
              }
              if (file[i].fieldname == "rod_tie_knobs_image") {
                await removefile(rod.rod_tie_knobs_image);
                await rod.update({
                  rod_tie_knobs_image: file[i].path,
                });
              }
            }
          }
        }
      }
    }

    if (req.body.extra_hardware_required || req.body.noOfExtraHardware) {
      await Room.update(
        {
          noOfExtraHardware: +req.body.noOfExtraHardware,
          extra_hardware_required: req.body.extra_hardware_required,
          tie_back_required: req.body.tie_back_required,
          tie_back: req.body.tie_back,
          tie_back_quantity: req.body.tie_back_quantity,
          l_bracket_required: req.body.lBracketRequired,
          l_bracket: req.body.lBracket,
          l_bracket_quantity: req.body.lBracketQuantity,
        },
        { where: { id: req.body.roomId } },
      );
    }
    const room = await Room.findOne({
      where: { id: req.body.roomId },
      include: [Enquiry],
    });

    // const existEnquiryStatus = await EnquiryStatus.findOne({ where: { remark: "Room hardware-details Added", enquiryId: room.enquiry.id } })
    // if (!existEnquiryStatus) {
    //     await EnquiryStatus.create({
    //         remark: "Room hardware-details Added",
    //         status: "completed",
    //         enquiryId: room.enquiry.id
    //     });
    // }

    const enquiry = await Enquiry.findOne({ where: { id: room.enquiry.id } });
    await enquiry.save();

    return res.status(200).json({
      message: "room assets added Successfully",
      data: req.body,
      status: true,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.add_assets_image = async (req, res, next) => {
  try {
    const { file, body } = await UploadFile(req, "room-assets");

    if (file.path) {
      await Media.create({
        assetId: req.params.id,
        filledBy: req.userId,
        mediaType: "room-asset",
        file: file.path,
        field: file.fieldname,
      });
    } else {
      file.forEach(async (element) => {
        await Media.create({
          assetId: req.params.id,
          filledBy: req.userId,
          mediaType: "room-asset",
          file: element.path,
          field: element.fieldname,
        });
      });
    }

    return res.status(200).json({
      message: "room images added Successfully",
      status: true,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.add_image = async (req, res, next) => {
  try {
    const { file, body } = await UploadFile(req, "assets/room-assets");

    return res.status(200).json({
      message: "images added Successfully",
      status: true,
      data: file,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.remove_assets_image = async (req, res, next) => {
  try {
    const image = await Media.findOne({ where: { id: req.params.id } });

    await removefile(image.file);
    await image.destroy();

    return res.status(200).json({
      message: "room images added Successfully",
      status: true,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.get_assets_image = async (req, res, next) => {
  try {
    const image = await Media.findAll({ where: { assetId: req.params.id } });

    return res.status(200).json({
      message: "room images added Successfully",
      data: image,
      status: true,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.edit_assets = async (req, res, next) => {
  try {
    const check = await RoomAsset.findOne({
      where: { id: req.body.roomAssetId },
    });

    if (!check) throw new Error("Room not found");

    const data = await check.update({
      height: req.body.height,
      width: req.body.width,
      widhtOfCove: req.body.widhtOfCove,
      ladderHeight: req.body.ladderHeight,
      type: req.body.type,
      ceilingTypeId: req.body.ceilingTypeId,
      wallTypeId: req.body.wallTypeId,
      curtainOperationId: req.body.curtainOperationId,
      ladderId: req.body.ladderId,
      accept_driling_from_FF_side: req.body.accept_driling_from_FF_side,
      accept_driling_from_client_side: req.body.accept_driling_from_client_side,
      blind_drilling_msg: req.body.blind_drilling_msg,
    });

    if (
      req.body.blind_width_top ||
      req.body.blind_width_middle ||
      req.body.blind_width_bottom ||
      req.body.blind_drop_left ||
      req.body.blind_drop_right ||
      req.body.blind_drop_middle ||
      req.body.blind_track_size ||
      req.body.blind_chain_length ||
      req.body.blind_mount_type ||
      req.body.blind_parking_space ||
      req.body.blind_remark
    ) {
      const blindasset = await BlindAsset.findOne({
        where: { roomAssetId: req.body.roomAssetId },
      });
      if (!blindasset) {
        await BlindAsset.create({
          blind_width_top: req.body.blind_width_top,
          blind_width_middle: req.body.blind_width_middle,
          blind_width_bottom: req.body.blind_width_bottom,
          blind_drop_left: req.body.blind_drop_left,
          blind_drop_right: req.body.blind_drop_right,
          blind_drop_middle: req.body.blind_drop_middle,
          blind_track_size: req.body.blind_track_size,
          blind_chain_length: req.body.blind_chain_length,
          blind_mount_type: req.body.blind_mount_type,
          blind_parking_space: req.body.blind_parking_space,
          blind_remark: req.body.blind_remark,
          curtainOperationId: req.body.curtainOperationId,
          ceilingTypeId: req.body.ceilingTypeId,
          wallTypeId: req.body.wallTypeId,
          parkingSpaceId: req.body.parkingSpaceId,
          roomAssetId: data.id,
          accept_blind_driling_from_FF_side:
            req.body.accept_blind_driling_from_FF_side,
          accept_blind_driling_from_client_side:
            req.body.accept_blind_driling_from_client_side,
        });
        if (
          req.body.blind_required ||
          req.body.blind_lining_required ||
          req.body.blind_lining_width ||
          req.body.blind_hardware_required ||
          req.body.blind_border_required ||
          req.body.blind_screw_required ||
          req.body.blind_extra_bracket_support_required ||
          req.body.blind_extra_bracket_support_quantity
        ) {
          await SelectedBlind.create({
            blind_required: req.body.blind_required,
            blind_fabric_required: req.body.blind_fabric_required,
            blind_lining_required: req.body.blind_lining_required,
            blind_lining_width: req.body.blind_lining_width,
            blind_hardware_required: req.body.blind_hardware_required,
            blind_border_required: req.body.blind_border_required,
            blind_screw_required: req.body.blind_screw_required,
            blind_extra_bracket_support_required:
              req.body.blind_extra_bracket_support_required,
            blind_extra_bracket_support_quantity:
              req.body.blind_extra_bracket_support_quantity,
            no_of_blinds: req.body.no_of_blinds,
            blind_default_width: req.body.blind_default_width,
            blind_border_type: req.body.blind_border_type,
            blind_shades: req.body.blind_shades,
            blind_track: req.body.blind_track,
            blind_motor_type: req.body.blind_motor_type,
            blind_motor_track_type: req.body.blind_motor_track_type,
            blind_fabric: req.body.blind_fabric,
            blind_border_fabric: req.body.blind_border_fabric,
            blind_window_type: req.body.blind_window_type,
            blind_fitting_type: req.body.blind_fitting_type,
            blind_style: req.body.blind_style,
            blind_sub_type: req.body.blind_sub_type,
            LiningFabric: req.body.blind_lining,
            LiningType: req.body.blind_lining_type,
            blind_screw_size: req.body.blind_screw_size,
            no_of_blind_motor_remote: req.body.no_of_blind_motor_remote,
            roomAssetId: data.id,
          });
        }
      } else {
        await blindasset.update({
          blind_width_top: req.body.blind_width_top,
          blind_width_middle: req.body.blind_width_middle,
          blind_width_bottom: req.body.blind_width_bottom,
          blind_drop_left: req.body.blind_drop_left,
          blind_drop_right: req.body.blind_drop_right,
          blind_drop_middle: req.body.blind_drop_middle,
          blind_track_size: req.body.blind_track_size,
          blind_chain_length: req.body.blind_chain_length,
          blind_mount_type: req.body.blind_mount_type,
          blind_parking_space: req.body.blind_parking_space,
          blind_remark: req.body.blind_remark,
          curtainOperationId: req.body.curtainOperationId,
          ceilingTypeId: req.body.ceilingTypeId,
          wallTypeId: req.body.wallTypeId,
          parkingSpaceId: req.body.parkingSpaceId,
          accept_blind_driling_from_FF_side:
            req.body.accept_blind_driling_from_FF_side,
          accept_blind_driling_from_client_side:
            req.body.accept_blind_driling_from_client_side,
        });
        if (
          req.body.blind_required ||
          req.body.blind_lining_required ||
          req.body.blind_lining_width ||
          req.body.blind_hardware_required ||
          req.body.blind_border_required ||
          req.body.blind_screw_required ||
          req.body.blind_extra_bracket_support_required ||
          req.body.blind_extra_bracket_support_quantity
        ) {
          const selectBlind = await SelectedBlind.findOne({
            where: { roomAssetId: req.body.roomAssetId },
          });
          if (!selectBlind) {
            await SelectedBlind.create({
              blind_required: req.body.blind_required,
              blind_fabric_required: req.body.blind_fabric_required,
              blind_lining_required: req.body.blind_lining_required,
              blind_lining_width: req.body.blind_lining_width,
              blind_hardware_required: req.body.blind_hardware_required,
              blind_border_required: req.body.blind_border_required,
              blind_screw_required: req.body.blind_screw_required,
              blind_extra_bracket_support_required:
                req.body.blind_extra_bracket_support_required,
              blind_extra_bracket_support_quantity:
                req.body.blind_extra_bracket_support_quantity,
              no_of_blinds: req.body.no_of_blinds,
              blind_default_width: req.body.blind_default_width,
              blind_border_type: req.body.blind_border_type,
              blind_shades: req.body.blind_shades,
              blind_track: req.body.blind_track,
              blind_motor_type: req.body.blind_motor_type,
              blind_motor_track_type: req.body.blind_motor_track_type,
              blind_fabric: req.body.blind_fabric,
              blind_border_fabric: req.body.blind_border_fabric,
              blind_window_type: req.body.blind_window_type,
              blind_fitting_type: req.body.blind_fitting_type,
              blind_style: req.body.blind_style,
              blind_sub_type: req.body.blind_sub_type,
              LiningFabric: req.body.blind_lining,
              LiningType: req.body.blind_lining_type,
              blind_screw_size: req.body.blind_screw_size,
              no_of_blind_motor_remote: req.body.no_of_blind_motor_remote,
              roomAssetId: req.body.roomAssetId,
            });
          } else {
            await SelectedBlind.update(
              {
                blind_required: req.body.blind_required,
                blind_fabric_required: req.body.blind_fabric_required,
                blind_lining_required: req.body.blind_lining_required,
                blind_lining_width: req.body.blind_lining_width,
                blind_hardware_required: req.body.blind_hardware_required,
                blind_border_required: req.body.blind_border_required,
                blind_screw_required: req.body.blind_screw_required,
                blind_extra_bracket_support_required:
                  req.body.blind_extra_bracket_support_required,
                blind_extra_bracket_support_quantity:
                  req.body.blind_extra_bracket_support_quantity,
                no_of_blinds: req.body.no_of_blinds,
                blind_default_width: req.body.blind_default_width,
                blind_border_type: req.body.blind_border_type,
                blind_shades: req.body.blind_shades,
                blind_track: req.body.blind_track,
                blind_motor_type: req.body.blind_motor_type,
                blind_motor_track_type: req.body.blind_motor_track_type,
                blind_fabric: req.body.blind_fabric,
                blind_border_fabric: req.body.blind_border_fabric,
                blind_window_type: req.body.blind_window_type,
                blind_fitting_type: req.body.blind_fitting_type,
                blind_style: req.body.blind_style,
                blind_sub_type: req.body.blind_sub_type,
                LiningFabric: req.body.blind_lining,
                LiningType: req.body.blind_lining_type,
                blind_screw_size: req.body.blind_screw_size,
                no_of_blind_motor_remote: req.body.no_of_blind_motor_remote,
              },
              { where: { roomAssetId: req.body.roomAssetId } },
            );
          }
        }
      }
    }

    const fabMesurement = await SelectedCurtain.findOne({
      where: { roomId: check.roomId },
    });

    if (fabMesurement) {
      if (fabMesurement.fabric_gathering == 1) {
        let totalfabric;

        const fabric = await CurtainFabric.findOne({
          where: { id: fabMesurement.mainFabric1 },
        });

        const panels = Math.ceil(parseFloat(req.body.width) / 55);

        const height = (parseFloat(req.body.height) + 35) / 100;

        const repeat =
          Math.ceil(height / parseFloat(fabric.repeat_vertical)) *
          parseFloat(fabric.repeat_vertical) *
          panels;

        if (fabMesurement.mainFabric1 == fabMesurement.beltFabric) {
          data.total_fabric_required = repeat + 1;
          data.number_of_panel = panels;
          await data.save();
          await data.reload();
        } else {
          data.total_fabric_required = repeat;
          data.number_of_panel = panels;
          await data.save();
          await data.reload();
        }
      } else if (fabMesurement.fabric_gathering == 2) {
        let totalfabric;

        const fabric = await CurtainFabric.findOne({
          where: { id: fabMesurement.mainFabric1 },
        });

        const panels = Math.ceil(parseFloat(req.body.width) / 60);

        const height = (parseFloat(req.body.height) + 35) / 100;

        const repeat =
          Math.ceil(height / parseFloat(fabric.repeat_vertical)) *
          parseFloat(fabric.repeat_vertical) *
          panels;

        if (fabMesurement.mainFabric1 == fabMesurement.beltFabric) {
          data.total_fabric_required = repeat + 1;
          data.number_of_panel = panels;
          await data.save();
          await data.reload();
        } else {
          data.total_fabric_required = repeat;
          data.number_of_panel = panels;
          await data.save();
          await data.reload();
        }
      } else if (fabMesurement.fabric_gathering == 3) {
        let totalfabric;

        const fabric = await CurtainFabric.findOne({
          where: { id: fabMesurement.mainFabric1 },
        });

        const panels = Math.ceil(parseFloat(req.body.width) / 50);

        const height = (parseFloat(req.body.height) + 35) / 100;

        const repeat =
          Math.ceil(height / parseFloat(fabric.repeat_vertical)) *
          parseFloat(fabric.repeat_vertical) *
          panels;

        if (fabMesurement.mainFabric1 == fabMesurement.beltFabric) {
          data.total_fabric_required = repeat + 1;
          data.number_of_panel = panels;
          await data.save();
          await data.reload();
        } else {
          data.total_fabric_required = repeat;
          data.number_of_panel = panels;
          await data.save();
          await data.reload();
        }
      } else if (fabMesurement.fabMesurement == null) {
        data.total_fabric_required = 0;
        data.number_of_panel = 0;
        await data.save();
        await data.reload();
      }
    }

    return res.status(200).json({
      message: "room assets updated Successfully",
      data: data,
      status: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.get_measurer_enquiry = async (req, res, next) => {
  try {
    const date_clause = {};
    if (req.query.postpone_date) {
      date_clause.postpone_date = req.query.postpone_date;
    }
    if (req.query.status) {
      date_clause.status = req.query.status;
    }
    if (req.query.date) {
      date_clause.date = req.query.date;
    }
    if (req.query.overdue) {
      date_clause.date = { [Op.lt]: new Date() };
    }
    if (req.query.enquiryId) {
      date_clause.enquiryId = req.query.enquiryId;
    }
    const data = await Enquiry_Schedule.findAll({
      where: { schedulePersonId: req.userId, ...date_clause },
      include: [
        {
          model: Enquiry,
          where: { status: { [Op.not]: "cancelled" } },
          include: [Customer, EnquiryStatus],
        },
        Schedule,
        { model: User },
      ],
    });

    for (var i = 0; i < data.length; i++) {
      const enq = data[i].enquiry;
      const products = [];
      const room = await Room.findAll({
        where: { enquiryId: enq.id },
        include: [{ model: SelectedMaterial, include: Material }],
      });

      for (const i of room) {
        for (const j of i.selectedmaterials) {
          if (!products.includes(j.material.name)) {
            products.push(j.material.name);
          }
        }
      }

      enq.dataValues.products = products;
    }

    return res.status(200).json({
      message: "list of measurer enquiry",
      data: data,
      status: true,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.get_measurer_data = async (req, res, next) => {
  try {
    const obj = {
      ceiling: await CeilingType.findAll(),
      wall: await WallType.findAll(),
      curtainOperation: await CurtainOperation.findAll(),
      ladder: await Ladder.findAll(),
      track: await Track.findAll(),
    };

    return res.status(200).json({
      message: "list of measurer Data",
      data: obj,
      status: true,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.get_measurer_info = async (req, res, next) => {
  try {
    const obj = {
      totalEnquiry: await Enquiry_Schedule.count({
        where: { schedulePersonId: req.userId },
      }),
      cancelEnquiry: await Enquiry_Schedule.count({
        where: { schedulePersonId: req.userId, status: "canceled" },
      }),
      completedEnquiry: await Enquiry_Schedule.count({
        where: { schedulePersonId: req.userId, status: "completed" },
      }),
      postponeEnquiry: await Enquiry_Schedule.count({
        where: { schedulePersonId: req.userId, status: "postponed" },
      }),
      overdueEnquiry: await Enquiry_Schedule.count({
        where: {
          schedulePersonId: req.userId,
          date: { [Op.lt]: new Date() },
          status: "pending",
        },
      }),
      pendingEnquiry: await Enquiry_Schedule.count({
        where: { schedulePersonId: req.userId, status: "pending" },
      }),
      acceptedEnquiry: await Enquiry_Schedule.count({
        where: { schedulePersonId: req.userId, status: "accepted" },
      }),
      notification: await Notification.count({
        where: { measurerId: req.userId },
      }),
    };

    return res.status(200).json({
      message: "list of measurer enquiry",
      data: obj,
      status: true,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.get_measurer_schedules = async (req, res, next) => {
  try {
    const schedule = await Enquiry_Schedule.findAll({
      where: { schedulePersonId: req.userId },
      include: [
        { model: Enquiry, include: [Customer, EnquiryStatus] },
        Schedule,
        { model: User },
      ],
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      message: "Enquiry Fetched",
      data: schedule,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

exports.getMeasurerNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findAll({
      where: { measurerId: req.userId },
    });

    return res.status(200).json({
      message: "Notificaiton Fetched",
      data: notification,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

exports.updateSchedules = async (req, res, next) => {
  try {
    const schedule = await Enquiry_Schedule.findOne({
      where: { id: req.body.id },
    });
    dataNotFound(schedule, 404, "No schedule found");

    if (req.body.status == "accepted") {
      await schedule.update({
        status: "accepted",
      });

      const enquiryStatus = await EnquiryStatus.findOne({
        where: {
          remark: "Measurement Started",
          status: "completed",
          enquiryId: schedule.enquiryId,
        },
      });

      if (!enquiryStatus) {
        await schedule.update({ measurement_start: new Date() });

        await EnquiryStatus.create({
          remark: "Measurement Started",
          status: "completed",
          enquiryId: schedule.enquiryId,
        });
      }
    } else if (req.body.status == "postponed") {
      await schedule.update({
        status: "postponed",
        remark: req.body.remark,
        postpone_date: req.body.postponeDate,
        ScheduleId: req.body.scheduleId,
        schedulePersonId: req.body.schedulePersonId,
        postpone_count: schedule.postpone_count + 1,
      });

      let sch;
      if (req.body.scheduleId) {
        sch = await Schedule.findOne({ where: { id: req.body.scheduleId } });
      }
      await EnquiryStatus.create({
        remark: "Measurement Postponed",
        status: "completed",
        enquiryId: schedule.enquiryId,
        details: {
          remark: req.body.remark,
          postpone_date: req.body.postponeDate,
          start_time: req.body.scheduleId ? sch.start_time : "",
          end_time: req.body.scheduleId ? sch.end_time : "",
        },
      });

      ////Start push notification function-----------
      const enquirydata = await Enquiry.findOne({
        where: { id: schedule.enquiryId },
      });
      const measurer = await User.findOne({
        where: { id: schedule.schedulePersonId },
      });
      const outletUser = await OutletUser.findOne({
        where: { salesPersonId: enquirydata.salesId },
      });
      const obj = {
        message: `Measurer postponed for enquiry ${enquirydata.enquiryId} on ${req.body.postponeDate}.`,
        enquiryId: enquirydata.id,
      };

      await send_notification(measurer.fcmToken, "Measurement postpone", obj);
      const notification = await Notification.findOne({
        where: { message: obj.message, enquiryId: enquirydata.id },
      });
      await Notification.create({
        message: obj.message,
        enquiryId: enquirydata.id,
        measurerId: measurer.id,
        adminId: outletUser.outletId,
      });
      //end push Notification function-----------
    } else if (req.body.status == "cancelled") {
      await schedule.update({
        status: "cancelled",
        remark: req.body.remark,
      });
      const enquiryStatus = await EnquiryStatus.findOne({
        where: {
          remark: "Measurement Cancelled",
          status: "completed",
          enquiryId: schedule.enquiryId,
        },
      });

      if (!enquiryStatus) {
        await EnquiryStatus.create({
          remark: "Measurement Cancelled",
          status: "completed",
          enquiryId: schedule.enquiryId,
        });
      }
    } else if (req.body.status == "completed") {
      await sequelize.transaction(async (t) => {
        const last_schedule = await Enquiry_Schedule.findOne({
          where: { enquiryId: schedule.enquiryId },
          include: [User],
          order: [["id", "DESC"]],
          transaction: t,
        });

        if (last_schedule) {
          const createdAt = new Date(last_schedule.measurement_start);
          let now = new Date();

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

          last_schedule.status = "completed";
          last_schedule.re_measurement_required =
            req.body.re_measurement_required;
          last_schedule.re_measurement_reason = req.body.re_measurement_reason;
          last_schedule.re_measurement_date = req.body.re_measurement_date;

          const enquirydata = await Enquiry.findByPk(schedule.enquiryId, {
            transaction: t,
          });
          enquirydata.expected_installation_date =
            req.body.expected_installation_date;
          enquirydata.estimate_creation = now;

          const enquiryStatus = await EnquiryStatus.findOne({
            where: {
              remark: "Measurement Done",
              status: "completed",
              enquiryId: schedule.enquiryId,
            },
            transaction: t,
          });

          if (!enquiryStatus) {
            await EnquiryStatus.create(
              {
                remark: "Measurement Done",
                status: "completed",
                enquiryId: schedule.enquiryId,
              },
              { transaction: t },
            );
          }

          // Simple Fix: Ensure these are always updated regardless of existing history records
          if (enquirydata.status === "measurer-assigned") {
            enquirydata.status = "measurement-complete";
          }

          if (!last_schedule.measurement_done) {
            last_schedule.measurement_done = now;
            last_schedule.tat = tatParts.join(", ");
          }

          await last_schedule.save({ transaction: t });
          await enquirydata.save({ transaction: t });
        }
      });

      const updatedEnquiry = await Enquiry.findByPk(schedule.enquiryId);

      if (updatedEnquiry) {
        ////Start push notification function-----------
        const salesperson = await User.findOne({
          where: { id: updatedEnquiry.salesId },
        });
        const outletUser = await OutletUser.findOne({
          where: { salesPersonId: updatedEnquiry.salesId },
        });
        const obj = {
          message: `Measurement has been completed for enquiryId ${updatedEnquiry.enquiryId}`,
          enquiryId: updatedEnquiry.id,
        };

        await send_notification(
          salesperson.fcmToken,
          "Measurement completed",
          obj,
        );

        const notification = await Notification.findOne({
          where: { message: obj.message, enquiryId: updatedEnquiry.id },
        });
        await Notification.create({
          message: obj.message,
          enquiryId: updatedEnquiry.id,
          salesId: salesperson.id,
          adminId: outletUser.outletId,
        });
        ////End push notification function------------
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

exports.addClientSignature = async (req, res, next) => {
  try {
    const { file, body } = await UploadFile(req, "client-signature");

    if (file.path) {
      await Client_Signature.create({
        image: file.path,
        enquiryId: req.params.enquiryId,
      });
    }
    return res.status(200).json({
      message: "images added Successfully",
      status: true,
      data: file,
    });
  } catch (e) {
    next(e);
  }
};

exports.updatePostponeScheduled = async (req, res, next) => {
  try {
    const currentDate = new Date().toISOString().slice(0, 10);

    const measurer_schedule = await Enquiry_Schedule.findAll({
      where: { status: "postponed", postpone_date: currentDate },
    });

    if (measurer_schedule.length > 0) {
      for (var i = 0; i < measurer_schedule.length; i++) {
        await Enquiry_Schedule.update(
          {
            status: "pending",
            date: measurer_schedule[i].postpone_date,
          },
          { where: { id: measurer_schedule[i].id } },
        );
      }
    }

    const installer_schedule = await InstallerTasks.findAll({
      where: { status: "postponed", postponeDate: currentDate },
    });

    if (installer_schedule.length > 0) {
      for (var i = 0; i < installer_schedule.length; i++) {
        await InstallerTasks.update(
          {
            status: "pending",
            date: installer_schedule[i].postponeDate,
          },
          { where: { id: installer_schedule[i].id } },
        );
      }
    }

    const newDate = new Date(currentDate);
    const estimate_schedule = await Enquiry.findAll({
      where: { status: "estimate-postpone", estimate_postpone_date: newDate },
    });

    if (estimate_schedule.length > 0) {
      for (var i = 0; i < estimate_schedule.length; i++) {
        await Enquiry.update(
          {
            status: "estimate-postpone",
            estimate_creation: estimate_schedule[i].estimate_postpone_date,
          },
          { where: { id: estimate_schedule[i].id } },
        );
      }
    }

    return res.status(200).json({
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
