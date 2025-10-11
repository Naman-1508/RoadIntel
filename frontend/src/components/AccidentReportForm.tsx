import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, MapPin, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const accidentReportSchema = z.object({
  location: z.string().min(1, "Location is required").max(200, "Location must be less than 200 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  severity: z.enum(["low", "medium", "high"], {
    required_error: "Please select severity level",
  }),
  vehiclesInvolved: z.string().min(1, "Number of vehicles is required"),
  injuries: z.enum(["none", "minor", "serious"], {
    required_error: "Please specify injury status",
  }),
  timeOfAccident: z.string().min(1, "Time is required"),
});

type AccidentReportFormValues = z.infer<typeof accidentReportSchema>;

interface AccidentReportFormProps {
  onSubmit: (data: AccidentReportFormValues) => void;
  onCancel: () => void;
}

export const AccidentReportForm = ({ onSubmit, onCancel }: AccidentReportFormProps) => {
  const form = useForm<AccidentReportFormValues>({
    resolver: zodResolver(accidentReportSchema),
    defaultValues: {
      location: "",
      description: "",
      severity: undefined,
      vehiclesInvolved: "",
      injuries: undefined,
      timeOfAccident: "",
    },
  });

  const { toast } = useToast();

const handleSubmit = async (data: AccidentReportFormValues) => {
  try {
    const response = await fetch("http://localhost:3000/api/reports/accident", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      toast({
        title: "Report Submitted ✅",
        description: "Your accident report has been successfully sent.",
      });
      form.reset();
    } else {
      toast({
        title: "Submission Failed ❌",
        description: "Something went wrong. Try again later.",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Server Error 😔",
      description: "Unable to reach the server.",
      variant: "destructive",
    });
  }
};



  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Report Accident
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Street address or intersection" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeOfAccident"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Time of Accident
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low - Minor damage</SelectItem>
                        <SelectItem value="medium">Medium - Moderate damage</SelectItem>
                        <SelectItem value="high">High - Severe damage</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehiclesInvolved"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Vehicles Involved
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="10" placeholder="Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="injuries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Injuries</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Injury status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No injuries</SelectItem>
                        <SelectItem value="minor">Minor injuries</SelectItem>
                        <SelectItem value="serious">Serious injuries</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed description of the accident, road conditions, weather, and any other relevant information..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 gradient-primary">
                Submit Report
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};