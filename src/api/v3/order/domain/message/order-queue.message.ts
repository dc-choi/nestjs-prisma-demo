import { OrderV3RequestDto } from '~/api/v3/order/domain/dto/orderV3.dto';
import { JwtPayload } from '~/global/jwt/payload/jwt.payload';

export interface OrderQueueRequest {
    readonly jwt: JwtPayload;
    readonly payload: OrderV3RequestDto;
}
