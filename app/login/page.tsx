"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from 'react';
import { LOCATION, SERVICE } from "@/lib/generated/prisma/client";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";

export default function Login() {
    return (
        <LoginForm />
    );
}
