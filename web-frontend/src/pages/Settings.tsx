import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleDarkMode } from "../store/uiSlice";
import api from "../services/api";
import { getErrorMessage } from "../lib/errors";
import { toast } from "sonner";

export default function Settings() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const dark = useAppSelector((s) => s.ui.darkMode);
  const [name, setName] = useState(user?.email?.split("@")[0] ?? "");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [savingPwd, setSavingPwd] = useState(false);

  const savePassword = async () => {
    if (pwd.next.length < 8)
      return toast.error("New password must be at least 8 characters.");
    if (pwd.next !== pwd.confirm)
      return toast.error("New passwords do not match.");
    setSavingPwd(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: pwd.current,
        newPassword: pwd.next,
      });
      toast.success("Password updated");
      setPwd({ current: "", next: "", confirm: "" });
    } catch (e) {
      toast.error(getErrorMessage(e, "Could not update your password."));
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account, security, and preferences."
      />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>
                This information is associated with your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email ?? ""}
                  disabled
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge variant="secondary">{user?.role ?? "USER"}</Badge>
              </div>
              <Button onClick={() => toast.success("Profile saved")}>
                Save changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Password</CardTitle>
              <CardDescription>Use a strong, unique password.</CardDescription>
            </CardHeader>
            <CardContent className="max-w-sm space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cur">Current password</Label>
                <Input
                  id="cur"
                  type="password"
                  value={pwd.current}
                  onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New password</Label>
                <Input
                  id="new"
                  type="password"
                  value={pwd.next}
                  onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conf">Confirm new password</Label>
                <Input
                  id="conf"
                  type="password"
                  value={pwd.confirm}
                  onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                />
              </div>
              <Button onClick={savePassword} disabled={savingPwd}>
                {savingPwd && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                Update password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferences</CardTitle>
              <CardDescription>
                Customize how FinFlow looks and notifies you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">Dark mode</p>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes.
                  </p>
                </div>
                <Switch
                  checked={dark}
                  onCheckedChange={() => dispatch(toggleDarkMode())}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">Email notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts about payments and invoices.
                  </p>
                </div>
                <Switch
                  checked={emailAlerts}
                  onCheckedChange={setEmailAlerts}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
