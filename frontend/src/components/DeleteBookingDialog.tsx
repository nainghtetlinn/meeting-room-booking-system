import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog";
import { api } from "#/lib/api";
import type { Booking } from "#/types";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteBookingDialogProps {
  booking: Booking;
  onSuccess: () => void;
}

export function DeleteBookingDialog({
  booking,
  onSuccess,
}: DeleteBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleDeleteBooking = async () => {
    try {
      setSubmitting(true);
      await api.delete(`/bookings/${booking.id}`);
      toast.success("Booking deleted");
      onSuccess();
    } catch (error) {
      console.error("Delete booking failed", error);
      toast.error("Failed to delete booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size="icon-sm"
          variant="destructive"
          disabled={submitting}
        >
          <Trash2 />
          <span className="sr-only">Delete booking</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this booking? This action cannot be
            undone.
            <br />
            <br />
            <strong>Booking details:</strong>
            <br />
            User: {booking.user?.name || "Unknown"}
            <br />
            Time: {format(
              new Date(booking.startTime),
              "MMM d, yyyy h:mm a",
            )} - {format(new Date(booking.endTime), "MMM d, yyyy h:mm a")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteBooking}
            disabled={submitting}
          >
            Delete Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
