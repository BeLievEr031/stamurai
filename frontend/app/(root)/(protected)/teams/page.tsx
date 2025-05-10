"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PencilIcon, } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/http/api";
import { IUser, IUserQuery } from "@/types";
import { useDebounce } from 'use-debounce';
import { useRouter } from "next/navigation";

export default function TeamPage() {
    const router = useRouter();
    const [pagination, setPagination] = useState<IUserQuery>({
        limit: "10",
        page: "1",
        search: ""
    })

    const [value] = useDebounce(pagination.search, 1000);


    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["fetch-users", pagination.page, pagination.limit, value],
        queryFn: () => getUser({
            ...pagination,
            search: value
        })
    })

    if (isLoading) {
        return <div>Loading..</div>
    }

    if (isError) {
        return <div>{error.message}</div>
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Team</h1>
                <Button variant="secondary">Invite Member</Button>
            </div>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Members</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                        placeholder="Search by name or email"
                        value={pagination.search}
                        onChange={(e) => setPagination({ ...pagination, search: e.target.value })}
                        className="w-full"
                    />
                </div>

                <div>

                    {data?.data && data?.data.users.users.length > 0 && data?.data.users.users.map((member: IUser) => (
                        <div
                            key={member._id}
                            className="flex mt-2 items-center justify-between border rounded-lg p-3"
                        >
                            <div className="flex items-center gap-4">
                                {/* <Avatar>
                                        <AvatarImage src={member.avatar} alt={member.name} />
                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    </Avatar> */}
                                <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="font-medium">{member.email}</p>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" className="cursor-pointer" onClick={() => router.push(`/tasks/create-task?memberid=${member._id}`)}>
                                <PencilIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
}
