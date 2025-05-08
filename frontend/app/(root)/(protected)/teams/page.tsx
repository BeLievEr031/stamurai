"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PencilIcon, TrashIcon, UserIcon, ChevronDownIcon } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const teamMembers = [
    {
        id: 1,
        name: "Alex Morgan",
        role: "Product Manager",
        avatar: "/avatars/alex.png",
    },
    {
        id: 2,
        name: "Jamie Lee",
        role: "Developer",
        avatar: "/avatars/jamie.png",
    },
    {
        id: 3,
        name: "Morgan Yu",
        role: "Designer",
        avatar: "/avatars/morgan.png",
    },
];

export default function TeamPage() {
    const [search, setSearch] = useState("");

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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full"
                    />
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All roles" />
                            <UserIcon className="ml-auto h-4 w-4 opacity-50" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="designer">Designer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="admins">Admins</TabsTrigger>
                        <TabsTrigger value="members">Members</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-4 space-y-4">
                        {teamMembers.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between border rounded-lg p-3"
                            >
                                <div className="flex items-center gap-4">
                                    {/* <Avatar>
                                        <AvatarImage src={member.avatar} alt={member.name} />
                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    </Avatar> */}
                                    <div>
                                        <p className="font-medium">{member.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="icon" variant="ghost">
                                        <PencilIcon className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost">
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" className="flex items-center gap-1 text-sm">
                                        Select
                                        <ChevronDownIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="admins">
                        <p className="text-muted-foreground mt-4">Admins list goes here...</p>
                    </TabsContent>

                    <TabsContent value="members">
                        <p className="text-muted-foreground mt-4">Members list goes here...</p>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
