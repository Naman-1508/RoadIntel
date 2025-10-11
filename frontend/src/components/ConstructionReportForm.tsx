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
import { Construction, MapPin, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const constructionReportSchema = z.object({
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  constructionType: z.enum(["roadwork", "bridgework", "building", "utility"], {
    required_error: "Please select construction typer",
  }),
  progressStatus: z.enum(["planned", "in progress", "completed", "delayed"], {
    required_error: "Please select progress status",
  }),
  expectedCompletion: z.string().min(1, "Expected completion data is required"),
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
      location: "",
      description: "",
      constructionType: undefined,
      progressStatus: undefined,
      expectedCompletion: "",
      timeReported: "",
    },
  });

const { toast } = useToast();

const handleSubmit = async (data: ConstructionReportFormValues) => {
  try {
    const response = await fetch("http://localhost:3000/api/reports/construction", {
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
          <Construction className="w-5 h-5 text-destructive" />
          Report Construction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
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
                      <Input
                        placeholder="Street address or intersection"
                        {...field}
                      />
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
                      Time of Report
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
                name="constructionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cosntruction Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select construction type" />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
