import { auth } from "@clerk/nextjs/server";

// Services
import { getUserProfile, getUsers } from "@/src/services/users";

// UI
import { UsersPageView } from "@/src/ui/UsersPage";

 const UsersPage = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  const users = await getUsers(token);
  const me = await getUserProfile(token);

  return <UsersPageView users={users} me={me} listError={null} />;
}

export default UsersPage;
