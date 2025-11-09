import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";

const Profile = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { user, isLoaded } = useUser();

  // Handle save button click
  const handleSave = async () => {
    try {
      if (!user) return;

      // Extract values from inputs
      const nameInput = document.getElementById("name") as HTMLInputElement;
      const locationInput = document.getElementById("location") as HTMLInputElement;

      const fullName = nameInput?.value.trim() || "";
      const [firstName, ...rest] = fullName.split(" ");
      const lastName = rest.join(" ");

      await user.update({
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        unsafeMetadata: {
          location: locationInput?.value || user.unsafeMetadata?.location,
        },
      });

      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating Clerk user:", error);
      alert("❌ Failed to update profile. Try again.");
    }
  };

  if (!isLoaded) {
    return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Navigation open={navOpen} onOpenChange={setNavOpen} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback>
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {user.fullName || "Unnamed User"}
                </CardTitle>
                <p className="text-muted-foreground">Traffic Monitor</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Full Name</span>
                </Label>
                <Input id="name" defaultValue={user.fullName || ""} />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user.primaryEmailAddress?.emailAddress || ""}
                  disabled
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Phone</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue={user.phoneNumbers[0]?.phoneNumber || ""}
                  disabled
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </Label>
                <Input
                  id="location"
                  defaultValue={(user.unsafeMetadata?.location as string) || ""}
                  placeholder="Enter your city or region"
                />
              </div>

              {/* Joined Date */}
              <div className="space-y-2">
                <Label htmlFor="joined" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Member Since</span>
                </Label>
                <Input
                  id="joined"
                  defaultValue={new Date(user.createdAt).toLocaleDateString()}
                  disabled
                />
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleSave} className="w-full md:w-auto">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary (Static Example) */}
        <Card className="mt-6 shadow-card">
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">23</p>
                <p className="text-sm text-muted-foreground">Reports Filed</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-sm text-muted-foreground">Alerts Viewed</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">42</p>
                <p className="text-sm text-muted-foreground">Days Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
