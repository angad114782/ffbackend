const app_estimate_price = {
    curtain_stiching: {
        curtain_style_3Pleat: 294,
        curtain_style_rippleFold: 294,//550
        curtain_style_pencilPleat: 350,
        curtain_style_eyelet: 350,
        fabirc1_hand_hammering: 300,
        fabirc2_hand_hammering: 300,
        mock_fabric_hammering: 300,
        lining_fabric: 0,
        pelmetTypeId1: 2000, //hard
        pelmetTypeId2: 350, //soft
        beltStiching: 236,
        beltBorder: 236,
        p_border: 118,
        s_border: 118,
        beltPiping: 236,
        pelmetTrackId1: 354, //Manual Track
        pelmetTrackId2: 1770, //Moterized Track
        studio_curtain_style_3Pleat: 1100,
        studio_curtain_style_rippleFold: 1100, //Manual
        studio_curtain_style_rippleFold_auto: 1200, //Moterized
        studio_curtain_style_pencilPleat: 1100,
        studio_curtain_style_eyelet: 1100,
    },
    rod_stiching: {
        primary_rod1: 354, //runningFeet < 8 
        primary_rod2: 708, //runningFeet > 8 
        secondary_rod1: 354, //runningFeet < 8
        secondary_rod2: 708, //runningFeet > 8
        curtainStick: 0,
        endCapWallSupport: 0,
        extraBracketSupport: 300,
        extraBracket: 350,
        endCap: 0,
        finial: 0,
        rodTieKnob: 200
    },
    sheer_stiching: {
        leadChainYes: 165,
        handHammering: 300
    },
    track_stiching: {
        primary_track_type1: 354, //Manual Track
        primary_track_type2: 1770,//Moterized Track
        primaryTrackMotor: 0,
        primaryTrackRemote: 0,
        primaryOverlapper: 350,
        primaryTrackCuratinStick: 0,
        primaryExtraTrackBracket: 350,
        primary_track_tieknob: 200,
        secondary_track_tieknob: 200,
        mock_track_tieknob: 200,
        Lbracket: 0,
        secondary_track_type1: 354,
        secondary_track_type2: 1770,
        secondaryTrackMotor: 0,
        secondaryTrackRemote: 0,
        secondaryOverlapper: 350,
        secondaryTrackCuratinStick: 0,
        secondaryExtraTrackBracket: 350,
        mock_track_type1: 354,
        mock_track_type2: 1770,
        mockTrackMotor: 0,
        mockTrackRemote: 0,
        mockOverlapper: 350,
        mockTrackCuratinStick: 0,
        mockExtraTrackBracket: 350
    },
    flooring_stiching: {
        normal_flooring: 17.70,
        engineer_wooden: 25.96,
        other: 33,
        carpet: 190.45
    },
    wallpaper_stiching: {
        wallpaper_normal_rate: 1011.24,
        wallpaper_ceiling_rate: 1307.11,
        mural_per_sqft_cost: 317.42
    },
    blind_stiching: {
        blindFabric: 958,
        isBlindTypeMotorized: 1770,
        notBlindTypeMotorized: 826,
        blind_lining: 958,
        BLINDSHADES: 0,
        blindBorder: 407,
        blindTrack_type1: 354,
        blindTrack_type2: 1770,
        blind_track_remote: 0,
        blind_track_motor: 0,
        blind_extra_bracket: 0,
    }
}

const ax_estimate_price = {
    curtain_stiching: {
        curtain_style_3Pleat: 294,
        curtain_style_rippleFold: 350,
        curtain_style_pencilPleat: 294,
        curtain_style_eyelet: 350,
        fabirc1_hand_hammering: 254,
        fabirc2_hand_hammering: 254,
        mock_fabric_hammering: 254,
        lining_fabric: 0,
        pelmetTypeId1: 1697.6, //hard
        pelmetTypeId2: 492, // soft
        beltStiching: 118,
        beltBorder: 118,
        p_border: 100,
        s_border: 500,
        beltPiping: 148,
        pelmetTrackId1: 300, //Manual Track
        pelmetTrackId2: 1770, //Moterized Track
    },
    rod_stiching: {
        primary_rod1: 350, //runningFeet < 8 
        primary_rod2: 700, //runningFeet > 8 
        secondary_rod1: 350, //runningFeet < 8
        secondary_rod2: 700, //runningFeet > 8
        curtainStick: 0,
        endCapWallSupport: 0,
        extraBracketSupport: 300,
        extraBracket: 350,
        endCap: 0,
        finial: 0,
        rodTieKnob: 0
    },
    sheer_stiching: {
        leadChainYes: 140,
        handHammering: 254
    },
    track_stiching: {
        primary_track_type1: 300, //Manual Track
        primary_track_type2: 1770, //Moterized Track
        primaryTrackMotor: 0,
        primaryTrackRemote: 0,
        primaryOverlapper: 0,
        primaryTrackCuratinStick: 0,
        primaryExtraTrackBracket: 350,
        primary_track_tieknob: 200,
        secondary_track_tieknob: 200,
        mock_track_tieknob: 200,
        Lbracket: 0,
        secondary_track_type1: 300,  //Manual Track
        secondary_track_type2: 1770, //Moterized Track
        secondaryTrackMotor: 0,
        secondaryTrackRemote: 0,
        secondaryOverlapper: 0,
        secondaryTrackCuratinStick: 0,
        secondaryExtraTrackBracket: 350,
        mock_track_type1: 300,  //Manual Track
        mock_track_type2: 1770, //Moterized Track
        mockTrackMotor: 0,
        mockTrackRemote: 0,
        mockOverlapper: 0,
        mockTrackCuratinStick: 0,
        mockExtraTrackBracket: 350,
    },
    flooring_stiching: {
        normal_flooring: 17.70,
        engineer_wooden: 25.96,
        other: 33,
        carpet: 160.7,
    },
    wallpaper_stiching: {
        wallpaper_normal_rate: 857,
        wallpaper_ceiling_rate: 1108,
        mural_per_sqft_cost: 269,
    },
    blind_stiching: {
        blindFabric: 812,
        isBlindTypeMotorized: 1500,
        notBlindTypeMotorized: 700,
        blind_lining: 958,
        BLINDSHADES: 0,
        blindBorder: 345,
        blindTrack_type1: 300,
        blindTrack_type2: 1770,
        blind_track_remote: 0,
        blind_track_motor: 0,
        blind_extra_bracket: 0,
    }
}

const updated_app_estimate_price = {
    curtain_stiching: {
        curtain_style_3Pleat: 360,
        curtain_style_rippleFold: 450,//Manual
        curtain_style_rippleFold_auto: 550,//Moterized
        curtain_style_pencilPleat: 360,
        curtain_style_eyelet: 390,
        fabirc1_hand_hammering: 300,
        fabirc2_hand_hammering: 300,
        mock_fabric_hammering: 300,
        lining_fabric: 0,
        pelmetTypeId1: 2000, //hard
        pelmetTypeId2: 350, //soft
        beltStiching: 236,
        beltBorder: 236,
        p_border: 118,
        s_border: 118,
        beltPiping: 236,
        pelmetTrackId1: 354, //Manual Track
        pelmetTrackId2: 1770, //Moterized Track
        studio_curtain_style_3Pleat: 1100,
        studio_curtain_style_rippleFold: 1100, //Manual
        studio_curtain_style_rippleFold_auto: 1200, //Moterized
        studio_curtain_style_pencilPleat: 1100,
        studio_curtain_style_eyelet: 1100,
    },
    rod_stiching: {
        primary_rod1: 354, //runningFeet < 8 
        primary_rod2: 708, //runningFeet > 8 
        secondary_rod1: 354, //runningFeet < 8
        secondary_rod2: 708, //runningFeet > 8
        curtainStick: 0,
        endCapWallSupport: 0,
        extraBracketSupport: 300,
        extraBracket: 350,
        endCap: 0,
        finial: 0,
        rodTieKnob: 200
    },
    sheer_stiching: {
        leadChainYes: 165,
        handHammering: 300
    },
    track_stiching: {
        primary_track_type1: 354, //Manual Track
        primary_track_type2: 1770,//Moterized Track
        primaryTrackMotor: 0,
        primaryTrackRemote: 0,
        primaryOverlapper: 350,
        primaryTrackCuratinStick: 0,
        primaryExtraTrackBracket: 350,
        primary_track_tieknob: 200,
        secondary_track_tieknob: 200,
        mock_track_tieknob: 200,
        Lbracket: 0,
        secondary_track_type1: 354,
        secondary_track_type2: 1770,
        secondaryTrackMotor: 0,
        secondaryTrackRemote: 0,
        secondaryOverlapper: 350,
        secondaryTrackCuratinStick: 0,
        secondaryExtraTrackBracket: 350,
        mock_track_type1: 354,
        mock_track_type2: 1770,
        mockTrackMotor: 0,
        mockTrackRemote: 0,
        mockOverlapper: 350,
        mockTrackCuratinStick: 0,
        mockExtraTrackBracket: 350
    },
    flooring_stiching: {
        normal_flooring: 17.70,
        engineer_wooden: 25.96,
        other: 33,
        carpet: 190.45
    },
    wallpaper_stiching: {
        wallpaper_normal_rate: 1011.24,
        wallpaper_ceiling_rate: 1307.11,
        mural_per_sqft_cost: 317.42
    },
    blind_stiching: {
        blindFabric: 980,
        nefaBlindFabric: 1290,
        blindFabric_studio: 1199,
        nefaBlindFabric_studio: 1499,
        isBlindTypeMotorized: 1770,
        notBlindTypeMotorized: 826,
        blind_lining: 958,
        BLINDSHADES: 0,
        blindBorder: 407,
        blindTrack_type1: 354,
        blindTrack_type2: 1770,
        blind_track_remote: 0,
        blind_track_motor: 0,
        blind_extra_bracket: 0,
    }
}

const updated_ax_estimate_price = {
    curtain_stiching: {
        curtain_style_3Pleat: 342.86,
        curtain_style_rippleFold: 428.57,//Manual
        curtain_style_rippleFold_auto: 523.81,//Moterized
        curtain_style_pencilPleat: 342.86,
        curtain_style_eyelet: 371.42,
        fabirc1_hand_hammering: 254,
        fabirc2_hand_hammering: 254,
        mock_fabric_hammering: 254,
        lining_fabric: 0,
        pelmetTypeId1: 1697.6, //hard
        pelmetTypeId2: 492, // soft
        beltStiching: 118,
        beltBorder: 118,
        p_border: 100,
        s_border: 500,
        beltPiping: 148,
        pelmetTrackId1: 300, //Manual Track
        pelmetTrackId2: 1770, //Moterized Track
        studio_curtain_style_3Pleat: 1047.62,
        studio_curtain_style_rippleFold: 1047.62, //Manual
        studio_curtain_style_rippleFold_auto: 1142.86, //Moterized
        studio_curtain_style_pencilPleat: 1047.62,
        studio_curtain_style_eyelet: 1047.62,
    },
    rod_stiching: {
        primary_rod1: 350, //runningFeet < 8 
        primary_rod2: 700, //runningFeet > 8 
        secondary_rod1: 350, //runningFeet < 8
        secondary_rod2: 700, //runningFeet > 8
        curtainStick: 0,
        endCapWallSupport: 0,
        extraBracketSupport: 300,
        extraBracket: 350,
        endCap: 0,
        finial: 0,
        rodTieKnob: 0
    },
    sheer_stiching: {
        leadChainYes: 140,
        handHammering: 254
    },
    track_stiching: {
        primary_track_type1: 300, //Manual Track
        primary_track_type2: 1770, //Moterized Track
        primaryTrackMotor: 0,
        primaryTrackRemote: 0,
        primaryOverlapper: 0,
        primaryTrackCuratinStick: 0,
        primaryExtraTrackBracket: 350,
        primary_track_tieknob: 200,
        secondary_track_tieknob: 200,
        mock_track_tieknob: 200,
        Lbracket: 0,
        secondary_track_type1: 300,  //Manual Track
        secondary_track_type2: 1770, //Moterized Track
        secondaryTrackMotor: 0,
        secondaryTrackRemote: 0,
        secondaryOverlapper: 0,
        secondaryTrackCuratinStick: 0,
        secondaryExtraTrackBracket: 350,
        mock_track_type1: 300,  //Manual Track
        mock_track_type2: 1770, //Moterized Track
        mockTrackMotor: 0,
        mockTrackRemote: 0,
        mockOverlapper: 0,
        mockTrackCuratinStick: 0,
        mockExtraTrackBracket: 350,
    },
    flooring_stiching: {
        normal_flooring: 17.70,
        engineer_wooden: 25.96,
        other: 33,
        carpet: 160.7,
    },
    wallpaper_stiching: {
        wallpaper_normal_rate: 857,
        wallpaper_ceiling_rate: 1108,
        mural_per_sqft_cost: 269,
    },
    blind_stiching: {
        blindFabric: 933.33,
        blindFabric_studio: 1228.57,
        nefaBlindFabric: 1141.9,
        nefaBlindFabric_studio: 1427.62,
        isBlindTypeMotorized: 1500,
        notBlindTypeMotorized: 700,
        blind_lining: 958,
        BLINDSHADES: 0,
        blindBorder: 345,
        blindTrack_type1: 300,
        blindTrack_type2: 1770,
        blind_track_remote: 0,
        blind_track_motor: 0,
        blind_extra_bracket: 0,
    }
}


module.exports = { app_estimate_price, ax_estimate_price, updated_app_estimate_price, updated_ax_estimate_price };