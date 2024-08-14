import { Repository } from "@infra/dao/Repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MemberService extends Repository {
    async getMember() {
        return await this.memberRepository.findMany();
    }
}
