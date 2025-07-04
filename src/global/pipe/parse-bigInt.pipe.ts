import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseBigIntPipe implements PipeTransform<string, bigint> {
    transform(value: string): bigint {
        try {
            return BigInt(value);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new BadRequestException(`Validation failed. "${value}" is not a valid bigint.`);
        }
    }
}
