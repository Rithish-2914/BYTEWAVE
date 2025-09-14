"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Languages, Mic, Send, User, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  audio?: string;
};

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I help you understand your documents today? Feel free to ask me in English or Malayalam.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsBotTyping(true);

    // Mock AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: `Based on the document, the main action item is to review the safety protocols by the end of the week. (This is a mock response in ${language === 'en' ? 'English' : 'Malayalam'})`,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsBotTyping(false);
    }, 1500);
  };
  
  const handlePlayAudio = (audioData: string | undefined) => {
    if (!audioData) return;
    toast({ title: "Playing Audio", description: "Audio playback is a demo feature." });
    // const audio = new Audio(audioData);
    // audio.play();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Ask questions about your documents in English or Malayalam.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4 bg-card border rounded-lg p-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === "bot" && (
                  <Avatar className="w-8 h-8 border-2 border-primary">
                    <AvatarFallback><Bot size={18} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-md rounded-lg p-3 text-sm",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p>{message.text}</p>
                   {message.sender === "bot" && (
                       <Button variant="ghost" size="icon" className="h-7 w-7 mt-2" onClick={() => handlePlayAudio(message.audio)}>
                           <Volume2 className="h-4 w-4" />
                       </Button>
                   )}
                </div>
                {message.sender === "user" && (
                  <Avatar className="w-8 h-8">
                      <AvatarImage src="https://picsum.photos/seed/user-admin/100/100" />
                      <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isBotTyping && (
               <div className="flex items-start gap-3 justify-start">
                   <Avatar className="w-8 h-8 border-2 border-primary">
                       <AvatarFallback><Bot size={18} /></AvatarFallback>
                   </Avatar>
                   <div className="bg-muted rounded-lg p-3 text-sm flex items-center gap-2">
                       <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                       <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                       <span className="h-2 w-2 bg-foreground rounded-full animate-pulse"></span>
                   </div>
               </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-auto flex items-center gap-2 border-t pt-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ml">Malayalam</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about a document..."
              className="pr-20"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button type="button" variant="ghost" size="icon">
                <Mic className="h-4 w-4" />
              </Button>
              <Button type="submit" size="icon" onClick={handleSend} disabled={isBotTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
