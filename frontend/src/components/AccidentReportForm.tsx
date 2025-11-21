import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, Users, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useAuth } from "@clerk/clerk-react";
import API, { setTokenGetter } from "@/utility/api";
import React, { useState } from "react";
import { LocationPicker } from "@/components/LocationPicker";

// ---------------------
// Validation Schema
// ---------------------
const accidentReportSchema = z.object({
  description: z.string().min(10, "Description is required"),
  severity: z.enum(["low", "medium", "high"]),
  vehiclesInvolved: z.string(),
  injuries: z.enum(["none", "minor", "serious"]),
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
      description: "",
      severity: undefined,
      vehiclesInvolved: "",
      injuries: undefined,
      timeOfAccident: "",
    },
  });

  const { toast } = useToast();
  const { getToken } = useAuth();

  // 🟢 Connect Clerk token
  setTokenGetter(() => getToken());

  // 🟢 STATE FOR GEO + ADDRESS
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [address, setAddress] = useState("");

  // ---------------------
  // FIXED Submit Handler
  // ---------------------
  const handleSubmit = async (data: AccidentReportFormValues) => {
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
      const response = await API.post("/reports/accident", payload);

      if (response.data.success) {
        toast({
          title: "Report Submitted ✅",
          description: "Your accident report has been successfully submitted.",
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
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Report Accident
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

            {/* 🌍 LOCATION PICKER */}
            <div className="space-y-2">
              <FormLabel className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Select Accident Location
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
                  📌 Selected Location: <b>{address}</b>
                </p>
              )}
            </div>

            {/* TIME + OTHER FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* SEVERITY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
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

              <FormField
                control={form.control}
                name="vehiclesInvolved"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Users className="w-4 h-4 inline-block mr-1" />
                      Vehicles
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
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
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="minor">Minor</SelectItem>
                        <SelectItem value="serious">Serious</SelectItem>
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
