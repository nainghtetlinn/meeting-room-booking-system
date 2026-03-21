import { createFileRoute } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";

import { useAuth } from "#/lib/AuthContext";
import { AdminDashboard } from "#/components/AdminDashboard";
import { BookingsList } from "#/components/BookingsList";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "#/components/ui/card";
import { Badge } from "#/components/ui/badge";
export const Route = createFileRoute("/")({ component: App });

function App() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader className="shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="font-bold text-2xl">
                Welcome, {user?.name}{" "}
              </CardTitle>
              <Badge className="uppercase">{user?.role}</Badge>
            </div>
            <CardAction>
              <Button
                variant="outline"
                onClick={logout}
              >
                Logout
              </Button>
            </CardAction>
          </CardHeader>
        </Card>

        {user?.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Member dashboard</CardTitle>
              <CardDescription>
                Role-specific views coming soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Continue</Button>
            </CardContent>
          </Card>
        )}

        {user?.role !== "admin" && (
          <div className="mt-8">
            <BookingsList />
          </div>
        )}
      </div>
    </main>
  );
}
