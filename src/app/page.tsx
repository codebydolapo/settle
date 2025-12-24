"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {

const router = useRouter()


  return (
    <div className="">
      Welcome to Settle!
      
       <Button onClick={()=>router.push("/customer/dolapo")}>Click me</Button>
    </div>
  );
}
