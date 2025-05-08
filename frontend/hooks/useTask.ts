import { createTask } from "@/http/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useTask() {
    const router = useRouter();
    const { mutate: createTaskMutate, isPending: createTaskPending } = useMutation({
        mutationKey: ["create-task"],
        mutationFn: createTask,
        onSuccess: (data) => {
            console.log(data);
            router.push("/tasks")
        }
    })

    return {
        createTaskMutate,
        createTaskPending
    }
}