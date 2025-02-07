
export const fixPayment = 1500;

export function calculateExtra(payment: number) : number {
    let extra = 0;
    console.log(payment);
    if (payment > fixPayment) {
        extra = Math.abs(payment - fixPayment);
    }

    console.log(extra);
    return extra
}

export function isFullyPaid(payment: number) : boolean {
    return payment >= fixPayment ? true : false;
}
