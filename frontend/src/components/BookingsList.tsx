import { useEffect, useState } from "react";
import { api } from "#/lib/api";
import { format } from "date-fns";
import { Calendar, Clock, UserIcon, Users } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Badge } from "#/components/ui/badge";
import { Skeleton } from "#/components/ui/skeleton";

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  user?: {
    name: string;
  };
}

export function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await api.get("/bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
        toast.error("Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5" /> All Bookings
            </CardTitle>
            <CardDescription>
              Loading currently scheduled meeting rooms...
            </CardDescription>
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="space-y-1.5 pt-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            All Bookings
          </CardTitle>
          <CardDescription>
            View all currently scheduled meeting rooms
          </CardDescription>
        </div>
        <Badge
          variant="secondary"
          className="px-3 py-1 rounded-full text-sm font-medium"
        >
          {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        {bookings.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 mb-4">
              <Calendar size={32} />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              No active bookings
            </h3>
            <p className="text-zinc-500 max-w-sm">
              There are no meeting rooms booked at the moment. Be the first to
              schedule a meeting!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {bookings.map((booking) => {
              const start = new Date(booking.startTime);
              const end = new Date(booking.endTime);

              return (
                <div
                  key={booking.id}
                  className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Users size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <UserIcon
                          size={16}
                          className="text-zinc-400"
                        />
                        {booking.user?.name || `User ID Data`}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar
                            size={14}
                            className="text-blue-500"
                          />
                          {format(start, "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock
                            size={14}
                            className="text-orange-500"
                          />
                          {format(start, "h:mm a")} - {format(end, "h:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
