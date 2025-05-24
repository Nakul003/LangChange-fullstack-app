import { useQuery } from "@tanstack/react-query";
import { checkAuthUser } from "../lib/api";

const useAuthUser = () => {
    const getAuthUser = useQuery({
        queryKey: ["authUser"],
        queryFn: checkAuthUser,
        retry:false
      });
      return { isLoading:getAuthUser.isLoading, authUser:getAuthUser.data?.user }
}

export default useAuthUser;