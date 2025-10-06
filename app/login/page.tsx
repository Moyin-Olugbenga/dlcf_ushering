"use client";
import { LoginForm } from "@/components/LoginForm";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
    return (
  <div className="flex justify-center items-center ">
    <Card className="w-full max-w-sm my-10">
        <CardContent>
            <LoginForm />
        <CardAction>
        </CardAction>
      </CardContent>
    </Card>
  </div>
    );
}
