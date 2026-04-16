import { auth } from "@clerk/nextjs/server";

// Services
import { getUserProfile, getUsers } from "@/src/services/users";

// UI
import { UsersPageView } from "@/src/ui/UsersPage";

const UsersPage = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  const [usersResult, meResult] = await Promise.allSettled([
    getUsers(token),
    getUserProfile(token),
  ]);

  const users = usersResult.status === "fulfilled" ? usersResult.value : [];
  const me = meResult.status === "fulfilled" ? meResult.value : null;
  const listError =
    usersResult.status === "rejected"
      ? (usersResult.reason as Error).message
      : null;

  return <UsersPageView users={users} me={me} listError={listError} />;
}

export default UsersPage;
