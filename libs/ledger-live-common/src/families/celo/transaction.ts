import type {
  Transaction,
  TransactionRaw,
  TransactionStatus,
  TransactionStatusRaw,
} from "./types";
import { BigNumber } from "bignumber.js";
import {
  formatTransactionStatusCommon,
  fromTransactionCommonRaw,
  fromTransactionStatusRawCommon,
  toTransactionCommonRaw,
  toTransactionStatusRawCommon,
} from "../../transaction/common";
import { getAccountUnit } from "../../account";
import { formatCurrencyUnit } from "../../currencies";
import { Account } from "@ledgerhq/types-live";
export const formatTransaction = (t: Transaction, account: Account): string => `
SEND ${formatCurrencyUnit(getAccountUnit(account), t.amount, {
  showCode: true,
  disableRounding: true,
})}
TO ${t.recipient}`;

const fromTransactionRaw = (tr: TransactionRaw): Transaction => {
  const common = fromTransactionCommonRaw(tr);
  return {
    ...common,
    family: tr.family,
    fees: tr.fees ? new BigNumber(tr.fees) : null,
  };
};

export const toTransactionRaw = (t: Transaction): TransactionRaw => {
  const common = toTransactionCommonRaw(t);
  return {
    ...common,
    family: t.family,
    fees: t.fees?.toString() || null,
  };
};

const fromTransactionStatusRaw = fromTransactionStatusRawCommon;
const toTransactionStatusRaw = toTransactionStatusRawCommon;
const formatTransactionStatus = formatTransactionStatusCommon;

export default {
  formatTransaction,
  fromTransactionRaw,
  toTransactionRaw,
  fromTransactionStatusRaw,
  toTransactionStatusRaw,
  formatTransactionStatus,
};
