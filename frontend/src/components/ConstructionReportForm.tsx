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
import { Construction, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import API from "@/utility/api";
import React, { useState } from "react";
import { LocationPicker } from "@/components/LocationPicker";


// ---------------------
// Validation Schema
// ---------------------
const constructionReportSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  constructionType: z.enum(["roadwork", "bridgework", "building", "utility"]),
  progressStatus: z.enum(["planned", "in progress", "completed", "delayed"]),
  expectedCompletion: z.string().min(1, "Expected completion date is required"),
  timeReported: z.string().min(1, "Time reported is required"),
});

type ConstructionReportFormValues = z.infer<typeof constructionReportSchema>;

interface ConstructionReportFormProps {
  onSubmit: (data: ConstructionReportFormValues) => void;
  onCancel: () => void;
}

export const ConstructionReportForm = ({
  onSubmit,
  onCancel,
}: ConstructionReportFormProps) => {
  const form = useForm<ConstructionReportFormValues>({
    resolver: zodResolver(constructionReportSchema),
    defaultValues: {
      description: "",
      constructionType: undefined,
      progressStatus: undefined,
      expectedCompletion: "",
      timeReported: "",
    },
  });

  const { toast } = useToast();

  // 🌍 Location State
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [address, setAddress] = useState("");

  // ---------------------
  // Submit Handler
  // ---------------------
  const handleSubmit = async (data: ConstructionReportFormValues) => {
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
      const response = await API.post("/reports/construction", payload);

      if (response.data.success) {
        toast({
          title: "Report Submitted ✅",
          description: "Your construction report has been added.",
        });
        form.reset();
        setLat(null);
        setLng(null);
        setAddress("");
        onSubmit(data);
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
          <Construction className="w-5 h-5 text-destructive" />
          Report Construction
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

            {/* 🌍 LOCATION PICKER */}
            <div className="space-y-2">
              <FormLabel className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Select Construction Location
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
                    <Clock className="w-4 h-4" /> Time Reported
                  </FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TYPE + STATUS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="constructionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Construction Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="roadwork">Roadwork</SelectItem>
                        <SelectItem value="bridgework">Bridgework</SelectItem>
                        <SelectItem value="building">Building</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="progressStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progress Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
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

            {/* COMPLETION DATE */}
            <FormField
              control={form.control}
              name="expectedCompletion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Completion</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
