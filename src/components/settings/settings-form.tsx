"use client";

import { useTransition } from "react";
import { signOut } from "@/lib/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";
import type { Profile } from "@/lib/types/app";

export function SettingsForm({
  email,
  profile,
}: {
  email: string;
  profile: Profile | null;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} disabled />
          </div>
          <div className="space-y-2">
            <Label>Display Name</Label>
            <Input value={profile?.display_name || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Input value={profile?.timezone || "UTC"} disabled />
          </div>
          <p className="text-xs text-muted-foreground">
            Profile editing coming soon.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={signOut}>
            <Button variant="destructive" className="gap-2" type="submit">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
