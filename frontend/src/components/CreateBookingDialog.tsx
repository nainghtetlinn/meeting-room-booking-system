import { Button } from "#/components/ui/button";
import { Calendar } from "#/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field";
import { api } from "#/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Input } from "./ui/input";

const bookingSchema = z
  .object({
    date: z.date(),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.date);
      const [sh, sm, ss] = data.startTime.split(":");
      start.setHours(Number(sh), Number(sm), Number(ss || 0), 0);

      const end = new Date(data.date);
      const [eh, em, es] = data.endTime.split(":");
      end.setHours(Number(eh), Number(em), Number(es || 0), 0);

      return start < end;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

type BookingData = z.infer<typeof bookingSchema>;

type CreateBookingDialogProps = {
  onSuccess: () => void;
};

export function CreateBookingDialog({ onSuccess }: CreateBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: new Date(),
      startTime: "",
      endTime: "",
    },
  });

  const handleCreateBooking = async (data: BookingData) => {
    try {
      setSubmitting(true);
      const start = new Date(data.date);
      const [sh, sm, ss] = data.startTime.split(":");
      start.setHours(Number(sh), Number(sm), Number(ss || 0), 0);

      const end = new Date(data.date);
      const [eh, em, es] = data.endTime.split(":");
      end.setHours(Number(eh), Number(em), Number(es || 0), 0);

      await api.post("/bookings", {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
      toast.success("Meeting room booked successfully!");
      setOpen(false);
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Booking failed", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Something went wrong");
      }
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Booking
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon size={20} />
            Book a Meeting Room
          </DialogTitle>
          <DialogDescription>
            Select the date and time for your meeting room reservation.
          </DialogDescription>
        </DialogHeader>

        <form
          id="booking-form"
          onSubmit={form.handleSubmit(handleCreateBooking)}
        >
          <div className="flex justify-center mb-4">
            <Controller
              control={form.control}
              name="date"
              render={({ field }) => (
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  className="p-3"
                />
              )}
            />
          </div>
          <FieldGroup className="flex-row items-center w-full gap-4">
            <Controller
              control={form.control}
              name="startTime"
              render={({ field, fieldState }) => (
                <Field
                  className="flex-1"
                  aria-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="startTime">Start Time</FieldLabel>
                  <Input
                    type="time"
                    id="startTime"
                    step={1}
                    aria-invalid={fieldState.invalid}
                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    {...field}
                  />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="endTime"
              render={({ field, fieldState }) => (
                <Field
                  className="flex-1"
                  aria-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="endTime">End Time</FieldLabel>
                  <Input
                    type="time"
                    id="endTime"
                    step={1}
                    aria-invalid={fieldState.invalid}
                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    {...field}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="booking-form"
            disabled={submitting}
          >
            {submitting ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
