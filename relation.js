const { User, Address, Gathering, Customer, Material, Room, Enquiry_Schedule,Message, CurtainFabric, SheerFabric,PaymentHistory, CeilingType, WallType, Book, Brand, Enquiry, Liniing, SelectedCurtain, SelectedSheer, ScrewSize, BeltType, BorderType, SelectedMaterial, RodType, CurtainStyle, Motorized_track, CurtainPattern, EnquiryStatus, OutletUser, RoomAsset, Schedule, Ladder, CurtainOperation, Media, Notification, OutletAddress, Quality_Check, Quality_Check_Remarks, QualityCheckType, Order, OrderItem, Vendor, SelectedTrack, SelectedRod, MaterialImage, PelmetType, Track, MotorOperation, BlindStyle, BlindFittingType, BlindWindowType, BlindBorderType, SelectedBlind, BlindTrackType, BlindMotorType, BlindMotorTrackType, ParkingSpace, BlindAsset, BlindSubType, BlindShades, Blind_Lining, InstallerTasks, InstallerSchedule, WarehouseOrder, Warehouse, CustomerOrder, OrderProof, SelectedSofa, SofaType, Flooring, Area, SelectedFlooring, UserQualityDetail, SelectedWallpaper, Wall, WallpaperArea ,Complaint, ComplaintTask, Feedback, Identification, Wcr_Report, Order_Bill,Blind_Lining_Fabric, LiningFabric, Client_Signature, Payment} = require("./model");

exports.relation = () => {

    Room.hasMany(MaterialImage);
    MaterialImage.belongsTo(Room);

    User.hasMany(Customer, { foreignKey: "salesId", as: 'sales' });
    Customer.belongsTo(User, { foreignKey: "salesId", as: 'sales' });

    Customer.hasMany(Address, { foreignKey: "customerId" });
    Address.belongsTo(Customer, { foreignKey: "customerId" });
    

    Enquiry.hasMany(Room, { foreignKey: "enquiryId", onDelete: "cascade" });
    Room.belongsTo(Enquiry, { foreignKey: "enquiryId", onDelete: "cascade" });

    Material.hasMany(Brand, { foreignKey: "materialId" });
    Brand.belongsTo(Material, { foreignKey: "materialId" });

    Brand.hasMany(Book, { foreignKey: "brandId" });
    Book.belongsTo(Brand, { foreignKey: "brandId" });

    Room.hasMany(RoomAsset, { foreignKey: "roomId", onDelete: "cascade" });
    RoomAsset.belongsTo(Room, { foreignKey: "roomId", onDelete: "cascade" });

    CeilingType.hasMany(RoomAsset);
    RoomAsset.belongsTo(CeilingType);

    WallType.hasMany(RoomAsset);
    RoomAsset.belongsTo(WallType);


    Ladder.hasMany(RoomAsset);
    RoomAsset.belongsTo(Ladder);

    User.hasMany(Enquiry, { foreignKey: 'salesId' });
    Enquiry.belongsTo(User, { foreignKey: 'salesId' });

    Customer.hasMany(Enquiry, { foreignKey: 'customerId' });
    Enquiry.belongsTo(Customer, { foreignKey: 'customerId' });

    Book.hasMany(CurtainFabric);
    CurtainFabric.belongsTo(Book);

    Book.hasMany(SheerFabric);
    SheerFabric.belongsTo(Book);

    Book.hasMany(BlindShades);
    BlindShades.belongsTo(Book);

    /**
     * 
     * Curtain Fabric Relation
     */


    SelectedCurtain.belongsTo(Room, { onDelete: "cascade" });
    Room.hasOne(SelectedCurtain, { onDelete: "cascade" })

    SelectedCurtain.belongsTo(Enquiry, { onDelete: "cascade" });
    Enquiry.hasOne(SelectedCurtain, { onDelete: "cascade" })

    CurtainFabric.hasOne(Room, { foreignKey: "extra_hardware" });
    Room.belongsTo(CurtainFabric, { foreignKey: "extra_hardware" });
    
    CurtainFabric.hasOne(Room, { foreignKey: "tie_back", as: "tieback" });
    Room.belongsTo(CurtainFabric, { foreignKey: "tie_back", as: "tieback" });
    
    CurtainFabric.hasOne(Room, { foreignKey: "l_bracket", as: "lbracket" });
    Room.belongsTo(CurtainFabric, { foreignKey: "l_bracket", as: "lbracket" });

    CurtainFabric.hasOne(SelectedCurtain, { foreignKey: "mainFabric1", as: "fabric1" });
    SelectedCurtain.belongsTo(CurtainFabric, { foreignKey: "mainFabric1", as: "fabric1" });

    CurtainFabric.hasOne(SelectedCurtain, { foreignKey: "mockFabric", as: "mock_fabric" });
    SelectedCurtain.belongsTo(CurtainFabric, { foreignKey: "mockFabric", as: "mock_fabric" });

    Gathering.hasOne(SelectedCurtain, { foreignKey: "fabric_gathering", as: "fabricGathering" });
    SelectedCurtain.belongsTo(Gathering, { foreignKey: "fabric_gathering", as: "fabricGathering" });

    Gathering.hasOne(SelectedCurtain, { foreignKey: "mock_fabric_gathering", as: "mockFabric_gathering" });
    SelectedCurtain.belongsTo(Gathering, { foreignKey: "mock_fabric_gathering", as: "mockFabric_gathering" });

    CurtainStyle.hasOne(SelectedCurtain, { foreignKey: "curtain_style", as: "curtain_fabric_style" });
    SelectedCurtain.belongsTo(CurtainStyle, { foreignKey: "curtain_style", as: "curtain_fabric_style" });

    CurtainStyle.hasOne(SelectedCurtain, { foreignKey: "mock_curtain_style", as: "mock_style" });
    SelectedCurtain.belongsTo(CurtainStyle, { foreignKey: "mock_curtain_style", as: "mock_style" });

    CurtainFabric.hasOne(SelectedCurtain, { foreignKey: "mainFabric2", as: "fabric2" });
    SelectedCurtain.belongsTo(CurtainFabric, { foreignKey: "mainFabric2", as: "fabric2" });

    Liniing.hasOne(SelectedCurtain, { foreignKey: "LiningType" });
    SelectedCurtain.belongsTo(Liniing, { foreignKey: "LiningType" });

    CurtainFabric.hasOne(SelectedCurtain, { foreignKey: "LiningFabric", as: "Lining_Fabric" });
    SelectedCurtain.belongsTo(CurtainFabric, { foreignKey: "LiningFabric", as: "Lining_Fabric" });
    
    CurtainFabric.hasOne(SelectedCurtain, { foreignKey: "pelmet_track", as: "pelmettrack" });
    SelectedCurtain.belongsTo(CurtainFabric, { foreignKey: "pelmet_track", as: "pelmettrack" });

    Liniing.hasMany(LiningFabric, { foreignKey: "liningType" })
    LiningFabric.belongsTo(Liniing, { foreignKey: "liningType" })

    Blind_Lining.hasMany(Blind_Lining_Fabric, { foreignKey: "liningType" })
    Blind_Lining_Fabric.belongsTo(Blind_Lining, { foreignKey: "liningType" })

    CurtainFabric.hasOne(SelectedCurtain, { foreignKey: "beltFabric", as: "belt" });
    SelectedCurtain.belongsTo(CurtainFabric, { foreignKey: "beltFabric", as: "belt" });

    CurtainFabric.hasOne(SelectedCurtain, { foreignKey: "beltBorderFabricId", as: "beltBorder" });
    SelectedCurtain.belongsTo(CurtainFabric, { foreignKey: "beltBorderFabricId", as: "beltBorder" });

    CurtainFabric.hasOne(SelectedCurtain, { foreignKey: "beltPipingFabricId", as: "beltPiping" });
    SelectedCurtain.belongsTo(CurtainFabric, { foreignKey: "beltPipingFabricId", as: "beltPiping" });

    BeltType.hasOne(SelectedCurtain, { foreignKey: "beltType" });
    SelectedCurtain.belongsTo(BeltType, { foreignKey: "beltType" });

    CurtainFabric.hasOne(SelectedCurtain, { foreignKey: "primaryBorderFabric", as: "p_border" });
    SelectedCurtain.belongsTo(CurtainFabric, { foreignKey: "primaryBorderFabric", as: "p_border" });

    CurtainFabric.hasOne(SelectedCurtain, { foreignKey: "secondaryBorderFabric", as: "s_border" });
    SelectedCurtain.belongsTo(CurtainFabric, { foreignKey: "secondaryBorderFabric", as: "s_border" });

    BorderType.hasOne(SelectedCurtain, { foreignKey: "borderType" });
    SelectedCurtain.belongsTo(BorderType, { foreignKey: "borderType" });

    CurtainFabric.hasOne(SelectedCurtain, { foreignKey: "pelmetFabric", as: "pelmet" });
    SelectedCurtain.belongsTo(CurtainFabric, { foreignKey: "pelmetFabric", as: "pelmet" });

    PelmetType.hasOne(SelectedCurtain, { foreignKey: "pelmetTypeId" });
    SelectedCurtain.belongsTo(PelmetType, { foreignKey: "pelmetTypeId" });

    CurtainPattern.hasOne(SelectedCurtain, { foreignKey: "pattern" });
    SelectedCurtain.belongsTo(CurtainPattern, { foreignKey: "pattern" });

    /**
     * 
    * SHEER FABRIC RELATION
     */

    SelectedSheer.belongsTo(Enquiry, { onDelete: "cascade" });
    Enquiry.hasOne(SelectedSheer, { onDelete: "cascade" })

    SelectedSheer.belongsTo(Room, { onDelete: "cascade" });
    Room.hasOne(SelectedSheer, { onDelete: "cascade" })

    Gathering.hasOne(SelectedSheer, { foreignKey: "sheerGathering", as: "GatheredSheer" });
    SelectedSheer.belongsTo(Gathering, { foreignKey: "sheerGathering", as: "GatheredSheer" });

    SelectedSheer.belongsTo(CurtainFabric, { foreignKey: "sheerFabricId" });
    CurtainFabric.hasMany(SelectedSheer, { foreignKey: "sheerFabricId" });

    SelectedSheer.belongsTo(CurtainStyle, { foreignKey: "SheerStyleId", as: "sheerStyle" });
    CurtainStyle.hasMany(SelectedSheer, { foreignKey: "SheerStyleId", as: "sheerStyle" });

    /*
    * ROD AND TRACK RELATION
    */
    Motorized_track.hasOne(SelectedTrack, { foreignKey: "primary_track_function", as: "primaryTrack" });
    SelectedTrack.belongsTo(Motorized_track, { foreignKey: "primary_track_function", as: "primaryTrack" })

    MotorOperation.hasOne(SelectedTrack, { foreignKey: "primary_motor_operation", as: "primaryMotorOperation" });
    SelectedTrack.belongsTo(MotorOperation, { foreignKey: "primary_motor_operation", as: "primaryMotorOperation" })

    Track.hasOne(SelectedTrack, { foreignKey: "primary_track_type", as: "primaryTrackType" });
    SelectedTrack.belongsTo(Track, { foreignKey: "primary_track_type", as: "primaryTrackType" })

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "primary_track", as: "primary_track_data" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "primary_track", as: "primary_track_data" })

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "primary_track_motor", as: "primaryTrackMotor" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "primary_track_motor", as: "primaryTrackMotor" });

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "primary_track_remote", as: "primaryTrackRemote" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "primary_track_remote", as: "primaryTrackRemote" });

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "primary_overlapper", as: "primaryOverlapper" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "primary_overlapper", as: "primaryOverlapper" })

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "primary_track_curatin_stick", as: "primaryTrackCuratinStick" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "primary_track_curatin_stick", as: "primaryTrackCuratinStick" })

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "primary_extra_track_bracket", as: "primaryExtraTrackBracket" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "primary_extra_track_bracket", as: "primaryExtraTrackBracket" })




    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "secondary_track", as: "secondary_track_data" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "secondary_track", as: "secondary_track_data" });

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "secondary_track_motor", as: "secondaryTrackMotor" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "secondary_track_motor", as: "secondaryTrackMotor" });

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "secondary_track_remote", as: "secondaryTrackRemote" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "secondary_track_remote", as: "secondaryTrackRemote" });

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "secondary_overlapper", as: "secondaryOverlapper" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "secondary_overlapper", as: "secondaryOverlapper" })

    MotorOperation.hasOne(SelectedTrack, { foreignKey: "secondary_motor_operation", as: "secondaryMotorOperation" });
    SelectedTrack.belongsTo(MotorOperation, { foreignKey: "secondary_motor_operation", as: "secondaryMotorOperation" })

    Track.hasOne(SelectedTrack, { foreignKey: "secondary_track_type", as: "secondaryTrackType" });
    SelectedTrack.belongsTo(Track, { foreignKey: "secondary_track_type", as: "secondaryTrackType" })

    Motorized_track.hasOne(SelectedTrack, { foreignKey: "secondary_track_function", as: "secondaryTrack" });
    SelectedTrack.belongsTo(Motorized_track, { foreignKey: "secondary_track_function", as: "secondaryTrack" });

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "secondary_track_curatin_stick", as: "secondaryTrackCuratinStick" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "secondary_track_curatin_stick", as: "secondaryTrackCuratinStick" })

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "secondary_extra_track_bracket", as: "secondaryExtraTrackBracket" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "secondary_extra_track_bracket", as: "secondaryExtraTrackBracket" })


    Track.hasOne(SelectedTrack, { foreignKey: "mock_track_type", as: "mockTrackType" });
    SelectedTrack.belongsTo(Track, { foreignKey: "mock_track_type", as: "mockTrackType" })

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "mock_overlapper", as: "mockOverlapper" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "mock_overlapper", as: "mockOverlapper" })

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "mock_track", as: "mock_track_data" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "mock_track", as: "mock_track_data" });

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "mock_track_motor", as: "mockTrackMotor" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "mock_track_motor", as: "mockTrackMotor" });

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "mock_track_remote", as: "mockTrackRemote" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "mock_track_remote", as: "mockTrackRemote" });

    MotorOperation.hasOne(SelectedTrack, { foreignKey: "mock_motor_operation", as: "mockMotorOperation" });
    SelectedTrack.belongsTo(MotorOperation, { foreignKey: "mock_motor_operation", as: "mockMotorOperation" })

    Motorized_track.hasOne(SelectedTrack, { foreignKey: "mock_track_function", as: "mockTrack" });
    SelectedTrack.belongsTo(Motorized_track, { foreignKey: "mock_track_function", as: "mockTrack" });

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "mock_track_curatin_stick", as: "mockTrackCuratinStick" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "mock_track_curatin_stick", as: "mockTrackCuratinStick" })

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "mock_extra_track_bracket", as: "mockExtraTrackBracket" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "mock_extra_track_bracket", as: "mockExtraTrackBracket" })

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "lBracketId", as: "Lbracket" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "lBracketId", as: "Lbracket" });

    ScrewSize.hasOne(SelectedTrack, { foreignKey: "track_screw_size" });
    SelectedTrack.belongsTo(ScrewSize, { foreignKey: "track_screw_size" });


    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "primary_track_tieknobId", as: "primary_track_tieknob" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "primary_track_tieknobId", as: "primary_track_tieknob" });

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "secondary_track_tieknobId", as: "secondary_track_tieknob" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "secondary_track_tieknobId", as: "secondary_track_tieknob" });

    CurtainFabric.hasOne(SelectedTrack, { foreignKey: "mock_track_tieknobId", as: "mock_track_tieknob" });
    SelectedTrack.belongsTo(CurtainFabric, { foreignKey: "mock_track_tieknobId", as: "mock_track_tieknob" });

    Room.hasOne(SelectedTrack, { foreignKey: "roomId" });
    SelectedTrack.belongsTo(Room, { foreignKey: "roomId" });

    // ScrewSize.hasOne(SelectedCurtain , {foreignKey : "track_screw_size"});
    // SelectedCurtain.belongsTo(ScrewSize , {foreignKey : "track_screw_size"});  

    RodType.hasMany(SelectedRod, { foreignKey: "primary_rod_type", as: "primaryRod" });
    SelectedRod.belongsTo(RodType, { foreignKey: "primary_rod_type", as: "primaryRod" });

    CurtainFabric.hasMany(SelectedRod, { foreignKey: "primary_rod", as: "primary_rod_data" });
    SelectedRod.belongsTo(CurtainFabric, { foreignKey: "primary_rod", as: "primary_rod_data" });

    RodType.hasMany(SelectedRod, { foreignKey: "secondary_rod_type", as: "secondaryRod" });
    SelectedRod.belongsTo(RodType, { foreignKey: "secondary_rod_type", as: "secondaryRod" });

    CurtainFabric.hasMany(SelectedRod, { foreignKey: "secondary_rod", as: "secondary_rod_data" });
    SelectedRod.belongsTo(CurtainFabric, { foreignKey: "secondary_rod", as: "secondary_rod_data" });

    CurtainFabric.hasOne(SelectedRod, { foreignKey: "rod_tieknobId", as: "rodTieKnob" });
    SelectedRod.belongsTo(CurtainFabric, { foreignKey: "rod_tieknobId", as: "rodTieKnob" });

    CurtainFabric.hasOne(SelectedRod, { foreignKey: "end_cap", as: "endCap" });
    SelectedRod.belongsTo(CurtainFabric, { foreignKey: "end_cap", as: "endCap" });

    CurtainFabric.hasOne(SelectedRod, { foreignKey: "extra_bracket", as: "extraBracket" });
    SelectedRod.belongsTo(CurtainFabric, { foreignKey: "extra_bracket", as: "extraBracket" });

    CurtainFabric.hasOne(SelectedRod, { foreignKey: "extra_bracket_support", as: "extraBracketSupport" });
    SelectedRod.belongsTo(CurtainFabric, { foreignKey: "extra_bracket_support", as: "extraBracketSupport" });

    CurtainFabric.hasOne(SelectedRod, { foreignKey: "end_cap_wall_support", as: "endCapWallSupport" });
    SelectedRod.belongsTo(CurtainFabric, { foreignKey: "end_cap_wall_support", as: "endCapWallSupport" });

    CurtainFabric.hasOne(SelectedRod, { foreignKey: "extra_ring", as: "extraRing" });
    SelectedRod.belongsTo(CurtainFabric, { foreignKey: "extra_ring", as: "extraRing" });

    CurtainFabric.hasOne(SelectedRod, { foreignKey: "curatin_stick", as: "curtainStick" });
    SelectedRod.belongsTo(CurtainFabric, { foreignKey: "curatin_stick", as: "curtainStick" });

    CurtainFabric.hasOne(SelectedRod, { foreignKey: "finialId", as: "finial" });
    SelectedRod.belongsTo(CurtainFabric, { foreignKey: "finialId", as: "finial" });

    Room.hasOne(SelectedRod, { foreignKey: "roomId" });
    SelectedRod.belongsTo(Room, { foreignKey: "roomId" });

    CurtainOperation.hasOne(RoomAsset, { foreignKey: "curtainOperationId" });
    RoomAsset.belongsTo(CurtainOperation, { foreignKey: "curtainOperationId" });
    /*
    *   Material Relation
    */

    SelectedMaterial.belongsTo(Material);
    Material.hasMany(SelectedMaterial)

    SelectedMaterial.belongsTo(Enquiry);
    Enquiry.hasMany(SelectedMaterial)

    SelectedMaterial.belongsTo(Room);
    Room.hasMany(SelectedMaterial)

    Enquiry.hasMany(EnquiryStatus);
    EnquiryStatus.belongsTo(Enquiry);

    User.hasOne(OutletAddress, { foreignKey: "userId", as: "outletAddress" });
    OutletAddress.belongsTo(User, { foreignKey: "userId", as: "outletAddress" });

    User.hasMany(OutletUser, { as: "sales_person", foreignKey: "salesPersonId" });
    OutletUser.belongsTo(User, { as: "sales_person", foreignKey: "salesPersonId" });

    User.hasMany(OutletUser, { as: "outlet", foreignKey: "outletId" });
    OutletUser.belongsTo(User, { as: "outlet", foreignKey: "outletId" });

    User.hasMany(Enquiry_Schedule, { foreignKey: "schedulePersonId" });
    Enquiry_Schedule.belongsTo(User, { foreignKey: "schedulePersonId" });

    Enquiry.hasMany(Enquiry_Schedule, { foreignKey: "enquiryId" });
    Enquiry_Schedule.belongsTo(Enquiry, { foreignKey: "enquiryId" });

    Schedule.hasMany(Enquiry_Schedule, { foreignKey: "ScheduleId" });
    Enquiry_Schedule.belongsTo(Schedule, { foreignKey: "ScheduleId" });

    User.hasMany(Media, { foreignKey: "filledBy" });
    Media.belongsTo(User, { foreignKey: "filledBy" });

    Media.belongsTo(RoomAsset, { foreignKey: "assetId" });
    RoomAsset.hasMany(Media, { foreignKey: "assetId" });

    Enquiry.hasMany(Notification, { foreignKey: "enquiryId" });
    Notification.belongsTo(Enquiry, { foreignKey: "enquiryId" });

    User.hasMany(Notification, { foreignKey: "adminId", as: "admin" });
    Notification.belongsTo(User, { foreignKey: "adminId", as: "admin" });

    User.hasMany(Notification, { foreignKey: "measurerId", as: "measurers" })
    Notification.belongsTo(User, { foreignKey: "measurerId", as: "measurers" });
    
    User.hasMany(Notification, { foreignKey: "installerId", as: "installers" });
    Notification.belongsTo(User, { foreignKey: "installerId", as: "installers" });
    
    User.hasMany(Notification, { foreignKey: "salesId", as: "salespersons" });
    Notification.belongsTo(User, { foreignKey: "salesId", as: "salespersons" });
    
    User.hasMany(Notification, { foreignKey: "qcId", as: "quality_checkers" });
    Notification.belongsTo(User, { foreignKey: "qcId", as: "quality_checkers" });



    /*
    *   QualityCheck Relation
    */

    Enquiry.hasMany(Quality_Check_Remarks, { foreignKey: "enquiryId" });
    Quality_Check_Remarks.belongsTo(Enquiry, { foreignKey: "enquiryId" });

    OrderItem.hasMany(Quality_Check_Remarks);
    Quality_Check_Remarks.belongsTo(OrderItem);

    Enquiry.hasMany(UserQualityDetail, { foreignKey: "enquiryId" });
    UserQualityDetail.belongsTo(Enquiry, { foreignKey: "enquiryId" });

    User.hasMany(UserQualityDetail, { foreignKey: "userId" });
    UserQualityDetail.belongsTo(User, { foreignKey: "userId" });

    QualityCheckType.hasMany(Quality_Check_Remarks, { foreignKey: "QCId" })
    Quality_Check_Remarks.belongsTo(QualityCheckType, { foreignKey: "QCId" })

    QualityCheckType.hasMany(Quality_Check, { foreignKey: "quality_check_type" })
    Quality_Check.belongsTo(QualityCheckType, { foreignKey: "quality_check_type" })

    Material.hasMany(Quality_Check, { foreignKey: "product_type" })
    Quality_Check.belongsTo(Material, { foreignKey: "product_type" })

    Quality_Check.hasMany(UserQualityDetail, { foreignKey: "descriptionId" })
    UserQualityDetail.belongsTo(Quality_Check, { foreignKey: "descriptionId" })

    OrderItem.hasMany(UserQualityDetail);
    UserQualityDetail.belongsTo(OrderItem);

    QualityCheckType.hasMany(UserQualityDetail, { foreignKey: "QCId" });
    UserQualityDetail.belongsTo(QualityCheckType, { foreignKey: "QCId" });




    /*
    *   Order Relation
    */
    User.hasOne(Order, { foreignKey: "userId" });
    Order.belongsTo(User, { foreignKey: "userId" });

    Enquiry.hasMany(Order, { foreignKey: "enquiryId" });
    Order.belongsTo(Enquiry, { foreignKey: "enquiryId" });

    Customer.hasMany(Order, { foreignKey: "customerId" });
    Order.belongsTo(Customer, { foreignKey: "customerId" });

    Order.hasMany(OrderItem, { foreignKey: "orderId" });
    OrderItem.belongsTo(Order, { foreignKey: "orderId" });
    
    Material.hasMany(OrderItem, { foreignKey: "materialId" });
    OrderItem.belongsTo(Material, { foreignKey: "materialId" });

    Room.hasMany(OrderItem, { foreignKey: "roomId" });
    OrderItem.belongsTo(Room, { foreignKey: "roomId" });


    Vendor.hasMany(User, { foreignKey: "vendorId" });
    User.belongsTo(Vendor, { foreignKey: "vendorId" })



    BlindBorderType.hasOne(SelectedBlind, { foreignKey: "blind_border_type" })
    SelectedBlind.belongsTo(BlindBorderType, { foreignKey: "blind_border_type" })

    CurtainFabric.hasOne(SelectedBlind, { foreignKey: "blind_shades", as: "BLINDSHADES" })
    SelectedBlind.belongsTo(CurtainFabric, { foreignKey: "blind_shades", as: "BLINDSHADES" })

    CurtainFabric.hasOne(SelectedBlind, { foreignKey: "blind_extra_bracket", as: "blindExtraBracket" })
    SelectedBlind.belongsTo(CurtainFabric, { foreignKey: "blind_extra_bracket", as: "blindExtraBracket" })

    CurtainFabric.hasOne(SelectedBlind, { foreignKey: "blindTrackRemote", as: "blind_track_remote" })
    SelectedBlind.belongsTo(CurtainFabric, { foreignKey: "blindTrackRemote", as: "blind_track_remote" })

    CurtainFabric.hasOne(SelectedBlind, { foreignKey: "blindTrackMotor", as: "blind_track_motor" })
    SelectedBlind.belongsTo(CurtainFabric, { foreignKey: "blindTrackMotor", as: "blind_track_motor" })

    BlindTrackType.hasOne(SelectedBlind, { foreignKey: "blind_track" })
    SelectedBlind.belongsTo(BlindTrackType, { foreignKey: "blind_track" })

    BlindMotorType.hasOne(SelectedBlind, { foreignKey: "blind_motor_type" })
    SelectedBlind.belongsTo(BlindMotorType, { foreignKey: "blind_motor_type" })

    BlindMotorTrackType.hasOne(SelectedBlind, { foreignKey: "blind_motor_track_type" })
    SelectedBlind.belongsTo(BlindMotorTrackType, { foreignKey: "blind_motor_track_type" })

    CurtainFabric.hasOne(SelectedBlind, { foreignKey: "blind_fabric", as: "blindFabric" })
    SelectedBlind.belongsTo(CurtainFabric, { foreignKey: "blind_fabric", as: "blindFabric" })

    CurtainFabric.hasOne(SelectedBlind, { foreignKey: "blind_border_curtain_fabric", as: "blindBorderCurtainFabric" })
    SelectedBlind.belongsTo(CurtainFabric, { foreignKey: "blind_border_curtain_fabric", as: "blindBorderCurtainFabric" })

    CurtainFabric.hasOne(SelectedBlind, { foreignKey: "blind_border_fabric", as: "blindBorderFabric" })
    SelectedBlind.belongsTo(CurtainFabric, { foreignKey: "blind_border_fabric", as: "blindBorderFabric" })

    BlindWindowType.hasOne(SelectedBlind, { foreignKey: "blind_window_type" })
    SelectedBlind.belongsTo(BlindWindowType, { foreignKey: "blind_window_type" })

    BlindSubType.hasOne(SelectedBlind, { foreignKey: "blind_sub_type" })
    SelectedBlind.belongsTo(BlindSubType, { foreignKey: "blind_sub_type" })

    BlindStyle.hasMany(BlindSubType, { foreignKey: "blindStyleId" })
    BlindSubType.belongsTo(BlindStyle, { foreignKey: "blindStyleId" })

    BlindFittingType.hasOne(SelectedBlind, { foreignKey: "blind_fitting_type" })
    SelectedBlind.belongsTo(BlindFittingType, { foreignKey: "blind_fitting_type" })

    BlindStyle.hasOne(SelectedBlind, { foreignKey: "blind_style" })
    SelectedBlind.belongsTo(BlindStyle, { foreignKey: "blind_style" })

    CurtainFabric.hasOne(SelectedBlind, { foreignKey: "LiningFabric", as: "BLINDLINING" });
    SelectedBlind.belongsTo(CurtainFabric, { foreignKey: "LiningFabric", as: "BLINDLINING" });

    CurtainFabric.hasOne(SelectedBlind, { foreignKey: "blindTypeSearchFabric", as: "blind_type_search_fabric" });
    SelectedBlind.belongsTo(CurtainFabric, { foreignKey: "blindTypeSearchFabric", as: "blind_type_search_fabric" });

    CurtainFabric.hasOne(SelectedBlind, { foreignKey: "blindTypeSearchMotor", as: "blind_type_search_motor" });
    SelectedBlind.belongsTo(CurtainFabric, { foreignKey: "blindTypeSearchMotor", as: "blind_type_search_motor" });

    CurtainFabric.hasOne(SelectedBlind, { foreignKey: "blindTypeSearchRemote", as: "blind_type_search_remote" });
    SelectedBlind.belongsTo(CurtainFabric, { foreignKey: "blindTypeSearchRemote", as: "blind_type_search_remote" });

    CurtainFabric.hasOne(SelectedBlind, { foreignKey: "BlindTrack", as: "blindTrack" })
    SelectedBlind.belongsTo(CurtainFabric, { foreignKey: "BlindTrack", as: "blindTrack" });

    Blind_Lining.hasOne(SelectedBlind, { foreignKey: "LiningType" });
    SelectedBlind.belongsTo(Blind_Lining, { foreignKey: "LiningType" });

    ScrewSize.hasOne(SelectedBlind, { foreignKey: "blind_screw_size" });
    SelectedBlind.belongsTo(ScrewSize, { foreignKey: "blind_screw_size" });

    RoomAsset.hasOne(SelectedBlind);
    SelectedBlind.belongsTo(RoomAsset);

    CurtainOperation.hasOne(BlindAsset, { foreignKey: "curtainOperationId" });
    BlindAsset.belongsTo(CurtainOperation, { foreignKey: "curtainOperationId" });

    CeilingType.hasMany(BlindAsset);
    BlindAsset.belongsTo(CeilingType);

    WallType.hasMany(BlindAsset);
    BlindAsset.belongsTo(WallType);

    ParkingSpace.hasMany(BlindAsset);
    BlindAsset.belongsTo(ParkingSpace);

    RoomAsset.hasOne(BlindAsset);
    BlindAsset.belongsTo(RoomAsset);

    BlindWindowType.hasMany(BlindFittingType, { foreignKey: "window_type" });
    BlindFittingType.belongsTo(BlindWindowType, { foreignKey: "window_type" })

    User.hasMany(InstallerTasks, { foreignKey: "installerId"  , as : "installer"});
    InstallerTasks.belongsTo(User, { foreignKey: "installerId", as : "installer" });

    User.hasMany(InstallerTasks , {foreignKey : "warehouseId" , as : "warehouse"});
    InstallerTasks.belongsTo(User,{foreignKey : "warehouseId" , as : "warehouse"});

    Customer.hasMany(InstallerTasks);
    InstallerTasks.belongsTo(Customer);

    Schedule.hasOne(InstallerTasks, { foreignKey: "scheduleId" });
    InstallerTasks.belongsTo(Schedule, { foreignKey: "scheduleId" });

    Enquiry.hasMany(InstallerTasks);
    InstallerTasks.belongsTo(Enquiry);

    Enquiry.hasMany(WarehouseOrder);
    WarehouseOrder.belongsTo(Enquiry);

    User.hasMany(WarehouseOrder , {foreignKey : "warehouseId" , as : "warehouse_id"});
    WarehouseOrder.belongsTo(User,{foreignKey : "warehouseId", as : "warehouse_id"});

    User.hasMany(WarehouseOrder, { foreignKey: "installerId" , as :"installer_id" });
    WarehouseOrder.belongsTo(User, { foreignKey: "installerId", as :"installer_id" })

    Enquiry.hasMany(CustomerOrder);
    CustomerOrder.belongsTo(Enquiry);

    Customer.hasMany(CustomerOrder);
    CustomerOrder.belongsTo(Customer);

    User.hasMany(CustomerOrder, { foreignKey: "installerId" });
    CustomerOrder.belongsTo(User, { foreignKey: "installerId" });

    Enquiry.hasMany(OrderProof);
    OrderProof.belongsTo(Enquiry);

    //sofa

    CurtainFabric.hasOne(SofaType, { foreignKey: "fabricId", });
    SofaType.belongsTo(CurtainFabric, { foreignKey: "fabricId" });

    SofaType.hasMany(SofaType, { foreignKey: "sofaSubType", });
    SofaType.belongsTo(SofaType, { foreignKey: "sofaSubType" ,  });

    CurtainFabric.hasOne(SelectedSofa, { foreignKey: "sofa_primary_fabric", as: "sofa_primary_fabric_" });
    SelectedSofa.belongsTo(CurtainFabric, { foreignKey: "sofa_primary_fabric", as: "sofa_primary_fabric_" });

    CurtainFabric.hasOne(SelectedSofa, { foreignKey: "sofa_secondary_fabric", as: "sofa_secondary_fabric_" });
    SelectedSofa.belongsTo(CurtainFabric, { foreignKey: "sofa_secondary_fabric", as: "sofa_secondary_fabric_" });

    CurtainFabric.hasOne(SelectedSofa, { foreignKey: "sofa_piping_fabric", as: "sofa_piping_fabric_" });
    SelectedSofa.belongsTo(CurtainFabric, { foreignKey: "sofa_piping_fabric", as: "sofa_piping_fabric_" });
    
    CurtainFabric.hasOne(SelectedSofa, { foreignKey: "pouffee_primary_fabric", as: "pouffee_primary_fabric_" });
    SelectedSofa.belongsTo(CurtainFabric, { foreignKey: "pouffee_primary_fabric", as: "pouffee_primary_fabric_" });

    CurtainFabric.hasOne(SelectedSofa, { foreignKey: "pouffee_secondary_fabric", as: "pouffee_secondary_fabric_" });
    SelectedSofa.belongsTo(CurtainFabric, { foreignKey: "pouffee_secondary_fabric", as: "pouffee_secondary_fabric_" });

    CurtainFabric.hasOne(SelectedSofa, { foreignKey: "pouffee_piping_fabric", as: "pouffee_piping_fabric_" });
    SelectedSofa.belongsTo(CurtainFabric, { foreignKey: "pouffee_piping_fabric", as: "pouffee_piping_fabric_" });
    
    CurtainFabric.hasOne(SelectedSofa, { foreignKey: "cushion_primary_fabric", as: "cushion_primary_fabric_" });
    SelectedSofa.belongsTo(CurtainFabric, { foreignKey: "cushion_primary_fabric", as: "cushion_primary_fabric_" });

    CurtainFabric.hasOne(SelectedSofa, { foreignKey: "cushion_secondary_fabric", as: "cushion_secondary_fabric_" });
    SelectedSofa.belongsTo(CurtainFabric, { foreignKey: "cushion_secondary_fabric", as: "cushion_secondary_fabric_" });

    CurtainFabric.hasOne(SelectedSofa, { foreignKey: "cushion_piping_fabric", as: "cushion_piping_fabric_" });
    SelectedSofa.belongsTo(CurtainFabric, { foreignKey: "cushion_piping_fabric", as: "cushion_piping_fabric_" });
    
    CurtainFabric.hasOne(SelectedSofa, { foreignKey: "bedback_primary_fabric", as: "bedback_primary_fabric_" });
    SelectedSofa.belongsTo(CurtainFabric, { foreignKey: "bedback_primary_fabric", as: "bedback_primary_fabric_" });

    CurtainFabric.hasOne(SelectedSofa, { foreignKey: "bedback_secondary_fabric", as: "bedback_secondary_fabric_" });
    SelectedSofa.belongsTo(CurtainFabric, { foreignKey: "bedback_secondary_fabric", as: "bedback_secondary_fabric_" });
    
    CurtainFabric.hasOne(SelectedSofa, { foreignKey: "wallpanel_primary_fabric", as: "wallpanel_primary_fabric_" });
    SelectedSofa.belongsTo(CurtainFabric, { foreignKey: "wallpanel_primary_fabric", as: "wallpanel_primary_fabric_" });

    CurtainFabric.hasOne(SelectedSofa, { foreignKey: "wallpanel_secondary_fabric", as: "wallpanel_secondary_fabric_" });
    SelectedSofa.belongsTo(CurtainFabric, { foreignKey: "wallpanel_secondary_fabric", as: "wallpanel_secondary_fabric_" });

    Enquiry.hasMany(SelectedSofa);
    SelectedSofa.belongsTo(Enquiry);

    Room.hasMany(SelectedSofa);
    SelectedSofa.belongsTo(Room);

    SofaType.hasOne(SelectedSofa, { foreignKey: "sofaTypeId" });
    SelectedSofa.belongsTo(SofaType, { foreignKey: "sofaTypeId" });

    //flooring

    CurtainFabric.hasOne(SelectedFlooring, { foreignKey: "flooringId", as: "flooring" })
    SelectedFlooring.belongsTo(CurtainFabric, { foreignKey: "flooringId", as: "flooring" })

    Room.hasMany(Area);
    Area.belongsTo(Room);

    SelectedFlooring.hasMany(Area);
    Area.belongsTo(SelectedFlooring);

    Room.hasOne(SelectedFlooring,)
    SelectedFlooring.belongsTo(Room)

    Enquiry.hasOne(SelectedFlooring)
    SelectedFlooring.belongsTo(Enquiry)

    CurtainFabric.hasOne(Area, { foreignKey: "polytheneId", as: "polythene" })
    Area.belongsTo(CurtainFabric, { foreignKey: "polytheneId", as: "polythene" })

    CurtainFabric.hasOne(Area, { foreignKey: "foamId", as: "foam" })
    Area.belongsTo(CurtainFabric, { foreignKey: "foamId", as: "foam" })

    CurtainFabric.hasOne(Area, { foreignKey: "skirtingId", as: "skirting" })
    Area.belongsTo(CurtainFabric, { foreignKey: "skirtingId", as: "skirting" })

    CurtainFabric.hasOne(Area, { foreignKey: "reducerId", as: "reducer" })
    Area.belongsTo(CurtainFabric, { foreignKey: "reducerId", as: "reducer" })

    CurtainFabric.hasOne(Area, { foreignKey: "t_profileId", as: "t_profile" })
    Area.belongsTo(CurtainFabric, { foreignKey: "t_profileId", as: "t_profile" })

    CurtainFabric.hasOne(Area, { foreignKey: "beedingId", as: "beeding" })
    Area.belongsTo(CurtainFabric, { foreignKey: "beedingId", as: "beeding" })
    
    CurtainFabric.hasOne(Area, { foreignKey: "bindingId", as: "binding" })
    Area.belongsTo(CurtainFabric, { foreignKey: "bindingId", as: "binding" })

    CurtainFabric.hasOne(Area, { foreignKey: "marginId", as: "margin" })
    Area.belongsTo(CurtainFabric, { foreignKey: "marginId", as: "margin" })

    // wallpaper

    CurtainFabric.hasOne(Wall, { foreignKey: "wallpaperId" });
    Wall.belongsTo(CurtainFabric, { foreignKey: "wallpaperId" });

    Enquiry.hasOne(SelectedWallpaper);
    SelectedWallpaper.belongsTo(Enquiry);

    Room.hasMany(Wall);
    Wall.belongsTo(Room)

    SelectedWallpaper.hasMany(Wall , { foreignKey : "selectedWallpaperId"});
    Wall.belongsTo(SelectedWallpaper,{ foreignKey : "selectedWallpaperId"})

    Room.hasMany(WallpaperArea)
    WallpaperArea.belongsTo(Room)

    Wall.hasMany(WallpaperArea);
    WallpaperArea.belongsTo(Wall)
    
    
    /*
    -----complaint model
    */

    Material.hasMany(Complaint)
    Complaint.belongsTo(Material)

    Customer.hasMany(ComplaintTask)
    ComplaintTask.belongsTo(Customer)

    Enquiry.hasMany(ComplaintTask)
    ComplaintTask.belongsTo(Enquiry)


    Schedule.hasOne(ComplaintTask, { foreignKey: "scheduleId" });
    ComplaintTask.belongsTo(Schedule, { foreignKey: "scheduleId" });

    User.hasMany(ComplaintTask, { foreignKey: 'installerId', as: "INSTALLER" })
    ComplaintTask.belongsTo(User, { foreignKey: 'installerId', as: "INSTALLER" })

    // Warehouse.hasMany(ComplaintTask, { foreignKey: "warehouseId", as: "store" });
    // ComplaintTask.belongsTo(Warehouse, { foreignKey: "warehouseId", as: "store" });

    Enquiry.hasOne(Feedback)
    Feedback.belongsTo(Enquiry)
    
    
    Enquiry.hasMany(Message)
    Message.belongsTo(Enquiry)
    
    Enquiry.hasMany(Identification);
    Identification.belongsTo(Enquiry);
    
    User.hasMany(Identification, { foreignKey: "salesId" });
    Identification.belongsTo(User, { foreignKey: "salesId" });
    
    Enquiry.hasOne(Wcr_Report);
    Wcr_Report.belongsTo(Enquiry);
    
    Enquiry.hasMany(Order_Bill, { foreignKey: "enquiryId" });
    Order_Bill.belongsTo(Enquiry, { foreignKey: "enquiryId" });
    
    Order.hasMany(Order_Bill, { foreignKey: "orderId" });
    Order_Bill.belongsTo(Order, { foreignKey: "orderId" });
    
    Enquiry.hasOne(Client_Signature, { foreignKey: "enquiryId" });
    Client_Signature.belongsTo(Enquiry, { foreignKey: "enquiryId" });
    
    Enquiry.hasMany(PaymentHistory, { foreignKey: "enquiry_Id" });
    PaymentHistory.belongsTo(Enquiry, { foreignKey: "enquiry_Id" });
    
    PaymentHistory.hasMany(Payment, { foreignKey: "paymentId" });
    Payment.belongsTo(PaymentHistory, { foreignKey: "paymentId" });

}