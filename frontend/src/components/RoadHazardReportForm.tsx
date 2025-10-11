import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const roadHazardReportSchema = z.object({
  hazardType: z.string().min(1, "Please select the type of road hazard"),
  location: z.string().min(3, "Please enter a valid location"),
  description: z.string().min(5, "Please provide more details"),
  severity: z.enum(["Low", "Medium", "High"], {
    required_error: "Please select severity level",
  }),
  timeReported: z.string().min(1, "Please enter time of report"),
});

type RoadHazardReportFormValues = z.infer<typeof roadHazardReportSchema>;

interface RoadHazardReportFormProps {
  onSubmit: (data: RoadHazardReportFormValues) => void;
  onCancel: () => void;
}

export const RoadHazardReportForm = ({ onSubmit, onCancel }: RoadHazardReportFormProps) => {
  const form = useForm<RoadHazardReportFormValues>({
    resolver: zodResolver(roadHazardReportSchema),
    defaultValues: {
      hazardType: "",
      location: "",
      description: "",
      severity: undefined,
      timeReported: "",
    },
  });

  const { toast } = useToast();

const handleSubmit = async (data: RoadHazardReportFormValues) => {
  try {
    const response = await fetch("http://localhost:3000/api/reports/hazard", {
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
          <MapPin className="w-5 h-5 text-destructive" />
          Report Road Hazard
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
                name="timeReported"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Time Reported
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hazardType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hazard Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hazard" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Debris">Debris</SelectItem>
                        <SelectItem value="Potholes">Potholes</SelectItem>
                        <SelectItem value="Obstacles">Obstacles</SelectItem>
                        <SelectItem value="Oil Spill">Oil Spill</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
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
                      placeholder="Provide detailed description of the hazard, location, and any risks..."
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
