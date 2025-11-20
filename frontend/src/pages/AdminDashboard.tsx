import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  AlertTriangle, 
  FileText, 
  BarChart3,
  Trash2,
  Edit,
  Shield,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import API from "@/utility/api";
import { useToast } from "@/hooks/use-toast";
import { useClerk } from "@clerk/clerk-react";

interface DashboardStats {
  users: {
    total: number;
    admins: number;
    totalUsers: number;
  };
  reports: {
    accidents: number;
    accidentReports: number;
    traffic: number;
    construction: number;
    hazards: number;
    total: number;
  };
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Accident {
  _id: string;
  location: string;
  description: string;
  severity: string;
  user?: {
    username: string;
    email: string;
  };
  createdAt: string;
}

interface Report {
  _id: string;
  type?: string;
  reportType?: string;
  location: string;
  description: string;
  status?: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const { signOut } = useClerk(); 
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === "overview") {
        const statsRes = await API.get("/admin/dashboard/stats");
        setStats(statsRes.data.stats);
        setUsers(statsRes.data.recentUsers || []);
      } else if (activeTab === "users") {
        const usersRes = await API.get("/admin/users");
        setUsers(usersRes.data.users || []);
      } else if (activeTab === "accidents") {
        const accidentsRes = await API.get("/admin/accidents");
        setAccidents(accidentsRes.data.accidents || []);
      } else if (activeTab === "reports") {
        const reportsRes = await API.get("/admin/reports");
        setReports(reportsRes.data.reports || []);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/admin/users/${userId}`);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await API.put(`/admin/users/${userId}`, {
        isActive: !currentStatus,
      });
      toast({
        title: "Success",
        description: `User ${!currentStatus ? "activated" : "deactivated"} successfully`,
      });
      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccident = async (accidentId: string) => {
    if (!confirm("Are you sure you want to delete this accident?")) return;

    try {
      await API.delete(`/admin/accidents/${accidentId}`);
      toast({
        title: "Success",
        description: "Accident deleted successfully",
      });
      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete accident",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReportStatus = async (reportType: string, reportId: string, status: string) => {
    try {
      await API.put(`/admin/reports/${reportType}/${reportId}/status`, { status });
      toast({
        title: "Success",
        description: "Report status updated successfully",
      });
      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update report status",
        variant: "destructive",
      });
    }
  };

  const handlePromoteUser = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Are you sure you want to ${newRole === "admin" ? "promote" : "demote"} this user?`)) return;

    try {
      await API.put(`/admin/users/${userId}`, { role: newRole });
      toast({
        title: "Success",
        description: `User ${newRole === "admin" ? "promoted" : "demoted"} successfully`,
      });
      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  if (loading && !stats) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
    <div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold flex items-center gap-2">
      <Shield className="h-8 w-8" />
      Admin Dashboard
    </h1>
    <p className="text-muted-foreground mt-2">
      Manage users, accidents, and reports
    </p>
  </div>

  <Button
    variant="outline"
    onClick={() => signOut({ redirectUrl: "/" })}
  >
    Logout
  </Button>
</div>


      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="accidents">Accidents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {stats && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.users.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.users.admins} admins, {stats.users.total} users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.reports.total}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all categories
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accidents</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.reports.accidents + stats.reports.accidentReports}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total accident reports
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Other Reports</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.reports.traffic + stats.reports.construction + stats.reports.hazards}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Traffic, construction, hazards
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No users found</p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{user.username}</p>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role}
                          </Badge>
                          {!user.isActive && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No users found</p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{user.username}</p>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role}
                          </Badge>
                          {!user.isActive && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePromoteUser(user._id, user.role)}
                          title={user.role === "admin" ? "Demote to User" : "Promote to Admin"}
                        >
                          {user.role === "admin" ? (
                            <ArrowDown className="h-4 w-4" />
                          ) : (
                            <ArrowUp className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Management</CardTitle>
              <CardDescription>View and manage all reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No reports found</p>
                ) : (
                  reports.map((report) => {
                    const reportType = report.type || report.reportType || "unknown";
                    return (
                      <div
                        key={report._id}
                        className="flex items-start justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium">{report.location}</p>
                            <Badge variant="secondary">{reportType}</Badge>
                            <Badge variant={
                              report.status === "Resolved" ? "default" :
                              report.status === "Verified" ? "default" :
                              report.status === "Active" ? "destructive" : "secondary"
                            }>
                              {report.status || "Pending"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {report.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(report.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Select
                            value={report.status || "Pending"}
                            onValueChange={(value) => handleUpdateReportStatus(reportType, report._id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Verified">Verified</SelectItem>
                              <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accident Management</CardTitle>
              <CardDescription>View and manage all accidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accidents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No accidents found</p>
                ) : (
                  accidents.map((accident) => (
                    <div
                      key={accident._id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium">{accident.location}</p>
                          <Badge variant={
                            accident.severity === "high" ? "destructive" :
                            accident.severity === "medium" ? "default" : "secondary"
                          }>
                            {accident.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {accident.description}
                        </p>
                        {accident.user && (
                          <p className="text-xs text-muted-foreground">
                            Reported by: {accident.user.username} ({accident.user.email})
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(accident.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAccident(accident._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;


