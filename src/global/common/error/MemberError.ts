import { ApiProperty } from '@nestjs/swagger';

export class ExistingMember {
    @ApiProperty({ example: '존재하는 사용자입니다.' })
    message = '존재하는 사용자입니다.';

    @ApiProperty({ example: 'EXISTING_MEMBER' })
    type = 'EXISTING_MEMBER';
}

export class NotExistingMember {
    @ApiProperty({ example: '존재하지 않는 사용자입니다.' })
    message = '존재하지 않는 사용자입니다.';

    @ApiProperty({ example: 'NOT_EXISTING_USER' })
    type = 'NOT_EXISTING_USER';
}

export class InvalidMember {
    @ApiProperty({ example: '유효하지 않은 이름의 사용자입니다.' })
    message = '유효하지 않은 이름의 사용자입니다.';

    @ApiProperty({ example: 'INVALID_NAME' })
    type = 'INVALID_NAME';
}
