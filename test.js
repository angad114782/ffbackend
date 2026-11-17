// exports.jasveerEnquiryInfo = async (req, res, next) => {
//     try {
//         const enquiry = await Enquiry.findByPk(req.params.id)
//         dataNotFound(enquiry, 404, `${req.params.id} - Enquiry not found`);
        
//         const discount = 0;
//         const hardwareTax = 0;
//         const fabricTax = 0
//         const response = await axios.get(`${process.env.LOCAL_URL}api/v1/sales/get-enquiry/` + req.params.id)
//         const roomData = response.data.data.rooms
//         const roomsObject = []
//         const curtain = [];
//         const rod = [];
//         const sheer = [];
//         const track = [];
//         const blind = [];
//         const sofa = [];
//         const pouffee = [];
//         const wallpanel = [];
//         const bedback = [];
//         const flooring = [];
//         const Wallpaper = [];
//         const extra_hardware = [];

//         for (let i = 0; i < roomData.length; i++) {
//             const roomInfo = roomData[i];
//             // return res.send(roomInfo)
//             if (roomInfo.selectedcurtain && (roomInfo.selectedcurtain.fabric1 || roomInfo.selectedcurtain.Lining_Fabric || roomInfo.selectedcurtain.belt || roomInfo.selectedcurtain.p_border || roomInfo.selectedcurtain.pelmet)) {
//                 let styleCost
//                 let styleType
//                 if (roomInfo.selectedcurtain.curtain_fabric_style) {
//                     styleCost = roomInfo.selectedcurtain.curtain_fabric_style.curtainStyle == "3 pleat" ? 249 :
//                         roomInfo.selectedcurtain.curtain_fabric_style.curtainStyle == "Ripple fold" ? 297 :
//                             roomInfo.selectedcurtain.curtain_fabric_style.curtainStyle == "Pencil pleat" ? 249 :
//                                 roomInfo.selectedcurtain.curtain_fabric_style.curtainStyle == "eyelet" ? 297 : 0;

//                     styleType = roomInfo.selectedcurtain.curtain_fabric_style.curtainStyle == "3 pleat" ? "FF-0098905" :
//                         roomInfo.selectedcurtain.curtain_fabric_style.curtainStyle == "Ripple fold" ? "FF-0121727" :
//                             roomInfo.selectedcurtain.curtain_fabric_style.curtainStyle == "Pencil pleat" ? "FF-0098908" :
//                                 roomInfo.selectedcurtain.curtain_fabric_style.curtainStyle == "eyelet" ? "FF-0121726" : "";
//                 }

//                 if (roomInfo.selectedcurtain.fabric1 && roomInfo.selectedcurtain.main_fabric_required == "Yes") {

//                     const price = roomInfo.selectedcurtain.fabric1.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]

//                         const stitchingCost = parseInt(asset.number_of_panel_fabric1) * parseInt(styleCost)

//                         const fabric1Estimatecost = parseInt(price) * (parseFloat(asset.total_fabric1_required).toFixed(2))

//                         const discount = roomInfo.selectedcurtain.primary_fabric_discount

//                         const discountedAmount = discount != 0 ? fabric1Estimatecost * (discount / 100) : 0

//                         const weight_price = roomInfo.selectedcurtain.weight_required == "Yes" ? 254 : 0

//                         const handHammering_price = roomInfo.selectedcurtain.hand_hammering_required == "Yes" ? 254 : 0

//                         const handHammeringStiching = handHammering_price == 0 ? 0 : handHammering_price + stitchingCost

//                         const grossAmount = fabric1Estimatecost

//                         const taxAmount = fabric1Estimatecost * (fabricTax / 100)

//                         const netAmount = grossAmount

//                         const FinalData = {
//                             item_id: roomInfo.selectedcurtain.fabric1.item_id,
//                             id: roomInfo.selectedcurtain.fabric1.item_id + `_${asset.id}_main_fabric`,
//                             // unit: "meter",
//                             mrp: price,
//                             qty: parseFloat(asset.total_fabric1_required).toFixed(2),
//                             discount,
//                             type: "main_fabric",
//                             netAmount: parseFloat(netAmount)
//                         }
//                         const stitching = {
//                             item_id: styleType,
//                             id: styleType + `_${asset.id}_main_fabric_stiching`,
//                             mrp: styleCost,
//                             qty: parseFloat(asset.number_of_panel_fabric1).toFixed(2),
//                             discount: 0,
//                             type: "main_fabric_stiching",
//                             netAmount: parseFloat(stitchingCost)
//                         }
//                         if (roomInfo.selectedcurtain.hand_hammering_required == "Yes") {
//                             const handHammering = {
//                                 item_id: "FF-0182134",
//                                 id: "FF-0182134" + `_${asset.id}_HandHamming_main_fabric`,
//                                 mrp: handHammering_price,
//                                 qty: parseFloat(asset.number_of_panel_fabric1).toFixed(2),
//                                 discount: 0,
//                                 type: "Hand Hamming",
//                                 netAmount: parseFloat(handHammering_price * parseInt(asset.number_of_panel_fabric1))
//                             }
//                             curtain.push(handHammering)
//                         }
//                         if (roomInfo.selectedcurtain.weight_required == "Yes") {
//                             const weight = {
//                                 item_id: "FF-0182133",
//                                 id: "FF-0182133" + `_${asset.id}_CurtainWeight_main_fabric`,
//                                 mrp: weight_price,
//                                 qty: 1,
//                                 discount: 0,
//                                 type: "Curtain Weight",
//                                 netAmount: parseFloat(weight_price)
//                             }
//                             curtain.push(weight)
//                         }
//                         curtain.push(FinalData)
//                         curtain.push(stitching)
//                     }
//                 }
//                 if (roomInfo.selectedcurtain.fabric2 && roomInfo.selectedcurtain.customization_fabric_required =="Yes") {
//                     const price = roomInfo.selectedcurtain.fabric2.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]

//                         const stitchingCost = parseInt(asset.number_of_panel_fabric2) * parseInt(styleCost)

//                         const fabric1Estimatecost = parseInt(price) * (parseFloat(asset.total_fabric2_required).toFixed(2))

//                         const discount = roomInfo.selectedcurtain.secondary_fabric_discount

//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0

//                         const weight_price = roomInfo.selectedcurtain.weight_required == "Yes" ? 254 : 0

//                         const handHammering_price = roomInfo.selectedcurtain.hand_hammering_required == "Yes" ? 254 : 0

//                         const handHammeringStiching = handHammering_price == 0 ? 0 : handHammering_price + stitchingCost

//                         const grossAmount = fabric1Estimatecost

//                         const taxAmount = fabric1Estimatecost * (fabricTax / 100)

//                         const netAmount = grossAmount

//                         const FinalData = {
//                             item_id: roomInfo.selectedcurtain.fabric2.item_id,
//                             id: roomInfo.selectedcurtain.fabric2.item_id + `_${asset.id}_secondary_fabric`,
//                             // unit: "meter",
//                             mrp: price,
//                             qty: parseFloat(asset.total_fabric2_required).toFixed(2),
//                             discount,
//                             type: "secondary_fabric",
//                             netAmount: parseFloat(netAmount)
//                         }
//                         const stiching = {
//                             item_id: styleType,
//                             id: styleType + `_${asset.id}_secondary_fabric_stiching`,
//                             mrp: styleCost,
//                             qty: parseFloat(asset.number_of_panel_fabric2).toFixed(2),
//                             discount: 0,
//                             type: "secondary_fabric_stiching",
//                             netAmount: parseFloat(stitchingCost)
//                         }

//                         if (roomInfo.selectedcurtain.hand_hammering_required == "Yes") {
//                             const handHammering = {
//                                 item_id: "FF-0182134",
//                                 id: "FF-0182134" + `_${asset.id}_HandHamming_secondary_fabric`,
//                                 mrp: handHammering_price,
//                                 qty: parseFloat(asset.number_of_panel_fabric1).toFixed(2),
//                                 discount: 0,
//                                 type: "Hand Hamming",
//                                 netAmount: parseFloat(handHammering_price * parseInt(asset.number_of_panel_fabric1))
//                             }
//                             curtain.push(handHammering)
//                         }
//                         if (roomInfo.selectedcurtain.weight_required == "Yes") {
//                             const weight = {
//                                 item_id: "FF-0182133",
//                                 id: "FF-0182133" + `_${asset.id}_CurtainWeight_secondary_fabric`,
//                                 mrp: weight_price,
//                                 qty: 1,
//                                 discount: 0,
//                                 type: "Curtain Weight",
//                                 netAmount: parseFloat(weight_price)
//                             }
//                             curtain.push(weight)
//                         }

//                         curtain.push(FinalData)
//                         curtain.push(stiching)
//                     }
//                 }
//                 if (roomInfo.selectedcurtain.mock_fabric && roomInfo.selectedcurtain.mock_fabric_required =="Yes") {
//                     const price = roomInfo.selectedcurtain.mock_fabric.sales_price
//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]

//                         const stitchingCost = parseInt(asset.number_of_panel_mock_fabric) * parseInt(styleCost)

//                         const fabric1Estimatecost = parseInt(price) * (parseFloat(asset.total_mock_fabric_required).toFixed(2))

//                         const discount = roomInfo.selectedcurtain.mock_fabric_discount

//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0

//                         const weight_price = roomInfo.selectedcurtain.weight_required == "Yes" ? 254 : 0

//                         const handHammering_price = roomInfo.selectedcurtain.hand_hammering_required == "Yes" ? 254 : 0

//                         const handHammeringStiching = handHammering_price == 0 ? 0 : handHammering_price + stitchingCost

//                         const grossAmount = fabric1Estimatecost
//                         const taxAmount = fabric1Estimatecost * (fabricTax / 100)

//                         const netAmount = grossAmount

//                         const FinalData = {
//                             item_id: roomInfo.selectedcurtain.mock_fabric.item_id,
//                             id: roomInfo.selectedcurtain.mock_fabric.item_id + `_${asset.id}_mock_fabric`,
//                             // unit: "meter",
//                             mrp: price,
//                             qty: parseFloat(asset.total_mock_fabric_required).toFixed(2),
//                             discount,
//                             type: "mock_fabric",
//                             netAmount: parseFloat(netAmount)
//                         }
//                         const stiching = {
//                             item_id: styleType,
//                             id: styleType + `_${asset.id}_mock_fabric_stiching`,
//                             mrp: styleCost,
//                             qty: parseFloat(asset.number_of_panel_mock_fabric).toFixed(2),
//                             discount: 0,
//                             type: "mock_fabric_stiching",
//                             netAmount: parseFloat(stitchingCost)
//                         }

//                         if (roomInfo.selectedcurtain.hand_hammering_required == "Yes") {
//                             const handHammering = {
//                                 item_id: "FF-0182134",
//                                 id: "FF-0182134" + `_${asset.id}_HandHamming_mock_fabric`,
//                                 mrp: handHammering_price,
//                                 qty: parseFloat(asset.number_of_panel_fabric1).toFixed(2),
//                                 discount: 0,
//                                 type: "Hand Hamming",
//                                 netAmount: parseFloat(handHammering_price * parseInt(asset.number_of_panel_fabric1))
//                             }
//                             curtain.push(handHammering)
//                         }

//                         if (roomInfo.selectedcurtain.weight_required == "Yes") {
//                             const weight = {
//                                 item_id: "FF-0182133",
//                                 id: "FF-0182133" + `_${asset.id}_CurtainWeight_mock_fabric`,
//                                 mrp: weight_price,
//                                 qty: 1,
//                                 discount: 0,
//                                 type: "Curtain Weight",
//                                 netAmount: parseFloat(weight_price)
//                             }
//                             curtain.push(weight)
//                         }
//                         curtain.push(FinalData)
//                         curtain.push(stiching)
//                     }
//                 }
//                 if (roomInfo.selectedcurtain.Lining_Fabric && roomInfo.selectedcurtain.lining_required =="Yes") {
//                     const price = roomInfo.selectedcurtain.Lining_Fabric.sales_price
//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]

//                         const stitchingCost = 0

//                         const fabric1Estimatecost = parseInt(price) * (parseFloat(asset.total_lining_fabric_required).toFixed(2))

//                         const discount = roomInfo.selectedcurtain.lining_discount

//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0

//                         const weight_price = 0

//                         const handHammering_price = 0

//                         const handHammeringStiching = 0

//                         const grossAmount = fabric1Estimatecost

//                         const taxAmount = fabric1Estimatecost * (fabricTax / 100)

//                         const netAmount = grossAmount

//                         const FinalData = {
//                             item_id: roomInfo.selectedcurtain.Lining_Fabric.item_id,
//                             id: roomInfo.selectedcurtain.Lining_Fabric.item_id + `_${asset.id}_lining_fabric`,
//                             // unit: "meter",
//                             mrp: price,
//                             // weight_price,
//                             // handHammering_price: handHammering_price,
//                             // curtain_style: "none",
//                             // number_of_panel: 0,
//                             // gross_amount: grossAmount.toFixed(2),
//                             // curtain_style_cost: stitchingCost,
//                             // stitchinPrice: 0,
//                             // stitchingCost: handHammeringStiching,
//                             qty: parseFloat(asset.total_lining_fabric_required).toFixed(2),
//                             discount,
//                             type: "lining_fabric",
//                             netAmount: parseFloat(netAmount)
//                         }
//                         curtain.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedcurtain && roomInfo.selectedcurtain.pelmet_required =="Yes") {
//                     const price = roomInfo.selectedcurtain.pelmet.sales_price
//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const stitchingCost = 0

//                         const runningFeet = Math.round(parseInt(asset.width) / 30.48)

//                         const stitching_cost = roomInfo.selectedcurtain.pelmetTypeId == 1 ? 1697.6 : 492

//                         const fittingCharges = 0

//                         const fabric1Estimatecost = price * (parseFloat(asset.total_pelmet_fabric_required).toFixed(2) + 30)

//                         // return res.send(fabric1Estimatecost)

//                         const pelmet_stiching_cost = (runningFeet * stitching_cost);


//                         const grossAmount = fabric1Estimatecost

//                         const discount = roomInfo.selectedcurtain.pelmet_discount

//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0

//                         const taxAmount = fabric1Estimatecost * (fabricTax / 100)

//                         const netAmount = grossAmount

//                         const FinalData = {
//                             item_id: roomInfo.selectedcurtain.pelmet.item_id,
//                             id: roomInfo.selectedcurtain.pelmet.item_id + `_${asset.id}_pelmet`,
//                             // unit: "meter",
//                             mrp: price,
//                             qty: parseFloat(asset.total_pelmet_fabric_required),
//                             discount,
//                             type: "pelmet",
//                             netAmount: parseFloat((netAmount).toFixed(2)) 
//                             // netAmount: parseFloat(netAmount) + parseFloat(pelmet_stiching_cost + fittingCharges)
//                         }
//                         const stiching = {
//                             item_id: roomInfo.selectedcurtain.pelmetTypeId == 1 ? "FF-0122318" : "FF-0122317",
//                             id: roomInfo.selectedcurtain.pelmetTypeId == 1 ? "FF-0122318" + `_${asset.id}_pelmet_stiching` : "FF-0122317" + `_${asset.id}_pelmet_stiching`,
//                             // unit: "meter",
//                             mrp: stitching_cost,
//                             qty: runningFeet,
//                             discount: 0,
//                             type: "pelmet_stiching",
//                             netAmount: parseFloat(pelmet_stiching_cost + fittingCharges)
//                         }
//                         curtain.push(FinalData)
//                         curtain.push(stiching)
//                     }
//                 }
//                 if (roomInfo.selectedcurtain.belt && roomInfo.selectedcurtain.belt_required =="Yes") {
//                     const price = roomInfo.selectedcurtain.belt.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const stitchingCost = 0

//                         const fabric1Estimatecost = price

//                         const beltStiching = 236

//                         const grossAmount = fabric1Estimatecost

//                         const discount = roomInfo.selectedcurtain.belt_discount

//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0

//                         const taxAmount = fabric1Estimatecost * (fabricTax / 100)

//                         const netAmount = grossAmount
                    
//                         const FinalData = {
//                             item_id: roomInfo.selectedcurtain.belt.item_id,
//                             id: roomInfo.selectedcurtain.belt.item_id + `_${asset.id}_belt`,
//                             // unit: "meter",
//                             mrp: price,
//                             qty: 0.5,
//                             discount,
//                             type: "belt",
//                             netAmount: parseFloat(netAmount) / 2
//                         }
//                         const stiching = {
//                             item_id: "FF-0134407",
//                             id: "FF-0134407" + `_${asset.id}_belt_stiching`,
//                             // unit: "meter",
//                             mrp: 100,
//                             qty: 2,
//                             discount: 0,
//                             type: "belt_stiching",
//                             netAmount: 200
//                         }
//                         curtain.push(FinalData)
//                         curtain.push(stiching)
//                     }
//                 }
//                 if (roomInfo.selectedcurtain.beltBorder && roomInfo.selectedcurtain.belt_required =="Yes") {
//                     const price = roomInfo.selectedcurtain.beltBorder.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const stitchingCost = 0
//                         const discount = roomInfo.selectedcurtain.belt_border_discount
//                         const fabric1Estimatecost = price * (parseFloat(asset.total_belt_border_fabric_required).toFixed(2))
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const grossAmount = fabric1Estimatecost
//                         const tax_amount = fabric1Estimatecost * (fabricTax / 100)
//                         const netAmount = grossAmount
//                         const FinalData = {
//                             item_id: roomInfo.selectedcurtain.beltBorder.item_id,
//                             id: roomInfo.selectedcurtain.beltBorder.item_id + `_${asset.id}_belt_border`,
//                             // unit: "meter",
//                             mrp: price,
//                             qty: 1,
//                             discount,
//                             type: "belt_border",
//                             netAmount: netAmount
//                         }
//                         const stiching = {
//                             item_id: "FF-0134407",
//                             id: "FF-0134407" + `_${asset.id}_belt_border_stiching`,
//                             // unit: "meter",
//                             mrp: 100,
//                             qty: 1,
//                             discount: 0,
//                             type: "belt_border_stiching",
//                             netAmount: 100
//                         }
//                         curtain.push(FinalData)
//                         curtain.push(stiching)
//                     }
//                 }
//                 if (roomInfo.selectedcurtain.p_border && roomInfo.selectedcurtain.border_required =="Yes") {
//                     const price = roomInfo.selectedcurtain.p_border.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]

//                         const stitchingPrice = 100

//                         const stitchingCost = 100 * parseInt(asset.number_of_panel_fabric1)

//                         const discount = roomInfo.selectedcurtain.primary_border_discount

//                         const fabric1Estimatecost = price * (parseFloat(roomInfo.selectedcurtain.primary_border_length/100).toFixed(2))

//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0

//                         const grossAmount = fabric1Estimatecost

//                         const tax_amount = fabric1Estimatecost * (fabricTax / 100)

//                         const netAmount = grossAmount

//                         const FinalData = {
//                             item_id: roomInfo.selectedcurtain.p_border.item_id,
//                             id: roomInfo.selectedcurtain.p_border.item_id + `_${asset.id}_primary_border`,
//                             // unit: "meter",
//                             mrp: price,
//                             qty: roomInfo.selectedcurtain.primary_border_length/100,
//                             discount,
//                             type: "primary_border",
//                             netAmount: parseFloat(netAmount)
//                         }
//                         const stiching = {
//                             item_id: "FF-0121728",
//                             id: "FF-0121728" + `_${asset.id}_primary_border_stiching`,
//                             // unit: "meter",
//                             mrp: stitchingPrice,
//                             qty: parseFloat(asset.number_of_panel_fabric1),
//                             discount: 0,
//                             type: "primary_border_stiching",
//                             netAmount: parseFloat(stitchingCost)
//                         }
//                         curtain.push(FinalData)
//                         curtain.push(stiching)
//                     }
//                 }
//                 if (roomInfo.selectedcurtain.s_border && roomInfo.selectedcurtain.border_required =="Yes") {
//                     const price = roomInfo.selectedcurtain.s_border.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const stitchingPrice = 500

//                         const stitchingCost = 500 * parseInt(asset.number_of_panel_fabric2)

//                         const fabric1Estimatecost = price * (parseFloat(asset.total_secondary_border_fabric_required).toFixed(2))

//                         const discount = roomInfo.selectedcurtain.secondary_border_discount

//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0

//                         const grossAmount = fabric1Estimatecost

//                         const tax_amount = fabric1Estimatecost * (fabricTax / 100)

//                         const netAmount = grossAmount

//                         const FinalData = {
//                             item_id: roomInfo.selectedcurtain.s_border.item_id,
//                             id: roomInfo.selectedcurtain.s_border.item_id + `_${asset.id}_secondary_border`,
//                             // unit: "meter",
//                             mrp: price,
//                             qty: parseFloat(asset.total_secondary_border_fabric_required),
//                             discount,
//                             type: "secondary_border",
//                             netAmount: parseFloat(netAmount)
//                         }
//                         const stiching = {
//                             item_id: "FF-0121728",
//                             id: "FF-0121728" + `_${asset.id}_secondary_border_stiching`,
//                             // unit: "meter",
//                             mrp: stitchingPrice,
//                             qty: parseFloat(asset.number_of_panel_fabric2),
//                             discount: 0,
//                             type: "secondary_border_stiching",
//                             netAmount: parseFloat(stitchingCost)
//                         }
//                         curtain.push(FinalData)
//                         curtain.push(stiching)
//                     }
//                 }
//                 if (roomInfo.selectedcurtain.beltPiping && roomInfo.selectedcurtain.belt_required =="Yes") {
//                     const price = roomInfo.selectedcurtain.beltPiping.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * (parseFloat(asset.total_belt_piping_fabric_required).toFixed(2))
//                         const gross_amount = fabric1Estimatecost
//                         const tax_amount = gross_amount * (fabricTax / 100)
//                         const discount = roomInfo.selectedcurtain.belt_piping_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const netAmount = gross_amount
//                         const FinalData = {
//                             item_id: roomInfo.selectedcurtain.beltPiping.item_id,
//                             id: roomInfo.selectedcurtain.beltPiping.item_id + `_${asset.id}_belt_piping`,
//                             // unit: "meter",
//                             mrp: price,
//                             qty: parseFloat(asset.total_belt_piping_fabric_required),
//                             discount,
//                             type: "belt_piping",
//                             netAmount: parseFloat(netAmount)
//                         }
//                         const stiching = {
//                             item_id: "FF-0098917",
//                             id: "FF-0098917" + `_${asset.id}_belt_piping_stiching`,
//                             // unit: "meter",
//                             mrp: 125,
//                             qty: 1,
//                             discount,
//                             type: "belt_piping_stiching",
//                             netAmount: 125
//                         }
//                         curtain.push(FinalData)
//                         curtain.push(stiching)
//                     }
//                 }
//             }
//             if (roomInfo.selectedRod && roomInfo.selectedRod.rod_required == "Yes") {

//                 if (roomInfo.selectedRod.primary_rod_data) {
//                     const price = roomInfo.selectedRod.primary_rod_data.sales_price
//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]

//                         // const runningFeet = Math.ceil((parseFloat(asset.width) / 30.48).toFixed(2))
//                         const runningFeet = Math.ceil((parseFloat(asset.primary_rod_length?asset.primary_rod_length:asset.width) / 30.48).toFixed(2))

//                         const fabric1Estimatecost = price * runningFeet

//                         const fittingCharges = runningFeet < 8 ? 350 : 700

//                         const gross_amount = fabric1Estimatecost 

//                         const tax_amount = gross_amount * (hardwareTax / 100)

//                         const net_amount = gross_amount

//                         const discount = roomInfo.selectedRod.primary_rod_discount

//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedRod.primary_rod_data.item_id,
//                             id: roomInfo.selectedRod.primary_rod_data.item_id + `_${asset.id}_primary_rod`,
//                             // unit: "Feet",
//                             mrp: price,
//                             qty: runningFeet,
//                             discount,
//                             type: "primary_rod",
//                             netAmount: net_amount.toFixed(2)
//                         }
//                         const stiching = {
//                             item_id: "FF-0098948",
//                             id: "FF-0098948" + `_${asset.id}_primary_rod_fitting`,
//                             mrp: fittingCharges,
//                             qty: 1,
//                             type: "primary_rod_fitting",
//                             discount: 0,
//                             netAmount: fittingCharges,
//                         }
//                         rod.push(stiching)
//                         rod.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedRod.secondary_rod_data) {
//                     const price = roomInfo.selectedRod.secondary_rod_data.sales_price
//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
                        
//                         const runningFeet = Math.ceil((parseFloat(asset.width) / 30.48).toFixed(2))

//                         const fabric1Estimatecost = price * runningFeet

//                         const fittingCharges = runningFeet < 8 ? 350 : 700

//                         const gross_amount = fabric1Estimatecost

//                         const tax_amount = gross_amount * (hardwareTax / 100)

//                         const net_amount = gross_amount
//                         const discount = roomInfo.selectedRod.secondary_rod_discount

//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedRod.secondary_rod_data.item_id,
//                             id: roomInfo.selectedRod.secondary_rod_data.item_id + `_${asset.id}_secondary_rod`,
//                             // unit: "Feet",
//                             mrp: price,
//                             qty: runningFeet,
//                             discount,
//                             type: "secondary_rod",
//                             netAmount: net_amount.toFixed(2)
//                         }
//                         const stiching = {
//                             item_id: "FF-0098948",
//                             id: "FF-0098948" + `_${asset.id}_secondary_rod_fitting`,
//                             mrp: fittingCharges,
//                             qty: 1,
//                             type: "secondary_rod_fitting",
//                             discount: 0,
//                             netAmount: fittingCharges,
//                         }
//                         rod.push(stiching)
//                         rod.push(FinalData)
//                     }
//                     // rod.secondary_rod = roomAssetArr
//                 }
//                 if (roomInfo.selectedRod.curtainStick) {
//                     const price = roomInfo.selectedRod.curtainStick.sales_price
//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const discount = roomInfo.selectedRod.curtain_stick_discount
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedRod.number_of_curatin_stick_pair))
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedRod.curtainStick.item_id,
//                             id: roomInfo.selectedRod.curtainStick.item_id + `_${asset.id}_curtain_stick`,
//                             // unit: "Feet",
//                             mrp: price,
//                             // number_of_panel: 0,
//                             qty: roomInfo.selectedRod.number_of_curatin_stick_pair,
//                             discount,
//                             type: "curtain_stick",
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         rod.push(FinalData)
//                     }
//                     // rod.curtainStick = roomAssetArr
//                 }
//                 if (roomInfo.selectedRod.endCapWallSupport) {
//                     const price = roomInfo.selectedRod.endCapWallSupport.sales_price
//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]

//                         const discount = roomInfo.selectedRod.end_cap_wall_support_discount
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedRod.end_cap_wall_support_quantity))
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedRod.endCapWallSupport.item_id,
//                             id: roomInfo.selectedRod.endCapWallSupport.item_id + `_${asset.id}_end_cap_wall_support`,
//                             // unit: "Feet",
//                             mrp: price,
//                             // number_of_panel: 0,
//                             qty: roomInfo.selectedRod.end_cap_wall_support_quantity,
//                             discount,
//                             type: "end_cap_wall_support",
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         rod.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedRod.extraBracketSupport) {
//                     const price = roomInfo.selectedRod.extraBracketSupport.sales_price
//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedRod.extra_bracket_support_quantity))

//                         const discount = roomInfo.selectedRod.extra_bracket_support_discount
//                         const fittingCharges = 300 * (parseInt(roomInfo.selectedRod.extra_bracket_support_quantity))
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedRod.extraBracketSupport.item_id,
//                             id: roomInfo.selectedRod.extraBracketSupport.item_id + `_${asset.id}_extra_bracket_support`,
//                             // unit: "Feet",
//                             mrp: price,
//                             // number_of_panel: 0,
//                             qty: roomInfo.selectedRod.extra_bracket_support_quantity,
//                             discount,
//                             type: "extra_bracket_support",
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         rod.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedRod.extraBracket) {
//                     const price = roomInfo.selectedRod.extraBracket.sales_price
//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedRod.extra_bracket_quantity))
//                         const discount = roomInfo.selectedRod.extra_bracket_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const fittingCharges = 350
//                         const FinalData = {
//                             item_id: roomInfo.selectedRod.extraBracket.item_id,
//                             id: roomInfo.selectedRod.extraBracket.item_id + `_${asset.id}_extra_bracket`,
//                             // unit: "Feet",
//                             mrp: price,
//                             // number_of_panel: 0,
//                             qty: roomInfo.selectedRod.extra_bracket_quantity,
//                             discount,
//                             type: "extra_bracket",
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         rod.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedRod.endCap) {
//                     const price = roomInfo.selectedRod.endCap.sales_price
//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]

//                         const discount = roomInfo.selectedRod.end_cap_discount
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedRod.end_cap_quantity))
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedRod.endCap.item_id,
//                             id: roomInfo.selectedRod.endCap.item_id + `_${asset.id}_end_cap`,
//                             // unit: "Feet",
//                             mrp: price,
//                             // number_of_panel: 0,
//                             qty: roomInfo.selectedRod.end_cap_quantity,
//                             discount,
//                             type: "end_cap",
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         rod.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedRod.finial) {
//                     const price = roomInfo.selectedRod.finial.sales_price
//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const discount = roomInfo.selectedRod.finial_discount
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedRod.finial_quantity))
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedRod.finial.item_id,
//                             id: roomInfo.selectedRod.finial.item_id + `_${asset.id}_finial`,
//                             // unit: "Feet",
//                             mrp: price,
//                             // number_of_panel: 0,
//                             qty: roomInfo.selectedRod.finial_quantity,
//                             discount,
//                             type: "finial",
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         rod.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedRod.rodTieKnob) {
//                     const price = roomInfo.selectedRod.rodTieKnob.sales_price
//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedRod.rod_number_of_tie_knobs_pair))
//                         const discount = roomInfo.selectedRod.rod_tieknob_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedRod.rodTieKnob.item_id,
//                             id: roomInfo.selectedRod.rodTieKnob.item_id + `_${asset.id}_rod_tieknob`,
//                             // unit: "Feet",
//                             mrp: price,
//                             // number_of_panel: 0,
//                             qty: roomInfo.selectedRod.rod_number_of_tie_knobs_pair,
//                             discount,
//                             type: "rod_tieknob",
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         rod.push(FinalData)
//                     }
//                 }
//             }
//             if (roomInfo.selectedsheer && roomInfo.selectedsheer.sheerFabricId && roomInfo.selectedsheer.sheer_required == "Yes") {
//                 let styleCost;
//                 let styleType;
//                 if (roomInfo.selectedsheer.sheerStyle) {
//                     styleCost = roomInfo.selectedsheer.sheerStyle.curtainStyle == "3 pleat" ? 249 :
//                         roomInfo.selectedsheer.sheerStyle.curtainStyle == "Ripple fold" ? 297 :
//                             roomInfo.selectedsheer.sheerStyle.curtainStyle == "Pencil pleat" ? 249 :
//                                 roomInfo.selectedsheer.sheerStyle.curtainStyle == "eyelet" ? 297 : 0;

//                     styleType = roomInfo.selectedsheer.sheerStyle.curtainStyle == "3 pleat" ? "FF-0098905" :
//                         roomInfo.selectedsheer.sheerStyle.curtainStyle == "Ripple fold" ? "FF-0121727" :
//                             roomInfo.selectedsheer.sheerStyle.curtainStyle == "Pencil pleat" ? "FF-0098908" :
//                                 roomInfo.selectedsheer.sheerStyle.curtainStyle == "eyelet" ? "FF-0121726" : "";
//                 }

//                 if (roomInfo.selectedsheer.curtainfabric) {

//                     const price = roomInfo.selectedsheer.curtainfabric.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]

//                         const fabric1Estimatecost = parseInt(price) * (parseFloat(asset.total_sheer_fabric_required).toFixed(2))

//                         const discount = roomInfo.selectedsheer.sheer_discount

//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0

//                         const leadChain = roomInfo.selectedsheer.leadChain == "Yes" ? 140 : 0
                        
//                         const number_of_panel_sheer_fabric = asset.number_of_panel_sheer_fabric == "0" ? asset.number_of_panel_fabric1 : asset.number_of_panel_sheer_fabric
//                         const leadChain_price = leadChain * number_of_panel_sheer_fabric

//                         const handHammering_price = roomInfo.selectedsheer.handHammering == "Yes" ? 254 : 0

//                         const handHammeringStiching = handHammering_price == 0 ? 0 : handHammering_price * parseInt(number_of_panel_sheer_fabric)

//                         const stitchingCost = parseInt(number_of_panel_sheer_fabric) * parseInt(styleCost)

//                         const grossAmount = fabric1Estimatecost

//                         const taxAmount = fabric1Estimatecost * (fabricTax / 100)

//                         const netAmount = grossAmount

//                         const FinalData = {
//                             item_id: roomInfo.selectedsheer.curtainfabric.item_id,
//                             id: roomInfo.selectedsheer.curtainfabric.item_id + `_${asset.id}_sheer`,
//                             mrp: price,
//                             discount,
//                             type: "sheer",
//                             qty: parseFloat(asset.total_sheer_fabric_required).toFixed(2),
//                             netAmount: parseFloat((netAmount).toFixed(2))
//                         }
//                         const stiching = {
//                             item_id: styleType,
//                             id: styleType + `_${asset.id}_${styleType}`,
//                             mrp: styleCost,
//                             discount: 0,
//                             type: styleType,
//                             qty: parseFloat(number_of_panel_sheer_fabric).toFixed(2),
//                             netAmount: (parseFloat(stitchingCost))
//                         }

//                         if (roomInfo.selectedsheer.leadChain == "Yes") {
//                             const lead = {
//                                 item_id: "FF-0098909",
//                                 id: "FF-0098909" + `_${asset.id}_sheer_lead_chain`,
//                                 mrp: 140.0,
//                                 discount: 0,
//                                 type: "sheer_lead_chain",
//                                 qty: parseFloat(number_of_panel_sheer_fabric).toFixed(2),
//                                 netAmount: leadChain_price
//                             }
//                             sheer.push(lead)
//                         }

//                         if (roomInfo.selectedsheer.handHammering == "Yes") {
//                             const handHammering = {
//                                 item_id: "FF-0182134",
//                                 id: "FF-0182134" + `_${asset.id}_SheerHandHamming`,
//                                 mrp: handHammering_price,
//                                 qty: parseFloat(number_of_panel_sheer_fabric).toFixed(2),
//                                 discount: 0,
//                                 type: "Hand Hamming",
//                                 netAmount: parseFloat(handHammering_price * parseInt(number_of_panel_sheer_fabric))
//                             }
//                             sheer.push(handHammering)
//                         }

//                         sheer.push(FinalData)
//                         sheer.push(stiching)
//                     }
//                 }
//             }
//             if (roomInfo.selectedTrack && roomInfo.selectedTrack.track_required == "Yes") {

//                 if (roomInfo.selectedTrack.primary_track_data && roomInfo.selectedTrack.track_required == "Yes" && roomInfo.selectedTrack.primary_track_required == "Yes") {
//                     const price = roomInfo.selectedTrack.primary_track_data.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j];
//                         if (roomInfo.selectedTrack.primary_track_data.calculation == false) {
                            
//                             const runningFeet = Math.ceil(parseFloat(asset.primary_track_length?asset.primary_track_length: asset.width) / 30.48)
//                             console.log(runningFeet)
//                             let roundedRunningFeet;
                            
//                             if (runningFeet % 1 === 0) {
//                                 roundedRunningFeet = runningFeet;
//                             } else {
//                                 const decimalPart = runningFeet % 1;
                            
//                                 if (decimalPart <= 0.5) {
//                                     roundedRunningFeet = Math.floor(runningFeet) + 0.5;
//                                 } else {
//                                     roundedRunningFeet = Math.ceil(runningFeet);
//                                 }
//                             }
//                             console.log(roundedRunningFeet)

//                             const fabric1Estimatecost = parseFloat(price) * parseFloat(roundedRunningFeet)

//                             const fittingCharges = roomInfo.selectedTrack.primary_track_type == 1 ? 300 : 1770
//                             const gross_amount = fabric1Estimatecost
//                             // return res.send(fabric1Estimatecost)
//                             const discount = roomInfo.selectedTrack.primary_track_discount
//                             const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                             const tax_amount = gross_amount * (hardwareTax / 100)
//                             const running_feet_calc = roundedRunningFeet < 8 ? fittingCharges : fittingCharges * 2
//                             const netAmount = gross_amount
//                             const FinalData = {
//                                 item_id: roomInfo.selectedTrack.primary_track_data.item_id,
//                                 id: roomInfo.selectedTrack.primary_track_data.item_id + `_${asset.id}_primary_track`,
//                                 mrp: price,
//                                 qty: roundedRunningFeet,
//                                 type: "primary_track",
//                                 discount: discount,
//                                 netAmount: netAmount
//                             }
//                             const stiching = {
//                                 item_id: "FF-0098948",
//                                 id: "FF-0098948" + `_${asset.id}_primary_track_fitting`,
//                                 mrp: fittingCharges,
//                                 qty: roundedRunningFeet < 8 ? 1 : 2,
//                                 type: "primary_track_fitting",
//                                 discount: 0,
//                                 netAmount: running_feet_calc,
//                             }
//                             track.push(stiching)
//                             track.push(FinalData)
//                         }
//                         else {
//                             const fabric1Estimatecost = price
//                             const tax_amount = fabric1Estimatecost * (hardwareTax / 100)
//                             const runningFeet = parseFloat(asset.width) / 30.48
                            
//                             let roundedRunningFeet;
                            
//                             if (runningFeet % 1 === 0) {
//                                 roundedRunningFeet = runningFeet;
//                             } else {
//                                 const decimalPart = runningFeet % 1;
                            
//                                 if (decimalPart <= 0.5) {
//                                     roundedRunningFeet = Math.floor(runningFeet) + 0.5;
//                                 } else {
//                                     roundedRunningFeet = Math.ceil(runningFeet);
//                                 }
//                             }
                            
//                             const fittingCharges = roomInfo.selectedTrack.primary_track_type == 1 ? 300 : 1770
//                             const running_feet_calc = roundedRunningFeet < 8 ? fittingCharges : fittingCharges * 2
//                             const discount = roomInfo.selectedTrack.primary_track_discount
//                             const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                             const netAmount = (fabric1Estimatecost)
//                             const FinalData = {
//                                 item_id: roomInfo.selectedTrack.primary_track_data.item_id,
//                                 id: roomInfo.selectedTrack.primary_track_data.item_id + `_${asset.id}_primary_track`,
//                                 // type: "System",
//                                 // unit: "Feet",
//                                 mrp: price,
//                                 qty: Math.round(parseFloat(asset.width) / 30.48),
//                                 type: "primary_track",
//                                 discount: discount,
//                                 netAmount: netAmount
//                             }
//                             const stiching = {
//                                 item_id: "FF-0098948",
//                                 id: "FF-0098948" + `_${asset.id}_primary_track_fitting`,
//                                 mrp: fittingCharges,
//                                 qty: roundedRunningFeet < 8 ? 1 : 2,
//                                 type: "primary_track_fitting",
//                                 discount: 0,
//                                 netAmount: running_feet_calc,
//                             }
//                             track.push(stiching)
//                             track.push(FinalData)
//                         }
//                     }

//                 }
//                 if (roomInfo.selectedTrack.primaryTrackMotor && roomInfo.selectedTrack.primaryTrackType.type == "Moterized Track") {
//                     const price = roomInfo.selectedTrack.primaryTrackMotor.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j];
//                         const fabric1Estimatecost = price
//                         const tax_amount = fabric1Estimatecost * (hardwareTax / 100)
//                         const discount = roomInfo.selectedTrack.primary_track_motor_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const netAmount = (fabric1Estimatecost)
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.primaryTrackMotor.item_id,
//                             id: roomInfo.selectedTrack.primaryTrackMotor.item_id + `_${asset.id}_primary_track_motor`,
//                             // unit: "Feet",
//                             mrp: price,
//                             qty: 1,
//                             discount,
//                             type: "primary_track_motor",
//                             netAmount: netAmount
//                         }
//                         track.push(FinalData)
//                     }

//                 }
//                 if (roomInfo.selectedTrack.primaryTrackRemote && roomInfo.selectedTrack.primaryTrackType.type == "Moterized Track") {
//                     const price = roomInfo.selectedTrack.primaryTrackRemote.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j];
//                         const fabric1Estimatecost = price * parseInt(roomInfo.selectedTrack.no_of_primary_track_remote)
//                         const tax_amount = fabric1Estimatecost * (hardwareTax / 100)
//                         const discount = roomInfo.selectedTrack.primary_track_remote_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const netAmount = (fabric1Estimatecost)
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.primaryTrackRemote.item_id,
//                             id: roomInfo.selectedTrack.primaryTrackRemote.item_id + `_${asset.id}_primary_track_remote`,
//                             // unit: "Feet",
//                             mrp: price,
//                             // qty: (parseFloat(asset.width) / 100) * 3.2808,
//                             qty: parseInt(roomInfo.selectedTrack.no_of_primary_track_remote),
//                             discount,
//                             type: "primary_track_remote",
//                             netAmount: netAmount
//                         }
//                         track.push(FinalData)

//                     }
//                 }
//                 if (roomInfo.selectedTrack.primaryOverlapper && roomInfo.selectedTrack.primary_overlappper_required == "Yes") {
//                     const price = roomInfo.selectedTrack.primaryOverlapper.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedTrack.primary_number_of_overlappper_pair))
//                         const discount = roomInfo.selectedTrack.primary_overlapper_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.primaryOverlapper.item_id,
//                             id: roomInfo.selectedTrack.primaryOverlapper.item_id + `_${asset.id}_primary_track_overlapper`,
//                             // unit: "Feet",
//                             mrp: price,
//                             qty: roomInfo.selectedTrack.primary_number_of_overlappper_pair,
//                             discount,
//                             type: "primary_track_overlapper",
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         track.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedTrack.primaryTrackCuratinStick && roomInfo.selectedTrack.primary_track_curatin_stick_required == "Yes") {
//                     const price = roomInfo.selectedTrack.primaryTrackCuratinStick.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * parseInt(roomInfo.selectedTrack.primary_track_curatin_stick_pair)
//                         const discount = roomInfo.selectedTrack.primary_track_curatin_stick_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.primaryTrackCuratinStick.item_id,
//                             id: roomInfo.selectedTrack.primaryTrackCuratinStick.item_id + `_${asset.id}_primary_track_curatin_stick`,
//                             // unit: "Feet",
//                             mrp: price,
//                             qty: roomInfo.selectedTrack.primary_track_curatin_stick_pair,
//                             discount,
//                             type: "primary_track_curatin_stick",
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         track.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedTrack.primaryExtraTrackBracket && roomInfo.selectedTrack.primary_extra_track_bracket_required == "Yes") {
//                     const price = roomInfo.selectedTrack.primaryExtraTrackBracket.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedTrack.primary_extra_track_bracket_quantity))
//                         const fittingCharges = 350
//                         const discount = roomInfo.selectedTrack.primary_extra_track_bracket_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.primaryExtraTrackBracket.item_id,
//                             id: roomInfo.selectedTrack.primaryExtraTrackBracket.item_id + `_${asset.id}_primary_track_extra_track_bracket`,
//                             // unit: "Feet",
//                             mrp: price,
//                             discount,
//                             type: "primary_track_extra_track_bracket",
//                             qty: roomInfo.selectedTrack.primary_extra_track_bracket_quantity,
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         track.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedTrack.primary_track_tieknob && roomInfo.selectedTrack.primary_tie_knobs_required == "Yes") {
//                     const price = roomInfo.selectedTrack.primary_track_tieknob.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedTrack.primary_tie_knobs_pair))
//                         const fittingCharges = 200 * (parseInt(roomInfo.selectedTrack.primary_tie_knobs_pair))
//                         const discount = roomInfo.selectedTrack.primary_tieknob_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.primary_track_tieknob.item_id,
//                             id: roomInfo.selectedTrack.primary_track_tieknob.item_id + `_${asset.id}_primary_track_tieknob`,
//                             // unit: "Feet",
//                             mrp: price,
//                             discount,
//                             type: "primary_track_tieknob",
//                             qty: roomInfo.selectedTrack.primary_tie_knobs_pair,
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         roomAssetArr.push(FinalData)
//                     }
//                     track.primary_track_tieknob = roomAssetArr
//                 }
//                 if (roomInfo.selectedTrack.secondary_track_tieknob && roomInfo.selectedTrack.secondary_tie_knobs_required == "Yes") {
//                     const price = roomInfo.selectedTrack.secondary_track_tieknob.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedTrack.secondary_tie_knobs_pair))
//                         const discount = roomInfo.selectedTrack.secondary_tieknobs_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const fittingCharges = 200 * (parseInt(roomInfo.selectedTrack.primary_tie_knobs_pair))
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.secondary_track_tieknob.item_id,
//                             id: roomInfo.selectedTrack.secondary_track_tieknob.item_id + `_${asset.id}_secondary_track_tieknob`,
//                             // unit: "Feet",
//                             mrp: price,
//                             discount,
//                             type: "secondary_track_tieknob",
//                             qty: roomInfo.selectedTrack.primary_tie_knobs_pair,
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         track.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedTrack.mock_track_tieknob && roomInfo.selectedTrack.mock_tie_knobs_required == "Yes") {
//                     const price = roomInfo.selectedTrack.mock_track_tieknob.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedTrack.mock_tie_knobs_pair))
//                         const discount = roomInfo.selectedTrack.mock_tie_knobs_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const fittingCharges = 200 * (parseInt(roomInfo.selectedTrack.primary_tie_knobs_pair))
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.mock_track_tieknob.item_id,
//                             id: roomInfo.selectedTrack.mock_track_tieknob.item_id + `_${asset.id}_mock_track_tieknob`,
//                             // unit: "Feet",
//                             mrp: price,
//                             qty: roomInfo.selectedTrack.primary_tie_knobs_pair,
//                             discount,
//                             type: "mock_track_tieknob",
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         track.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedTrack.Lbracket && roomInfo.selectedTrack.l_bracket_required == "Yes") {
//                     const price = roomInfo.selectedTrack.Lbracket.sales_price
//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedTrack.l_bracket_quantity))
//                         const discount = roomInfo.selectedTrack.lbracket_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.Lbracket.item_id,
//                             id: roomInfo.selectedTrack.Lbracket.item_id + `_${asset.id}_l_bracket`,
//                             // unit: "Feet",
//                             mrp: price,
//                             discount,
//                             type: "l_bracket",
//                             qty: roomInfo.selectedTrack.l_bracket_quantity,
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         track.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedTrack.secondary_track_data && roomInfo.selectedTrack.secondary_track_required == "Yes") {
//                     const price = roomInfo.selectedTrack.secondary_track_data.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j];
//                         if (roomInfo.selectedTrack.secondary_track_data.calculation == false) {
                           
//                             const runningFeet = Math.ceil(parseFloat(asset.secondary_track_length?asset.secondary_track_length:asset.width) / 30.48)

//                             let roundedRunningFeet = runningFeet;
                            
//                             // if (runningFeet % 1 === 0) {
//                             //     roundedRunningFeet = runningFeet;
//                             // } else {
//                             //     const decimalPart = runningFeet % 1;
                            
//                             //     if (decimalPart <= 0.5) {
//                             //         roundedRunningFeet = Math.floor(runningFeet) + 0.5;
//                             //     } else {
//                             //         roundedRunningFeet = Math.ceil(runningFeet);
//                             //     }
//                             // }
                            
//                             const fabric1Estimatecost = parseFloat(price) * parseFloat(roundedRunningFeet)

//                             const fittingCharges = roomInfo.selectedTrack.secondary_track_type == 1 ? 300 : 1770
//                             const gross_amount = fabric1Estimatecost
//                             // return res.send(fabric1Estimatecost)
//                             const discount = roomInfo.selectedTrack.secondary_track_discount
//                             const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                             const tax_amount = gross_amount * (hardwareTax / 100)
//                             const running_feet_calc = roundedRunningFeet < 8 ? fittingCharges : fittingCharges * 2
//                             const netAmount = gross_amount
                            
//                             const FinalData = {
//                                 item_id: roomInfo.selectedTrack.secondary_track_data.item_id,
//                                 id: roomInfo.selectedTrack.secondary_track_data.item_id + `_${asset.id}_secondary_track`,
//                                 // type: "System",
//                                 // unit: "Feet",
//                                 mrp: price,
//                                 qty: roundedRunningFeet,
//                                 discount: discount,
//                                 // discountedAmount,
//                                 // tax: hardwareTax,
//                                 // tax_amount: tax_amount,
//                                 type: "secondary_track",
//                                 netAmount: netAmount
//                             }
//                             const stiching = {
//                                 item_id: "FF-0098948",
//                                 id: "FF-0098948" + `_${asset.id}_secondary_track_fitting`,
//                                 mrp: fittingCharges,
//                                 qty: roundedRunningFeet < 8 ? 1 : 2,
//                                 type: "secondary_track_fitting",
//                                 discount: 0,
//                                 netAmount: running_feet_calc,
//                             }

//                             track.push(stiching)
//                             track.push(FinalData)
//                         }
//                         else {
//                             const fabric1Estimatecost = price
//                             const tax_amount = fabric1Estimatecost * (hardwareTax / 100)
//                             const runningFeet = parseFloat(asset.width) / 30.48
                            
//                             let roundedRunningFeet;
                            
//                             if (runningFeet % 1 === 0) {
//                                 roundedRunningFeet = runningFeet;
//                             } else {
//                                 const decimalPart = runningFeet % 1;
                            
//                                 if (decimalPart <= 0.5) {
//                                     roundedRunningFeet = Math.floor(runningFeet) + 0.5;
//                                 } else {
//                                     roundedRunningFeet = Math.ceil(runningFeet);
//                                 }
//                             }
//                             const fittingCharges = roomInfo.selectedTrack.secondary_track_type == 1 ? 300 : 1770
//                             const running_feet_calc = roundedRunningFeet < 8 ? fittingCharges : fittingCharges * 2
//                             const discount = roomInfo.selectedTrack.secondary_track_discount
//                             const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                             const netAmount = (fabric1Estimatecost)
                            
//                             const FinalData = {
//                                 item_id: roomInfo.selectedTrack.secondary_track_data.item_id,
//                                 id: roomInfo.selectedTrack.secondary_track_data.item_id + `_${asset.id}_secondary_track`,
//                                 // type: "System",
//                                 // unit: "Feet",
//                                 mrp: price,
//                                 qty: Math.round(parseFloat(asset.width) / 30.48),
//                                 discount: discount,
//                                 type: "secondary_track",
//                                 netAmount: netAmount
//                             }
//                             const stiching = {
//                                 item_id: "FF-0098948",
//                                 id: "FF-0098948" + `_${asset.id}_secondary_track_fitting`,
//                                 mrp: fittingCharges,
//                                 qty: roundedRunningFeet < 8 ? 1 : 2,
//                                 type: "secondary_track_fitting",
//                                 discount: 0,
//                                 netAmount: running_feet_calc,
//                             }

//                             track.push(stiching)
//                             track.push(FinalData)
//                         }
//                     }

//                 }
//                 if (roomInfo.selectedTrack.secondaryTrackMotor && roomInfo.selectedTrack.secondaryTrackType.type == "Moterized Track") {
//                     const price = roomInfo.selectedTrack.secondaryTrackMotor.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j];
//                         const fabric1Estimatecost = price
//                         const tax_amount = fabric1Estimatecost * (hardwareTax / 100)
//                         const discount = roomInfo.selectedTrack.secondary_track_motor_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const netAmount = (fabric1Estimatecost)
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.secondaryTrackMotor.item_id,
//                             id: roomInfo.selectedTrack.secondaryTrackMotor.item_id + `_${asset.id}_secondary_track_motor`,
//                             // unit: "Feet",
//                             mrp: price,
//                             qty: 1,
//                             discount,
//                             type: "secondary_track_motor",
//                             netAmount: netAmount
//                         }
//                         track.push(FinalData)

//                     }
//                 }
//                 if (roomInfo.selectedTrack.secondaryTrackRemote && roomInfo.selectedTrack.secondaryTrackType.type == "Moterized Track") {
//                     const price = roomInfo.selectedTrack.secondaryTrackRemote.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j];
//                         const fabric1Estimatecost = price * parseInt(roomInfo.selectedTrack.no_of_secondary_track_remote)
//                         const tax_amount = fabric1Estimatecost * (hardwareTax / 100)
//                         const discount = roomInfo.selectedTrack.secondary_track_remote_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const netAmount = (fabric1Estimatecost)
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.secondaryTrackRemote.item_id,
//                             id: roomInfo.selectedTrack.secondaryTrackRemote.item_id + `_${asset.id}_secondary_track_remote`,
//                             // unit: "Feet",
//                             mrp: price,
//                             qty: roomInfo.selectedTrack.no_of_secondary_track_remote,
//                             discount,
//                             type: "secondary_track_remote",
//                             netAmount: netAmount
//                         }
//                         track.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedTrack.secondaryOverlapper && roomInfo.selectedTrack.secondary_overlappper_required == "Yes") {
//                     const price = roomInfo.selectedTrack.secondaryOverlapper.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const discount = roomInfo.selectedTrack.secondary_overlappper_discount
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedTrack.secondary_number_of_overlappper_pair))
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.secondaryOverlapper.item_id,
//                             id: roomInfo.selectedTrack.secondaryOverlapper.item_id + `_${asset.id}_secondary_track_overlapper`,
//                             // unit: "Feet",
//                             mrp: price,
//                             qty: roomInfo.selectedTrack.secondary_number_of_overlappper_pair,
//                             discount,
//                             type: "secondary_track_overlapper",
//                             netAmount: fabric1Estimatecost
//                         }
//                         track.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedTrack.secondaryTrackCuratinStick && roomInfo.selectedTrack.secondary_track_curatin_stick_required == "Yes") {
//                     const price = roomInfo.selectedTrack.secondaryTrackCuratinStick.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const discount = roomInfo.selectedTrack.secondary_track_curatin_stick_discount
//                         const fabric1Estimatecost = price * parseInt(roomInfo.selectedTrack.secondary_track_curatin_stick_pair)
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.secondaryTrackCuratinStick.item_id,
//                             id: roomInfo.selectedTrack.secondaryTrackCuratinStick.item_id + `_${asset.id}_secondary_track_curatin_stick`,
//                             // unit: "Feet",
//                             mrp: price,
//                             discount,
//                             type: "secondary_track_curatin_stick",
//                             qty: roomInfo.selectedTrack.secondary_track_curatin_stick_pair,
//                             netAmount: fabric1Estimatecost
//                         }
//                         track.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedTrack.secondaryExtraTrackBracket && roomInfo.selectedTrack.secondary_extra_track_bracket_required == "Yes") {
//                     const price = roomInfo.selectedTrack.secondaryExtraTrackBracket.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedTrack.secondary_extra_track_bracket_quantity))
//                         const discount = roomInfo.selectedTrack.secondary_extra_track_bracket_discount
//                         const fittingCharges = 350
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.secondaryExtraTrackBracket.item_id,
//                             id: roomInfo.selectedTrack.secondaryExtraTrackBracket.item_id + `_${asset.id}_secondary_track_extra_bracket`,
//                             // unit: "Feet",
//                             mrp: price,
//                             discount,
//                             type: "secondary_track_extra_bracket",
//                             qty: roomInfo.selectedTrack.secondary_extra_track_bracket_quantity,
//                             netAmount: fabric1Estimatecost
//                         }
//                         track.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedTrack.mock_track_data && roomInfo.selectedTrack.mock_track_required == "Yes") {
//                     const price = roomInfo.selectedTrack.mock_track_data.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j];
//                         if (roomInfo.selectedTrack.mock_track_data.calculation == false) {
//                             const runningFeet = Math.round(parseFloat(asset.width) / 30.48)

//                             const fabric1Estimatecost = parseInt(price) * parseInt(runningFeet)

//                             const fittingCharges = roomInfo.selectedTrack.mock_track_type == 1 ? 300 : 1770
//                             const gross_amount = fabric1Estimatecost
//                             // return res.send(fabric1Estimatecost)
//                             const discount = roomInfo.selectedTrack.mock_track_discount
//                             const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                             const tax_amount = gross_amount * (hardwareTax / 100)
//                             const running_feet_calc = runningFeet < 8 ? fittingCharges : fittingCharges * 2
//                             const netAmount = gross_amount
//                             const FinalData = {
//                                 item_id: roomInfo.selectedTrack.mock_track_data.item_id,
//                                 id: roomInfo.selectedTrack.mock_track_data.item_id + `_${asset.id}_mock_track`,
//                                 // type: "System",
//                                 // unit: "Feet",
//                                 mrp: price,
//                                 qty: runningFeet,
//                                 type: "mock_track",
//                                 discount: discount,
//                                 // discountedAmount,
//                                 // tax: hardwareTax,
//                                 // tax_amount: tax_amount,
//                                 netAmount: netAmount
//                             }
//                             const stiching = {
//                                 item_id: "FF-0098948",
//                                 id: "FF-0098948" + `_${asset.id}_mock_track_fitting`,
//                                 mrp: fittingCharges,
//                                 qty: runningFeet < 8 ? 1 : 2,
//                                 type: "mock_track_fitting",
//                                 discount: 0,
//                                 netAmount: running_feet_calc,
//                             }

//                             track.push(stiching)
//                             track.push(FinalData)
//                         }
//                         else {
//                             const fabric1Estimatecost = price
//                             const tax_amount = fabric1Estimatecost * (hardwareTax / 100)
//                             const runningFeet = Math.round(parseFloat(asset.width) / 30.48)
//                             const fittingCharges = roomInfo.selectedTrack.mock_track_type == 1 ? 300 : 1770
//                             const running_feet_calc = runningFeet < 8 ? fittingCharges : fittingCharges * 2
//                             const discount = roomInfo.selectedTrack.mock_track_discount
//                             const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                             const netAmount = (fabric1Estimatecost)
//                             const FinalData = {
//                                 item_id: roomInfo.selectedTrack.mock_track_data.item_id,
//                                 id: roomInfo.selectedTrack.mock_track_data.item_id + `_${asset.id}_mock_track`,
//                                 // type: "System",
//                                 // unit: "Feet",
//                                 mrp: price,
//                                 qty: Math.round(parseFloat(asset.width) / 30.48),
//                                 type: "mock_track",
//                                 discount: discount,
//                                 netAmount: netAmount
//                             }
//                             const stiching = {
//                                 item_id: "FF-0098948",
//                                 id: "FF-0098948" + `_${asset.id}_mock_track_fitting`,
//                                 mrp: fittingCharges,
//                                 qty: runningFeet < 8 ? 1 : 2,
//                                 type: "mock_track_fitting",
//                                 discount: 0,
//                                 netAmount: running_feet_calc,
//                             }

//                             track.push(stiching)
//                             track.push(FinalData)
//                         }
//                     }
//                 }
//                 if (roomInfo.selectedTrack.mockTrackMotor && roomInfo.selectedTrack.mockTrackType.type == "Moterized Track") {
//                     const price = roomInfo.selectedTrack.mockTrackMotor.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j];
//                         if (roomInfo.selectedTrack.mockTrackMotor.calculation == false) {
//                             const fabric1Estimatecost = price * parseInt(roomInfo.selectedTrack.no_of_mock_track_remote)
//                             const discount = roomInfo.selectedTrack.mock_track_motor_discount
//                             const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                             const FinalData = {
//                                 item_id: roomInfo.selectedTrack.mockTrackMotor.item_id,
//                                 id: roomInfo.selectedTrack.mockTrackMotor.item_id + `_${asset.id}_mock_track_motor`,
//                                 // type: "System",
//                                 // unit: "Feet",
//                                 mrp: price,
//                                 type: "mock_track_motor",
//                                 qty: roomInfo.selectedTrack.no_of_mock_track_remote,
//                                 netAmount: (fabric1Estimatecost)
//                             }
//                             track.push(FinalData)
//                         }
//                         else {
//                             const fabric1Estimatecost = price
//                             const tax_amount = fabric1Estimatecost * (hardwareTax / 100)
//                             const discount = roomInfo.selectedTrack.mock_track_motor_discount
//                             const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                             const netAmount = (fabric1Estimatecost)
//                             const FinalData = {
//                                 item_id: roomInfo.selectedTrack.mockTrackMotor.item_id,
//                                 id: roomInfo.selectedTrack.mockTrackMotor.item_id + `_${asset.id}_mock_track_motor`,
//                                 // type: "System",
//                                 // unit: "Feet",
//                                 mrp: price,
//                                 discount: discount,
//                                 type: "mock_track_motor",
//                                 qty: roomInfo.selectedTrack.no_of_mock_track_remote,
//                                 netAmount: netAmount
//                             }
//                             track.push(FinalData)
//                         }
//                     }
//                 }
//                 if (roomInfo.selectedTrack.mockTrackRemote && roomInfo.selectedTrack.mockTrackType.type == "Moterized Track") {
//                     const price = roomInfo.selectedTrack.mockTrackRemote.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j];
//                         const runningFeet = parseFloat(asset.width) / 30.48

//                         const fabric1Estimatecost = price * parseInt(roomInfo.selectedTrack.no_of_mock_track_remote)
//                         const discount = roomInfo.selectedTrack.mock_track_remote_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.mockTrackRemote.item_id,
//                             id: roomInfo.selectedTrack.mockTrackRemote.item_id + `_${asset.id}_mock_track_remote`,
//                             // unit: "Feet",
//                             mrp: price,
//                             discount,
//                             type: "mock_track_remote",
//                             qty: roomInfo.selectedTrack.no_of_mock_track_remote,
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         track.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedTrack.mockOverlapper && roomInfo.selectedTrack.mock_overlappper_required == "Yes") {
//                     const price = roomInfo.selectedTrack.mockOverlapper.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedTrack.mock_number_of_overlappper_pair))
//                         const discount = roomInfo.selectedTrack.mock_overlappper_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.mockOverlapper.item_id,
//                             id: roomInfo.selectedTrack.mockOverlapper.item_id + `_${asset.id}_mock_track_overlapper`,
//                             // unit: "Feet",
//                             mrp: price,
//                             discount,
//                             type: "mock_track_overlapper",
//                             qty: roomInfo.selectedTrack.mock_number_of_overlappper_pair,
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         track.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedTrack.mockTrackCuratinStick && roomInfo.selectedTrack.mock_track_curatin_stick_required == "Yes") {
//                     const price = roomInfo.selectedTrack.mockTrackCuratinStick.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * parseInt(roomInfo.selectedTrack.mock_track_curatin_stick_pair)
//                         const discount = roomInfo.selectedTrack.mock_track_curatin_stick_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.mockTrackCuratinStick.item_id,
//                             id: roomInfo.selectedTrack.mockTrackCuratinStick.item_id + `_${asset.id}_mock_track_curatin_stick`,
//                             // unit: "Feet",
//                             mrp: price,
//                             discount,
//                             type: "mock_track_curatin_stick",
//                             qty: roomInfo.selectedTrack.mock_track_curatin_stick_pair,
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         track.push(FinalData)
//                     }
//                 }
//                 if (roomInfo.selectedTrack.mockExtraTrackBracket && roomInfo.selectedTrack.mock_extra_track_bracket_required == "Yes") {
//                     const price = roomInfo.selectedTrack.mockExtraTrackBracket.sales_price

//                     const roomAssetArr = []
//                     for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                         const asset = roomInfo.room_assets[j]
//                         const fabric1Estimatecost = price * (parseInt(roomInfo.selectedTrack.mock_extra_track_bracket_quantity))
//                         const discount = roomInfo.selectedTrack.mock_extra_track_bracket_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const fittingCharges = 350
//                         const FinalData = {
//                             item_id: roomInfo.selectedTrack.mockExtraTrackBracket.item_id,
//                             id: roomInfo.selectedTrack.mockExtraTrackBracket.item_id + `_${asset.id}_mock_track_extra_track_bracket`,
//                             // unit: "Feet",
//                             mrp: price,
//                             discount,
//                             type: "mock_track_extra_track_bracket",
//                             qty: roomInfo.selectedTrack.mock_extra_track_bracket_quantity,
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         track.push(FinalData)
//                     }
//                 }
//             }
//             if (roomInfo.selectedsofa && roomInfo.selectedsofa.length > 0) {

//                 for (var j = 0; j < roomInfo.selectedsofa.length; j++) {
//                     let sofaData = roomInfo.selectedsofa[j]
//                     const quillt_price = sofaData.quillt_price ? sofaData.quillt_price : 0;
//                     let obj;

//                     if (sofaData && sofaData.sofa_required == "Yes") {
//                         let primary_fabric = sofaData.sofa_primary_fabric_ ? sofaData.sofa_primary_fabric_.fabric : null
//                         let primary_fabric_id = sofaData.sofa_primary_fabric_ ? sofaData.sofa_primary_fabric_.item_id : null
//                         let primary_fabric_price = sofaData.sofa_primary_fabric_ ? sofaData.sofa_primary_fabric_.sales_price : null
//                         let primary_fabric_cost = sofaData.total_sofa_primary_fabric * primary_fabric_price
//                         let primary_fabric_qty = sofaData.total_sofa_primary_fabric
//                         let primary_fabric_discount = sofaData.sofa_primary_fabric_discount
//                         let primary_fabric_discounted_price = (sofaData.sofa_primary_fabric_discount / 100) * primary_fabric_cost
//                         let net_primary_fabric_price = primary_fabric_cost
                        
//                         let secondary_fabric = sofaData.sofa_secondary_fabric_ ? sofaData.sofa_secondary_fabric_.fabric : null
//                         let secondary_fabric_id = sofaData.sofa_secondary_fabric_ ? sofaData.sofa_secondary_fabric_.item_id : null
//                         let secondary_fabric_price = sofaData.sofa_secondary_fabric_ ? sofaData.sofa_secondary_fabric_.sales_price : null
//                         let secondary_fabric_cost = sofaData.total_sofa_secondary_fabric * secondary_fabric_price
//                         let secondary_fabric_qty = sofaData.total_sofa_secondary_fabric
//                         let secondary_fabric_discount = sofaData.sofa_secondary_fabric_discount
//                         let secondary_fabric_discounted_price = (sofaData.sofa_secondary_fabric_discount / 100) * secondary_fabric_cost
//                         let net_secondary_fabric_price = secondary_fabric_cost

//                         let piping_fabric = sofaData.sofa_piping_fabric_ ? sofaData.sofa_piping_fabric_.fabric : null
//                         let piping_fabric_id = sofaData.sofa_piping_fabric_ ? sofaData.sofa_piping_fabric_.item_id : null
//                         let piping_fabric_price = sofaData.sofa_piping_fabric_ ? sofaData.sofa_piping_fabric_.sales_price : null
//                         let piping_fabric_cost = sofaData.total_sofa_piping_fabric * piping_fabric_price
//                         let piping_fabric_qty = sofaData.total_sofa_piping_fabric
//                         let piping_fabric_discount = sofaData.sofa_piping_fabric_discount
//                         let piping_fabric_discounted_price = (sofaData.pouffee_piping_fabric_discount / 100) * piping_fabric_cost
//                         let net_piping_fabric_price = piping_fabric_cost

//                         let number_of_seats = sofaData.seating_capacity
//                         let cost_per_seat = sofaData.cost_per_seat
//                         let total_making_cost = number_of_seats * cost_per_seat
//                         let net_amount = (net_primary_fabric_price + net_secondary_fabric_price + net_piping_fabric_price + quillt_price)

//                         if (primary_fabric) {
//                             const newObject = {
//                                 item_id: sofaData.sofa_primary_fabric_.item_id,
//                                 id: sofaData.sofa_primary_fabric_.item_id + `_${roomInfo.id}_sofa_primary_fabric`,
//                                 mrp: primary_fabric_price,
//                                 qty: primary_fabric_qty,
//                                 discount: primary_fabric_discount,
//                                 type: "sofa_primary_fabric",
//                                 netAmount: net_primary_fabric_price
//                             }
//                             sofa.push(newObject)
//                         }
//                         if (secondary_fabric) {
//                             const newObject = {
//                                 item_id: secondary_fabric_id,
//                                 id: secondary_fabric_id + `_${roomInfo.id}_sofa_secondary_fabric`,
//                                 mrp: secondary_fabric_price,
//                                 qty: secondary_fabric_qty,
//                                 discount: secondary_fabric_discount,
//                                 type: "sofa_secondary_fabric",
//                                 netAmount: net_secondary_fabric_price
//                             }
//                             sofa.push(newObject)

//                         }
//                         if (piping_fabric) {
//                             const newObject = {
//                                 item_id: piping_fabric_id,
//                                 id: piping_fabric_id + `_${roomInfo.id}_sofa_piping_fabric`,
//                                 mrp: piping_fabric_price,
//                                 qty: piping_fabric_qty,
//                                 discount: piping_fabric_discount,
//                                 type: "sofa_piping_fabric",
//                                 netAmount: piping_fabric_cost
//                             }
//                             sofa.push(newObject)
//                         }
//                         if (sofaData.stiching_type) {
//                             const newObject = {
//                                 item_id: "FF-0121737",
//                                 id: "FF-0121737" + `_${roomInfo.id}_sofa_stiching`,
//                                 mrp: total_making_cost,
//                                 qty: number_of_seats,
//                                 discount: 0,
//                                 type: "sofa_stiching",
//                                 netAmount: total_making_cost
//                             }
//                             sofa.push(newObject)
//                         }
//                     }
//                     if (sofaData && sofaData.wallpanel_required == "Yes") {
//                         const total_area = sofaData.wallpanel_area
//                         const primary_fabric = sofaData.wallpanel_primary_fabric_.fabric
//                         const primary_fabric_price = sofaData.wallpanel_primary_fabric_.sales_price
//                         const primary_fabric_cost = sofaData.wallpanel_primary_fabric_quantity * primary_fabric_price
//                         const primary_fabric_qty = sofaData.wallpanel_primary_fabric_quantity
//                         const primary_fabric_discount = sofaData.wallpanel_primary_fabric_discount
//                         const primary_fabric_discounted_price = (sofaData.wallpanel_primary_fabric_discount / 100) * primary_fabric_cost
//                         const net_primary_fabric_price = primary_fabric_cost

//                         const secondary_fabric = sofaData.wallpanel_secondary_fabric_ ? sofaData.wallpanel_secondary_fabric_.fabric : null
//                         const secondary_fabric_price = sofaData.wallpanel_secondary_fabric_ ? sofaData.wallpanel_secondary_fabric_.sales_price : null
//                         const secondary_fabric_cost = sofaData.wallpanel_secondary_fabric_quantity * secondary_fabric_price
//                         const secondary_fabric_qty = sofaData.wallpanel_secondary_fabric_quantity
//                         const secondary_fabric_discount = sofaData.wallpanel_secondary_fabric_discount
//                         const secondary_fabric_discounted_price = (sofaData.wallpanel_secondary_fabric_discount / 100) * secondary_fabric_cost
//                         const net_secondary_fabric_price = secondary_fabric_cost - secondary_fabric_discounted_price

//                         const making_cost_sqmt = sofaData.making_cost_wallpanel
//                         const total_making_cost = sofaData.making_cost_wallpanel * total_area
//                         const net_amount = net_primary_fabric_price + net_secondary_fabric_price + total_making_cost + quillt_price

//                         if (primary_fabric) {
//                             const newObject = {
//                                 item_id: sofaData.wallpanel_primary_fabric_.item_id,
//                                 id: sofaData.wallpanel_primary_fabric_.item_id + `_${roomInfo.id}_wallpanel_primary_fabric`,
//                                 mrp: primary_fabric_price,
//                                 qty: primary_fabric_qty,
//                                 discount: primary_fabric_discount,
//                                 type: "wallpanel_primary_fabric",
//                                 netAmount: net_primary_fabric_price
//                             }
//                             sofa.push(newObject)
//                         }
//                         if (secondary_fabric) {
//                             const newObject = {
//                                 item_id: sofaData.wallpanel_secondary_fabric_.item_id,
//                                 id: sofaData.wallpanel_secondary_fabric_.item_id + `_${roomInfo.id}_wallpanelsecondary_fabric`,
//                                 mrp: secondary_fabric_price,
//                                 qty: secondary_fabric_qty,
//                                 discount: secondary_fabric_discount,
//                                 type: "wallpanelsecondary_fabric",
//                                 netAmount: net_secondary_fabric_price
//                             }
//                             sofa.push(newObject)

//                         }
//                         if (sofaData.stiching_type) {
//                             const newObject = {
//                                 item_id: "FF-0121739",
//                                 id: "FF-0121739" + `_${roomInfo.id}_wallpanel_stiching`,
//                                 mrp: sofaData.making_cost_wallpanel,
//                                 qty: total_area,
//                                 discount: 0,
//                                 type: "wallpanel_stiching",
//                                 netAmount: total_making_cost
//                             }
//                             sofa.push(newObject)
//                         }
//                         // wallpanel.push(obj)
//                     }
//                     if (sofaData && sofaData.bedback_required == "Yes") {
//                         const total_area = sofaData.bedback_area
//                         const primary_fabric = sofaData.bedback_primary_fabric_.fabric
//                         const primary_fabric_price = sofaData.bedback_primary_fabric_.sales_price
//                         const primary_fabric_id = sofaData.bedback_primary_fabric_.item_id
//                         const primary_fabric_cost = sofaData.bedback_primary_fabric_quantity * primary_fabric_price
//                         const primary_fabric_qty = sofaData.bedback_primary_fabric_quantity
//                         const primary_fabric_discount = sofaData.primary_bedback_fabric_discount
//                         const primary_fabric_discounted_price = (sofaData.primary_bedback_fabric_discount / 100) * primary_fabric_cost
//                         const net_primary_fabric_price = primary_fabric_cost

//                         const secondary_fabric = sofaData.bedback_secondary_fabric_ ? sofaData.bedback_secondary_fabric_.fabric : null
//                         const secondary_fabric_id = sofaData.bedback_secondary_fabric_ ? sofaData.bedback_secondary_fabric_.item_id : null
//                         const secondary_fabric_price = sofaData.bedback_secondary_fabric_ ? sofaData.bedback_secondary_fabric_.sales_price : null
//                         const secondary_fabric_cost = sofaData.bedback_secondary_fabric_quantity * secondary_fabric_price
//                         const secondary_fabric_qty = sofaData.bedback_secondary_fabric_quantity
//                         const secondary_fabric_discount = sofaData.primary_bedback_fabric_discount
//                         const secondary_fabric_discounted_price = (sofaData.primary_bedback_fabric_discount / 100) * secondary_fabric_cost
//                         const net_secondary_fabric_price = secondary_fabric_cost - secondary_fabric_discounted_price

//                         const making_cost_sqmt = sofaData.making_cost_bedback
//                         const total_making_cost = sofaData.making_cost_bedback * total_area
//                         const net_amount = net_primary_fabric_price + net_secondary_fabric_price + total_making_cost + quillt_price

//                         if (primary_fabric) {
//                             const newObject = {
//                                 item_id: primary_fabric_id,
//                                 id: primary_fabric_id + `_${roomInfo.id}_bedback_primary_fabric`,
//                                 mrp: primary_fabric_price,
//                                 qty: primary_fabric_qty,
//                                 discount: primary_fabric_discount,
//                                 type: "bedback_primary_fabric",
//                                 netAmount: net_primary_fabric_price
//                             }
//                             sofa.push(newObject)
//                         }
//                         if (secondary_fabric) {
//                             const newObject = {
//                                 item_id: secondary_fabric_id,
//                                 id: secondary_fabric_id + `_${roomInfo.id}_bedback_secondary_fabric`,
//                                 mrp: secondary_fabric_price,
//                                 qty: secondary_fabric_qty,
//                                 discount: secondary_fabric_discount,
//                                 type: "bedback_secondary_fabric",
//                                 netAmount: net_secondary_fabric_price
//                             }
//                             sofa.push(newObject)

//                         }
//                         if (sofaData.stiching_type) {
//                             const newObject = {
//                                 item_id: "FF-0121739",
//                                 id: 'FF-0121739' + `_${roomInfo.id}_bedback_stiching`,
//                                 mrp: making_cost_sqmt,
//                                 qty: total_area,
//                                 discount: 0,
//                                 type: "bedback_stiching",
//                                 netAmount: total_making_cost
//                             }
//                             sofa.push(newObject)
//                         }

//                     }
//                     if (sofaData && sofaData.pouffee_required == "Yes") {
//                         const primary_fabric = sofaData.pouffee_primary_fabric_.fabric
//                         const primary_fabric_id = sofaData.pouffee_primary_fabric_.item_id
//                         const primary_fabric_price = sofaData.pouffee_primary_fabric_.sales_price
//                         const primary_fabric_cost = sofaData.total_pouffee_primary_fabric * primary_fabric_price
//                         const primary_fabric_qty = sofaData.total_pouffee_primary_fabric
//                         const primary_fabric_discount = sofaData.pouffee_primary_fabric_discount
//                         const primary_fabric_discounted_price = (sofaData.pouffee_primary_fabric_discount / 100) * primary_fabric_cost
//                         const net_primary_fabric_price = primary_fabric_cost

//                         const secondary_fabric = sofaData.pouffee_secondary_fabric_ ? sofaData.pouffee_secondary_fabric_.fabric : null
//                         const secondary_fabric_id = sofaData.pouffee_secondary_fabric_ ? sofaData.pouffee_secondary_fabric_.item_id : null
//                         const secondary_fabric_price = sofaData.pouffee_secondary_fabric_ ? sofaData.pouffee_secondary_fabric_.sales_price : null
//                         const secondary_fabric_cost = sofaData.total_pouffee_secondary_fabric * secondary_fabric_price
//                         const secondary_fabric_qty = sofaData.total_pouffee_secondary_fabric
//                         const secondary_fabric_discount = sofaData.pouffee_secondary_fabric_discount
//                         const secondary_fabric_discounted_price = (sofaData.pouffee_secondary_fabric_discount / 100) * secondary_fabric_cost
//                         const net_secondary_fabric_price = secondary_fabric_cost

//                         const piping_fabric = sofaData.pouffee_piping_fabric_ ? sofaData.pouffee_piping_fabric_.fabric : null
//                         const piping_fabric_id = sofaData.pouffee_piping_fabric_ ? sofaData.pouffee_piping_fabric_.item_id : null
//                         const piping_fabric_price = sofaData.pouffee_piping_fabric_ ? sofaData.pouffee_piping_fabric_.sales_price : null
//                         const piping_fabric_cost = sofaData.total_pouffee_piping_fabric * secondary_fabric_price
//                         const piping_fabric_qty = sofaData.total_pouffee_piping_fabric
//                         const piping_fabric_discount = sofaData.pouffee_piping_fabric_discount
//                         const piping_fabric_discounted_price = (sofaData.pouffee_piping_fabric_discount / 100) * secondary_fabric_cost
//                         const net_piping_fabric_price = piping_fabric_cost

//                         const number_of_pouffee = sofaData.number_of_pouffee
//                         const cost_per_pouffee = sofaData.cost_per_pouffee
//                         const total_making_cost = number_of_pouffee * cost_per_pouffee
                      
//                         const net_amount = (net_primary_fabric_price + net_secondary_fabric_price + net_piping_fabric_price + quillt_price)

//                         if (primary_fabric) {
//                             const newObject = {
//                                 item_id: primary_fabric_id,
//                                 id: primary_fabric_id + `_${roomInfo.id}_pouffee_primary_fabric`,
//                                 mrp: primary_fabric_price,
//                                 qty: primary_fabric_qty,
//                                 discount: primary_fabric_discount,
//                                 type: "pouffee_primary_fabric",
//                                 netAmount: net_primary_fabric_price
//                             }
//                             pouffee.push(newObject)
//                         }
//                         if (secondary_fabric) {
//                             const newObject = {
//                                 item_id: secondary_fabric_id,
//                                 id: secondary_fabric_id + `_${roomInfo.id}_pouffee_secondary_fabric`,
//                                 mrp: piping_fabric_price,
//                                 qty: secondary_fabric_qty,
//                                 discount: secondary_fabric_discount,
//                                 type: "pouffee_secondary_fabric",
//                                 netAmount: net_secondary_fabric_price
//                             }
//                             pouffee.push(newObject)

//                         }
//                         if (piping_fabric) {
//                             const newObject = {
//                                 item_id: piping_fabric_id,
//                                 id: piping_fabric_id + `_${roomInfo.id}_pouffee_piping_fabric`,
//                                 mrp: piping_fabric_price,
//                                 qty: piping_fabric_qty,
//                                 discount: piping_fabric_discount,
//                                 type: "pouffee_piping_fabric",
//                                 netAmount: net_piping_fabric_price
//                             }
//                             pouffee.push(newObject)
//                         }

//                         if (sofaData.stiching_type) {
//                             const newObject = {
//                                 item_id: sofaData.stiching_type,
//                                 id: sofaData.stiching_type + `_${roomInfo.id}_pouffee_stiching`,
//                                 mrp: cost_per_pouffee,
//                                 qty: number_of_pouffee,
//                                 discount: 0,
//                                 type: "pouffee_stiching",
//                                 netAmount: total_making_cost
//                             }
//                             pouffee.push(newObject)
//                         }
//                     }
//                     if (sofaData && sofaData.cushion_required == "Yes") {
//                         let item_price = sofaData.cost_per_cushion;
                                            
//                         const primary_fabric = sofaData.cushion_primary_fabric_.fabric
//                         const primary_fabric_id = sofaData.cushion_primary_fabric_.item_id
//                         const primary_fabric_price = sofaData.cushion_primary_fabric_.sales_price
//                         const primary_fabric_cost = sofaData.total_cushion_primary_fabric_required * primary_fabric_price
//                         const primary_fabric_qty = sofaData.total_cushion_primary_fabric_required
//                         const primary_fabric_discount = sofaData.cushion_primary_fabric_discount
//                         const primary_fabric_discounted_price = (sofaData.cushion_primary_fabric_discount / 100) * primary_fabric_cost
//                         const net_primary_fabric_price = primary_fabric_cost 

//                         const secondary_fabric = sofaData.cushion_secondary_fabric_?sofaData.cushion_secondary_fabric_.fabric:null
//                         const secondary_fabric_id = sofaData.cushion_secondary_fabric_?sofaData.cushion_secondary_fabric_.item_id:null
//                         const secondary_fabric_price = sofaData.cushion_secondary_fabric_ ? sofaData.cushion_secondary_fabric_.price : null
//                         const secondary_fabric_cost = sofaData.total_cushion_secondary_fabric_required * secondary_fabric_price
//                         const secondary_fabric_qty = sofaData.total_cushion_secondary_fabric_required 
//                         const secondary_fabric_discount = sofaData.cushion_secondary_fabric_discount 
//                         const secondary_fabric_discounted_price = (sofaData.cushion_secondary_fabric_discount / 100)*secondary_fabric_cost
//                         const net_secondary_fabric_price = sofaData.cushion_secondary_fabric_total_cost?sofaData.cushion_secondary_fabric_total_cost : 0 - secondary_fabric_discounted_price
                       
//                         const piping_fabric = sofaData.cushion_piping_fabric_ ? sofaData.cushion_piping_fabric_.fabric : null
//                         const piping_fabric_id = sofaData.cushion_piping_fabric_ ? sofaData.cushion_piping_fabric_.item_id : null
//                         const piping_fabric_price = sofaData.cushion_piping_fabric_ ? sofaData.cushion_piping_fabric_.price : null
//                         const piping_fabric_cost = sofaData.total_cushion_piping_fabric_required * piping_fabric_price
//                         const piping_fabric_qty = sofaData.total_cushion_piping_fabric_required
//                         const piping_fabric_discount = sofaData.cushion_piping_fabric_discount
//                         const piping_fabric_discounted_price = (sofaData.cushion_piping_fabric_discount / 100) * piping_fabric_cost
//                         const net_piping_fabric_price = piping_fabric_cost

//                         const concelPrice = sofaData.cushion_concel_zip_required == "Yes" ? 500 : 0

//                         const number_of_cushion = sofaData.number_of_cushion
//                         const cost_per_cushion = item_price
//                         const total_making_cost = number_of_cushion * cost_per_cushion
//                         const net_amount = (net_primary_fabric_price + net_secondary_fabric_price + net_piping_fabric_price + concelPrice)

//                         if (primary_fabric) {
//                             const newObject = {
//                                 item_id: primary_fabric_id,
//                                 id: primary_fabric_id + `_${roomInfo.id}_cushion_primary_fabric`,
//                                 mrp: primary_fabric_price,
//                                 qty: primary_fabric_qty,
//                                 discount: primary_fabric_discount,
//                                 type: "cushion_primary_fabric",
//                                 netAmount: net_primary_fabric_price
//                             }
//                             pouffee.push(newObject)
//                         }
//                         if (secondary_fabric) {
//                             const newObject = {
//                                 item_id: secondary_fabric_id,
//                                 id: secondary_fabric_id + `_${roomInfo.id}_cushion_secondary_fabric`,
//                                 mrp: piping_fabric_price,
//                                 qty: secondary_fabric_qty,
//                                 discount: secondary_fabric_discount,
//                                 type: "cushion_secondary_fabric",
//                                 netAmount: net_secondary_fabric_price
//                             }
//                             pouffee.push(newObject)

//                         }
//                         if (piping_fabric) {
//                             const newObject = {
//                                 item_id: piping_fabric_id,
//                                 id: piping_fabric_id + `_${roomInfo.id}_cushion_piping_fabric`,
//                                 mrp: piping_fabric_price,
//                                 qty: piping_fabric_qty,
//                                 discount: piping_fabric_discount,
//                                 type: "cushion_piping_fabric",
//                                 netAmount: net_piping_fabric_price
//                             }
//                             pouffee.push(newObject)
//                         }

//                         if (sofaData.stiching_type) {
//                             const item_id = sofaData.stiching_type == "Cushion Stitching (16*16)" ? "FF-0099311" :
//                                             sofaData.stiching_type == "Cushion Stitching (12*12)" ? "FF-0099310" :
//                                             sofaData.stiching_type == "Cushion Stitching (18*18)" ? "FF-0099312" :
//                                             sofaData.stiching_type == "Cushion Stitching (24*24)" ? "FF-0099313" : "FF-0121729";
                                            
                            
//                             const newObject = {
//                                 item_id: item_id,
//                                 id: sofaData.stiching_type + `_${roomInfo.id}_cushion_stiching`,
//                                 mrp: cost_per_cushion,
//                                 qty: number_of_cushion,
//                                 discount: 0,
//                                 type: "cushion_stiching",
//                                 netAmount: total_making_cost
//                             }
//                             pouffee.push(newObject)
//                         }
//                     }
//                 }
//             }
//             if (roomInfo.selectedWallpaper && roomInfo.selectedWallpaper.length > 0) {
                
//                 let totalWalls = roomInfo.selectedWallpaper.length
                
//                 const wall_information = [];
//                 const wallpaper = [];
//                 const mural = [];
                
//                 for (let i = 0; i < roomInfo.selectedWallpaper.length; i++) {
//                     const wall = roomInfo.selectedWallpaper[i]; 
//                     const wallpaper = await CurtainFabric.findOne({ where: { id: wall.wallpaperId } })

//                     if( wall.selectedwallpaper.wallpaper_required == "Yes" && wallpaper){
//                         // wallpaperData = JSON.parse(wall.totalMeasurement)
//                         if(wall.type == "wallpaper"){
                            
//                             let windowInSQMT = 0;
                              
//                             if(wall.wallpaperareas && wall.wallpaperareas.length > 0){
//                                 for (let j = 0; j < wall.wallpaperareas.length; j++) {
                                  
//                                     const wallpaperareas = wall.wallpaperareas[j]
//                                     for(item of wallpaperareas.windowData ){
//                                       const window_width = parseInt(item.window_width);
//                                       const window_length = parseInt(item.window_height);
                                       
//                                       windowInSQMT = windowInSQMT + ((window_width * window_length) /10000)
//                                     }
//                                 }
//                             }
                            
//                             let wallpaperData = {};
//                             const wallpaper = await CurtainFabric.findOne({where: {id: wall.wallpaperId}})
    
//                             let areaInSQMT = (parseInt(wall.wallLength) / 100) * (parseInt(wall.wallWidth) / 100)
//                             // let windowInSQMT = (parseInt(window_length) / 100) * (parseInt(window_width) / 100);
                            
//                             areaInSQMT = areaInSQMT + windowInSQMT
                            
//                             let perRollInstallationCost = wall.rate_type == 'normal_rate' ? 857 : 1108;
//                             const rollWidth = wall.rollWidth / 100;
//                             const rollLength = wall.rollLength/100;
                            
//                             const totalAreaCoverByRoll = rollLength * rollWidth;
//                             const totalAreaCoverByRoll_wastage = wall.wallpaper_wastage ? ((wall.wallpaper_wastage * areaInSQMT ) / 100 ) : 0 ;
                            
//                             areaInSQMT = areaInSQMT + totalAreaCoverByRoll_wastage
//                             const actutalAreaCoverByRoll =  areaInSQMT
                            
//                             // console.log(actutalAreaCoverByRoll,"------------", totalAreaCoverByRoll_wastage)
//                             const totalRollRequired =  Math.ceil(actutalAreaCoverByRoll / totalAreaCoverByRoll)
                            
//                             let totalInstallationCost = perRollInstallationCost * Math.ceil(totalRollRequired)
//                             let isPremiered = wall.premier_required == "Yes" ? 2000 : 0 ;
//                             let totalMeasurementCost = (wallpaper.sales_price * totalRollRequired)
    
//                             wallpaperData.areaInSQMT = areaInSQMT
//                             wallpaperData.totalAreaCoverByRoll = totalAreaCoverByRoll
//                             wallpaperData.actutalAreaCoverByRoll = actutalAreaCoverByRoll
//                             wallpaperData.totalRollRequired = totalRollRequired
//                             wallpaperData.totalAreaCoverByRoll_wastage = totalAreaCoverByRoll_wastage
//                             wallpaperData.perRollInstallationCost = perRollInstallationCost;
//                             wallpaperData.totalInstallationCost = totalInstallationCost;
//                             wallpaperData.totalMeasurementCost = totalMeasurementCost;
//                             wallpaperData.primer_price = isPremiered;
                            
//                             const discount = wall.wallpaper_discount ? wall.wallpaper_discount : 0
//                             const discountedAmount = (discount / 100) * wallpaperData.totalMeasurementCost
//                             const netAmount = wallpaperData.totalMeasurementCost
//                             const info = {
//                                 item_id: wall.curtainfabric.item_id,
//                                 id: wall.curtainfabric.item_id + `_${roomInfo.id}_wallpaper`,
//                                 type: "wallpaper",
//                                 discount,
//                                 mrp: wall.curtainfabric.sales_price,
//                                 qty: wallpaperData.totalRollRequired,
//                                 netAmount
//                             }
//                             const stiching = {
//                                 item_id: "FF-0121745",
//                                 id: "FF-0121745" + `_${wall.id}_Wallcover`,
//                                 type: "Wallcover Laying Charge (vinyl )",
//                                 discount: 0,
//                                 mrp: perRollInstallationCost,
//                                 qty: wallpaperData.totalRollRequired,
//                                 netAmount: (totalInstallationCost).toFixed(2),
//                             }

//                             Wallpaper.push(info)
//                             Wallpaper.push(stiching)
//                         }else{
//                             let wallpaperData = {};
                           
//                             // let totalAreaInSQFT = (totalWallLength / 100 * totalWallWidth / 100) * 10.7639
//                             let totalAreaInSQFT = (wall.wallLength / 100 * wall.wallWidth / 100) 
//                             let per_sqft_installation_cost = 269 ;
//                             let totalInstallationCost = per_sqft_installation_cost * totalAreaInSQFT
            
//                             let isPremiered = wall.premier_required == "Yes" ? 2000 : 0;
                            
//                             let totalCost = (wallpaper.sales_price * totalAreaInSQFT)
            
//                             let totalMeasurementCost = totalCost
            
//                             wallpaperData.totalArea = totalAreaInSQFT;
//                             wallpaperData.per_sqft_installation_cost = per_sqft_installation_cost;
//                             wallpaperData.totalInstallationCost = totalInstallationCost;
//                             wallpaperData.primer_price = isPremiered;
//                             wallpaperData.totalWallpaperCost = totalCost
//                             wallpaperData.totalMeasurementCost = totalMeasurementCost;
                            
//                             const discount = wall.wallpaper_discount ? wall.wallpaper_discount : 0

//                             const info = {
//                                 item_id: wall.curtainfabric.item_id,
//                                 id: wall.curtainfabric.item_id + `_${roomInfo.id}_mural`,
//                                 type: "mural",
//                                 discount,
//                                 totalInstallationCost:  wallpaperData.primer_price + wallpaperData.totalInstallationCost,
//                                 mrp: wall.curtainfabric.sales_price,
//                                 qty: wallpaperData.totalArea,
//                                 netAmount  : wallpaperData.totalWallpaperCost
//                             }
//                             const stiching = {
//                                 item_id: "FF-0121745",
//                                 id: "FF-0121745" + `_${roomInfo.id}_Wallcover`,
//                                 type: "Wallcover Laying Charge (vinyl )",
//                                 discount: 0,
//                                 mrp: wallpaperData.per_sqft_installation_cost,
//                                 qty: wallpaperData.totalArea,
//                                 netAmount: wallpaperData.totalArea * wallpaperData.per_sqft_installation_cost,
//                             }
//                             Wallpaper.push(info)
//                             Wallpaper.push(stiching)
//                         }
//                     }
                    
//                 }
//                 // Wallpaper.push({ totalWalls, wallpaper, mural })
                
                
//                 // let totalWalls = roomInfo.selectedWallpaper.length
//                 // let totalAreas = 0;
//                 // const wallpaper = [];
//                 // const mural = [];
//                 // for (var j = 0; j < roomInfo.selectedWallpaper.length; j++) {
//                 //     const wall = roomInfo.selectedWallpaper[j]
//                 //     totalAreas += wall.wallpaperareas.length

//                 //     let wallpaperData;

//                 //     if (wall.totalMeasurement) {
//                 //         wallpaperData = JSON.parse(wall.totalMeasurement)
//                 //         if (wall.type == "wallpaper") {
//                 //             const discount = wall.wallpaper_discount ? wall.wallpaper_discount : 0
//                 //             const discountedAmount = (discount / 100) * wallpaperData.totalMeasurementCost
//                 //             const netAmount = wallpaperData.totalMeasurementCost - discountedAmount
//                 //             const info = {
//                 //                 item_id: wall.curtainfabric.item_id,
//                 //                 id: wall.curtainfabric.item_id + `_${roomInfo.id}_wallpaper`,
//                 //                 type: "wallpaper",
//                 //                 discount,
//                 //                 mrp: wall.curtainfabric.sales_price,
//                 //                 qty: wallpaperData.totalRollRequired,
//                 //                 netAmount: (parseFloat(wallpaperData.totalRollRequired) * parseFloat(wall.curtainfabric.sales_price)),
//                 //             }
//                 //             const stiching = {
//                 //                 item_id: "FF-0121745",
//                 //                 id: "FF-0121745" + `_${asset.id}_Wallcover`,
//                 //                 type: "Wallcover Laying Charge (vinyl )",
//                 //                 discount: 0,
//                 //                 mrp: "161.87",
//                 //                 qty: wallpaperData.totalRollRequired,
//                 //                 netAmount: 161.87 * wallpaperData.totalRollRequired,
//                 //             }

//                 //             Wallpaper.push(info)
//                 //             Wallpaper.push(stiching)
//                 //         } else {
//                 //             const discount = wall.wallpaper_discount ? wall.wallpaper_discount : 0
//                 //             const discountedAmount = (discount / 100) * wallpaperData.totalMeasurementCost
//                 //             const netAmount = wallpaperData.totalMeasurementCost - discountedAmount
//                 //             const info = {
//                 //                 item_id: wall.curtainfabric.item_id,
//                 //                 id: wall.curtainfabric.item_id + `_${roomInfo.id}_mural`,
//                 //                 type: "mural",
//                 //                 discount,
//                 //                 mrp: wall.curtainfabric.sales_price,
//                 //                 qty: wallpaperData.totalRollRequired,
//                 //                 netAmount: parseFloat(wallpaperData.totalMeasurementCost) + (parseFloat(wallpaperData.totalRollRequired) * parseFloat(wall.curtainfabric.price)),
//                 //             }
//                 //             Wallpaper.push(info)
//                 //         }
//                 //     }
//                 // }

//                 // Wallpaper.push({ totalWalls, totalAreas, wallpaper, mural })
//             }
//             if (roomInfo.selectedFlooring && roomInfo.selectedFlooring.flooring_required == "Yes" && roomInfo.selectedFlooring.flooring) {
//                 const areaItems = {
//                     binding: null,
//                     binding_mrp: null,
//                     binding_id: null,
//                     binding_quantity: 0,
//                     binding_cost: 0,
//                     skirting: null,
//                     skirting_mrp: null,
//                     skirting_id: null,
//                     skirting_quantity: 0,
//                     skirting_cost: 0,
//                     reducer: null,
//                     reducer_mrp: null,
//                     reducer_id: null,
//                     reducer_quantity: 0,
//                     reducer_cost: 0,
//                     t_profile: null,
//                     t_profile_mrp: null,
//                     t_profile_id: null,
//                     t_profile_quantity: 0,
//                     t_profile_cost: 0,
//                     beeding: null,
//                     beeding_mrp: null,
//                     beeding_id: null,
//                     beeding_quantity: 0,
//                     beeding_cost: 0,
//                     // margin: null,
//                     // margin_mrp: null,
//                     // margin_id: null,
//                     // margin_quantity: 0,
//                     // margin_cost: 0
//                 }

//                 const flooringData = roomInfo.selectedFlooring
                
//                 let totalWastageArea = flooringData.wastage ? flooringData.wastage : 0;
//                 let totalFlooring = flooringData.room_total_sqm + ((totalWastageArea * flooringData.room_total_sqm) / 100);
//                 let totalFlooringSQMT = (flooringData.room_total_sqm + ((totalWastageArea * flooringData.room_total_sqm) / 100)).toFixed(2);
//                 let totalFlooringSQFT = totalFlooring * 10.76
                
//                 let flooringInstallationCost = 17.70
//                 let totalFlooringInstallationCost = 0;
                
//                 if(flooringData.type == "flooring"){
//                     flooringInstallationCost = flooringData.flooring_type == "Normal flooring" ? 17.70 : flooringData.flooring_type == "Engineer Wooden" ? 25.96 : 33 ;
//                     totalFlooringInstallationCost = (flooringInstallationCost * totalFlooringSQFT).toFixed(2);
//                 }
//                 if(flooringData.type == "carpet"){
//                     flooringInstallationCost = 160.7
//                     totalFlooringInstallationCost = (flooringInstallationCost * totalFlooringSQMT).toFixed(2);
//                 }
                
//                 const polythenePrice = flooringData.total_polythene_cost;
//                 const FoamPrice = flooringData.total_foam_cost;
//                 const discount = flooringData.discount
                
//                 let totalFlooringCost = flooringInstallationCost * flooringData.room_total_sqm;
              
//                 const curtain = await CurtainFabric.findOne({where: {item_id: flooringData.flooring.item_id}})
//                 const price = curtain.sales_price
                
//                 const gross_amount = flooringData.type== "carpet" ? price * totalFlooringSQMT : price * totalFlooringSQFT;
                
//                 let Areacount = 0

//                 const discountedAmount = gross_amount * (discount / 100)
//                 const netAmount = gross_amount

//                 if (roomInfo.selectedFlooring.type == "flooring") {
//                     for (var j = 0; j < roomInfo.selectedFlooring.areas.length; j++) {
//                         const area = roomInfo.selectedFlooring.areas[j]
//                         if (area.binding) {
//                             areaItems.binding = area.binding.fabric
//                             areaItems.binding_mrp = area.binding.sales_price
//                             areaItems.binding_id = area.binding.item_id
//                             areaItems.binding_discount = area.binding_discount
//                             areaItems.binding_quantity += area.binding_quantity
//                             areaItems.binding_cost += (area.binding.sales_price * area.binding_quantity) - ((area.binding.sales_price * area.binding_quantity) * (area.binding_discount / 100))
//                         }
//                         if (area.skirting) {
//                             areaItems.skirting = area.skirting.fabric
//                             areaItems.skirting_id = area.skirting.item_id
//                             areaItems.skirting_mrp = area.skirting.sales_price
//                             areaItems.skirting_discount = area.skirting_discount
//                             areaItems.skirting_quantity += area.skirting_quantity
//                             areaItems.skirting_cost += (area.skirting.sales_price * area.skirting_quantity) - ((area.skirting.sales_price * area.skirting_quantity) * (area.skirting_discount / 100))
//                         }
//                         if (area.reducer) {
//                             areaItems.reducer = area.reducer.fabric
//                             areaItems.reducer_id = area.reducer.item_id
//                             areaItems.reducer_mrp = area.reducer.sales_price
//                             areaItems.reducer_discount = area.reducer_discount
//                             areaItems.reducer_quantity += area.reducer_quantity
//                             areaItems.reducer_cost += (area.reducer.sales_price * area.reducer_quantity) - ((area.reducer.sales_price * area.reducer_quantity) * (area.reducer_discount / 100))
//                         }
//                         if (area.t_profile) {
//                             areaItems.t_profile = area.t_profile.fabric
//                             areaItems.t_profile_id = area.t_profile.item_id
//                             areaItems.t_profile_mrp = area.t_profile.sales_price
//                             areaItems.t_profile_discount = area.t_profile_discount
//                             areaItems.t_profile_quantity += area.t_profile_quantity
//                             areaItems.t_profile_cost += (area.t_profile.sales_price * area.t_profile_quantity) - ((area.t_profile.sales_price * area.t_profile_quantity) * (area.t_profile_discount / 100))
//                         }
//                         if (area.beeding) {
//                             areaItems.beeding = area.beeding.fabric
//                             areaItems.beeding_id = area.beeding.item_id
//                             areaItems.beeding_mrp = area.beeding.sales_price
//                             areaItems.beeding_discount = area.beeding_discount
//                             areaItems.beeding_quantity += area.beeding_quantity
//                             areaItems.beeding_cost += (area.beeding.sales_price * area.beeding_quantity) - ((area.beeding.sales_price * area.beeding_quantity) * (area.beeding_discount / 100))
//                         }
//                         // if (area.margin) {
//                         //     areaItems.margin = area.margin.fabric
//                         //     areaItems.margin_id = area.margin.item_id
//                         //     areaItems.margin_mrp = area.margin.price
//                         //     areaItems.margin_discount = area.margin_discount
//                         //     areaItems.margin_quantity += area.margin_quantity
//                         //     areaItems.margin_cost += (area.margin.price * area.margin_quantity) - ((area.beeding.price * area.margin_quantity) * (area.margin_discount / 100))
//                         // }
//                     }
//                 }

//                 flooring.push({
//                     item_id: flooringData.flooring.item_id,
//                     id: flooringData.flooring.item_id + `_${flooringData.id}_${flooringData.type}`,
//                     mrp: price,
//                     type: flooringData.type,
//                     discount,
//                     qty: flooringData.type == "flooring" ? totalFlooringSQFT.toFixed(2) : totalFlooringSQMT,
//                     netAmount: netAmount.toFixed(2)
//                 })
//                 flooring.push({
//                     item_id: "FF-0121742",
//                     id: "FF-0121742" + `_${flooringData.id}_Laying`,
//                     mrp: flooringInstallationCost.toFixed(2),
//                     type: "Wall to Wall Laying Charge",
//                     discount: 0,
//                     qty:flooringData.type == "flooring" ? totalFlooringSQFT.toFixed(2) : totalFlooringSQMT,
//                     netAmount: totalFlooringInstallationCost
//                 })
                
//                 if(areaItems.binding){
//                     flooring.push({
//                         item_id: areaItems.binding_id,
//                         id: areaItems.binding_id + `_${flooringData.id}_binding`,
//                         mrp: areaItems.binding_mrp,
//                         type: areaItems.binding,
//                         discount: 0,
//                         qty: areaItems.binding_quantity,
//                         netAmount: (areaItems.binding_quantity * areaItems.binding_mrp).toFixed(2)
//                     })
//                 }
//                 if(areaItems.skirting){
//                     flooring.push({
//                         item_id: areaItems.skirting_id,
//                         id: areaItems.skirting_id + `_${flooringData.id}_skirting`,
//                         mrp: areaItems.skirting_mrp,
//                         type: areaItems.skirting,
//                         discount: 0,
//                         qty: areaItems.skirting_quantity,
//                         netAmount: (areaItems.skirting_quantity * areaItems.skirting_mrp).toFixed(2)
//                     })
//                 }
//                 if(areaItems.reducer){
//                     flooring.push({
//                         item_id: areaItems.reducer_id,
//                         id: areaItems.reducer_id + `_${flooringData.id}_reducer`,
//                         mrp: areaItems.reducer_mrp,
//                         type: areaItems.reducer,
//                         discount: 0,
//                         qty: areaItems.reducer_quantity,
//                         netAmount: (areaItems.reducer_quantity * areaItems.reducer_mrp).toFixed(2)
//                     })
//                 }
//                 if(areaItems.t_profile){
//                     flooring.push({
//                         item_id: areaItems.t_profile_id,
//                         id: areaItems.t_profile_id + `_${flooringData.id}_t_profile`,
//                         mrp: areaItems.t_profile_mrp,
//                         type: areaItems.t_profile,
//                         discount: 0,
//                         qty: areaItems.t_profile_quantity,
//                         netAmount: (areaItems.t_profile_quantity * areaItems.t_profile_mrp).toFixed(2)
//                     })
//                 }
//                 if(areaItems.beeding){
//                     flooring.push({
//                         item_id: areaItems.beeding_id,
//                         id: areaItems.beeding_id + `_${flooringData.id}_beeding`,
//                         mrp: areaItems.beeding_mrp,
//                         type: areaItems.beeding,
//                         discount: 0,
//                         qty: areaItems.beeding_quantity,
//                         netAmount: (areaItems.beeding_quantity * areaItems.beeding_mrp).toFixed(2)
//                     })
//                 }
//             }

//             for (let j = 0; j < roomInfo.room_assets.length; j++) {
//                 const asset = roomInfo.room_assets[j]
//                 if (asset.selectedBlind) {
//                     if (asset.selectedBlind.blindFabric) {
//                         const price = asset.selectedBlind.blindFabric.sales_price
//                         let lowestWidth = 0
//                         let lowestHeight = 0

//                         if (asset && asset.blind_asset && asset.blind_asset.blind_width_top && asset.blind_asset.blind_width_middle && asset.blind_asset.blind_width_bottom) {
//                             lowestWidth = Math.min(asset.blind_asset.blind_width_top, asset.blind_asset.blind_width_middle, asset.blind_asset.blind_width_bottom)
//                         }
//                         if (asset && asset.blind_asset && asset.blind_asset.blind_drop_left && asset.blind_asset.blind_drop_right && asset.blind_asset.blind_drop_middle) {
//                             lowestHeight = Math.min(asset.blind_asset.blind_drop_left, asset.blind_asset.blind_drop_right, asset.blind_asset.blind_drop_middle)
//                         }
//                         const stitchinPrice = (lowestWidth / 100) * (lowestHeight / 100)
//                         const stitching = asset && asset.selectedBlind && asset.selectedBlind.blind_subtype && asset.selectedBlind.blind_subtype.id == 2 ? 812 : 812
//                         const stitchingCost = stitching * stitchinPrice
//                         const fabric1Estimatecost = price * asset.total_blind_fabric_required

//                         const discount = asset.selectedBlind.blind_fabric_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: asset.selectedBlind.blindFabric.item_id,
//                             id: asset.selectedBlind.blindFabric.item_id + `_${asset.id}_blind_fabric`,
//                             mrp: price,
//                             qty: parseFloat(asset.total_blind_fabric_required),
//                             discount,
//                             type: "blind_fabric",
//                             discount: discount,
//                             netAmount: parseFloat(fabric1Estimatecost) 
//                         }
//                         let stiching;
//                         if (asset.selectedBlind.blindTrack) {
//                             stiching = {
//                                 item_id: "FF-0121731",
//                                 id: "FF-0121731" + `_${asset.id}_BlindStitchingTrack`,
//                                 mrp: 812,
//                                 qty: parseFloat(stitchinPrice),
//                                 discount: 0,
//                                 type: "Blind Stitching with Track",
//                                 netAmount: parseFloat(stitchingCost)
//                             }
//                         }
//                         else {
//                             stiching = {
//                                 item_id: "FF-0121732",
//                                 id: "FF-0121732" + `_${asset.id}_BlindwithoutTrack`,
//                                 mrp: 812,
//                                 qty: parseFloat(stitchinPrice),
//                                 discount: 0,
//                                 type: "Blind Stitching without  Track",
//                                 netAmount: parseFloat(stitchingCost)
//                             }
//                         }

//                         if (asset.selectedBlind.blindBorderFabric) {
//                             blind.push({
//                                 item_id: "FF-0121730",
//                                 id: "FF-0121730" + `_${asset.id}_CustomizedDesign`,
//                                 mrp: 812,
//                                 qty: parseFloat(stitchinPrice),
//                                 discount: 0,
//                                 type: "Blinds Stitching -Customized Design",
//                                 netAmount: parseFloat(stitchingCost)
//                             })
//                         }
//                         blind.push(FinalData)
//                         blind.push(stiching)
//                     }

//                     if (asset.selectedBlind.blind_type_search_fabric) {
//                         const price = asset.selectedBlind.blind_type_search_fabric.sales_price
//                         let lowestWidth = 0
//                         let lowestHeight = 0

//                         if (asset && asset.blind_asset && asset.blind_asset.blind_width_top && asset.blind_asset.blind_width_middle && asset.blind_asset.blind_width_bottom) {
//                             lowestWidth = Math.min(asset.blind_asset.blind_width_top, asset.blind_asset.blind_width_middle, asset.blind_asset.blind_width_bottom)
//                         }
//                         if (asset && asset.blind_asset && asset.blind_asset.blind_drop_left && asset.blind_asset.blind_drop_right && asset.blind_asset.blind_drop_middle) {
//                             lowestHeight = Math.min(asset.blind_asset.blind_drop_left, asset.blind_asset.blind_drop_right, asset.blind_asset.blind_drop_middle)
//                         }
//                         const runningSq = (lowestWidth / 100) * (lowestHeight / 100)
//                         const fittingCharges = asset.selectedBlind.isBlindTypeMotorized ? 1500 : 700
//                         const stitchingCost = price * parseFloat((runningSq).toFixed(2))
//                         const fabric1Estimatecost = stitchingCost
//                         const discount = asset.selectedBlind.blind_fabric_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: asset.selectedBlind.blind_type_search_fabric.item_id,
//                             id: asset.selectedBlind.blind_type_search_fabric.item_id + `_${asset.id}_blind_type_search_fabric`,
//                             // unit: "sqM",
//                             mrp: price,
//                             qty: parseFloat((runningSq).toFixed(2)),
//                             discount,
//                             type: "blind_type_search_fabric",
//                             discount: discount,
//                             // discountedAmount,
//                             // tax: fabricTax,
//                             // tax_amount: 0,
//                             netAmount: parseFloat((fabric1Estimatecost).toFixed(2))
//                         }
                       
//                         const stiching = {
//                                 item_id: "FF-0098948",
//                                 id: "FF-0098948" + `_${asset.id}_blind_type_search_fabric_stitching`,
//                                 mrp: fittingCharges,
//                                 qty: 1,
//                                 discount: 0,
//                                 type: "blind_type_search_fabric_stitching",
//                                 netAmount: fittingCharges
//                             }
                       
//                         blind.push(stiching)
//                         blind.push(FinalData)
                        
//                     }

//                     if (asset.selectedBlind.BLINDLINING) {
//                         const price = asset.selectedBlind.BLINDLINING.sales_price
//                         const stitchinPrice = (asset.width / 100) * (asset.height / 100)
//                         const stitchingCost = 958 * stitchinPrice
//                         const fabric1Estimatecost = price * asset.total_blind_fabric_required
//                         const discount = asset.selectedBlind.blind_lining_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: asset.selectedBlind.BLINDLINING.item_id,
//                             id: asset.selectedBlind.BLINDLINING.item_id + `_${asset.id}_blind_lining_fabric`,
//                             // unit: "meter",
//                             // assetId: asset.id,
//                             mrp: price,
//                             qty: parseFloat(asset.total_blind_fabric_required),
//                             discount,
//                             type: "blind_lining_fabric",
//                             discount: discount,
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         blind.push(FinalData)
//                     }

//                     if (asset.selectedBlind.BLINDSHADES && asset.selectedBlind.blind_pelmet_required == "Yes") {
//                         const price = asset.selectedBlind.BLINDSHADES.sales_price
//                         const fabric1Estimatecost = price
//                         const discount = asset.selectedBlind.blind_shades_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const qty = (asset.blind_asset.blind_width_top / 100)
//                         const FinalData = {
//                             item_id: asset.selectedBlind.BLINDSHADES.item_id,
//                             id: asset.selectedBlind.BLINDSHADES.item_id + `_${asset.id}_blind_shades`,
//                             // assetId: asset.id,
//                             // unit: "meter",
//                             mrp: price,
//                             discount,
//                             type: "blind_shades",
//                             qty: qty,
//                             netAmount: (fabric1Estimatecost * qty).toFixed(2)
//                         }
//                         blind.push(FinalData)
//                     }
                    
//                     if (asset.selectedBlind.blindBorderCurtainFabric) {
                       
//                         const price = asset.selectedBlind.blindBorderCurtainFabric.sales_price
//                         let lowestWidth = 0
//                         let lowestHeight = 0

//                         if (asset && asset.blind_asset && asset.blind_asset.blind_width_top && asset.blind_asset.blind_width_middle && asset.blind_asset.blind_width_bottom) {
//                             lowestWidth = Math.min(asset.blind_asset.blind_width_top, asset.blind_asset.blind_width_middle, asset.blind_asset.blind_width_bottom)
//                         }
//                         if (asset && asset.blind_asset && asset.blind_asset.blind_drop_left && asset.blind_asset.blind_drop_right && asset.blind_asset.blind_drop_middle) {
//                             lowestHeight = Math.min(asset.blind_asset.blind_drop_left, asset.blind_asset.blind_drop_right, asset.blind_asset.blind_drop_middle)
//                         }

//                         const stitchingCost = 345 * (lowestWidth / 100) * (lowestHeight / 100)
                    
//                         const fabric1Estimatecost =  price * parseFloat(asset.selectedBlind.border_curtain_length)/100
//                         const discount = asset.selectedBlind.blind_shades_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const FinalData = {
//                             item_id: asset.selectedBlind.blindBorderCurtainFabric.item_id,
//                             id: asset.selectedBlind.blindBorderCurtainFabric.item_id + `_${asset.id}_blind_border_fabric`,
//                             // assetId: asset.id,
//                             // unit: "meter",
//                             mrp: price,
//                             qty: parseFloat(asset.selectedBlind.border_curtain_length)/100,
//                             discount,
//                             type: "blind_border_fabric",
//                             discount: discount,
//                             netAmount: fabric1Estimatecost
//                         }
                       
//                         const stiching = {
//                             item_id: "FF-0121730",
//                             id: "FF-0121730" + `_${asset.id}_blind_border_fabric_stiching`,
//                             // assetId: asset.id,
//                             // unit: "meter",
//                             mrp: 345,
//                             qty: parseFloat(asset.selectedBlind.border_curtain_length)/100,
//                             discount,
//                             type: "blind_border_fabric_stiching",
//                             discount: discount,
//                             netAmount: 345 * parseFloat(asset.selectedBlind.border_curtain_length)/100
//                         }
//                         blind.push(FinalData)
//                         blind.push(stiching)
//                     }

//                     if (asset.selectedBlind.blindTrack && asset.selectedBlind.blind_hardware_required == "Yes") {
//                         const price = asset.selectedBlind.blindTrack.sales_price
//                         if (asset.selectedBlind.blindTrack.calculation == false) {
//                             const items = ["FF-0074628", "FF-0074629", "FF-0074630", "FF-0076439", "FF-0076452", "FF-0077396", "FF-0077397", "FF-0077398", "FF-0077405", "FF-0077406", "FF-0077407", "FF-0077408", "FF-0082830", "FF-0087865", "FF-0090194", "FF-0091235", "FF-0100277", "FF-0106726", "FF-0108258", "FF-0110409", "FF-0110411", "FF-0115631", "FF-0122636", "FF-0122727", "FF-0123051", "FF-0123057", "FF-0123058", "FF-0123059", "FF-0123060", "FF-0123061", "FF-0123062", "FF-0123063", "FF-0123100", "FF-0124499", "FF-0129410", "FF-0132131", "FF-0132751", "FF-0134763", "FF-0135521", "FF-0136649", "FF-0136650", "FF-0136651", "FF-0136652", "FF-0136836", "FF-0145074", "FF-0149667", "FF-0149699", "FF-0155874", "FF-0172502", "FF-0175839", "FF-0175840", "FF-0175841", "FF-0175842", "FF-0175843", "FF-0175844", "FF-0175845", "FF-0175846", "FF-0175847", "FF-0175848", "FF-0175849", "FF-0178150"]
//                             let defaultWidth = 0
//                             let lowestHeight = 0

//                             if (asset && asset.blind_asset && asset.blind_asset.blind_width_top && asset.blind_asset.blind_width_middle && asset.blind_asset.blind_width_bottom) {
//                                 defaultWidth = Math.min(asset.blind_asset.blind_width_top, asset.blind_asset.blind_width_middle, asset.blind_asset.blind_width_bottom)
//                             }
//                             if (asset && asset.blind_asset && asset.blind_asset.blind_drop_left && asset.blind_asset.blind_drop_right && asset.blind_asset.blind_drop_middle) {
//                                 lowestHeight = Math.min(asset.blind_asset.blind_drop_left, asset.blind_asset.blind_drop_right, asset.blind_asset.blind_drop_middle)
//                             }
//                             let runningFeet = parseFloat((defaultWidth) / 30.48).toFixed(2)
//                             if (items.includes(asset.selectedBlind.blindTrack.item_id)) {
//                                 runningFeet = 1
//                             } else {
//                                 runningFeet = runningFeet < 3 ? 3 : runningFeet;
//                             }
                            
//                             const fabric1Estimatecost = price * runningFeet
//                             const discount = asset.selectedBlind.blind_track_discount
//                             const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                             const fittingCharges = asset.selectedBlind.blindTrack_type.id == 1 ?  300 : 1770;
//                             const FinalData = {
//                                 item_id: asset.selectedBlind.blindTrack.item_id,
//                                 id: asset.selectedBlind.blindTrack.item_id + `_${asset.id}_blind_track`,
//                                 mrp: price,
//                                 qty: runningFeet,
//                                 discount,
//                                 discount: discount,
//                                 type: "blind_track",
//                                 netAmount: fabric1Estimatecost.toFixed(2)
//                             }
//                             const stiching = {
//                                 item_id: "FF-0098948",
//                                 id: "FF-0098948" + `_${asset.id}_blind_track_fitting`,
//                                 mrp: fittingCharges,
//                                 qty: 1,
//                                 type: "blind_track_fitting",
//                                 discount: 0,
//                                 netAmount: fittingCharges,
//                             }
//                             blind.push(FinalData)
//                             blind.push(stiching)
//                         }
//                         else {
//                             const fabric1Estimatecost = price
//                             const discount = asset.selectedBlind.blind_track_discount
//                             const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                             const fittingCharges =  asset.selectedBlind.blindTrack_type.id == 1 ?  354 : 1770;
//                             const FinalData = {
//                                 item_id: asset.selectedBlind.blindTrack.item_id,
//                                 id: asset.selectedBlind.blindTrack.item_id + `_${asset.id}_blind_track`,
//                                 // type: "System",
//                                 // assetId: asset.id,
//                                 // unit: "Feet",
//                                 mrp: price,
//                                 qty: Math.round((parseFloat(asset.width) / 100) * 3.2808),
//                                 discount: discount,
//                                 type: "blind_track",
//                                 netAmount: (fabric1Estimatecost)
//                             }
//                             blind.push(FinalData)
//                         }
//                     }

//                     if (asset.selectedBlind.blind_track_remote && asset.selectedBlind.no_of_blind_motor_remote != "") {
//                         const price = asset.selectedBlind.blind_track_remote.sales_price
//                         const fabric1Estimatecost = price * parseInt(asset.selectedBlind.no_of_blind_motor_remote)
//                         const discount = asset.selectedBlind.blind_track_remote_discount
//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                         const fittingCharges = 0
//                         const FinalData = {
//                             item_id: asset.selectedBlind.blind_track_remote.item_id,
//                             id: asset.selectedBlind.blind_track_remote.item_id + `_${asset.id}_blind_track_remote`,
//                             // unit: "Feet",
//                             // assetId: asset.id,
//                             mrp: price,
//                             qty: parseInt(asset.selectedBlind.no_of_blind_motor_remote),
//                             discount,
//                             type: "blind_track_remote",
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         blind.push(FinalData)
//                     }

//                     if (asset.selectedBlind.blind_track_motor) {
//                         const price = asset.selectedBlind.blind_track_motor.sales_price
//                         if (asset.selectedBlind.blind_track_motor.calculation == false) {

//                             const fabric1Estimatecost = price
//                             const discount = asset.selectedBlind.blind_track_motor_discount

//                             const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0

//                             const FinalData = {
//                                 item_id: asset.selectedBlind.blind_track_motor.item_id,
//                                 id: asset.selectedBlind.blind_track_motor.item_id + `_${asset.id}_blind_track_motor`,
//                                 // type: "System",
//                                 // assetId: asset.id,
//                                 // unit: "Feet",
//                                 mrp: price,
//                                 // tax_amount: fabric1Estimatecost * (hardwareTax / 100),
//                                 discount,
//                                 type: "blind_track_motor",
//                                 qty: 1,
//                                 netAmount: (fabric1Estimatecost)
//                             }
//                             blind.push(FinalData)
//                         }
//                         else {
//                             const fabric1Estimatecost = price
//                             const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                             const fittingCharges = 0
//                             const FinalData = {
//                                 item_id: asset.selectedBlind.blind_track_motor.item_id,
//                                 id: asset.selectedBlind.blind_track_motor.item_id + `_${asset.id}_blind_track_motor`,
//                                 // type: "System",
//                                 // assetId: asset.id,
//                                 // unit: "Feet",
//                                 mrp: price,
//                                 discount: asset.selectedBlind.blind_track_motor_discount,
//                                 type: "blind_track_motor",
//                                 qty: 1,
//                                 netAmount: (fabric1Estimatecost)
//                             }
//                             blind.push(FinalData)
//                         }
//                     }

//                     if (asset.selectedBlind.blind_extra_bracket) {

//                         const price = asset.selectedBlind.blindExtraBracket.sales_price

//                         const fabric1Estimatecost = price * (parseInt(asset.selectedBlind.blind_extra_bracket_support_quantity))

//                         const discount = asset.selectedBlind.blind_extra_bracket_discount

//                         const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0

//                         const FinalData = {
//                             item_id: asset.selectedBlind.blindExtraBracket.item_id,
//                             id: asset.selectedBlind.blindExtraBracket.item_id + `_${asset.id}_blind_extra_bracket`,
//                             // assetId: asset.id,
//                             // unit: "Feet",
//                             mrp: price,
//                             qty: parseInt(asset.selectedBlind.blind_extra_bracket_support_quantity),
//                             discount,
//                             type: "blind_extra_bracket",
//                             netAmount: (fabric1Estimatecost)
//                         }
//                         blind.push(FinalData)
//                     }
//                 }
//             }

//             delete roomInfo.selectedcurtain
//             delete roomInfo.selectedRod
//             delete roomInfo.selectedsheer
//             delete roomInfo.selectedTrack
//             delete roomInfo.material_images

//             if (roomInfo.extra_hardware_required == "Yes") {
                
//                 if(roomInfo.curtainfabric){
//                     const price = roomInfo.curtainfabric.sales_price
    
//                     const fabric1Estimatecost = price * roomInfo.noOfExtraHardware
//                     const tax_amount = fabric1Estimatecost * (hardwareTax / 100)
//                     const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                     // const netAmount = (fabric1Estimatecost - discountedAmount) + (fabric1Estimatecost * (hardwareTax / 100)) + 1500
//                     const netAmount = (fabric1Estimatecost - discountedAmount) + (fabric1Estimatecost * (hardwareTax / 100))
//                     const FinalData = {
//                         item_id: roomInfo.curtainfabric.item_id,
//                         id: roomInfo.curtainfabric.item_id + `_${roomInfo.id}_extra_hardware`,
//                         mrp: price,
//                         qty: roomInfo.noOfExtraHardware,
//                         type: "extra_hardware",
//                         netAmount: netAmount
//                     }
//                     extra_hardware.push(FinalData)
                    
//                 }
//                 if(roomInfo.tie_back_required == "Yes" && roomInfo.tieback){
//                     const price = roomInfo.tieback.price

//                     const fabric1Estimatecost = price * roomInfo.tie_back_quantity
//                     const tax_amount = fabric1Estimatecost * (hardwareTax / 100)
//                     let discount = 0
//                     const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                     const netAmount = (fabric1Estimatecost - discountedAmount) + (fabric1Estimatecost * (hardwareTax / 100))
                   
//                     const FinalData = {
//                         item_id: roomInfo.tieback.item_id,
//                         id: roomInfo.tieback.item_id + `_${roomInfo.id}_extra_hardware`,
//                         mrp: price,
//                         qty: roomInfo.tie_back_quantity,
//                         type: "tie_back",
//                         netAmount: netAmount
//                     }
//                     extra_hardware.push(FinalData)
//                 }
//                 if(roomInfo.l_bracket_required ==  "Yes" && roomInfo.lbracket){
//                     const price = roomInfo.lbracket.price

//                     const fabric1Estimatecost = price * roomInfo.l_bracket_quantity
//                     const tax_amount = fabric1Estimatecost * (hardwareTax / 100)
//                     let discount = 0
//                     const discountedAmount = discount != 0 ? fabric1Estimatecost / discount : 0
//                     const netAmount = (fabric1Estimatecost - discountedAmount) + (fabric1Estimatecost * (hardwareTax / 100))
                    
//                     const FinalData = {
//                         item_id: roomInfo.lbracket.item_id,
//                         id: roomInfo.lbracket.item_id + `_${roomInfo.id}_extra_hardware`,
//                         mrp: price,
//                         qty: roomInfo.l_bracket_quantity,
//                         type: "l_bracket",
//                         netAmount: netAmount
//                     }
//                     extra_hardware.push(FinalData)
//                 }
//             }
//         }
//         let serviceAmount = [{
//                 item_id: "FF-0067361",
//                 id: "FF-0067361" + `_${response.data.data.id}_Services`,
//                 mrp: response.data.data.service_amount,
//                 qty: 1,
//                 type: "Services",
//                 discount: 0,
//                 netAmount: response.data.data.service_amount
//             }]

//         let cartage = [{
//                 item_id: "FF-0077158",
//                 id: "FF-0077158" + `_${response.data.data.id}_FRIEGHT`,
//                 mrp: response.data.data.cartage,
//                 qty: 1,
//                 type: "FRIEGHT/CARTAGE OUTWARD-18%",
//                 discount: 0,
//                 netAmount: response.data.data.cartage
//             }]
//         const obj = {
//             enquiryId: response.data.data.enquiryId,
//             mode_of_deliveries: response.data.data.mode_of_deliveries,
//             payment_terms: response.data.data.payment_terms,
//             tailor_vendors: response.data.data.tailor_vendors,
//             transports: response.data.data.transports,
//             comment: response.data.data.comment,
//             tailor_vendors_id: response.data.data.tailor_vendors_id,
//             warehouse_id: response.data.data.warehouse_id,
//             warehouse_name: response.data.data.warehouse_name,
//             service_remark: response.data.data.service_remark,
//             customer_ref: response.data.data.customer_ref,
//             pending_enquiry: response.data.data.status == "fresh" || response.data.data.status == "inprogess" ? true : false,
//             deliveryAddress: {
//                 contactPerson: response.data.data.contactPerson,
//                 contactNumber: response.data.data.contactNumber,
//                 street: response.data.data.landmark ? response.data.data.landmark : response.data.data.street,
//                 address: response.data.data.landmark ? response.data.data.landmark : response.data.data.address,
//                 city: response.data.data.city,
//                 state: response.data.data.state,
//                 pincode: response.data.data.pincode,
//                 latitude: response.data.data.latitude,
//                 longitude: response.data.data.longitude,
//             },
//             billingAddress: {
//                 contactPerson: response.data.data.customer.addresses[0].contactPerson,
//                 contactNumber: response.data.data.customer.addresses[0].contactNumber,
//                 street: response.data.data.customer.addresses[0].landmark ? response.data.data.customer.addresses[0].landmark : response.data.data.customer.addresses[0].street,
//                 address: response.data.data.customer.addresses[0].landmark ? response.data.data.customer.addresses[0].landmark : response.data.data.customer.addresses[0].address,
//                 city: response.data.data.customer.addresses[0].city,
//                 state: response.data.data.customer.addresses[0].state,
//                 pincode: response.data.data.customer.addresses[0].pincode,
//                 latitude: response.data.data.customer.addresses[0].latitude,
//                 longitude: response.data.data.customer.addresses[0].longitude,
//             },
//             sales: {
//                 name: response.data.data.user.firstName,
//                 userId: response.data.data.user.userId,
//                 email: response.data.data.user.email
//             },
//             customer: {
//                 name: String(response.data.data.customer.firstName).trim() + " " + String(response.data.data.customer.lastName).trim(),
//                 userId: response.data.data.customer.ACCOUNTNUM,
//                 email: response.data.data.customer.primary_email,
//                 phone: response.data.data.customer.primary_phone,
//             },
//             curtain, rod, sheer, track, blind, extra_hardware, sofa, wallpanel, pouffee, bedback, flooring, Wallpaper, serviceAmount, cartage
//         }


//         obj.outlet = response.data.data.outlet
//         obj.outlet.address = response.data.data.outletAddress
//         return res.status(200).json(obj)
//     } catch (e) {
//         next(e)
//     }
// }










 // if (event === 'payment_link.paid') {
            //     const paymentLink = req.body.payload.payment_link.entity;
            //     const payment = await PaymentHistory.findOne({ where: { paymentId: paymentLink.id } });

            //     await payment.update({
            //         status: paymentLink.status,
            //     })
                
            //     const newPayment = await Payment.create({
            //         data: req.body.payload.payment,
            //         payment_id: req.body.payload.payment.entity.id,
            //         paid_amount: (req.body.payload.payment.entity.amount / 100),
            //         method: req.body.payload.payment.entity.method,
            //         created_at: req.body.payload.payment.entity.created_at,
            //         status: req.body.payload.payment.entity.status,
            //         paymentId: payment.id
            //     })

            //     //SEND PAYEMNT DATA IN AX------
            //     if (newPayment.ax_status == false) {
            //         const paymentPayload = {
            //             "data": [
            //                 {
            //                     "enquiryId": payment.dataValues.enquiryId,
            //                     "customerId": payment.dataValues.customerId,
            //                     "amount": newPayment.dataValues.paid_amount,
            //                     "createdAt": newPayment.dataValues.createdAt,
            //                     "paymentId": newPayment.dataValues.payment_id
            //                 }
            //             ]
            //         }


            //         console.log(paymentPayload, "=====")
            //         const postResponse = await createAmount(paymentPayload);
                   
            //         // const postResponse = 1;
            //         if (paymentPayload && postResponse.data == 1) {
            //             await newPayment.update({ ax_status: true })
            //         }
            //     }
                
            //     if (payment && payment.enquiryId && payment.payment_type == "final_payment") {
            //         console.log(payment.enquiryId, "---------------------->>>>>>>>>>>>>>>>>>>..")
            //         const enquiry = await Enquiry.findOne({where: { enquiryId: payment.enquiryId }});
            //         if(enquiry){
                        
            //             const customer = await Customer.findOne({ where: { id: enquiry.customerId } });
            //             const order = await Order.findOne({where: {enquiryId: enquiry.id}});
                        
            //             if(order){
            //                 const message_data = await Message.findOne({ where: { enquiryId: enquiry.id, message: 'book_installation_time_slot' } })
            //                 if (!message_data) {
                        
            //                     await Message.create({
            //                         message: "book_installation_time_slot",
            //                         enquiryId: order.enquiryId
            //                     })
                                
            //                     const message = book_installation_time_slot(customer.firstName + ' ' + customer.lastName, order.orderId ,enquiry.id)
            //                     whatsappMessage(message, customer.primary_phone)
            //                 }
            //             }
                        
            //         }
                    
            //     }

            // } else if (event === 'payment_link.partially_paid') {
            //     const paymentLink = req.body.payload.payment_link.entity;
                
            //     const payment = await PaymentHistory.findOne({ where: { paymentId: paymentLink.id } });
            //     if(payment){
                    
            //         await payment.update({
            //             status: paymentLink.status
            //         })
                
            //         const newPayment = await Payment.create({
            //             data: req.body.payload.payment,
            //             payment_id: req.body.payload.payment.entity.id,
            //             paid_amount: (req.body.payload.payment.entity.amount / 100),
            //             method: req.body.payload.payment.entity.method,
            //             created_at: req.body.payload.payment.entity.created_at,
            //             status: req.body.payload.payment.entity.status,
            //             paymentId: payment.id
            //         })
                    
            //         //SEND PAYEMNT DATA IN AX------
            //         if (newPayment.ax_status == false) {
            //             const paymentPayload = {
            //                 "data": [
            //                     {
            //                         "enquiryId": payment.dataValues.enquiryId,
            //                         "customerId": payment.dataValues.customerId,
            //                         "amount": newPayment.dataValues.paid_amount,
            //                         "createdAt": newPayment.dataValues.createdAt,
            //                         "paymentId": newPayment.dataValues.payment_id
            //                     }
            //                 ]
            //             }
    
                        
            //             console.log(paymentPayload, "=====")
            //             const postResponse = await createAmount(paymentPayload);
              
            //             // const postResponse = 1;
            //             if (postResponse && postResponse.data == 1) {
            //                 await newPayment.update({ ax_status: true })
            //             }
            //         }
            //     }

                
            // } else if (event === 'payment.failed') {
            //     console.log("payment failed", req.body.payload.payment.entity.id)
            // }
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
// exports.get_unassign_user = async (req, res, next) => {
//     try {
//         const categories = req.body.categories;
        
//         const store = await User.findByPk(req.body.storeId);
//         dataNotFound(store, 400, "store not found")
        
//         let usedCategory = "";
        
//         if (categories.every(category => fabricCategory.includes(category))) {
//             usedCategory = "fabricCategory";
//         }
//         if (categories.every(category => wallpaperCategory.includes(category))) {
//             usedCategory = "wallpaperCategory"
//         }
//         if (categories.every(category => upholsteryCategory.includes(category))) {
//             usedCategory = "upholsteryCategory"
//         }
//         if (categories.every(category => flooringCategory.includes(category))) {
//             usedCategory = "flooringCategory"
//         }
        
//         const installerIds = []
        
//         const upholsteryInstaller = await InstallerTasks.findAll({
//                     where: { installerId: { [Op.in]: [71, 139, 76,75] } },
//                     order: [['createdAt', 'DESC']],
//                     limit: 1
//         });
        
//         const fabricInstaller1 = await InstallerTasks.findAll({
//                     where: { installerId: { [Op.in]: [98, 106, 105] } },
//                     order: [['createdAt', 'DESC']],
//                     limit: 1
//         });
        
//         const fabricInstaller2 = await InstallerTasks.findAll({
//                     where: { installerId: { [Op.in]: [99, 159, 118, 109] } },
//                     order: [['createdAt', 'DESC']],
//                     limit: 1
//         });
      
//         const getInstallerIdByStoreAndCategory = (storeId, usedCategory) => {
//           const storeConfig = {
//             22: {
//               fabricCategory: () => getFabricInstaller_1(fabricInstaller1),
//               wallpaperCategory: [73], // Montu
//               upholsteryCategory: () => getUpholsteryInstaller(upholsteryInstaller),
//               flooringCategory: [159], // Triloki
//             },
//             42: {
//               fabricCategory: () => getFabricInstaller_2(fabricInstaller2),
//               wallpaperCategory: [73], // Montu
//               upholsteryCategory: () => getUpholsteryInstaller(upholsteryInstaller),
//               flooringCategory: [159], // Triloki
//             },
//             81: {
//               fabricCategory: () => getFabricInstaller_1(fabricInstaller1),
//               wallpaperCategory: [73], // Montu
//               upholsteryCategory: () => getUpholsteryInstaller(upholsteryInstaller),
//               flooringCategory: [159], // Triloki
//             },
//             79: {
//               fabricCategory: () => getFabricInstaller_2(fabricInstaller2),
//               wallpaperCategory: [73], // Montu
//               upholsteryCategory: () => getUpholsteryInstaller(upholsteryInstaller),
//               flooringCategory: [159], // Triloki
//             },
//             80: {
//               fabricCategory: () => getFabricInstaller_2(fabricInstaller2),
//               wallpaperCategory: [73], // Montu
//               upholsteryCategory: () => getUpholsteryInstaller(upholsteryInstaller),
//               flooringCategory: [159], // Triloki
//             },
//             82: {
//               fabricCategory: [146], // Kamlesh
//               wallpaperCategory: [146], // Darban
//               upholsteryCategory: [147], // Sahid
//               flooringCategory: [146], // Kamlesh
//             },
//           };
    
//           const storeData = storeConfig[storeId];
//           if (storeData && storeData[usedCategory]) {
//             const installer = storeData[usedCategory];
//             return typeof installer === "function" ? installer() : installer;
//           }
//           return [];
//         };
    
//         const getFabricInstaller_1 = (installerList) => {
//           if (installerList.length > 0) {
//             const installerId = installerList[0].installerId;
//             switch (installerId) {
//               case 98:
//                 return [106]; // Govind
//               case 106:
//                 return [105]; // Gulzar
//             //   case 105:
//             //     return []; //Rajesh
//               default:
//                 return [98]; // Naresh
//             }
//           }
//           return [98]; // Naresh
//         };
        
//         const getFabricInstaller_2 = (installerList) => {
//           if (installerList.length > 0) {
//             const installerId = installerList[0].installerId;
//             switch (installerId) {
//               case 99:
//                 return [159]; // triloki
//               case 159:
//                 return [118]; // brijesh
//               case 118:
//                 return [109]; // kanahiya
//               default:
//                 return [99]; //dilip
//             }
//           }
//           return [99]; // dilip
//         };
    
//         const getUpholsteryInstaller = (installerList) => {
//           if (installerList.length > 0) {
//             const installerId = installerList[0].installerId;
//             switch (installerId) {
//               case 71:
//                 return [139]; // Rahis
//               case 139:
//                 return [76]; // Zaqui
//               case 76:
//                 return [75]; // Alam
//               default:
//                 return [71]; // Arif
//             }
//           }
//           return [71]; // Arif
//         };
    
//         installerIds.push(...getInstallerIdByStoreAndCategory(store.id, usedCategory));
        
//         if(upholsteryInstaller.length == 0){
//             installerIds.push(71)
//         }
        
//         const data = await User.findAll({
//             where: { type: 'installer', id: { [Op.in]: installerIds } }
//         });

//         return res.status(200).json({
//             message: "Schedule Fetched Successfully",
//             data: data,
//             status: true
//         });
//     }
//     catch (err) {
//         next(err)
//     }

// }
