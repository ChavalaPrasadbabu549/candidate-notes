import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { socket } from "../utils/socket";
import instance from "../utils/api";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandGroup, CommandItem } from "./ui/command";



interface DecodedToken {
    id: string;
    email: string;
    role: string;
    username?: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
}

interface ChatInterfaceProps {
    candidateId: string;
}

export function NotesInterface({ candidateId }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [value, setValue] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const token = localStorage.getItem("token");
    const decoded: DecodedToken | null = token ? jwtDecode(token) : null;
    const userId = decoded?.id;

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await instance.get("/user/getall");
            setUsers(res.data?.data || []);
        };
        fetchUsers();
    }, []);

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            const res = await instance.get(`/messages/${candidateId}`);
            setMessages(res.data.data || []);
        };
        fetchMessages();
    }, [candidateId]);

    useEffect(() => {
        if (!candidateId || !userId) return;

        socket.emit("joinRoom", candidateId);
        socket.emit("joinUserRoom", userId);
        socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));
        return () => {
            socket.off("receiveMessage");
        };
    }, [candidateId, userId,]);

    useEffect(() => {
        if (userId && messages.length) {
            setMessages((prev) => [...prev]);
        }
    }, [userId]);


    const handleSend = () => {
        if (!value.trim()) return;

        socket.emit("sendMessage", {
            candidateId,
            sendId: userId,
            message: value,
            tags,
        });

        setValue("");
        setTags([]);
    };

    // detect when user types "@"
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue(val);

        const lastWord = val.split(" ").pop();
        if (lastWord?.startsWith("@")) {
            setSearch(lastWord.slice(1));
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const handleSelectUser = (user: User) => {
        // replace last @word with selected username
        const words = value.split(" ");
        words.pop();
        const newMessage = [...words, `@${user.name}`].join(" ");
        setValue(newMessage);

        // add userId to tags
        if (!tags.includes(user._id)) {
            setTags((prev) => [...prev, user._id]);
        }

        setOpen(false);
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto border rounded-lg overflow-hidden">
            <ScrollArea className="flex-1 p-4 space-y-3 bg-gray-50 h-120">
                {messages.map((msg, i) => {
                    const senderId = typeof msg.sendId === "string" ? msg.sendId : msg.sendId?._id;
                    const senderName =
                        typeof msg.sendId === "string"
                            ? users.find((u) => u._id === msg.sendId)?.name || "Unknown"
                            : msg.sendId?.name || "Unknown";

                    const isOwnMessage = senderId === userId;

                    return (
                        <div
                            key={i}
                            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                        >
                            <div className="flex flex-col max-w-xs">
                                {!isOwnMessage && (
                                    <span className="text-xs font-semibold text-gray-600 mb-1">
                                        {senderName}
                                    </span>
                                )}
                                <div
                                    className={`px-3 py-2 rounded-lg shadow-sm break-words ${isOwnMessage
                                        ? "bg-blue-500 text-white rounded-br-none self-end"
                                        : "bg-gray-200 text-gray-900 rounded-bl-none self-start"
                                        }`}
                                >
                                    {msg.message}
                                </div>
                                <span className="text-[10px] text-gray-500 mt-1 self-end">
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </ScrollArea>
            <div className="p-2 border-t flex gap-2 relative">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Input
                            value={value}
                            onChange={handleChange}
                            type="text"
                            placeholder="Send Messages with @mention"
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-0">
                        <Command>
                            <CommandGroup>
                                {users
                                    .filter((u) =>
                                        u.name.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((user) => (
                                        <CommandItem
                                            key={user._id}
                                            onSelect={() => handleSelectUser(user)}
                                        >
                                            {user.name}
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Button onClick={handleSend} disabled={!value}>➤</Button>
            </div>
        </div>
    );
}
