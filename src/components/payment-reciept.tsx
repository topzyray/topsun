"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { TransactionResponse } from "../../types";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { TextHelper } from "@/helpers/TextHelper";

const PaymentReceipt = ({
  status,
  transaction_id,
  amount_paid,
  payment_method,
  date_paid,
  summary,
  failure_reason,
  school_name,
  school_contact,
  historyPage,
}: TransactionResponse) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { userDetails } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setIsDarkMode(theme == "dark");
  }, [theme]);

  const handlePrint = () => {
    const printContent = document.getElementById("receipt-content");

    if (printContent) {
      const printWindow = window.open("", "_blank");
      printWindow?.document.write(`
        <html>
          <head>
            <title>Payment Receipt</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                color: ${isDarkMode ? "white" : "black"};
                background-color: ${isDarkMode ? "#1A202C" : "white"};
              }
              .header {
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
              }
              .footer {
                margin-top: 30px;
                font-size: 14px;
                text-align: center;
                color: gray;
              }
              .details {
                margin-top: 15px;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <div id="receipt-content">${printContent.innerHTML}</div>
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print();
    }
  };

  const studentId =
    localStorage.getItem("studentId") !== null &&
    JSON.parse(localStorage.getItem("studentId") as string);

  return (
    <div id="receipt-content" className="bg-sidebar mx-auto max-w-sm rounded border p-4">
      <div className="text-center">
        <h2
          className={`text-xl font-medium ${
            status === "confirmed"
              ? "text-green-600"
              : status === "failed"
                ? "text-red-600"
                : status === "pending"
                  ? "text-yellow-600"
                  : ""
          }`}
        >
          {status === "confirmed"
            ? "Transaction Successful"
            : status === "failed"
              ? "Transaction Failed"
              : status === "pending"
                ? "Transaction Pending"
                : ""}
        </h2>
        {status === "failed" && <p className="mt-2 text-red-600">{failure_reason}</p>}
      </div>

      <div className="mt-6">
        <h3 className="mb-4 text-base font-medium underline">Transaction Details</h3>
        <div className="grid grid-cols-2 gap-x-6">
          <div className="text-sm font-normal">Reference</div>
          <div className="text-sm font-normal">{transaction_id}</div>

          <div className="text-sm font-normal">Amount</div>
          <div className="text-sm font-normal">₦{amount_paid && amount_paid.toFixed(2)}</div>

          <div className="text-sm font-normal">Payment Method</div>
          <div className="text-sm font-normal capitalize">{payment_method}</div>

          <div className="text-sm font-normal">Transaction Status</div>
          <div
            className={`text-sm font-normal capitalize ${
              status === "confirmed"
                ? "text-green-600"
                : status === "failed"
                  ? "text-red-600"
                  : status === "pending"
                    ? "text-yellow-600"
                    : ""
            }`}
          >
            {status}
          </div>

          <div className="text-sm font-normal">Summary</div>
          <div className="text-sm font-normal">{summary || "School fees payement"}</div>

          <div className="text-sm font-normal">Date</div>
          <div className="text-sm font-normal">
            {date_paid && TextHelper.getFormattedDate(date_paid)}
          </div>

          <div className="text-sm font-normal">Time</div>
          <div className="text-sm font-normal">
            {date_paid && TextHelper.getFormattedTime(date_paid)}
          </div>
        </div>
      </div>

      {process.env.NEXT_PUBLIC_SCHOOL_NAME != undefined &&
        process.env.NEXT_PUBLIC_SCHOOL_EMAIL != undefined && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Powered by {school_name || process.env.NEXT_PUBLIC_SCHOOL_NAME}
            </p>
            <p className="text-sm text-gray-500">
              Contact: {school_contact || process.env.NEXT_PUBLIC_SCHOOL_EMAIL}
            </p>
          </div>
        )}

      {!historyPage ? (
        <div className="mt-6 flex justify-center gap-2">
          <Button
            onClick={() => {
              if (userDetails?.role === "student") {
                router.replace(
                  `${
                    status === "confirmed"
                      ? `/dashboard/student/fee_payments`
                      : status === "failed"
                        ? `/dashboard/student/fee_payments/make_payment`
                        : status === "pending"
                          ? `/dashboard/student/fee_payments/transaction_history`
                          : `/dashboard/student/overview`
                  }`,
                );
              } else if (userDetails?.role === "parent") {
                router.replace(
                  `${
                    status === "confirmed"
                      ? `/dashboard/parent/children/${studentId}`
                      : status === "failed"
                        ? `/dashboard/parent/children/${studentId}/make_payment`
                        : status === "pending"
                          ? `/dashboard/parent/children/${studentId}`
                          : `/dashboard/parent/overview`
                  }`,
                );
              }
            }}
          >
            {status === "confirmed"
              ? "Close"
              : status === "failed"
                ? "Try again"
                : "Back to dashboard"}
          </Button>
          <Button className="text-white" onClick={handlePrint}>
            Print Receipt
          </Button>
        </div>
      ) : (
        <div className="mt-3 border p-2 text-center text-green-600">
          <p>Press (Ctrl + P on Windows) or (Cmd + P on Mac) on keyboard to print receipt</p>
        </div>
      )}
    </div>
  );
};

export default PaymentReceipt;
