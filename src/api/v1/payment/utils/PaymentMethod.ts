import { invalidValue } from "@global/common/message/ErrorMessage";
import { BadRequestException } from "@nestjs/common";

import { TossCardCode, TossCardName } from "./TossCode";

export class PaymentMethod {
    public static vaildCardCode(code: TossCardCode) {
        if (!Object.values(TossCardCode).includes(code)) {
            throw new BadRequestException(invalidValue("토스 지정 카드코드"));
        }
    }

    public static vaildCardName(name: TossCardName) {
        if (!Object.values(TossCardName).includes(name)) {
            throw new BadRequestException(invalidValue("토스 지정 카드이름"));
        }
    }

    public static convertCodeToName(code: TossCardCode) {
        switch (code) {
            case TossCardCode.IBK_BC:
                return TossCardName.IBK_BC;
            case TossCardCode.GWANGJUBANK:
                return TossCardName.GWANGJUBANK;
            case TossCardCode.LOTTE:
                return TossCardName.LOTTE;
            case TossCardCode.KDBBANK:
                return TossCardName.KDBBANK;
            case TossCardCode.BC:
                return TossCardName.BC;
            case TossCardCode.SAMSUNG:
                return TossCardName.SAMSUNG;
            case TossCardCode.SAEMAUL:
                return TossCardName.SAEMAUL;
            case TossCardCode.SHINHAN:
                return TossCardName.SHINHAN;
            case TossCardCode.SHINHYEOP:
                return TossCardName.SHINHYEOP;
            case TossCardCode.CITI:
                return TossCardName.CITI;
            case TossCardCode.WOORI:
            case TossCardCode.WOORI_BC:
                return TossCardName.WOORI;
            case TossCardCode.POST:
                return TossCardName.POST;
            case TossCardCode.SAVINGBANK:
                return TossCardName.SAVINGBANK;
            case TossCardCode.JEONBUKBANK:
                return TossCardName.JEONBUKBANK;
            case TossCardCode.JEJUBANK:
                return TossCardName.JEJUBANK;
            case TossCardCode.KAKAOBANK:
                return TossCardName.KAKAOBANK;
            case TossCardCode.KBANK:
                return TossCardName.KBANK;
            case TossCardCode.TOSSBANK:
                return TossCardName.TOSSBANK;
            case TossCardCode.HANA:
                return TossCardName.HANA;
            case TossCardCode.HYUNDAI:
                return TossCardName.HYUNDAI;
            case TossCardCode.KOOKMIN:
                return TossCardName.KOOKMIN;
            case TossCardCode.NONGHYEOP:
                return TossCardName.NONGHYEOP;
            case TossCardCode.SUHYEOP:
                return TossCardName.SUHYEOP;
            case TossCardCode.DINERS:
                return TossCardName.DINERS;
            case TossCardCode.MASTER:
                return TossCardName.MASTER;
            case TossCardCode.UNIONPAY:
                return TossCardName.UNIONPAY;
            case TossCardCode.AMEX:
                return TossCardName.AMEX;
            case TossCardCode.JCB:
                return TossCardName.JCB;
            case TossCardCode.VISA:
                return TossCardName.VISA;
            default:
                throw new BadRequestException(invalidValue("토스 지정 카드코드"));
        }
    }

    public static convertNameToCode(name: TossCardName) {
        switch (name) {
            case TossCardName.IBK_BC:
                return TossCardCode.IBK_BC;
            case TossCardName.GWANGJUBANK:
                return TossCardCode.GWANGJUBANK;
            case TossCardName.LOTTE:
                return TossCardCode.LOTTE;
            case TossCardName.KDBBANK:
                return TossCardCode.KDBBANK;
            case TossCardName.BC:
                return TossCardCode.BC;
            case TossCardName.SAMSUNG:
                return TossCardCode.SAMSUNG;
            case TossCardName.SAEMAUL:
                return TossCardCode.SAEMAUL;
            case TossCardName.SHINHAN:
                return TossCardCode.SHINHAN;
            case TossCardName.SHINHYEOP:
                return TossCardCode.SHINHYEOP;
            case TossCardName.CITI:
                return TossCardCode.CITI;
            // INFO: 요청시 WOORI_BC에 맞는 코드를 사용해야함
            case TossCardName.WOORI:
                return TossCardCode.WOORI_BC;
            case TossCardName.POST:
                return TossCardCode.POST;
            case TossCardName.SAVINGBANK:
                return TossCardCode.SAVINGBANK;
            case TossCardName.JEONBUKBANK:
                return TossCardCode.JEONBUKBANK;
            case TossCardName.JEJUBANK:
                return TossCardCode.JEJUBANK;
            case TossCardName.KAKAOBANK:
                return TossCardCode.KAKAOBANK;
            case TossCardName.KBANK:
                return TossCardCode.KBANK;
            case TossCardName.TOSSBANK:
                return TossCardCode.TOSSBANK;
            case TossCardName.HANA:
                return TossCardCode.HANA;
            case TossCardName.HYUNDAI:
                return TossCardCode.HYUNDAI;
            case TossCardName.KOOKMIN:
                return TossCardCode.KOOKMIN;
            case TossCardName.NONGHYEOP:
                return TossCardCode.NONGHYEOP;
            case TossCardName.SUHYEOP:
                return TossCardCode.SUHYEOP;
            case TossCardName.DINERS:
                return TossCardCode.DINERS;
            case TossCardName.MASTER:
                return TossCardCode.MASTER;
            case TossCardName.UNIONPAY:
                return TossCardCode.UNIONPAY;
            case TossCardName.AMEX:
                return TossCardCode.AMEX;
            case TossCardName.JCB:
                return TossCardCode.JCB;
            case TossCardName.VISA:
                return TossCardCode.VISA;
            default:
                throw new BadRequestException(invalidValue("토스 지정 카드이름"));
        }
    }
}
