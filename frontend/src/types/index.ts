export type UserRole = "admin" | "owner" | "user";

export type User = {
  id: number;
  name: string;
  role: UserRole;
};

export type Booking = {
  id: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  user?: { id: number; name: string; role: UserRole };
};
