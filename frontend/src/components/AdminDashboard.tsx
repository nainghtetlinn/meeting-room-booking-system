import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import { api } from "#/lib/api";
import type { Booking, User, UserRole } from "#/types";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CreateUserDialog } from "./CreateUserDialog";
import { DeleteBookingDialog } from "./DeleteBookingDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { Skeleton } from "./ui/skeleton";

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersResponse, bookingsResponse] = await Promise.all([
        api.get<User[]>("/users"),
        api.get<Booking[]>("/bookings"),
      ]);
      setUsers(usersResponse.data || []);
      setBookings(bookingsResponse.data || []);
    } catch (error) {
      console.error("Failed to load admin data", error);
      toast.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateUserRole = async (userId: number, role: UserRole) => {
    try {
      setSubmitting(true);
      await api.patch(`/users/${userId}`, { role });
      toast.success("User role updated");
      await fetchData();
    } catch (error) {
      console.error("Update role failed", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  };

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
            <CardTitle>User Management</CardTitle>
            <CardDescription>List of users with role controls.</CardDescription>
          </div>
          <CreateUserDialog onSuccess={fetchData} />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) =>
                        handleUpdateUserRole(user.id, value as UserRole)
                      }
                      disabled={submitting}
                    >
                      <SelectTrigger size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteUserDialog
                      user={user}
                      onSuccess={fetchData}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {!users.length && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6"
                  >
                    No users yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bookings Management</CardTitle>
          <CardDescription>View and delete room bookings.</CardDescription>
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
              {!bookings.length && (
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
