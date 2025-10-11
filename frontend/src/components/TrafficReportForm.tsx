import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Car, MapPin, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const trafficReportSchema = z.object({
  location: z.string().min(1, "Location is required").max(200, "Location must be less than 200 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  trafficlevel: z.enum(["light", "moderate", "heavy"], {
    required_error: "Please select traffic level",
  }),
  cause: z.enum(["accident","construction","rush hour","weather"],{
    required_error: "Please select cause of delay",
  }),
  estimateDelay: z.string().min(1,"Estimated Delay is required"),
  timeReported: z.string().min(1, "Time is required"),
});

type TrafficReportFormValues = z.infer<typeof trafficReportSchema>;

interface TrafficReportFormProps {
  onSubmit: (data: TrafficReportFormValues) => void;
  onCancel: () => void;
}

export const TrafficReportForm = ({ onSubmit, onCancel }: TrafficReportFormProps) => {
  const form = useForm<TrafficReportFormValues>({
    resolver: zodResolver(trafficReportSchema),
    defaultValues: {
      location: "",
      description: "",
      trafficlevel: undefined,
      cause: undefined,
      estimateDelay:"",
      timeReported: "",
    },
  });

  const { toast } = useToast();

const handleSubmit = async (data: TrafficReportFormValues) => {
  try {
    const response = await fetch("http://localhost:3000/api/reports/traffic", {
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
          <Car className="w-5 h-5 text-destructive" />
          Report Traffic
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
                      Time of Traffic
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
                name="trafficlevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Traffic Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select traffic level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cause"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cause</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cause" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="accident">Accident</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="rush hour">Rush Hour</SelectItem>
                        <SelectItem value="weather">Weather</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
                control={form.control}
                name="estimateDelay"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Estimated Delay (minutes)</FormLabel>
                        <FormControl>
                            <Input type="number" min="0" placeholder="e.g., 15" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}

            />
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