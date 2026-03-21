import { Shield, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type User, useAuth } from "#/lib/AuthContext";
import { api } from "#/lib/api";
import { Card, CardContent } from "#/components/ui/card";

export function Login() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { login } = useAuth();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/users/list");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
        toast.error("Failed to load users for login");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleLogin = (user: User) => {
    login(user);
    toast.success(`Logged in as ${user.name}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-500 animate-pulse">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-24 bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-zinc-100">
            Welcome
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Select a user to continue
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {users.map((user) => (
            <Card
              key={user.id}
              onClick={() => handleLogin(user)}
              className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400 transition-colors">
                  {user.role === "admin" ? (
                    <Shield size={24} />
                  ) : (
                    <UserIcon size={24} />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {user.name}
                  </p>
                  <p className="text-sm text-zinc-500 capitalize">
                    {user.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          {users.length === 0 && (
            <div className="col-span-full text-center p-8 text-zinc-500 border border-dashed rounded-xl border-zinc-300 dark:border-zinc-800">
              No users found. Please add users to the database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
