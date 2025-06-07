import { useEffect } from "react";
import { AlertTriangle, Mail, Phone, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PaymentReminder = () => {
  useEffect(() => {
    const originalTitle = document.title;

    document.title = "PAYMENT OVERDUE - SYSTEM SUSPENDED";

    return () => {
      document.title = originalTitle;
    };
  }, []);

  const handleContactEmail = () => {
    window.location.href = "mailto:finnsatoshi03@gmail.com";
  };

  const handleContactMessenger = () => {
    window.open("http://m.me/9906443009377982", "_blank");
  };

  const handleContactMessengerAlt = () => {
    window.open("http://m.me/fabulousEggPie", "_blank");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-100 to-red-200 p-4">
      <Card className="w-full max-w-2xl border-red-400 shadow-xl ring-2 ring-red-300">
        <CardHeader className="space-y-4 border-b border-red-200 bg-red-50 pb-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-400 bg-red-200">
            <XCircle className="h-8 w-8 animate-pulse text-red-700" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-red-800">
            SYSTEM ACCESS SUSPENDED
          </CardTitle>
          <p className="text-lg font-semibold text-red-600">
            PAYMENT OVERDUE - ACTION REQUIRED
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-red-400 bg-red-100">
            <AlertCircle className="h-4 w-4 text-red-700" />
            <AlertDescription className="font-semibold text-red-800">
              CRITICAL: This system has been SUSPENDED due to non-payment of
              development services. Service access is blocked until payment is
              resolved.
            </AlertDescription>
          </Alert>

          <div className="rounded-lg border-2 border-red-300 bg-red-50 p-6">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-700" />
              <h3 className="text-lg font-bold text-red-900">
                URGENT NOTICE TO MANAGEMENT
              </h3>
            </div>
            <p className="mb-4 font-semibold text-red-800">
              Your development team payment is SEVERELY OVERDUE. Continued
              non-payment will result in:
            </p>
            <div className="mb-4 rounded border-l-4 border-red-500 bg-white p-4">
              <ul className="space-y-2 font-medium text-red-700">
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Complete system shutdown
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Service termination
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Potential legal action for breach of contract
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Additional fees for system restoration
                </li>
              </ul>
            </div>
            <p className="mb-3 font-bold text-red-900">
              IMMEDIATE ACTIONS REQUIRED:
            </p>
            <ul className="space-y-3 text-red-800">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-red-400 bg-red-200 text-sm font-bold text-red-800">
                  1
                </span>
                <span className="font-semibold">
                  REVIEW all outstanding development invoices and penalty fees
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-red-400 bg-red-200 text-sm font-bold text-red-800">
                  2
                </span>
                <span className="font-semibold">
                  PROCESS PAYMENT immediately to restore service access
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-red-400 bg-red-200 text-sm font-bold text-red-800">
                  3
                </span>
                <span className="font-semibold">
                  CONTACT development team to prevent escalation
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border-2 border-red-500 bg-black p-4 text-white">
            <div className="mb-3 flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <p className="text-center font-bold text-red-400">
                EMERGENCY CONTACT REQUIRED
              </p>
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Button
                onClick={handleContactEmail}
                className="w-full border-2 border-red-400 bg-red-600 text-white hover:bg-red-700"
                size="default"
              >
                <Mail className="mr-2 h-4 w-4" />
                EMAIL NOW
              </Button>

              <Button
                onClick={handleContactMessenger}
                className="w-full border-2 border-red-400 bg-red-600 text-white hover:bg-red-700"
                size="default"
              >
                <Phone className="mr-2 h-4 w-4" />
                MESSAGE 1
              </Button>

              <Button
                onClick={handleContactMessengerAlt}
                className="w-full border-2 border-red-400 bg-red-600 text-white hover:bg-red-700"
                size="default"
              >
                <Phone className="mr-2 h-4 w-4" />
                MESSAGE 2
              </Button>
            </div>
          </div>

          <div className="rounded border-t-2 border-red-300 bg-red-50 p-4 text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-800" />
              <p className="font-bold text-red-800">DEVELOPMENT TEAM CONTACT</p>
              <AlertCircle className="h-4 w-4 text-red-800" />
            </div>
            <p className="mb-2 text-sm font-semibold text-red-700">
              Email: <span className="font-bold">finnsatoshi03@gmail.com</span>
            </p>
            <p className="mb-3 text-sm font-semibold text-red-700">
              Messenger:{" "}
              <span className="font-bold">m.me/9906443009377982</span> |{" "}
              <span className="font-bold">m.me/fabulousEggPie</span>
            </p>
            <p className="text-xs font-medium text-red-600">
              FAILURE TO RESPOND WILL RESULT IN SERVICE TERMINATION AND LEGAL
              ACTION
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentReminder;
