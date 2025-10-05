"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SessionApiService } from "@/api/services/SessionApiService";
import React, { useContext } from "react";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import AddNewTerm from "@/components/forms/school/admins/add-term";
import { Session, Term, User } from "../../../../../types";
import { PaymentApiService } from "@/api/services/PaymentApiService";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { useQueryClient } from "@tanstack/react-query";
import BackButton from "@/components/buttons/BackButton";
import { TextHelper } from "@/helpers/TextHelper";
import ModalComponent from "@/components/modals/base/modal-component";
import SubmitButton from "@/components/buttons/SubmitButton";
import AddMandatoryFeeForm from "@/components/forms/school/admins/add-mandatory-fee";
import AddOptionalFeeForm from "@/components/forms/school/admins/add-optional-fee";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { GlobalContext } from "@/providers/global-state-provider";
import EndSessionAlert from "@/components/modals/end-session-alert";
import TooltipComponent from "@/components/info/tool-tip";
import EndTermAlert from "@/components/modals/end-term-alert";
import { useAuth } from "@/api/hooks/use-auth.hook";

export default function SessionDetails({ params }: { params: Record<string, string> }) {
  const [openDeleteSessionConfirmation, setOpenDeleteSessionConfirmation] = React.useState(false);
  const [openDeleteTermConfirmation, setOpenDeleteTermConfirmation] = React.useState(false);
  const [termToDelete, setTermToDelete] = React.useState<Term | null>(null);
  const [openNewTermForm, setOpenNewTermForm] = React.useState(false);
  const [openFeeAdditionForm, setOpenFeeAdditionForm] = React.useState({
    mandatoryFee: false,
    optionalFee: false,
    term_name: "",
  });
  const { activeSessionData } = useContext(GlobalContext);
  const userDetails = useAuth()?.userDetails as User;

  const queryClient = useQueryClient();

  // Handle session data fetching
  let { data, isLoading, isError, error } = useCustomQuery(
    ["sessionById"],
    () => SessionApiService.getSessionByIdForASchool(params.session_id),
    { id: params.session_id },
  );

  let sessionData: Session = data?.session !== undefined && data?.session;

  // Handle create payment
  let { mutate: createPayment, isPending: isCreatingPayment } = useCustomMutation(
    PaymentApiService.createPaymentForAllStudents,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
        queryClient.invalidateQueries({ queryKey: ["sessionById"] });
        queryClient.invalidateQueries({ queryKey: ["studentById"] });
        queryClient.invalidateQueries({ queryKey: ["students"] });
      },
    },
  );

  return (
    <div className="space-y-4">
      <BackButton />

      <Separator />
      <h1 className="text-lg uppercase">Session Details Page</h1>
      <Separator />

      {isLoading && <CircularLoader text="Fetching session details" />}

      {sessionData && sessionData !== null && (
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full space-y-3 rounded border p-4 lg:w-1/2">
              <h2>Session Details</h2>

              <Table className="border">
                <TableBody>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableCell className="uppercase">{sessionData?._id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableCell className="uppercase">{sessionData?.academic_session}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Created</TableHead>
                    <TableCell className="uppercase">
                      {TextHelper.getFormattedDate(sessionData?.createdAt as string)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableCell
                      className={`${sessionData?.is_active ? "text-green-600" : "text-red-600"}`}
                    >
                      {sessionData?.is_active ? "Active" : "Ended"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableHead>Promotion Done</TableHead>
                    <TableCell
                      className={`${
                        sessionData?.is_promotion_done ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {sessionData?.is_promotion_done ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                  {userDetails?.role === "super_admin" && (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <div className="flex flex-wrap gap-2 md:gap-4" suppressHydrationWarning>
                          <TooltipComponent
                            trigger={
                              <Button
                                variant="destructive"
                                onClick={() => setOpenDeleteSessionConfirmation(true)}
                              >
                                End Session
                              </Button>
                            }
                            message={
                              <p className="text-base text-red-600">This action cannot be undone</p>
                            }
                          />
                          <Button
                            disabled={
                              sessionData.is_active == false ||
                              sessionData.terms.length == 3 ||
                              activeSessionData?.activeTerm?.is_active
                            }
                            onClick={() => setOpenNewTermForm(true)}
                          >
                            Add Term
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="w-full space-y-3 rounded border p-4 lg:w-1/2">
              <h2>Terms Details</h2>

              {sessionData?.terms.map((term) => (
                <Table key={term?._id} className="border">
                  <TableBody>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableCell className="uppercase">{term?.name.split("_").join(" ")}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Start Date</TableHead>
                      <TableCell className="uppercase">
                        {TextHelper.getFormattedDate(term.start_date)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>End Date</TableHead>
                      <TableCell className="uppercase">
                        {" "}
                        {TextHelper.getFormattedDate(term.end_date)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableCell
                        className={`uppercase ${
                          term.is_active ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {term.is_active ? "Active" : "Ended"}
                      </TableCell>
                    </TableRow>

                    {term?.is_active && userDetails?.role === "super_admin" && (
                      <TableRow>
                        <TableCell colSpan={2}>
                          <div className="flex justify-end">
                            <div className="space-y-2 self-end">
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  onClick={async () => {
                                    setOpenDeleteTermConfirmation(true);
                                    setTermToDelete(term);
                                  }}
                                  variant="destructive"
                                >
                                  End Term
                                </Button>

                                <SubmitButton
                                  loading={isCreatingPayment}
                                  disabled={isCreatingPayment}
                                  text="Create Payment"
                                  onSubmit={() =>
                                    createPayment({
                                      requestBody: {
                                        term: term.name,
                                      },
                                      params: {
                                        session_id: sessionData?._id as string,
                                      },
                                    })
                                  }
                                  type="button"
                                />

                                <Button
                                  onClick={() =>
                                    setOpenFeeAdditionForm((prev) => ({
                                      ...prev,
                                      optionalFee: true,
                                      term_name: term.name,
                                    }))
                                  }
                                >
                                  Add Optional Fee
                                </Button>

                                <Button
                                  onClick={() =>
                                    setOpenFeeAdditionForm((prev) => ({
                                      ...prev,
                                      mandatoryFee: true,
                                      term_name: term.name,
                                    }))
                                  }
                                >
                                  Add Mandatory Fee
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {sessionData?.terms?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2}>No term add yet.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ))}
            </div>
          </div>
        </div>
      )}

      {isError && (
        <div className="bg-sidebar max-w-md space-y-3 rounded p-6 text-red-600">
          <p>{extractErrorMessage(error)}</p>
        </div>
      )}

      {/* End session alert */}
      <ModalComponent
        open={openDeleteTermConfirmation}
        onClose={() => setOpenDeleteTermConfirmation(false)}
      >
        <EndTermAlert
          session={sessionData}
          term={termToDelete as Term}
          onClose={() => setOpenDeleteTermConfirmation(false)}
          onSuccess={() => setOpenDeleteTermConfirmation(false)}
        />
      </ModalComponent>

      {/* End session alert */}
      <ModalComponent
        open={openDeleteSessionConfirmation}
        onClose={() => setOpenDeleteSessionConfirmation(false)}
      >
        <EndSessionAlert
          session={sessionData}
          onClose={() => setOpenDeleteSessionConfirmation(false)}
          onSuccess={() => setOpenDeleteSessionConfirmation(false)}
        />
      </ModalComponent>

      {/* Component for creating term */}
      <ModalComponent open={openNewTermForm} onClose={() => setOpenNewTermForm(false)}>
        <AddNewTerm
          session_id={sessionData?._id as string}
          onClose={() => {
            setOpenNewTermForm(false);
          }}
          closeOnSuccess={() => {
            setOpenNewTermForm(false);
          }}
        />
      </ModalComponent>

      {/* Handles mandatory fee addition during term */}
      <ModalComponent
        open={openFeeAdditionForm.mandatoryFee}
        onClose={() =>
          setOpenFeeAdditionForm((prev) => ({
            ...prev,
            mandatoryFee: false,
            term_name: "",
          }))
        }
      >
        <AddMandatoryFeeForm
          when="during_term"
          term={openFeeAdditionForm.term_name}
          onClose={() =>
            setOpenFeeAdditionForm((prev) => ({
              ...prev,
              mandatoryFee: false,
              term_name: "",
            }))
          }
          closeOnSuccess={() =>
            setOpenFeeAdditionForm((prev) => ({
              ...prev,
              mandatoryFee: false,
              term_name: "",
            }))
          }
        />
      </ModalComponent>

      {/* Handles optional fee addition during term */}
      <ModalComponent
        open={openFeeAdditionForm.optionalFee}
        onClose={() =>
          setOpenFeeAdditionForm((prev) => ({
            ...prev,
            optionalFee: false,
            term_name: "",
          }))
        }
      >
        <AddOptionalFeeForm
          when="during_term"
          term={openFeeAdditionForm.term_name}
          onClose={() =>
            setOpenFeeAdditionForm((prev) => ({
              ...prev,
              optionalFee: false,
              term_name: "",
            }))
          }
          closeOnSuccess={() =>
            setOpenFeeAdditionForm((prev) => ({
              ...prev,
              optionalFee: false,
              term_name: "",
            }))
          }
        />
      </ModalComponent>
    </div>
  );
}
