require('dotenv').config();
export const accountName = process.env.accountName;
export const privateKey = process.env.privateKey;
export const httpEndpoint = process.env.httpEndpoint;
export const memo = process.env.memo;
export const backAccount = process.env.backAccount as string;
export const percent = parseFloat(process.env.percent as string);
