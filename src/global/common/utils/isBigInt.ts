import {
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsBigIntConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        // 값이 BigInt이거나 BigInt로 변환 가능해야 함
        return typeof value === 'bigint' || (!isNaN(value) && BigInt(value).toString() === value.toString());
    }

    defaultMessage(): string {
        return 'Value must be a BigInt.';
    }
}

export function IsBigInt(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBigIntConstraint,
        });
    };
}
