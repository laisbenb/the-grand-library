'use server';

import prisma from "@/lib/client";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerUser(data: FormData) {
    const email = data.get('email') as string;
    const name = data.get('name') as string;
    const password = data.get('password') as string;

    if (!email || !name || !password) {
        throw new Error('All fields are required');
    }

    const isArteveldeEmail = email.endsWith('@arteveldehs.be') || email.endsWith('@student.arteveldehs.be');
    if (!isArteveldeEmail) {
        throw new Error('Email must be an Artevelde email');
    }

    const existingUser  = await prisma.user.findUnique({ where : { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword
        }
    });

    redirect('/signin');
}