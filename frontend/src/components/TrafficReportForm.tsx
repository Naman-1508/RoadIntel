import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Car, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import API from "@/utility/api";
import { LocationPicker } from "@/components/LocationPicker";

// ---------------------
// Validation Schema
// ---------------------
const trafficReportSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  trafficlevel: z.enum(["light", "moderate", "heavy"]),
  cause: z.enum(["accident", "construction", "rush hour", "weather"]),
  estimateDelay: z.string().min(1, "Estimated Delay is required"),
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
      description: "",
      trafficlevel: undefined,
      cause: undefined,
      estimateDelay: "",
      timeReported: "",
    },
  });

  const { toast } = useToast();

  // 🌍 GEO STATE
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [address, setAddress] = useState("");

  // ---------------------
  // Submit Handler
  // ---------------------
  const handleSubmit = async (data: TrafficReportFormValues) => {
    if (!lat || !lng || !address) {
      toast({
        title: "Location Required",
        description: "Please pick a location on the map.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      ...data,
      location: address,
      latitude: lat,
      longitude: lng,

      // backend expects congestionLevel instead of trafficlevel
      congestionLevel: data.trafficlevel,
    };

    delete payload["trafficlevel"]; // remove old field

    try {
      const response = await API.post("/reports/traffic", payload);

      if (response.data.success) {
        toast({
          title: "Report Submitted ✅",
          description: "Your traffic report has been successfully submitted.",
        });

        form.reset();
        setLat(null);
        setLng(null);
        setAddress("");

        onSubmit(data);
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

            {/* 🌍 LOCATION PICKER */}
            <div className="space-y-2">
              <FormLabel className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Select Traffic Location
              </FormLabel>

              <LocationPicker
                onLocationSelect={(lat, lng, address) => {
                  setLat(lat);
                  setLng(lng);
                  setAddress(address);
                }}
              />

              {address && (
                <p className="text-sm text-muted-foreground mt-1">
                  📌 Selected: <b>{address}</b>
                </p>
              )}
            </div>

            {/* TIME REPORTED */}
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

            {/* TRAFFIC LEVEL + CAUSE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

            {/* ESTIMATED DELAY */}
            <FormField
              control={form.control}
              name="estimateDelay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Delay (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="e.g., 15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BUTTONS */}
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
