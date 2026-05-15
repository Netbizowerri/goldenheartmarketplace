import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Container } from "@/src/components/ui/Container";
import { Button } from "@/src/components/ui/Button";
import { CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/src/lib/utils";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { SuccessModal } from "@/src/components/ui/SuccessModal";
import { useSiteContent } from "@/src/providers/SiteContentProvider";
import { leadSchema, type LeadInput } from "@/shared/schemas";

type SubmitApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

async function readResponseMessage(response: Response) {
  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const payload = await response.json();
      return payload?.error || payload?.message || "Submission failed";
    }
    const text = await response.text();
    return text.substring(0, 200) || "Submission failed";
  } catch {
    return "Submission failed";
  }
}

async function readApiPayload(response: Response): Promise<SubmitApiResponse | null> {
  try {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return null;
    }

    return (await response.json()) as SubmitApiResponse;
  } catch {
    return null;
  }
}

function getSubmitEndpoints() {
  const configuredEndpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim();

  if (configuredEndpoint) {
    return [configuredEndpoint];
  }

  return ["/api/submit-lead", "/api/submit-lead.php"];
}

async function submitLead(data: LeadInput) {
  const endpoints = getSubmitEndpoints();
  let lastErrorMessage = "Submission failed";

  for (const endpoint of endpoints) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });

    const payload = await readApiPayload(response.clone());

    if (response.ok && payload?.success) {
      return;
    }

    const message = payload?.error || payload?.message || await readResponseMessage(response);
    lastErrorMessage = message;

    const contentType = response.headers.get("content-type") || "";
    const canFallback =
      endpoint.endsWith("/submit-lead") &&
      (response.status === 404 || response.status === 405 || !contentType.includes("application/json"));

    if (!canFallback) {
      const error = new Error(message);
      (error as Error & { status?: number }).status = response.status;
      throw error;
    }
  }

  throw new Error(lastErrorMessage);
}

export const SignUpForm = () => {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const { content } = useSiteContent();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      phone: "",
      businessType: "",
      country: "",
    },
  });

  const onSubmit = async (data: LeadInput) => {
    setSubmitError("");
    const toastId = toast.loading("Submitting your application...");

    try {
      await submitLead(data);

      toast.success("Welcome aboard! Application received.", { id: toastId });
      setShowSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4A017", "#1A1A1A", "#FFFFFF"],
      });
      reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";

      if ((error as Error & { status?: number })?.status === 409) {
        setError("email", { type: "server", message });
      } else {
        setSubmitError(message);
      }

      toast.error(message, { id: toastId });
    }
  };

  return (
    <section className="py-24 bg-white" id="signup">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Start Your Journey <br />
              With <span className="text-gold">GoldenHeart</span>
            </motion.h2>
            <p className="text-lg text-medium-grey mb-8">
              Join the marketplace built for entrepreneurs. Complete the form and our team will get in touch to help you get started.
            </p>

            <div className="space-y-4">
              {[
                "Global Customer Exposure",
                "Secure Wallet & Instant Payouts",
                "Advanced Sales Analytics",
                "Priority Merchant Support",
                "Delivery Services",
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-near-black font-semibold"
                >
                  <CheckCircle2 className="text-gold w-6 h-6" />
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 text-gold/10">
              <Lock className="w-16 h-16" />
            </div>
            
            <h3 className="text-3xl font-black mb-2 text-soft-black">Create Merchant Account</h3>
            <p className="text-sm text-medium-grey mb-10">Takes less than 2 minutes to get started.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10" noValidate>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    {...register("fullName")}
                    className={cn("form-input", errors.fullName && "border-red-500")}
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                  {errors.fullName && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="form-label">Business Name</label>
                  <input
                    {...register("businessName")}
                    className={cn("form-input", errors.businessName && "border-red-500")}
                    placeholder="Golden Ventures"
                    autoComplete="organization"
                   />
                  {errors.businessName && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.businessName.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    {...register("email")}
                    className={cn("form-input", errors.email && "border-red-500")}
                    placeholder="john@example.com"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                  />
                  {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    {...register("phone")}
                    className={cn("form-input", errors.phone && "border-red-500")}
                    placeholder="+234..."
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Business Type</label>
                  <select
                    {...register("businessType")}
                    className={cn("form-input appearance-none", errors.businessType && "border-red-500")}
                  >
                    <option value="">Select Category</option>
                    {(content?.merchantCategories ?? []).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.businessType && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.businessType.message}</p>}
                </div>
                <div>
                  <label className="form-label">Country</label>
                  <input
                    {...register("country")}
                    className={cn("form-input", errors.country && "border-red-500")}
                    placeholder="Nigeria"
                    autoComplete="country-name"
                  />
                  {errors.country && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.country.message}</p>}
                </div>
              </div>

              {submitError && <p className="text-sm text-red-600">{submitError}</p>}

              <Button 
                type="submit" 
                size="lg" 
                className="w-full py-4 text-base tracking-wide" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "👉 Create My Account"}
              </Button>
              
              <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6">
                Your information is safe and secure. 🔒
              </p>
            </form>
          </motion.div>
        </div>
      </Container>
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </section>
  );
};
