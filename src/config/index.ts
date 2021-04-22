require('dotenv').config();
export const accountName = process.env.accountName as string;
export const privateKey = process.env.privateKey as string;
export const httpEndpoint = process.env.httpEndpoint as string;
export const memo = process.env.memo as string;
export const backAccount = process.env.backAccount as string;
export const percent = parseFloat(process.env.percent as string);
