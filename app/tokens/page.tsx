"use client"
import { Token, TokenResult } from "@/classes/Token.class";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



export default function TokenPage() {
  
    const [data, setData] = useState<TokenResult[]>([]);
  const [isPending, startTransition] = useTransition();
      const router = useRouter();
      
        useEffect(() => {
      const fetchTokens = async () => {
    const data = await Token.getTokens();
            setData(data);
          };
          fetchTokens();
        }, []);

  const createToken = () => {
    startTransition(async () => {
      await Token.createToken();
      setTimeout(() => {
        router.refresh();
      }, 3000);
    });
  };

  return (
    
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card  className="w-[500px] max-w-sm">
            <CardHeader>
              <CardTitle>Smart waste bin system</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={createToken} aria-disabled={isPending}>{isPending ? "Creating..." : "Create Token"}</Button>
        
              <Table>
                  <TableCaption>A list of created tokens.</TableCaption>
                  <TableHeader>
                      <TableRow>
                          <TableHead className="w-[100px]">Id</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Password</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {data.map((token: TokenResult) => (
                      <TableRow key={token.id}>
                          <TableCell className="font-medium">{token.id}</TableCell>
                          <TableCell>{token.username}</TableCell>
                          <TableCell>{token.pass}</TableCell>
                      </TableRow>
                      ))}
                  </TableBody>
                  </Table>
              
                </CardContent>
              </Card>
            </div>
      </div>
    </div>
  )
}