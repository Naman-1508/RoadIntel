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
import { MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import API from "@/utility/api";
import { LocationPicker } from "@/components/LocationPicker";

// ---------------------
// Validation Schema
// ---------------------
const roadHazardReportSchema = z.object({
  hazardType: z.string().min(1, "Please select the type of road hazard"),
  description: z.string().min(5, "Please provide more details"),
  severity: z.enum(["low", "medium", "high"]),
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
      description: "",
      severity: undefined,
      timeReported: "",
    },
  });

  const { toast } = useToast();

  // 🌍 Geo State
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [address, setAddress] = useState("");

  // ---------------------
  // Submit Handler
  // ---------------------
  const handleSubmit = async (data: RoadHazardReportFormValues) => {
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
    };

    try {
      const response = await API.post("/reports/hazard", payload);

      if (response.data.success) {
        toast({
          title: "Report Submitted ✅",
          description: "Your road hazard report has been submitted.",
        });
        form.reset();
        onSubmit(data);
        setLat(null);
        setLng(null);
        setAddress("");
      } else {
        toast({
          title: "Submission Failed ❌",
          description: "Try again later.",
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

            {/* 🌍 LOCATION PICKER */}
            <div className="space-y-2">
              <FormLabel className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Select Hazard Location
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

            {/* TIME */}
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

            {/* HAZARD TYPE + SEVERITY */}
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
                        <SelectItem value="debris">Debris</SelectItem>
                        <SelectItem value="potholes">Potholes</SelectItem>
                        <SelectItem value="obstacles">Obstacles</SelectItem>
                        <SelectItem value="oil spill">Oil Spill</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the road hazard..."
                      className="min-h-[120px]"
                      {...field}
                    />
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
