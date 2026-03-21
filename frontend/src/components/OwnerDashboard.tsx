import { Badge } from "#/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import { api } from "#/lib/api";
import type { Booking } from "#/types";
import { format } from "date-fns";
import { Calendar, Clock, UserIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CreateBookingDialog } from "./CreateBookingDialog";
import { DeleteBookingDialog } from "./DeleteBookingDialog";

type GroupedUser = {
  id: number;
  name: string;
  bookings: Booking[];
};

type UsageRow = {
  userId: number;
  userName: string;
  totalBookings: string;
};

export function OwnerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [grouped, setGrouped] = useState<GroupedUser[]>([]);
  const [summary, setSummary] = useState<UsageRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [allResp, groupedResp, summaryResp] = await Promise.all([
        api.get<Booking[]>("/bookings"),
        api.get<GroupedUser[]>("/bookings/grouped"),
        api.get<UsageRow[]>("/bookings/summary"),
      ]);

      setBookings(allResp.data || []);
      setGrouped(groupedResp.data || []);
      setSummary(summaryResp.data || []);
    } catch (error) {
      console.error("Owner dashboard fetch failed", error);
      toast.error("Failed to load owner dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalBookings = useMemo(() => bookings.length, [bookings]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Owner Booking Management</CardTitle>
            <CardDescription>
              Create, view, and delete any booking.
            </CardDescription>
          </div>
          <CreateBookingDialog onSuccess={fetchData} />
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.user?.name || "Unknown"}</TableCell>
                  <TableCell>
                    {format(new Date(booking.startTime), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.endTime), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteBookingDialog
                      booking={booking}
                      onSuccess={fetchData}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6"
                  >
                    No bookings yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex gap-3 flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <CardTitle>Bookings by user</CardTitle>
            <CardDescription>
              Grouped view for easier ownership tracking
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className="px-3 py-1 rounded-full text-sm font-medium"
          >
            {grouped.length} users
          </Badge>
        </CardHeader>

        <CardContent>
          {grouped.length === 0 ? (
            <p className="text-sm text-zinc-500">No user bookings found.</p>
          ) : (
            <div className="space-y-4">
              {grouped.map((user) => (
                <div
                  key={user.id}
                  className="border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                      <UserIcon /> {user.name}
                    </div>
                    <Badge
                      variant="secondary"
                      className="px-2 py-1"
                    >
                      {user.bookings.length} bookings
                    </Badge>
                  </div>
                  {user.bookings.length === 0 ? (
                    <p className="text-sm text-zinc-500">No bookings</p>
                  ) : (
                    <div className="grid gap-2">
                      {user.bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-2"
                        >
                          <div className="text-sm flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
                            <Clock className="size-4" />{" "}
                            {format(
                              new Date(booking.startTime),
                              "MMM d, yyyy h:mm a",
                            )}{" "}
                            - {format(new Date(booking.endTime), "h:mm a")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage summary</CardTitle>
          <CardDescription>Number of bookings per user</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Total Bookings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.map((row) => (
                <TableRow key={row.userId}>
                  <TableCell>{row.userName}</TableCell>
                  <TableCell>{row.totalBookings}</TableCell>
                </TableRow>
              ))}
              {summary.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center py-6"
                  >
                    No summary data yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-sm text-zinc-500">
        <Calendar className="inline-block mr-1" /> {totalBookings} total
        bookings
      </div>
    </div>
  );
}
