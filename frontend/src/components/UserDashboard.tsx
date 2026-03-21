import { Button } from "#/components/ui/button";
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
import { useAuth } from "#/lib/AuthContext";
import type { Booking } from "#/types";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CreateBookingDialog } from "./CreateBookingDialog";
import { DeleteBookingDialog } from "./DeleteBookingDialog";

export function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [bookingsResp] = await Promise.all([
        api.get<Booking[]>("/bookings"),
      ]);
      setBookings(bookingsResp.data || []);
    } catch (error) {
      console.error("User dashboard fetch failed", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalBookings = useMemo(() => bookings.length, [bookings]);

  if (isLoading) {
    return <Skeleton className="h-64 rounded-2xl" />;
  }

  return (
    <div className="space-y-6 pb-12">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>User Booking Dashboard</CardTitle>
            <CardDescription>
              Create bookings and delete your own bookings.
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
                    {booking.user?.id === user?.id ? (
                      <DeleteBookingDialog
                        booking={booking}
                        onSuccess={fetchData}
                      />
                    ) : (
                      <Button
                        size="icon-sm"
                        variant="outline"
                        disabled
                      >
                        <span className="sr-only">No delete access</span>
                        ..
                      </Button>
                    )}
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

      <div className="text-sm text-zinc-500">
        <Calendar className="inline-block mr-1" /> {totalBookings} total
        bookings
      </div>
    </div>
  );
}
