import { Injectable } from "@nestjs/common";

import { Repository } from "prisma/repository";

@Injectable()
export class OrderService {
    constructor(private readonly repository: Repository) {}
}
