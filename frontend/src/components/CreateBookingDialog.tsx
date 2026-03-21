import { api } from "#/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "#/components/ui/button";
import { Calendar } from "#/components/ui/calendar";
import { Card, CardContent, CardFooter } from "#/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "#/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "#/components/ui/input-group";
import { Calendar as CalendarIcon, Clock2Icon } from "lucide-react";

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

type BookingFormValues = z.infer<typeof bookingSchema>;

export function CreateBookingDialog({
  children,
  onSuccess,
}: {
  children: React.ReactNode;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema as any),
    defaultValues: {
      date: new Date(),
      startTime: "10:30:00",
      endTime: "12:30:00",
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    try {
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
      reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Booking failed", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) reset();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-50 dark:bg-zinc-950 p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon
              className="text-blue-500"
              size={20}
            />
            Book a Meeting Room
          </DialogTitle>
          <DialogDescription>
            Select the date and time for your meeting room reservation.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Card className="mx-auto w-fit shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
            <CardContent className="p-0">
              <Controller
                control={control}
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
            </CardContent>
            <CardFooter className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex-col gap-4 p-4">
              <FieldGroup className="flex-row items-center w-full gap-4">
                <Field className="flex-1 space-y-2">
                  <FieldLabel
                    htmlFor="startTime"
                    className="text-xs uppercase tracking-wider text-zinc-500 font-semibold shadow-none"
                  >
                    Start Time
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="startTime"
                      type="time"
                      step="1"
                      {...register("startTime")}
                      className="appearance-none pr-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none bg-white dark:bg-zinc-950"
                    />
                    <InputGroupAddon>
                      <Clock2Icon
                        size={16}
                        className="text-zinc-400"
                      />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>

                <Field className="flex-1 space-y-2">
                  <FieldLabel
                    htmlFor="endTime"
                    className="text-xs uppercase tracking-wider text-zinc-500 font-semibold shadow-none"
                  >
                    End Time
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="endTime"
                      type="time"
                      step="1"
                      {...register("endTime")}
                      className="appearance-none pr-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none bg-white dark:bg-zinc-950"
                    />
                    <InputGroupAddon>
                      <Clock2Icon
                        size={16}
                        className="text-zinc-400"
                      />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </FieldGroup>

              <div className="w-full flex justify-between gap-2 mt-2">
                {errors.date && <FieldError>{errors.date.message}</FieldError>}
                {errors.startTime && (
                  <FieldError>{errors.startTime.message}</FieldError>
                )}
                {errors.endTime && (
                  <FieldError>{errors.endTime.message}</FieldError>
                )}
              </div>
            </CardFooter>
          </Card>

          <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
