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
import type { User } from "#/types";
import { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteUserDialogProps {
  user: User;
  onSuccess: () => void;
}

export function DeleteUserDialog({ user, onSuccess }: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleDeleteUser = async () => {
    try {
      setSubmitting(true);
      await api.delete(`/users/${user.id}`);
      toast.success("User deleted");
      onSuccess();
    } catch (error) {
      console.error("Delete user failed", error);
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
        <Button
          size="icon-sm"
          variant="destructive"
          disabled={submitting}
        >
          <Trash2 />
          <span className="sr-only">Delete user</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete user "{user.name}"? This action
            cannot be undone and will also delete all related bookings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteUser}
            disabled={submitting}
          >
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
