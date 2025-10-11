import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import API from "@/utility/api";

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const email = searchParams.get("email");
  

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) { // only single digit
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus automatically
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      alert("Please enter a valid OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.post("/auth/verify-otp", {
        email,
        otp: enteredOtp,
      });
      alert(res.data.message);
      window.location.href = "/login";
    } catch (err: any) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await API.post("/auth/send-otp", { email});
      alert("OTP resent successfully");
    } catch {
      alert("Failed to resend OTP. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-primary/5 p-4">
      <Card className="w-full max-w-md border-2 shadow-elegant">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Verify OTP
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-6">
          <p className="text-center text-muted-foreground">
            Enter the OTP sent to <br />
            <span className="font-medium text-primary">
              {email}
            </span>
          </p>

          {/* OTP boxes */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-center text-xl font-semibold border-2 focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl"
                maxLength={1}
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>

          <Button
            variant="outline"
            onClick={handleResend}
            className="w-full"
          >
            Resend OTP
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtp;
