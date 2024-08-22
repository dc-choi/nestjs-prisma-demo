import { MemberEntity } from "@api/v1/member/domain/entity/Member.entity";

describe("Member Unit Test", () => {
    describe("member.generateHashedPassword", () => {
        it("normal case", () => {
            const member = new MemberEntity();
            member.generateHashedPassword("password", String(process.env.SECRET));
            expect(member.hashedPassword).toBeTruthy();
            expect(member.hashedPassword).not.toBeNull();
            expect(member.hashedPassword?.length).toBeGreaterThanOrEqual(1);
        });

        it("wrong secret key", () => {
            const member = new MemberEntity();
            member.generateHashedPassword("password", String(process.env.SECRET));

            const wrongMember = new MemberEntity();
            wrongMember.generateHashedPassword("password", "");

            expect(member.hashedPassword).not.toEqual(wrongMember.hashedPassword);
        });
    });
});
